import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import '../assets/js/workspace-routes.js';

const routes = globalThis.WorkspaceRoutes;
const root = new URL('../', import.meta.url);
const parse = value => routes.parse('https://menglayer.cc' + value);

test('old section bookmarks retain the view, filter and search on clean URLs', () => {
  for (const [before, after, query] of [
    ['/app.html#airdrop', '/airdrop/', ''],
    ['/app.html#airdrop/calculator', '/airdrop/calculators/', ''],
    ['/app.html?q=币安#register/exchanges', '/register/exchanges/', '币安'],
    ['/tools.html?q=APR', '/tools/', 'APR'],
    ['/app.html#tools/points', '/tools/yield/', ''],
    ['/app.html?q=USDT#earn', '/airdrop/', ''],
    ['/airfrop/', '/airdrop/', '']
  ]) {
    const result = parse(before);
    assert.equal(result.path, after, before);
    assert.equal(result.query, query, before);
  }
});

test('legacy calculator bookmarks resolve to their correct section and short path', () => {
  for (const id of [...routes.projectCalculatorIds, ...routes.toolCalculatorIds]) {
    const view = routes.calculatorView(id);
    for (const previousView of ['airdrop', 'tools']) {
      const result = parse('/app.html?q=estimate#' + previousView + '/calculator/' + id);
      assert.equal(result.path, '/' + view + '/' + id + '/');
      assert.equal(result.view, view);
      assert.equal(result.calculatorId, id);
      assert.equal(result.query, 'estimate');
    }
  }
});

test('every generated URL has a real, matching static entry for direct loads and refreshes', async () => {
  assert.equal(new Set(routes.paths).size, routes.paths.length);
  for (const route of routes.paths) {
    const normalized = parse(route);
    assert.equal(normalized.path, route);
    const html = await readFile(new URL(route.slice(1) + 'index.html', root), 'utf8');
    assert.ok(html.includes('href="https://menglayer.cc' + route + '"'), route);
    assert.ok(html.includes('src="/assets/js/workspace-routes.js"'), route);
    assert.ok(!html.includes('href="#airdrop"'), route);
    for (const [,src] of html.matchAll(/<script[^>]*src="([^"]+)"/g)) {
      assert.ok(src.startsWith('/'), route + ': ' + src);
      await readFile(new URL(src.slice(1), root));
    }
  }
});

test('all six general calculators belong to the yield group', async () => {
  const script = await readFile(new URL('assets/js/workspace.js', root), 'utf8');
  const yieldGroup = script.match(/yield:\[([^\]]+)\]/)?.[1] || '';
  for (const id of routes.toolCalculatorIds) assert.ok(yieldGroup.includes("'" + id + "'"));
  assert.ok(!/points:\[/.test(script));
});

test('removed Saturn calculator is absent and old bookmarks return to the calculator list', async () => {
  assert.ok(!routes.projectCalculatorIds.includes('saturn'));
  assert.equal(parse('/app.html#airdrop/calculator/saturn').path, '/airdrop/calculators/');
  const sources = JSON.parse(await readFile(new URL('calculators/sources.json',root),'utf8'));
  assert.ok(!sources.calculators.some(item=>item.id==='saturn'));
  const redirect = await readFile(new URL('airdrop/saturn/index.html',root),'utf8');
  assert.ok(redirect.includes('url=/airdrop/calculators/'));
});
