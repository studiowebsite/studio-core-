/**
 * shots.mts — cattura screenshot multi-viewport per il loop visivo.
 *
 *   pnpm shots                          → localhost:3000, Chromium pulito
 *   pnpm shots http://localhost:3000/chi-siamo
 *   pnpm shots --gpu                    → Chrome reale con GPU (scene 3D)
 *   pnpm shots --slow                   → throttling 4G
 *   pnpm shots --label dopo-hero        → etichetta la cartella di output
 *   pnpm shots http://127.0.0.1:8791/concept-b/   → un mockup servito con `pnpm serve mockups`
 *
 * Output: .shots/<timestamp>[-label]/<viewport>.png
 *
 * REGOLA: i numeri di performance che finiscono in un report al cliente
 * escono da qui (profilo pulito, nessuna estensione), mai dal browser
 * personale. Gli fps delle scene 3D non si misurano qui: il rendering
 * headless è software. Per quelli serve --gpu e un occhio umano.
 *
 * Windows e Mac (rules/cross-platform.md): i profili desktop hanno la
 * barra di scorrimento classica di Windows, che toglie ~15px alla pagina;
 * mobile, tablet e MacBook quella sovrapposta, larga 0. Playwright headless
 * di suo le nasconde tutte: senza questa distinzione le catture sono sempre
 * "da Mac", su qualunque PC le si scatti. Su un Mac la pagina intera dei profili
 * Windows può non reggere: lo script lo rileva e lo scrive tra i problemi.
 */

import { chromium, type Browser, type LaunchOptions, type Page } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// --- percorsi ancorati al file, non alla cwd -------------------------------

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// --- configurazione --------------------------------------------------------

// L'hook di stato finale che ogni pagina con animazioni JS espone (rules/motion.md §4).
type SeekWindow = Window & { __seekAnimationsToEnd?: () => void };

// classic = barra di Windows, occupa spazio · overlay = barra sovrapposta (Mac, telefoni)
type Scrollbar = 'classic' | 'overlay';
type Viewport = {
  name: string;
  width: number;
  height: number;
  dpr: number;
  mobile: boolean;
  scrollbar: Scrollbar;
};

const VIEWPORTS: Viewport[] = [
  { name: '01-mobile', width: 390, height: 844, dpr: 2, mobile: true, scrollbar: 'overlay' },
  { name: '02-tablet', width: 768, height: 1024, dpr: 2, mobile: true, scrollbar: 'overlay' },
  { name: '03-laptop', width: 1440, height: 900, dpr: 1, mobile: false, scrollbar: 'classic' },
  { name: '04-desktop', width: 1920, height: 1080, dpr: 1, mobile: false, scrollbar: 'classic' },
  // Portatile Windows: schermo 1920×1080 con ridimensionamento al 125% (il default di
  // Windows sui portatili), tolte barra delle applicazioni e barre di Chrome. Finestra
  // bassa: è qui che le hero a 100svh e ciò che sborda si rompono.
  { name: '05-laptop-win', width: 1536, height: 730, dpr: 1.25, mobile: false, scrollbar: 'classic' },
  // MacBook Air 13": risoluzione di default 1470×956, tolte barra dei menu e barre di Chrome.
  { name: '06-macbook', width: 1470, height: 830, dpr: 2, mobile: false, scrollbar: 'overlay' },
];

// Profilo 4G "Slow" — gli stessi numeri che usa Lighthouse mobile.
const THROTTLE_4G = {
  offline: false,
  downloadThroughput: (1.6 * 1024 * 1024) / 8,
  uploadThroughput: (750 * 1024) / 8,
  latency: 150,
};

// Attesa dopo il networkidle, per far assestare animazioni d'ingresso e font.
const SETTLE_MS = 1200;

// Pausa a ogni passo dello scroll, per dare tempo all'IntersectionObserver.
const SCROLL_STEP_MS = 150;

// --- argomenti -------------------------------------------------------------

const argv = process.argv.slice(2);
const flag = (name: string) => argv.includes(`--${name}`);

const labelIndex = argv.indexOf('--label');
const label = labelIndex !== -1 ? argv[labelIndex + 1] : undefined;

// Una pagina aperta da file (doppio clic) non si comporta come online: Chrome blocca
// fetch e moduli verso altri file locali. Prima si serve la cartella, poi si fotografa.
const fileArg = argv.find((a) => a.startsWith('file:'));
if (fileArg) {
  console.error(
    `\n${fileArg}\nUna pagina aperta da file non si comporta come online (Chrome blocca i fetch locali).\n` +
      `Servi la cartella con \`pnpm serve <cartella>\` e fotografa l'indirizzo http che stampa.\n`,
  );
  process.exit(1);
}

const url =
  argv.find((a) => a.startsWith('http')) ?? 'http://localhost:3000';

const useGpu = flag('gpu');
const throttle = flag('slow');
const fullPage = !flag('viewport-only');

// --- utility ---------------------------------------------------------------

