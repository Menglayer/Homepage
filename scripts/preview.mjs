import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import './build-routes.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.xml': 'application/xml', '.txt': 'text/plain', '.woff2': 'font/woff2', '.ttf': 'font/ttf' };
const server = http.createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const segments = pathname.split('/');
    if (segments.some(part => part.startsWith('.'))) throw new Error('Not public');
    let file = path.resolve(root, '.' + pathname);
    if (!path.extname(pathname)) {
      const directory = pathname === '/' ? '' : pathname.replace(/\/$/, '');
      if (pathname !== '/' && !pathname.endsWith('/')) {
        res.writeHead(301, { Location: pathname + '/' + new URL(req.url, 'http://localhost').search });
        res.end();
        return;
      }
      file = path.join(root, directory, 'index.html');
    }
    if (!file.startsWith(root + path.sep) || !types[path.extname(file)]) throw new Error('Not public');
    const data = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] + (['.html', '.css', '.js', '.json', '.svg', '.xml', '.txt'].includes(path.extname(file)) ? '; charset=utf-8' : ''), 'Cache-Control': 'no-store' });
    res.end(data);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
  }
});
server.listen(4173, '127.0.0.1', () => console.log('MengLayer preview: http://127.0.0.1:4173/'));
