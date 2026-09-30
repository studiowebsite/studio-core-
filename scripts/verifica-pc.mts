/**
 * verifica-pc.mts — controlla che questo PC abbia gli strumenti del progetto, alle
 * versioni del progetto. Stesso esito su Windows e su Mac, o dice cosa manca.
 *
 *   pnpm verifica-pc
 *
 * (Non si chiama `doctor`: `pnpm doctor` è un comando di pnpm e ha la precedenza
 * sugli script del progetto — partirebbe il suo controllo, non questo.)
 *
 * Le versioni attese non stanno qui: si leggono da `.node-version` e dal campo
 * `packageManager` / `devDependencies` del package.json del progetto, così un
 * numero vive in un posto solo (rules/cross-platform.md).
 *
 * I browser non si controllano guardando se il file c'è: si aprono davvero.
 */

import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

type Level = 'ok' | 'avviso' | 'errore';
const rows: { level: Level; what: string; detail: string; fix?: string }[] = [];
const add = (level: Level, what: string, detail: string, fix?: string) =>
  rows.push({ level, what, detail, fix });

// Una stringa unica con shell: su Windows pnpm e git possono essere .cmd, che senza
// shell non partono; e Node 24 sconsiglia shell insieme a una lista di argomenti.
function run(command: string): string | null {
  const r = spawnSync(command, { cwd: ROOT, shell: true, encoding: 'utf8' });
  return r.status === 0 ? r.stdout.trim() : null;
}

function readText(file: string): string | null {
  try {
    return readFileSync(join(ROOT, file), 'utf8');
  } catch {
    return null;
  }
}

const pkg = JSON.parse(readText('package.json') ?? '{}') as {
  packageManager?: string;
  devDependencies?: Record<string, string>;
  dependencies?: Record<string, string>;
};

// --- Node ------------------------------------------------------------------

const nodeWanted = readText('.node-version')?.trim().replace(/^v/, '');
const nodeMajor = Number(process.versions.node.split('.')[0]);
if (!nodeWanted) {
  add('avviso', 'Node', `${process.versions.node} — manca .node-version nel progetto`, 'copialo da studio-core');
} else {
  const wantedMajor = Number(nodeWanted.split('.')[0]);
  if (nodeMajor === wantedMajor) add('ok', 'Node', `${process.versions.node} (progetto: ${nodeWanted})`);
  else if (nodeMajor < wantedMajor)
    add('errore', 'Node', `${process.versions.node}, il progetto vuole ${nodeWanted}`, `installa Node ${wantedMajor} LTS da https://nodejs.org`);
  else add('avviso', 'Node', `${process.versions.node}, il progetto è provato su ${nodeWanted}`, `se qualcosa si comporta diversamente, usa Node ${wantedMajor}`);
}

// --- pnpm ------------------------------------------------------------------

// Lanciato con `pnpm verifica-pc`, la versione in uso è nello user agent; da pnpm 11 in poi
// è già quella del campo packageManager, perché pnpm la scarica e la usa da solo.
const pmWanted = pkg.packageManager?.match(/^pnpm@([^+]+)/)?.[1];
const pmRunning =
  process.env.npm_config_user_agent?.match(/pnpm\/(\S+)/)?.[1] ?? run('pnpm -v');
if (!pmRunning) add('errore', 'pnpm', 'non trovato', 'corepack enable pnpm   (oppure https://pnpm.io/installation)');
else if (!pmWanted)
  add('errore', 'pnpm', `${pmRunning} — il package.json non fissa la versione`, 'aggiungi "packageManager": "pnpm@<versione>" (come in studio-core)');
else if (pmRunning === pmWanted) add('ok', 'pnpm', `${pmRunning} (progetto: ${pmWanted})`);
else
  add('avviso', 'pnpm', `${pmRunning}, il progetto vuole ${pmWanted}`, 'lancia pnpm dalla cartella del progetto: scarica e usa la versione giusta da solo');

// --- git -------------------------------------------------------------------

const git = run('git --version');
if (git) add('ok', 'git', git.replace('git version ', ''));
else add('errore', 'git', 'non trovato', 'https://git-scm.com/downloads');

const lfs = run('git lfs version');
if (lfs) add('ok', 'git lfs', lfs.split(' ')[0].replace('git-lfs/', ''));
else add('errore', 'git lfs', 'non trovato (serve per materiali/ nei repo cliente)', 'https://git-lfs.com, poi: git lfs install');

const who = run('git config user.name');
if (who) add('ok', 'identità git', who);
else add('avviso', 'identità git', 'user.name non impostato: i commit non hanno autore', 'git config --global user.name "Nome"');

// --- Playwright e browser --------------------------------------------------

const pwWanted = pkg.devDependencies?.playwright ?? pkg.dependencies?.playwright;
type Launcher = { launch: (o?: object) => Promise<{ close: () => Promise<void> }> };
let chromium: Launcher | null = null;
let pwInstalled: string | null = null;
try {
  pwInstalled = (JSON.parse(readText('node_modules/playwright/package.json') ?? 'null') as { version?: string } | null)?.version ?? null;
  chromium = ((await import('playwright')) as { chromium: Launcher }).chromium;
} catch {
  chromium = null;
}

if (!pwWanted) add('avviso', 'Playwright', 'non è tra le dipendenze del progetto', 'pnpm add -D --save-exact playwright@<versione di studio-core>');
else if (!chromium || !pwInstalled) add('errore', 'Playwright', `non installato (progetto: ${pwWanted})`, 'pnpm install');
else {
  if (/^[~^]/.test(pwWanted))
    add('avviso', 'Playwright', `${pwInstalled}, ma il package.json dice "${pwWanted}": ogni PC può finire su una versione diversa`, 'fissala esatta, senza ^ né ~');
  else add('ok', 'Playwright', pwInstalled);

  try {
    const b = await chromium.launch({ headless: true });
    await b.close();
    add('ok', 'browser di shots', 'Chromium di questa versione di Playwright');
  } catch {
    add('errore', 'browser di shots', 'Chromium di questa versione di Playwright mancante', 'pnpm exec playwright install chromium');
  }

  try {
    const b = await chromium.launch({ channel: 'chrome', headless: true });
    await b.close();
    add('ok', 'Chrome (per --gpu)', 'installato');
  } catch {
    add('avviso', 'Chrome (per --gpu)', 'non trovato: servono le catture 3D', 'https://www.google.com/chrome/');
  }
}

// --- riepilogo -------------------------------------------------------------

const tag: Record<Level, string> = { ok: '[ok]    ', avviso: '[avviso]', errore: '[errore]' };
console.log(`\n${ROOT}  ·  ${process.platform === 'win32' ? 'Windows' : process.platform === 'darwin' ? 'macOS' : process.platform}\n`);
for (const r of rows) {
  console.log(`${tag[r.level]} ${r.what.padEnd(19)} ${r.detail}`);
  if (r.fix && r.level !== 'ok') console.log(`${' '.repeat(29)}→ ${r.fix}`);
}
const errors = rows.filter((r) => r.level === 'errore').length;
console.log(errors ? `\n${errors} da sistemare prima di lavorare.\n` : '\nTutto a posto.\n');
process.exit(errors ? 1 : 0);
