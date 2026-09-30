/**
 * serve.mts — serve una cartella in http su questo PC, per mockup e pagine statiche.
 *
 *   pnpm serve mockups                  → http://127.0.0.1:8791/
 *   pnpm serve mockups --port 8800
 *   pnpm serve                          → la cartella da cui lo lanci
 *
 * Perché esiste: una pagina aperta con doppio clic (file://) non si comporta come
 * online — Chrome blocca fetch e moduli verso altri file locali, e ciò che ne dipende
 * semplicemente non compare. Prima si usava `python3 -m http.server`, che su Windows
 * di norma non c'è. Questo gira ovunque giri Node, senza dipendenze
 * (rules/cross-platform.md).
 *
 * Solo per lavorare in locale: risponde a 127.0.0.1, non alla rete, e non esce mai
 * dalla cartella servita.
 */

import { createServer, type ServerResponse } from 'node:http';
import { createReadStream, type Stats } from 'node:fs';
import { readdir, stat } from 'node:fs/promises';
import { extname, join, resolve, sep } from 'node:path';

// --- argomenti -------------------------------------------------------------

const argv = process.argv.slice(2);
const portIndex = argv.indexOf('--port');
const port = portIndex !== -1 ? Number(argv[portIndex + 1]) : 8791;
const dirArg = argv.find((a, i) => !a.startsWith('--') && (portIndex === -1 || i !== portIndex + 1));

// `pnpm serve` lancia lo script dalla cartella del package.json: la cartella da cui
// l'utente ha scritto il comando sta in INIT_CWD.
const baseDir = process.env.INIT_CWD ?? process.cwd();
const root = resolve(baseDir, dirArg ?? '.');

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error(`\nPorta non valida: ${argv[portIndex + 1]}\n`);
  process.exit(1);
}

try {
  if (!(await stat(root)).isDirectory()) throw new Error();
} catch {
  console.error(`\nLa cartella non esiste: ${root}\n`);
  process.exit(1);
}

// --- tipi di file ----------------------------------------------------------

const TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/plain; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.glb': 'model/gltf-binary',
  '.gltf': 'model/gltf+json',
  '.ktx2': 'image/ktx2',
  '.wasm': 'application/wasm',
};

// --- risposta --------------------------------------------------------------

function send(res: ServerResponse, code: number, body: string) {
  res.writeHead(code, { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' });
  res.end(body);
}

const server = createServer(async (req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, 'Solo GET');

  let pathname: string;
  try {
    pathname = decodeURIComponent(new URL(req.url ?? '/', 'http://localhost').pathname);
  } catch {
    return send(res, 400, 'Indirizzo non valido');
  }

  // Mai fuori dalla cartella servita, nemmeno con ../ o percorsi assoluti.
  const target = resolve(root, '.' + pathname);
  if (target !== root && !target.startsWith(root + sep)) return send(res, 403, 'Fuori dalla cartella');

  let file = target;
  let info: Stats;
  try {
    info = await stat(file);
    if (info.isDirectory()) {
      // Senza la barra finale i percorsi relativi della pagina (../shared/...) puntano
      // alla cartella sbagliata: si reindirizza come fa qualunque server vero.
      if (!pathname.endsWith('/')) {
        res.writeHead(301, { location: pathname + '/' });
        return res.end();
      }
      file = join(file, 'index.html');
      info = await stat(file);
    }
  } catch {
    return send(res, 404, `Non trovato: ${pathname}`);
  }

  const headers: Record<string, string | number> = {
    'content-type': TYPES[extname(file).toLowerCase()] ?? 'application/octet-stream',
    'cache-control': 'no-store', // si modifica e si ricarica: niente copie vecchie
    'accept-ranges': 'bytes',
  };

  // Range: i video si possono spostare avanti e indietro solo se il server lo supporta.
  const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range ?? '');
  if (range && (range[1] || range[2])) {
    const size = info.size;
    const start = range[1] ? Number(range[1]) : Math.max(0, size - Number(range[2]));
    const end = range[1] && range[2] ? Math.min(Number(range[2]), size - 1) : size - 1;
    if (start >= size || start > end) {
      res.writeHead(416, { 'content-range': `bytes */${size}` });
      return res.end();
    }
    res.writeHead(206, { ...headers, 'content-range': `bytes ${start}-${end}/${size}`, 'content-length': end - start + 1 });
    if (req.method === 'HEAD') return res.end();
    return createReadStream(file, { start, end }).on('error', () => res.destroy()).pipe(res);
  }

  res.writeHead(200, { ...headers, 'content-length': info.size });
  if (req.method === 'HEAD') return res.end();
  // un file cancellato a metà lettura chiude la risposta, non il server
  createReadStream(file).on('error', () => res.destroy()).pipe(res);
});

server.on('error', (e: NodeJS.ErrnoException) => {
  console.error(
    e.code === 'EADDRINUSE'
      ? `\nLa porta ${port} è già occupata (forse il server è già aperto). Prova: pnpm serve ${dirArg ?? '.'} --port ${port + 1}\n`
      : `\n${e.message}\n`,
  );
  process.exit(1);
});

server.listen(port, '127.0.0.1', async () => {
  // 127.0.0.1 e non localhost: localhost può risolvere su IPv6 (::1) e finire a un altro
  // programma in ascolto sulla stessa porta, senza errori visibili.
  const base = `http://127.0.0.1:${port}/`;
  console.log(`\nServo ${root}\n→ ${base}`);
  // Le pagine da aprire, così non si indovina l'indirizzo: le sottocartelle con un index.html.
  const pages: string[] = [];
  for (const entry of await readdir(root, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    try {
      await stat(join(root, entry.name, 'index.html'));
      pages.push(`${base}${encodeURIComponent(entry.name)}/`);
    } catch {
      // nessun index.html: non è una pagina
    }
  }
  for (const p of pages) console.log(`  ${p}`);
  console.log('\nCtrl+C per fermarlo.\n');
});