function stamp(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}`;
}

const outDir = join(ROOT, '.shots', label ? `${stamp()}-${label}` : stamp());

// --- cattura ---------------------------------------------------------------

async function capture(browser: Browser, vp: Viewport) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: vp.dpr,
    isMobile: vp.mobile,
    hasTouch: vp.mobile,
    locale: 'it-IT',
  });

  // Nella cattura a pagina intera Chrome toglie la barra classica e la pagina si
  // ridisegna larga quanto la finestra, cioè come su Mac: il bug di Windows sparisce
  // proprio nel momento dello scatto. `scrollbar-gutter: stable` tiene riservato lo
  // spazio della barra anche lì (verificato: 1905px prima e durante, su 1920; con
  // `overflow-y: scroll` da solo torna a 1920). Serve anche `overflow-y: scroll`: gli
  // hook di stato finale che fermano lo smooth scroll (lenis.stop() mette
  // `overflow: clip` su html) toglierebbero la barra, e con `clip` il gutter non vale.
  // Si applica dal primo istante, così la pagina non vede mai un'altra larghezza. Su
  // una pagina più corta della finestra Windows non mostrerebbe la barra: lì la
  // cattura toglie ~15px che l'utente avrebbe.
  // La barra è disegnata via CSS, larga 15px come quella di Chrome su Windows
  // (misurata): una barra stilizzata occupa spazio su ogni sistema, così il profilo
  // resta "da Windows" anche lanciato su un Mac, dove quella nativa è sovrapposta.
  if (vp.scrollbar === 'classic') {
    await context.addInitScript(() => {
      const keep = () => {
        if (!document.documentElement) return false;
        const s = document.createElement('style');
        s.textContent =
          'html { overflow-y: scroll !important; scrollbar-gutter: stable !important; }' +
          '::-webkit-scrollbar { width: 15px; height: 15px; }' +
          '::-webkit-scrollbar-track { background: #f1f1f1; }' +
          '::-webkit-scrollbar-thumb { background: #c1c1c1; }';
        document.documentElement.appendChild(s);
        return true;
      };
      if (!keep()) {
        new MutationObserver((_, o) => {
          if (keep()) o.disconnect();
        }).observe(document, { childList: true });
      }
    });
  }

  const page: Page = await context.newPage();

  // Gli errori di console sono spesso la vera causa di un layout rotto.
  const problems: string[] = [];
  page.on('console', (m) => {
    if (m.type() === 'error') problems.push(`console: ${m.text()}`);
  });
  page.on('pageerror', (e) => problems.push(`pageerror: ${e.message}`));
  page.on('requestfailed', (r) =>
    problems.push(`failed: ${r.url()} — ${r.failure()?.errorText ?? '?'}`),
  );

  if (throttle) {
    const cdp = await context.newCDPSession(page);
    await cdp.send('Network.enable');
    await cdp.send('Network.emulateNetworkConditions', THROTTLE_4G);
  }

  const started = Date.now();
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 });
  await page.waitForTimeout(SETTLE_MS);

  // Il fullPage da solo non attiva il lazy-load: il layout riserva l'altezza
  // ma le sezioni sotto la piega restano vuote finché non le si attraversa.
  await page.evaluate(async (stepMs) => {
    for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, stepMs));
    }
  }, SCROLL_STEP_MS);

  // Dove si scatta dipende dall'hook di stato finale (rules/motion.md §4), che ha ogni
  // pagina con animazioni JS. Durante la cattura a pagina intera la pagina si
  // ridimensiona e le animazioni legate allo scroll si ricalcolano dalla posizione
  // corrente — verificato su un mockup con ScrollTrigger: in cima tornano all'inizio
  // anche dopo l'hook, in fondo restano alla fine.
  // - Con l'hook: si resta in fondo e si chiama l'hook. Limite noto: header ed
  //   elementi fixed/sticky finiscono disegnati a fondo pagina, sopra il contenuto.
  // - Senza hook: si torna in cima, così header ed elementi sticky stanno dove li
  //   vede l'utente e non dove la pagina si è fermata.
  // - Con --viewport-only si fotografa la prima schermata come la vede chi apre la
  //   pagina: in cima, senza hook. L'hook porta alla fine anche ciò che lo scroll fa
  //   uscire (verificato: il titolo della hero sparisce), e la prima schermata non è
  //   la fine. Si aspetta SETTLE_MS perché le animazioni con scrub raggiungano la cima.
  // `animations: 'disabled'` ferma il CSS, non GSAP né i loop di render: lo stato
  // deterministico lo dà la pagina, non questo script.
  const hasSeekHook = await page.evaluate(
    () => typeof (window as SeekWindow).__seekAnimationsToEnd === 'function',
  );
  let shotAt: string;
  if (fullPage && hasSeekHook) {
    await page.evaluate(() => (window as SeekWindow).__seekAnimationsToEnd?.());
    shotAt = 'in fondo, dopo l’hook';
  } else {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(fullPage ? SCROLL_STEP_MS : SETTLE_MS);
    shotAt = 'in cima';
  }
  await page.waitForTimeout(150);

  // Quanto spazio toglie davvero la barra: 0 su overlay, ~15 su classic. Se un
  // profilo classic segna 0, la cattura non sta mostrando il caso Windows.
  const scrollbarPx = await page.evaluate(
    () => window.innerWidth - document.documentElement.clientWidth,
  );
  if (vp.scrollbar === 'classic' && scrollbarPx === 0) {
    problems.push(`${vp.name}: barra classica attesa ma larga 0px — la cattura non è "da Windows"`);
  }

  // Si registra la larghezza della pagina anche durante lo scatto. Con barre di
  // sistema sovrapposte (macOS) la cattura a pagina intera la riporta per un momento
  // a tutta la finestra, la pagina si ridispone "da Mac" e il bug di Windows non si
  // vede — senza nessun errore. Verificato simulando le barre sovrapposte su Chrome
  // per Windows; su Windows normale la larghezza non cambia.
  await page.evaluate(() => {
    const w = window as Window & { __shotsWidths?: number[] };
    w.__shotsWidths = [];
    new ResizeObserver(() => w.__shotsWidths?.push(document.documentElement.clientWidth)).observe(
      document.documentElement,
    );
  });

  const file = join(outDir, `${vp.name}.png`);
  await page.screenshot({ path: file, fullPage, animations: 'disabled' });

  if (vp.scrollbar === 'classic' && scrollbarPx > 0) {
    const widths = await page.evaluate(
      () => (window as Window & { __shotsWidths?: number[] }).__shotsWidths ?? [],
    );
    if (widths.some((w) => w >= vp.width)) {
      problems.push(
        `${vp.name}: durante lo scatto la pagina è tornata larga ${vp.width}px, come senza barra — ` +
          `la cattura non è "da Windows" (succede con barre sovrapposte, es. su Mac). ` +
          `Usa --viewport-only o scatta da Windows.`,
      );
    }
  }

  const elapsed = Date.now() - started;
  const flagged = problems.length ? ` ⚠ ${problems.length}` : '';
  console.log(
    `  ${vp.name.padEnd(13)} ${String(elapsed).padStart(5)}ms  barra ${vp.scrollbar} ${scrollbarPx}px · ${shotAt}${flagged}`,
  );

  await context.close();
  return { viewport: vp.name, scrollbar: vp.scrollbar, scrollbarPx, shotAt, elapsed, problems };
}

// --- browser ---------------------------------------------------------------

// La barra di scorrimento si decide all'avvio del browser, non per pagina: un browser
// per tipo, aperto solo se qualche profilo lo usa. `--hide-scrollbars` è ciò che
// Playwright headless aggiunge da solo; toglierlo dà la barra classica di Windows.
function launchOptions(scrollbar: Scrollbar): LaunchOptions {
  const base: LaunchOptions = useGpu
    ? { channel: 'chrome', headless: false } // GPU reale, necessario per WebGL
    : { headless: true };
  return scrollbar === 'classic'
    ? { ...base, ignoreDefaultArgs: ['--hide-scrollbars'] }
    : { ...base, args: ['--hide-scrollbars'] };
}

async function launch(scrollbar: Scrollbar): Promise<Browser> {
  try {
    return await chromium.launch(launchOptions(scrollbar));
  } catch (e) {
    const hint = useGpu
      ? 'Serve Google Chrome installato (per --gpu): https://www.google.com/chrome/'
      : 'Manca il browser di questa versione di Playwright: `pnpm exec playwright install chromium`';
    console.error(`\nIl browser non parte. ${hint}\nPer un controllo completo: \`pnpm verifica-pc\`.\n`);
    throw e;
  }
}

