(function () {
  'use strict';
  const id = location.pathname.split('/').filter(Boolean).slice(-2)[0];
  if (!['axis', 'tori', '3j'].includes(id)) return;

  function ready() {
    const en = new URLSearchParams(location.search).get('lang') === 'en';
    const text = (zh, english) => en ? english : zh;
    // Retain source nodes while moving controls between the step containers.
    const originalNodes = [...document.querySelectorAll('*')];
    const $ = selector => document.querySelector(selector) || originalNodes.find(node => node.matches(selector)) || null;
    const make = (tag, className, content) => {
      const node = document.createElement(tag);
      if (className) node.className = className;
      if (content !== undefined) node.textContent = content;
      return node;
    };
    const field = inputId => $('#' + inputId)?.closest('label');
    const mirrors = [];
    const mirror = (source, className = '') => {
      const node = make('strong', className, '—');
      mirrors.push({source, node});
      return node;
    };
    const put = (parent, ...nodes) => nodes.filter(Boolean).forEach(node => parent.append(node));
    function grid(...nodes) {
      const node = make('div', 'pc-fields');
      put(node, ...nodes);
      return node;
    }
    function step(number, title, description, collapsible = false) {
      const section = make(collapsible ? 'details' : 'section', 'pc-step');
      if (collapsible) section.open = true;
      const head = make(collapsible ? 'summary' : 'div', 'pc-step-head');
      head.append(make('span', 'pc-step-number', String(number)));
      const heading = make('div', 'pc-step-heading');
      heading.append(make('span', 'pc-eyebrow', 'STEP ' + number), make('h2', '', title));
      head.append(heading);
      if (collapsible) head.append(make('span', 'pc-chevron', '+'));
      const body = make('div', 'pc-step-body');
      if (description) body.append(make('p', 'pc-step-description', description));
      section.append(head, body);
      return {section, head, body};
    }
    function details(title, ...nodes) {
      const node = make('details', 'pc-details');
      node.append(make('summary', '', title));
      const body = make('div', 'pc-details-body');
      put(body, ...nodes);
      node.append(body);
      return node;
    }
    const configs = {
      axis:{name:'AXIS', logo:'/assets/images/axis.png', primary:'combinedAirdrop', fdv:'fdvInput', scale:1,
        title:text('预估空投价值', 'Estimated airdrop value'), hint:text('已有积分与新增积分，按同一 TGE 价格估值。', 'Existing and new points, valued at the same TGE price.'),
        metrics:[['strategyDailyPoints',text('预计每日 Coordinates','Daily Coordinates')],['totalApy',text('总 APY · 积分 + 底息','Total APY · points + base yield')],['strategyPoints',text('新增仓位预计积分','Projected new points')],['projectedPoints',text('预计全网积分','Projected network points')]],
        date:'tgeInput', docs:'https://app.axis.to/coordinates', unit:'PTS'},
      tori:{name:'TORI', logo:'/assets/images/tori.png', primary:'resultAirdropValue', fdv:'fdv', scale:1e6,
        title:text('预估空投价值','Estimated airdrop value'), hint:text('普通仓位与 Pendle YT，统一计算你的 Cores 份额。','Your Cores share across regular positions and Pendle YT.'),
        metrics:[['positionDailyTotal',text('普通仓位每日 Cores','Daily Cores · regular positions')],['resultApy',text('新增仓位 Cores APY','Cores APY · new positions')],['resultUserCores',text('预计最终 Cores','Projected personal Cores')],['resultNetwork',text('预计全网 Cores','Projected network Cores')]],
        date:'airdropDate', docs:'https://docs.tori.finance/resources/cores', unit:'CORES'},
      '3j':{name:'3JANE', logo:'/assets/images/3jane.png', primary:'projectedYield', fdv:'fdvInput', scale:1,
        title:text('预计期间盈亏','Estimated period P&L'), hint:text('按所选策略与持有周期，拆分底层收益和 JANE 奖励。','Base yield and JANE rewards for your selected strategy and holding period.'),
        metrics:[['dailyYield',text('预计每日盈亏','Estimated daily P&L')],['effectiveApy',text('有效 APY','Effective APY')],['endingBalance',text('预计期末余额','Projected ending balance')],['stripTvl',text('当前策略 TVL','Selected strategy TVL')]],
        date:'daysInput', docs:'https://app.3jane.xyz/farm', unit:'JANE'}
    };
    const config = configs[id];
    document.body.classList.add('project-calculator');
    document.documentElement.classList.add('project-calculator-root');
    const oldMain = $('main');
    const root = make('main', 'pc-root');
    root.setAttribute('aria-label', config.name + ' ' + text('计算器','calculator'));
    root.append(make('h1','pc-sr-only',config.name + ' ' + text('收益与空投计算器','yield & airdrop calculator')));

    const timeline = make('section', 'pc-timeline');
    const timelineLabel = make('div', 'pc-timeline-label');
    timelineLabel.append(make('span', 'pc-eyebrow', text('估算周期','ESTIMATION PERIOD')));
    const period = make('strong', 'pc-period', '—');
    timelineLabel.append(period);
    const line = make('span', 'pc-timeline-line');
    line.setAttribute('aria-hidden','true');
    const countdown = make('span', 'pc-countdown', '—');
    const official = make('a', 'pc-official', text('官方资料 ↗','Official resources ↗'));
    official.href = config.docs;
    official.target = '_blank';
    official.rel = 'noopener noreferrer';
    timeline.append(timelineLabel, line, countdown, official);
    root.append(timeline);

    const overview = make('section', 'pc-overview');
    overview.setAttribute('aria-label',text('估算结果总览','Estimated results overview'));
    const primary = make('div', 'pc-primary');
    const brand = make('div', 'pc-protocol');
    const logo = make('img'); logo.src = config.logo; logo.alt = ''; logo.width = 24; logo.height = 24;
    brand.append(logo, make('span', '', config.name));
    primary.append(brand, make('span', 'pc-primary-label', config.title), mirror(config.primary, 'pc-primary-value'), make('p','pc-primary-hint',config.hint));
    const scenarios = make('div', 'pc-scenarios');
    scenarios.append(make('span', 'pc-overview-label', text('代币 FDV 假设','TOKEN FDV ASSUMPTION')));
    const currentFdv = make('span','pc-current-fdv','');
    scenarios.append(currentFdv);
    const presets = make('div', 'pc-presets');
    const presetButtons = [];
    for (const millions of [50,100,250,500,1000]) {
      const button = make('button', '', millions === 1000 ? '$1B' : '$' + millions + 'M');
      button.type = 'button';
      button.setAttribute('aria-label', 'FDV ' + button.textContent);
      button.addEventListener('click', () => {
        const input = document.getElementById(config.fdv);
        input.value = String(millions * config.scale);
        input.dispatchEvent(new Event('input', {bubbles:true}));
      });
      presetButtons.push({button, value:millions * config.scale});
      presets.append(button);
    }
    scenarios.append(presets);
    const assumptionNote = make('p', 'pc-scenario-note', text('切换情景即时重算；参数均为你的假设。','Switch scenarios to recalculate. All parameters are your assumptions.'));
    scenarios.append(assumptionNote);
    const pointPrice = make('div', 'pc-point-price');
    pointPrice.append(make('span','',id === '3j' ? text('JANE 估算单价','Estimated JANE price') : text('每百万积分估值','Value per million points')), mirror(id === 'axis' ? 'sharedPointPrice' : id === 'tori' ? 'resultMillionValue' : 'janePrice'));
    scenarios.append(pointPrice);
    const metricList = make('dl', 'pc-overview-metrics');
    for (const [source, label] of config.metrics) {
      const row = make('div');
      const value = make('dd'); value.append(mirror(source));
      row.append(make('dt','',label),value); metricList.append(row);
    }
    overview.append(primary, scenarios, metricList); root.append(overview);

    const steps = make('div', 'pc-steps');
    const one = step(1, text('我的仓位','My positions'), text('选择策略并输入投入金额，查看新增奖励与收益。','Choose a strategy and enter your deposit to estimate new rewards and returns.'));
    const two = step(2, text(id === '3j' ? '持有周期与复利方式' : '已有积分与估算周期', id === '3j' ? 'Holding period & compounding' : 'Existing points & estimation period'), '', true);
    const three = step(3, text('市场与估值假设','Market & valuation assumptions'), text('估值和日期可自行调整，数据更新时间与可用性单独显示。','Adjust valuation and dates. Source freshness and availability are shown separately.'), true);

    function quickAmounts(input) {
      if (!input || input.closest('label').querySelector('.pc-quick-amounts')) return;
      const choices = make('div', 'pc-quick-amounts');
      choices.setAttribute('aria-label',text('投入金额快捷选择','Deposit presets'));
      for (const amount of [10000,50000,100000,500000]) {
        const button = make('button','','$' + amount / 1000 + 'K');
        button.type = 'button';
        button.addEventListener('click', () => { input.value=String(amount); input.dispatchEvent(new Event('input',{bubbles:true})); });
        choices.append(button);
      }
      input.closest('label').append(choices);
    }

    let farmSelect;
    if (id === 'axis') {
      const form = $('#strategyForm');
      const reset = $('#strategyResetButton');
      const select = $('.strategy-select-field');
      const amount = field('strategyAmountInput');
      const apy = field('strategyApyInput');
      const multiplier = field('strategyMultiplierInput');
      const yt = field('ytPriceInput');
      put(one.head, reset);
      one.body.append(grid(select, amount, apy, multiplier, yt));
      put(one.body, $('#strategyApyNote'));
      two.body.append(grid(field('pointsInput'), field('strategyTgeInput'), field('tgeInput')));
      put(two.body, $('.strategy-boost'), $('.boost-toggle'), $('.input-note'));
      three.body.append(grid(field('fdvInput'), field('airdropInput'), field('growthInput')));
      put(three.body, $('.market-strip'), $('#dataStatus'));
      form.className = 'pc-form';
      form.replaceChildren(one.section, two.section, three.section);
      steps.append(form);
      quickAmounts($('#strategyAmountInput'));
      put(root, steps, details(text('收益明细与已有积分估值','Return breakdown & existing point value'), $('.strategy-results')), details(text('官方倍率、计算说明与参与入口','Multipliers, methodology & participation'), $('.earn-grid'), $('.earn-note'), $('.method'), $('.boost-banner')));
      const note = make('p','pc-disclaimer',text('结果基于你输入的 FDV、空投比例、积分增长和日期假设。已有积分 Boost 与新增仓位 Boost 分开计算，请核对积分是否已含加成。','Results depend on your FDV, allocation, point growth and date assumptions. Existing point Boost and new position Boost are separate; check whether your points already include a bonus.'));
      root.append(note);
    } else if (id === 'tori') {
      const positions = $('.positions-panel');
      const timing = $('.compact-grid');
      const yt = $('.yt-panel');
      positions.querySelector('.panel-heading')?.remove();
      two.body.append(timing);
      one.body.append(positions);
      put(one.head, $('#openMultipliers'));
      const ytDetail = details(text('Pendle YT · 进阶仓位','Pendle YT · advanced position'), yt);
      if (Number($('#ytInvestment').value) > 0) ytDetail.open = true;
      one.body.append(ytDetail);
      const assumptions = $('.assumptions-panel');
      assumptions.querySelector('.panel-heading')?.remove();
      const assumptionFields = grid(field('fdv'), field('airdropPercent'), field('networkGrowth'));
      put(three.body, assumptionFields, $('.live-total-box'));
      steps.append(one.section,two.section,three.section);
      put(root, steps, details(text('空投估值与 YT 收益明细','Airdrop valuation & YT return breakdown'), $('.results-section')), details(text('排行榜快照与计算说明','Leaderboard snapshot & methodology'), $('.leaderboard-panel'), $('.methodology')));
      const source = make('div','pc-data-foot');
      source.append(make('span','',text('全网 Cores · 数据时间','Network Cores · source timestamp')),mirror('headerTotalCores'),mirror('headerUpdated'));
      root.append(source);
      const note = make('div','pc-disclaimer');
      put(note, $('footer p'));
      root.append(note);
      for (const input of document.querySelectorAll('.amount-input')) quickAmounts(input);
    } else {
      const farmList = $('#farmList');
      farmList.classList.add('pc-farm-legacy');
      farmList.setAttribute('aria-hidden','true');
      const farmLabel = make('label','field');
      farmLabel.append(make('span','',text('当前策略','Selected strategy')));
      farmSelect = make('select','pc-farm-select');
      farmSelect.setAttribute('aria-label',text('选择 3Jane 策略','Choose a 3Jane strategy'));
      farmLabel.append(farmSelect);
      farmSelect.addEventListener('change', () => {
        const button = [...farmList.querySelectorAll('[data-farm-id]')].find(node => node.dataset.farmId === farmSelect.value);
        button?.click();
      });
      one.body.append(grid(farmLabel,field('amountInput')),farmList);
      put(one.body, $('#selectedProtocol'));
      two.body.append(grid(field('daysInput')));
      put(two.body, $('.segmented'));
      three.body.append(grid(field('fdvInput'),field('janeSupplyInput')));
      put(three.body, $('.market-strip'));
      const source = make('div','pc-data-foot');
      put(source, $('#statusPill'), $('#lastUpdated'), $('#refreshButton'));
      three.body.append(source);
      steps.append(one.section,two.section,three.section);
      put(root, steps, details(text('收益拆分与收益曲线','Return breakdown & projection'), $('.rate-table'), $('.result-card')), details(text('数据来源','Data sources'), $('.source-row')));
      root.append(make('p','pc-disclaimer',text('JANE 奖励、底层收益与 YT 成本沿用现有计算模型。数据不可用时保持空值，不作为可成交或保证收益。','JANE rewards, base yield and YT costs use the existing model. Unavailable data remains blank; estimates are not executable or guaranteed returns.')));
      quickAmounts($('#amountInput'));
    }
    document.body.insertBefore(root, oldMain);
    // Keep remaining data hooks available to the original calculation engines.
    oldMain.hidden = true;

    let scheduled = false;
    function sync() {
      scheduled = false;
      for (const {source,node} of mirrors) {
        const value = document.getElementById(source)?.textContent.trim() || '—';
        if (node.textContent !== value) node.textContent = value;
      }
      const fdv = Number(document.getElementById(config.fdv)?.value);
      currentFdv.textContent = text('当前 ','Current ') + '$' + (fdv / config.scale).toLocaleString(en?'en-US':'zh-CN',{maximumFractionDigits:2}) + 'M';
      for (const {button,value} of presetButtons) button.setAttribute('aria-pressed',String(fdv === value));
      const input = document.getElementById(config.date);
      const date = id === '3j' ? new Date(Date.now() + Math.max(0,Number(input.value)) * 86400000) : new Date(input.value + 'T00:00:00Z');
      const valid = Number.isFinite(date.getTime());
      const days = valid ? Math.max(0, Math.ceil((date.getTime() - Date.now()) / 86400000)) : 0;
      const today = new Date().toISOString().slice(0,10).replaceAll('-','.');
      const end = valid ? date.toISOString().slice(0,10).replaceAll('-','.') : '—';
      period.textContent = today + ' → ' + end;
      countdown.textContent = id === '3j' ? text('持有 ','Holding ') + input.value + text(' 天',' days') : text('估算结束 D−','Estimation ends D−') + days;
      if (farmSelect) {
        const buttons = [...$('#farmList').querySelectorAll('[data-farm-id]')];
        const options = buttons.map(node => ({id:node.dataset.farmId,name:node.querySelector('.farm-title strong')?.textContent || node.dataset.farmId,active:node.classList.contains('is-active')}));
        if (farmSelect.dataset.options !== JSON.stringify(options)) {
          farmSelect.replaceChildren(...options.map(value => {const option=make('option','',value.name);option.value=value.id;option.selected=value.active;return option;}));
          farmSelect.dataset.options=JSON.stringify(options);
        }
      }
      if (id === 'tori') document.querySelectorAll('.amount-input').forEach(quickAmounts);
    }
    function schedule() { if (!scheduled) {scheduled=true;queueMicrotask(sync);} }
    const observer = new MutationObserver(schedule);
    for (const source of new Set([...mirrors.map(value=>value.source), ...(id === '3j' ? ['farmList'] : id === 'tori' ? ['positionsList'] : [])])) {
      const node = document.getElementById(source);
      if (node) observer.observe(node,{subtree:true,childList:true,characterData:true});
    }
    document.addEventListener('input',schedule);
    document.addEventListener('change',schedule);
    sync();
    document.documentElement.dataset.projectUi='ready';
  }
  if (document.readyState !== 'complete') document.addEventListener('DOMContentLoaded',ready,{once:true}); else ready();
})();
