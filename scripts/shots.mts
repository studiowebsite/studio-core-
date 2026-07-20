/**
 * shots.mts — cattura screenshot multi-viewport per il loop visivo.
 *
 *   pnpm shots                          → localhost:3000, Chromium pulito
 *   pnpm shots http://localhost:3000/chi-siamo
 *   pnpm shots --gpu                    → Chrome reale con GPU (scene 3D)
 *   pnpm shots --slow                   → throttling 4G
 *   pnpm shots --label dopo-hero        → etichetta la cartella di output
 *
 * Output: .shots/<timestamp>[-label]/<viewport>.png
 *
 * REGOLA: i numeri di performance che finiscono in un report al cliente
 * escono da qui (profilo pulito, nessuna estensione), mai dal browser
 * personale. Gli fps delle scene 3D non si misurano qui: il rendering
 * headless è software. Per quelli serve --gpu e un occhio umano.
 */

import { chromium, type Browser, type Page } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// --- percorsi ancorati al file, non alla cwd -------------------------------

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// --- configurazione --------------------------------------------------------

type Viewport = { name: string; width: number; height: number; mobile: boolean };

const VIEWPORTS: Viewport[] = [
  { name: '01-mobile', width: 390, height: 844, mobile: true },
  { name: '02-tablet', width: 768, height: 1024, mobile: true },
  { name: '03-laptop', width: 1440, height: 900, mobile: false },
  { name: '04-desktop', width: 1920, height: 1080, mobile: false },
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
    deviceScaleFactor: vp.mobile ? 2 : 1,
    isMobile: vp.mobile,
    hasTouch: vp.mobile,
    locale: 'it-IT',
  });

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
  // Si resta in fondo: tornare in cima smonta le sezioni che alcuni siti
  // legano allo scroll, e il fullPage cattura comunque tutta la pagina.
  await page.evaluate(async (stepMs) => {
    for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, stepMs));
    }
  }, SCROLL_STEP_MS);

  const file = join(outDir, `${vp.name}.png`);
  await page.screenshot({ path: file, fullPage, animations: 'disabled' });

  const elapsed = Date.now() - started;
  const flagged = problems.length ? ` ⚠ ${problems.length}` : '';
  console.log(`  ${vp.name.padEnd(11)} ${String(elapsed).padStart(5)}ms${flagged}`);

  await context.close();
  return { viewport: vp.name, elapsed, problems };
}

// --- main ------------------------------------------------------------------

const browser = await chromium.launch(
  useGpu
    ? { channel: 'chrome', headless: false } // GPU reale, necessario per WebGL
    : { headless: true },
);

await mkdir(outDir, { recursive: true });

console.log(`\n${url}`);
console.log(
  `${useGpu ? 'Chrome (GPU)' : 'Chromium headless'}${throttle ? ' · 4G' : ''} · ${fullPage ? 'full page' : 'viewport'}\n`,
);

const results = [];
for (const vp of VIEWPORTS) {
  results.push(await capture(browser, vp));
}

await browser.close();

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