const browsers = new Map<Scrollbar, Browser>();
async function browserFor(scrollbar: Scrollbar): Promise<Browser> {
  let b = browsers.get(scrollbar);
  if (!b) {
    b = await launch(scrollbar);
    browsers.set(scrollbar, b);
  }
  return b;
}

// --- main ------------------------------------------------------------------

await mkdir(outDir, { recursive: true });

console.log(`\n${url}`);
console.log(
  `${useGpu ? 'Chrome (GPU)' : 'Chromium headless'}${throttle ? ' · 4G' : ''} · ${fullPage ? 'full page' : 'viewport'}\n`,
);

const results = [];
for (const vp of VIEWPORTS) {
  results.push(await capture(await browserFor(vp.scrollbar), vp));
}

for (const b of browsers.values()) await b.close();

// Manifest: serve per confrontare due run e capire cosa è cambiato.
await writeFile(
  join(outDir, 'manifest.json'),
  JSON.stringify({ url, useGpu, throttle, fullPage, at: new Date().toISOString(), results }, null, 2),
);

const allProblems = results.flatMap((r) => r.problems);
if (allProblems.length) {
  console.log('\nProblemi rilevati:');
  for (const p of [...new Set(allProblems)]) console.log(`  · ${p}`);
}

console.log(`\n→ ${outDir}\n`);
