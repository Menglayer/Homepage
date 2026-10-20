(function (root) {
  'use strict';

  const projectCalculatorIds = ['axis', 'tori', '3j', 'saturn'];
  const toolCalculatorIds = ['airdrop_universal', 'option', 'civcalc', 'apr', 'borrow_risk', 'clammv3'];
  const toolGroups = ['yield', 'markets', 'safety', 'utilities'];
  const registerGroups = ['exchanges', 'brokers', 'payments'];
  const views = ['airdrop', 'tools', 'register'];
  const calculatorView = id => projectCalculatorIds.includes(id) ? 'airdrop' : toolCalculatorIds.includes(id) ? 'tools' : null;

  function href(view, section = 'all') {
    const [group, id] = section.split('/');
    if (group === 'calculator' && id && calculatorView(id)) return '/' + calculatorView(id) + '/' + id + '/';
    if (view === 'airdrop') return group === 'calculator' ? '/airdrop/calculators/' : '/airdrop/';
    if (view === 'tools') return toolGroups.includes(group) ? '/tools/' + group + '/' : group === 'points' ? '/tools/yield/' : '/tools/';
    if (view === 'register') return registerGroups.includes(group) ? '/register/' + group + '/' : '/register/';
    return '/airdrop/';
  }

  function parse(value) {
    const url = new URL(value, 'https://menglayer.cc');
    let route = url.pathname.replace(/^\/+|\/+$/g, '');
    let fragment = '';
    try { fragment = decodeURIComponent(url.hash.slice(1)); } catch (_) { /* Ignore malformed legacy fragments. */ }
    if (/^(airdrop|airfrop|tools|register|earn)(\/|$)/.test(fragment)) route = fragment;
    if (route === 'app.html' || route === 'tools.html' || !route) route = url.searchParams.has('q') || route === 'tools.html' ? 'tools' : 'airdrop';
    let [view, group, id] = route.split('/');
    const paused = view === 'earn';
    if (paused || view === 'airfrop') { view = 'airdrop'; group = ''; id = ''; }
    if (!views.includes(view)) view = url.searchParams.has('q') ? 'tools' : 'airdrop';
    let section = view === 'airdrop' ? 'projects' : 'all';
    let calculatorId = '';
    if (view === 'airdrop' && ['calculator', 'calculators'].includes(group)) section = 'calculator';
    const candidate = group === 'calculator' || group === 'calculators' ? id : group;
    const owner = calculatorView(candidate);
    if (view !== 'register' && owner) { view = owner; section = 'calculator'; calculatorId = candidate; }
    else if (view === 'tools') section = group === 'points' ? 'yield' : toolGroups.includes(group) ? group : 'all';
    else if (view === 'register') section = registerGroups.includes(group) ? group : 'all';
    return {view, section, calculatorId, query:paused ? '' : url.searchParams.get('q') || '', path:href(view, section + (calculatorId ? '/' + calculatorId : '')), paused};
  }

  const paths = [
    ...views.map(view => href(view)),
    href('airdrop', 'calculator'),
    ...projectCalculatorIds.map(id => href('airdrop', 'calculator/' + id)),
    ...toolCalculatorIds.map(id => href('tools', 'calculator/' + id)),
    ...toolGroups.map(group => href('tools', group)),
    ...registerGroups.map(group => href('register', group))
  ];
  root.WorkspaceRoutes = {href, parse, paths, calculatorView, projectCalculatorIds, toolCalculatorIds};
})(globalThis);
