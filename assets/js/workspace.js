(function () {
  'use strict';

  const words = {
    zh: {
      earn:'赚取', airdrop:'空投', tools:'工具', register:'注册', members:'会员',
      skip:'跳至正文', home:'返回 MengLayer 首页', navigation:'应用导航', membersLink:'会员：联系 Mo 的 Telegram', backHome:'返回首页 ↗',
      earnDescription:'交易所活动与收益条件，一处查看。', airdropDescription:'项目研究与测算工具，放在同一个工作台。',
      toolsDescription:'研究、测算与日常操作，按用途找到所需工具。', registerDescription:'交易所、券商与支付服务，分开查找。',
      earnEmpty:'暂无赚取项目', airdropEmpty:'暂无空投项目', comingSoon:'内容正在整理，稍后更新。',
      all:'全部', yield:'收益测算', points:'通用空投估算', markets:'市场看板', safety:'风险与安全', utilities:'实用工具',
      exchanges:'交易所', brokers:'券商', payments:'银行与支付卡', filters:'筛选分类',
      toolColumn:'工具', platformColumn:'平台', categoryColumn:'分类', descriptionColumn:'简介', actionColumn:'操作',
      searchTools:'搜索工具名称或用途…', searchRegister:'搜索交易所、券商或支付服务…', clearSearch:'清空搜索',
      toolCount:'个工具', entryCount:'个入口', noResults:'没有找到相关结果', noResultsHint:'试试其他关键词，或重置分类与搜索。', reset:'重置筛选',
      openTool:'打开工具', signup:'注册', openSignup:'打开注册入口', openExternal:'新标签页打开', closeDialog:'关闭工具',
      loading:'正在加载工具…', slowLoading:'如工具未能显示，可点击右上角在新标签页打开。', frameTitle:'工具内容'
    },
    en: {
      earn:'Earn', airdrop:'Airdrops', tools:'Tools', register:'Register', members:'Members',
      skip:'Skip to content', home:'Back to MengLayer home', navigation:'App navigation', membersLink:'Members: contact Mo on Telegram', backHome:'Back to home ↗',
      earnDescription:'Exchange campaigns and yield conditions, in one place.', airdropDescription:'Project research and calculators in one workspace.',
      toolsDescription:'Research, calculate, and get things done. Find tools by purpose.', registerDescription:'Browse exchanges, brokers, and payment services by category.',
      earnEmpty:'No earn opportunities yet', airdropEmpty:'No airdrop projects yet', comingSoon:'Content is being prepared. Check back soon.',
      all:'All', yield:'Yield calculators', points:'General airdrop estimators', markets:'Market dashboards', safety:'Risk & security', utilities:'Utilities',
      exchanges:'Exchanges', brokers:'Brokers', payments:'Banking & cards', filters:'Filter by category',
      toolColumn:'Tool', platformColumn:'Platform', categoryColumn:'Category', descriptionColumn:'Description', actionColumn:'Action',
      searchTools:'Search tools by name or purpose…', searchRegister:'Search exchanges, brokers, or payments…', clearSearch:'Clear search',
      toolCount:'tools', entryCount:'entries', noResults:'No matching results', noResultsHint:'Try a different keyword, or reset the category and search.', reset:'Reset filters',
      openTool:'Open tool', signup:'Register', openSignup:'Open registration page', openExternal:'Open in new tab', closeDialog:'Close tool',
      loading:'Loading tool…', slowLoading:'If the tool does not appear, open it in a new tab using the button above.', frameTitle:'Tool content'
    }
  };

  // Categories reference the existing catalog; URLs, names and descriptions stay shared.
  const toolGroups = {
    yield:['option','civcalc','apr','borrow_risk','clammv3'],
    points:['airdrop_universal'],
    markets:['yyy','strc','fundingfee','stable_radar','cex_radar'],
    safety:['earnfaq','tsc','allowance','e712'],
    utilities:['watermark','bridge_optimizer','subdomain','vanity']
  };
  const paymentIds = new Set(['ifast','bybit_card','bitget_card','kast_card','etherfi_card']);
  const tools = (window.LINKS?.tools || []).map(item => ({...item, group:Object.keys(toolGroups).find(group => toolGroups[group].includes(item.id)) || 'utilities'}));
  const registration = [
    ...(window.LINKS?.exchanges || []).map(item => ({...item, group:'exchanges'})),
    ...(window.LINKS?.broker || []).map(item => ({...item, group:paymentIds.has(item.id) ? 'payments' : 'brokers'}))
  ];
  const $ = selector => document.querySelector(selector);
  const content = $('#viewContent');
  const search = $('#searchInput');
  const dialog = $('#toolDialog');
  const frame = $('#toolFrame');
  let lang = 'zh';
  try { if (localStorage.getItem('lang') === 'en') lang = 'en'; } catch (_) { /* Language does not require storage. */ }
  let view = 'airdrop';
  let category = 'all';
  let calculatorId = '';
  let query = '';
  let activeTool = null;
  let lastTrigger = null;
  let loadingTimer;
  let searchTimer;
  let renderedRoute = '';
  const text = key => words[lang][key];
  const card = item => window.I18N?.[lang]?.cards?.[item.id] || {title:item.id,desc:''};

  function icon(name) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('aria-hidden','true');
    const use = document.createElementNS('http://www.w3.org/2000/svg','use');
    use.setAttribute('href','#icon-' + name);
    svg.appendChild(use);
    return svg;
  }

  function make(tag, className, label) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (label !== undefined) el.textContent = label;
    return el;
  }

  function groups() { return view === 'tools' ? Object.keys(toolGroups) : ['exchanges','brokers','payments']; }
  function catalog() { return view === 'tools' ? tools.filter(item => !window.WorkspacePages.projectCalculatorIds.includes(item.id)) : registration; }

  function readLocation() {
    let route = '';
    try { route = decodeURIComponent(location.hash.slice(1)); } catch (_) { /* Ignore malformed fragments. */ }
    // Earn is paused. Keep old bookmarks usable without loading campaign data.
    if (route.split('/')[0] === 'earn') {
      const url = new URL(location.href);
      url.hash = 'airdrop';
      url.searchParams.delete('q');
      history.replaceState(null,'',url);
      route = 'airdrop';
    }
    const [requestedView, requestedGroup, requestedCalculator] = route.split('/');
    const params = new URLSearchParams(location.search);
    view = ['airdrop','tools','register'].includes(requestedView) ? requestedView : params.has('q') ? 'tools' : 'airdrop';
    category = ['tools','register'].includes(view) && groups().includes(requestedGroup) ? requestedGroup : 'all';
    if (view === 'airdrop') category = requestedGroup === 'calculator' ? 'calculator' : 'projects';
    calculatorId = '';
    if (['airdrop','tools'].includes(view) && requestedGroup === 'calculator') {
      category = 'calculator';
      calculatorId = requestedCalculator || '';
      const owner = window.WorkspacePages.calculatorView(calculatorId);
      if (owner && owner !== view) {
        view = owner;
        const url = new URL(location.href);
        url.hash = view + '/calculator/' + calculatorId;
        history.replaceState(null,'',url);
      }
    }
    query = params.get('q') || '';
    search.value = query;
    render();
    const currentRoute = [view,category,calculatorId].join('/');
    if (renderedRoute && renderedRoute !== currentRoute) window.scrollTo(0,0);
    renderedRoute = currentRoute;
  }

  function setLocation(nextView, nextCategory = 'all', nextQuery = '', replace = false) {
    const url = new URL(location.href);
    url.hash = nextView + (nextCategory === 'all' ? '' : '/' + nextCategory);
    if (nextQuery.trim()) url.searchParams.set('q',nextQuery); else url.searchParams.delete('q');
    history[replace ? 'replaceState' : 'pushState'](null,'',url);
    readLocation();
  }

  function render() {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    document.title = text(view) + ' · MengLayer APP';
    $('[name="description"]').content = text(view + 'Description');
    document.querySelectorAll('[data-text]').forEach(el => { el.textContent = text(el.dataset.text); });
    document.querySelectorAll('[data-label]').forEach(el => { el.setAttribute('aria-label',text(el.dataset.label)); });
    document.querySelectorAll('[data-view]').forEach(el => {
      if (el.dataset.view === view) el.setAttribute('aria-current','page'); else el.removeAttribute('aria-current');
    });
    $('#languageButton').textContent = lang === 'zh' ? 'EN' : '中';
    $('#languageButton').setAttribute('aria-label',lang === 'zh' ? 'Switch to English' : '切换到中文');
    $('#viewTitle').textContent = text(view);
    $('#viewDescription').textContent = text(view + 'Description');
    const isCatalog = view === 'register' || (view === 'tools' && category !== 'calculator');
    $('#searchField').hidden = false;
    $('#catalogToolbar').hidden = !isCatalog;
    content.replaceChildren();
    $('#airdropSections').hidden = view !== 'airdrop';
    document.querySelectorAll('[data-airdrop-tab]').forEach(el => {
      el.textContent = lang === 'zh' ? (el.dataset.airdropTab === 'projects' ? '项目' : '项目计算器') : (el.dataset.airdropTab === 'projects' ? 'Projects' : 'Project calculators');
      if (el.dataset.airdropTab === category) el.setAttribute('aria-current','page'); else el.removeAttribute('aria-current');
    });
    search.placeholder = view === 'tools' ? text('searchTools') : lang === 'zh' ? (view === 'earn' ? '搜索活动、交易所或币种…' : '搜索项目或计算器…') : (view === 'earn' ? 'Search campaigns, exchanges, or assets…' : 'Search projects or calculators…');
    $('#clearSearch').hidden = !query;
    if (!isCatalog) {
      search.setAttribute('aria-label',search.placeholder);
      window.WorkspacePages.render({view,section:category,id:calculatorId,lang,query,content,tools,copy:card,make,icon,navigate:setLocation});
      return;
    }
    search.placeholder = text(view === 'tools' ? 'searchTools' : 'searchRegister');
    search.setAttribute('aria-label',search.placeholder);
    $('#clearSearch').hidden = !query;
    renderFilters();
    renderDirectory();
  }

  function renderFilters() {
    const filters = $('#categoryFilters');
    filters.replaceChildren();
    for (const id of ['all',...groups()]) {
      const button = make('button','',text(id));
      button.type = 'button';
      button.dataset.category = id;
      button.setAttribute('aria-pressed',String(category === id));
      const count = catalog().filter(item => id === 'all' || item.group === id).length;
      const counter = make('span','filter-count',String(count));
      counter.setAttribute('aria-hidden','true');
      button.appendChild(counter);
      filters.appendChild(button);
    }
  }

  function matches(item) {
    if (category !== 'all' && item.group !== category) return false;
    const descriptions = ['zh','en'].flatMap(code => {
      const copy = window.I18N?.[code]?.cards?.[item.id];
      return [copy?.title,copy?.desc,words[code][item.group]];
    });
    const haystack = [item.id,...descriptions].join(' ').normalize('NFKC').toLocaleLowerCase();
    return query.normalize('NFKC').trim().toLocaleLowerCase().split(/\s+/).every(token => haystack.includes(token));
  }

  function renderDirectory() {
    const list = catalog().filter(matches);
    $('#resultCount').textContent = list.length + (lang === 'zh' ? ' ' : ' ') + text(view === 'tools' ? 'toolCount' : 'entryCount');
    if (!list.length) {
      const panel = make('div','empty-panel');
      panel.append(icon('search'),make('h2','',text('noResults')),make('p','',text('noResultsHint')));
      const reset = make('button','reset-search',text('reset'));
      reset.type = 'button';
      reset.dataset.reset = 'true';
      panel.appendChild(reset);
      content.appendChild(panel);
      return;
    }
    const groupIcons = {yield:'earn',points:'airdrop',markets:'search',safety:'members',utilities:'tools',exchanges:'earn',brokers:'register',payments:'register'};
    for (const group of groups()) {
      const entries = list.filter(item => item.group === group);
      if (!entries.length) continue;
      const section = make('section','catalog-group');
      const heading = make('h2','catalog-group-title');
      heading.id = 'group-' + group;
      heading.append(icon(groupIcons[group]),make('span','',text(group)),make('span','group-count',String(entries.length)));
      section.setAttribute('aria-labelledby',heading.id);
      const grid = make('ul','card-grid');
      for (const item of entries) grid.appendChild(renderCard(item));
      section.append(heading,grid);
      content.appendChild(section);
    }
  }

  function renderCard(item) {
    const copy = card(item);
    const entry = document.createElement('li');
    entry.dataset.entry = item.id;
    const link = make('a','catalog-card');
    const integrated = view === 'tools' && window.WorkspacePages.toolCalculatorIds.includes(item.id);
    link.href = integrated ? '#tools/calculator/' + item.id : item.href;
    if (!integrated) { link.target = '_blank'; link.rel = 'noopener noreferrer'; }
    link.title = copy.title.trim() + '\n' + copy.desc;
    if (view === 'tools') link.dataset.toolId = item.id;
    const image = document.createElement('img');
    image.src = item.img;
    image.alt = '';
    image.width = 40;
    image.height = 40;
    image.loading = 'lazy';
    image.decoding = 'async';
    image.addEventListener('error',()=> { image.src = 'assets/images/avatar.jpg'; },{once:true});
    const body = make('span','catalog-card-copy');
    const name = make('span','catalog-card-name');
    name.append(make('span','',copy.title.trim()),icon('arrow'));
    body.append(name,make('span','catalog-card-description',copy.desc));
    link.append(image,body);
    entry.appendChild(link);
    return entry;
  }

  function canEmbed(item) {
    try {
      const url = new URL(item.href);
      return item.open !== 'blank' && url.protocol === 'https:' && (url.hostname === 'menglayer.cc' || url.hostname.endsWith('.menglayer.cc'));
    } catch (_) { return false; }
  }

  function openTool(item, trigger) {
    activeTool = item;
    lastTrigger = trigger;
    $('#dialogTitle').textContent = card(item).title;
    $('#openExternal').href = item.href;
    $('#openExternal').setAttribute('aria-label',text('openExternal') + '：' + card(item).title);
    frame.title = card(item).title;
    $('#dialogLoading').hidden = false;
    $('#loadingText').textContent = text('loading');
    frame.src = item.href;
    dialog.showModal();
    document.documentElement.classList.add('dialog-open');
    clearTimeout(loadingTimer);
    loadingTimer = setTimeout(()=> { if (dialog.open) { $('#loadingText').textContent = text('slowLoading'); $('#dialogLoading').hidden = false; } },10000);
  }

  $('.app-nav').addEventListener('click',event => {
    const link = event.target.closest('[data-view]');
    if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    clearTimeout(searchTimer);
    setLocation(link.dataset.view);
    window.scrollTo(0,0);
    $('#viewTitle').focus({preventScroll:true});
  });
  $('#categoryFilters').addEventListener('click',event => {
    const button = event.target.closest('[data-category]');
    if (button) {
      clearTimeout(searchTimer);
      const selected = button.dataset.category;
      setLocation(view,selected,search.value,true);
      document.querySelector('[data-category="' + selected + '"]').focus({preventScroll:true});
    }
  });
  $('.skip-link').addEventListener('click',event => {
    event.preventDefault();
    $('#viewTitle').focus();
  });
  search.addEventListener('input',()=> {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(()=>setLocation(view,category+(calculatorId?'/'+calculatorId:''),search.value,true),100);
  });
  $('#clearSearch').addEventListener('click',()=> {
    clearTimeout(searchTimer);
    setLocation(view,category+(calculatorId?'/'+calculatorId:''),'',true);
    search.focus();
  });
  content.addEventListener('click',event => {
    if (event.target.closest('[data-reset]')) {
      setLocation(view,'all','',true);
      search.focus();
      return;
    }
    const link = event.target.closest('[data-tool-id]');
    if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
    const item = tools.find(tool => tool.id === link.dataset.toolId);
    if (item && window.WorkspacePages.toolCalculatorIds.includes(item.id)) {
      event.preventDefault();
      setLocation('tools','calculator/'+item.id);
      window.scrollTo(0,0);
      return;
    }
    if (item && canEmbed(item) && typeof dialog.showModal === 'function') {
      event.preventDefault();
      openTool(item,link);
    }
  });
  $('#closeDialog').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close',()=> {
    clearTimeout(loadingTimer);
    activeTool = null;
    frame.removeAttribute('src');
    document.documentElement.classList.remove('dialog-open');
    lastTrigger?.focus({preventScroll:true});
  });
  frame.addEventListener('load',()=> {
    if (activeTool && dialog.open) {
      clearTimeout(loadingTimer);
      $('#dialogLoading').hidden = true;
    }
  });
  $('#languageButton').addEventListener('click',()=> {
    clearTimeout(searchTimer);
    lang = lang === 'zh' ? 'en' : 'zh';
    try { localStorage.setItem('lang',lang); } catch (_) { /* Storage is optional. */ }
    render();
  });
  window.addEventListener('popstate',readLocation);
  window.addEventListener('hashchange',readLocation);
  $('#year').textContent = String(new Date().getFullYear());
  readLocation();
})();
