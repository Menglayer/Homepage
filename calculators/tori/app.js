import {
  ALL_MULTIPLIERS,
  STRATEGIES,
  YT_MARKETS,
  calculateScenario,
  daysUntil,
} from './calculator.js';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const copy = {
  zh: {
    brandSub: '社区情景计算器', totalCores: '全网 Cores', totalWallets: '参与钱包', dataAge: '数据时间',
    viewMultipliers: '查看倍率', verifiedDate: '倍率核对于 2026-07-28', heroTitle: '估算你的 Tori Cores<br><span>与潜在空投价值</span>',
    heroCopy: '组合多种 Tori 机会，使用实时 Pendle YT 价格与排行榜总量，建立自己的情景假设。',
    openTori: '打开 Tori Opportunities ↗', readRules: '阅读官方 Cores 规则 ↗',
    boostTitle: '现在加入 Tori · 获取额外积分 BOOST', boostCopy: '使用专属邀请链接开始赚取 Cores', boostAction: '使用邀请链接加入 ↗',
    myPositions: '我的仓位', positionSubtitle: '普通仓位按美元名义金额计分',
    currentCores: '当前 Cores', airdropDate: '预计空投日期', targetDays: '距目标 {days} 天', positionDetails: '持仓详情', addPosition: '添加仓位',
    emptyPositions: '暂无持仓', emptyPositionsHint: '点击“添加仓位”开始建立计算情景。', positionDaily: '普通仓位每日 Cores',
    assumptions: '估值假设', assumptionSubtitle: '默认情景可随时修改，均非官方参数',
    fdv: 'TGE 时 FDV（USD）', airdropPercent: 'Cores 空投占比（%）', networkGrowth: '全网 Cores 每日增长（%）',
    currentNetworkTotal: '接口当前全网总量',
    ytLab: 'Pendle YT 实时实验室', ytSubtitle: '按 YT 数量与底层名义本金计算，不把买入成本当作计分本金', syncing: '同步中',
    ytType: 'YT 类型', ytPrice: 'YT 单价（USD）', ytInvestment: '买入成本（USD）',
    ytFeeNote: 'Pendle 将底层收益与积分流向 YT，计算按官方文档扣除 3% YT 费；实际 Tori 记分结果以项目后台为准。',
    ytQuantity: 'YT 数量', ytLeverage: '名义杠杆', ytNotional: '计分名义本金', ytDaily: 'YT 每日 Cores', ytPointDays: '有效计分天数', ytExpiry: '到期日',
    leaderboard: '实时排行榜快照', leaderboardSubtitle: '官方接口 Top 5', viewAll: '查看全部 ↗', wallet: '钱包', share: '占比',
    scenarioOutput: '情景输出', resultsTitle: '你的情景结果',
    airdropValue: '预估空投价值', projectedCores: '模拟结束时我的 Cores', millionValue: '每 1M Cores 价值', basedOnProjectedTotal: '按预测全网总量',
    coresApy: '新增仓位 Cores APY', networkProjected: '预测全网累计 Cores', includesYourNew: '含你的新增 Cores',
    ytTotal: 'YT 至模拟结束 Cores', ytNet: 'YT 预估净收益', ytRoi: 'YT ROI', ytRoiHint: '空投 + 底息 + 线性残值 − 成本',
    methodOneTitle: '普通仓位', methodOne: '每日 Cores = 美元名义金额 × 机会页倍率', methodTwoTitle: 'Pendle YT',
    methodTwo: 'YT 数量 × 底层价格 × 倍率 × 97%', methodThreeTitle: '估值', methodThree: 'FDV × 空投占比 × 你的预测份额',
    disclaimer: '非 Tori 官方产品，仅供情景研究，不构成投资建议。倍率、Cores 规则、市场价格与潜在空投条款均可能变化。', authorLabel: '作者',
    multiplierTitle: 'Cores 倍率参考', multiplierCopy: '来自 Tori Opportunities 页面，最后人工核对于 2026-07-28。YT 项请使用专用计算区。',
    strategy: '策略', category: '类别', dailyMultiplier: 'Cores / $ / day', amount: '名义金额（USD）', dailyEarning: '每日 Cores',
    delete: '删除', live: '实时', snapshot: '快照', synced: '已同步', days: '天', capital: '投入', newCores: '新增',
    ytBreakdown: '空投 {airdrop} · 底息 {yield} · 残值 {residual} · 成本 -{cost}',
    dataFallback: '正在使用随站点发布的排行榜快照', livePriceMeta: '{source}价格 {price} · 底层 APY {apy} · 更新 {time}',
  },
  en: {
    brandSub: 'Community scenario calculator', totalCores: 'Network Cores', totalWallets: 'Wallets', dataAge: 'Data time',
    viewMultipliers: 'Multipliers', verifiedDate: 'Multipliers checked 2026-07-28', heroTitle: 'Estimate your Tori Cores<br><span>and potential airdrop value</span>',
    heroCopy: 'Combine Tori opportunities with live Pendle YT prices and leaderboard totals to build your own scenario.',
    openTori: 'Open Tori Opportunities ↗', readRules: 'Read official Cores rules ↗',
    boostTitle: 'Join Tori now · Get an extra points BOOST', boostCopy: 'Start earning Cores with the referral link', boostAction: 'Join with referral ↗',
    myPositions: 'My positions', positionSubtitle: 'Standard positions accrue on USD notional',
    currentCores: 'Current Cores', airdropDate: 'Expected airdrop date', targetDays: '{days} days to target', positionDetails: 'Position details', addPosition: 'Add position',
    emptyPositions: 'No positions yet', emptyPositionsHint: 'Select “Add position” to start building your scenario.', positionDaily: 'Standard position Cores / day',
    assumptions: 'Valuation assumptions', assumptionSubtitle: 'Editable scenario defaults; none are official parameters',
    fdv: 'FDV at TGE (USD)', airdropPercent: 'Cores allocation (%)', networkGrowth: 'Network Cores daily growth (%)',
    currentNetworkTotal: 'Current total from endpoint',
    ytLab: 'Live Pendle YT lab', ytSubtitle: 'Uses YT quantity and underlying notional—not purchase cost—as the points base', syncing: 'Syncing',
    ytType: 'YT type', ytPrice: 'YT price (USD)', ytInvestment: 'Purchase cost (USD)',
    ytFeeNote: 'Pendle streams yield and points to YT. The model applies the documented 3% YT fee; actual Tori accounting remains authoritative.',
    ytQuantity: 'YT quantity', ytLeverage: 'Notional leverage', ytNotional: 'Points notional', ytDaily: 'YT Cores / day', ytPointDays: 'Accrual days', ytExpiry: 'Expiry',
    leaderboard: 'Leaderboard snapshot', leaderboardSubtitle: 'Official endpoint Top 5', viewAll: 'View all ↗', wallet: 'Wallet', share: 'Share',
    scenarioOutput: 'SCENARIO OUTPUT', resultsTitle: 'Your scenario results',
    airdropValue: 'Estimated airdrop value', projectedCores: 'My Cores at simulation end', millionValue: 'Value per 1M Cores', basedOnProjectedTotal: 'Based on projected network total',
    coresApy: 'New-position Cores APY', networkProjected: 'Projected network Cores', includesYourNew: 'Includes your new Cores',
    ytTotal: 'YT Cores through simulation', ytNet: 'Estimated YT net profit', ytRoi: 'YT ROI', ytRoiHint: 'Airdrop + base yield + linear residual − cost',
    methodOneTitle: 'Standard positions', methodOne: 'Daily Cores = USD notional × opportunity multiplier', methodTwoTitle: 'Pendle YT',
    methodTwo: 'YT quantity × underlying price × multiplier × 97%', methodThreeTitle: 'Valuation', methodThree: 'FDV × allocation × your projected share',
    disclaimer: 'Unofficial community tool for scenario research only; not investment advice. Multipliers, Cores rules, prices, and any potential airdrop terms may change.', authorLabel: 'Built by',
    multiplierTitle: 'Cores multiplier reference', multiplierCopy: 'From Tori Opportunities, manually checked on 2026-07-28. Use the dedicated YT lab for YT entries.',
    strategy: 'Strategy', category: 'Category', dailyMultiplier: 'Cores / $ / day', amount: 'Notional (USD)', dailyEarning: 'Daily Cores',
    delete: 'Delete', live: 'Live', snapshot: 'Snapshot', synced: 'Synced', days: 'days', capital: 'capital', newCores: 'new',
    ytBreakdown: 'Airdrop {airdrop} · yield {yield} · residual {residual} · cost -{cost}',
    dataFallback: 'Using the leaderboard snapshot bundled with this deployment', livePriceMeta: '{source} price {price} · underlying APY {apy} · updated {time}',
  },
};

const fallbackLeaderboard = {
  leaderboard: [
    { rank: 1, user: '0x2e3dc205e5687e02eb4bea4f657c9572a83490e5', points: 7721694979.735736, share: '11.0%', referralCount: 0 },
    { rank: 2, user: '0xfecfc33176c4ed3df7fea68e8fe13bcd32eb36d1', points: 5131215857.232387, share: '7.3%', referralCount: 0 },
    { rank: 3, user: '0xd93e7ab3cc0cf5f116c90b3f96ffd952793ee5d2', points: 3079203947.456296, share: '4.4%', referralCount: 0 },
    { rank: 4, user: '0x645e0dbdb5fc2594b8913d7d7c627afe250ab550', points: 2014091442.689395, share: '2.9%', referralCount: 0 },
    { rank: 5, user: '0x0068b5d771862892d42273ff183bc7cdb031e5b6', points: 1928851707.754196, share: '2.8%', referralCount: 0 },
  ],
  totalWallets: 5518,
  totalPoints: 69937327951.04741,
  fetchedAt: '2026-07-28T01:06:36.000Z',
  source: 'https://app.tori.finance/api/leaderboard',
};

const state = {
  locale: localStorage.getItem('tori-calculator-locale') === 'en' ? 'en' : 'zh',
  positions: [{ id: 1, strategyId: 'tori_trusd', amount: 1000 }],
  nextPositionId: 2,
  leaderboard: fallbackLeaderboard,
  leaderboardIsFallback: false,
  pendleLive: new Map(),
  pendleIsLive: false,
};

function t(key, replacements = {}) {
  let value = copy[state.locale][key] ?? copy.zh[key] ?? key;
  for (const [name, replacement] of Object.entries(replacements)) {
    value = value.replace(`{${name}}`, replacement);
  }
  return value;
}

function formatNumber(value, maximumFractionDigits = 2) {
  const number = Number(value) || 0;
  const absolute = Math.abs(number);
  const suffixes = [[1e12, 'T'], [1e9, 'B'], [1e6, 'M'], [1e3, 'K']];
  for (const [threshold, suffix] of suffixes) {
    if (absolute >= threshold) return `${(number / threshold).toFixed(absolute >= threshold * 100 ? 1 : 2)}${suffix}`;
  }
  return number.toLocaleString(state.locale === 'zh' ? 'zh-CN' : 'en-US', { maximumFractionDigits });
}

function formatCurrency(value, maximumFractionDigits = 2) {
  return `$${formatNumber(value, maximumFractionDigits)}`;
}

function shortAddress(address) {
  return address ? `${address.slice(0, 6)}…${address.slice(-4)}` : '—';
}

function formatTimestamp(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat(state.locale === 'zh' ? 'zh-CN' : 'en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false,
  }).format(date);
}

function strategyLabel(strategy) {
  return state.locale === 'zh' ? strategy.labelZh : strategy.labelEn;
}

function applyLanguage() {
  document.documentElement.lang = state.locale === 'zh' ? 'zh-CN' : 'en';
  $$('[data-i18n]').forEach((element) => {
    const value = t(element.dataset.i18n);
    if (value.includes('<')) element.innerHTML = value;
    else element.textContent = value;
  });
  $('#languageButton').textContent = state.locale === 'zh' ? 'EN' : '中文';
  $('#openMultipliers').setAttribute('aria-label', t('viewMultipliers'));
  renderPositions();
  renderYtOptions();
  renderMultipliers();
  renderLeaderboard();
  renderLiveData();
  updateScenario();
}

function renderPositions() {
  const list = $('#positionsList');
  list.innerHTML = '';
  if (state.positions.length === 0) {
    list.innerHTML = `
      <div class="positions-empty">
        <span aria-hidden="true">0</span>
        <strong>${t('emptyPositions')}</strong>
        <p>${t('emptyPositionsHint')}</p>
      </div>`;
    return;
  }
  state.positions.forEach((position, index) => {
    const card = document.createElement('div');
    card.className = 'position-card';
    card.dataset.positionId = String(position.id);
    const options = STRATEGIES.map((strategy) => `<option value="${strategy.id}"${strategy.id === position.strategyId ? ' selected' : ''}>${strategyLabel(strategy)} (${strategy.multiplier}x)</option>`).join('');
    card.innerHTML = `
      <div class="position-card-head"><span>#${index + 1}</span><button class="delete-position" type="button" aria-label="${t('delete')}">×</button></div>
      <div class="position-fields">
        <label class="position-field-label"><span>${t('strategy')}</span><select class="strategy-select">${options}</select></label>
        <label class="position-field-label"><span>${t('amount')}</span><input class="amount-input" type="number" min="0" step="100" value="${position.amount}" inputmode="decimal"></label>
      </div>
      <div class="position-daily"><span>${t('dailyEarning')}</span><strong>0</strong></div>`;
    list.append(card);
  });

  $$('.strategy-select', list).forEach((select) => select.addEventListener('change', (event) => {
    const card = event.target.closest('.position-card');
    const position = state.positions.find((item) => item.id === Number(card.dataset.positionId));
    if (position) position.strategyId = event.target.value;
    updateScenario();
  }));
  $$('.amount-input', list).forEach((input) => input.addEventListener('input', (event) => {
    const card = event.target.closest('.position-card');
    const position = state.positions.find((item) => item.id === Number(card.dataset.positionId));
    if (position) position.amount = Number(event.target.value) || 0;
    updateScenario();
  }));
  $$('.delete-position', list).forEach((button) => button.addEventListener('click', (event) => {
    const id = Number(event.target.closest('.position-card').dataset.positionId);
    state.positions = state.positions.filter((position) => position.id !== id);
    renderPositions();
    updateScenario();
  }));
}

function renderYtOptions() {
  const select = $('#ytType');
  const selected = select.value || 'yt_strusd';
  select.innerHTML = Object.values(YT_MARKETS).map((market) => `<option value="${market.id}"${market.id === selected ? ' selected' : ''}>${strategyLabel(market)}</option>`).join('');
  if (!YT_MARKETS[select.value]) select.value = 'yt_strusd';
}

function renderMultipliers() {
  const rows = $('#multiplierRows');
  rows.innerHTML = ALL_MULTIPLIERS.map((item) => `
    <div class="multiplier-row">
      <span>${strategyLabel(item)}</span>
      <span class="category-tag">${item.category}</span>
      <span class="multiplier-value">${item.multiplier}×</span>
    </div>`).join('');
}

function renderLeaderboard() {
  const rows = $('#leaderboardRows');
  rows.innerHTML = state.leaderboard.leaderboard.slice(0, 5).map((entry) => `
    <div class="leaderboard-row" role="row">
      <span class="rank">${entry.rank}</span>
      <span class="wallet" title="${entry.user}">${shortAddress(entry.user)}</span>
      <span class="points">${formatNumber(entry.points)}</span>
      <span class="share">${entry.share}</span>
    </div>`).join('');
}

function renderLiveData() {
  $('#headerTotalCores').textContent = formatNumber(state.leaderboard.totalPoints);
  $('#headerWallets').textContent = formatNumber(state.leaderboard.totalWallets, 0);
  $('#headerUpdated').textContent = formatTimestamp(state.leaderboard.fetchedAt);
  $('#networkTotalDisplay').textContent = formatNumber(state.leaderboard.totalPoints);
  $('#leaderboardSyncNote').textContent = state.leaderboardIsFallback
    ? t('dataFallback')
    : `${t('synced')} ${formatTimestamp(state.leaderboard.fetchedAt)}`;
}

function normalizeLeaderboard(payload) {
  if (!payload || !Array.isArray(payload.leaderboard) || !Number.isFinite(Number(payload.totalPoints))) throw new Error('Invalid leaderboard payload');
  return {
    ...payload,
    totalWallets: Number(payload.totalWallets) || 0,
    totalPoints: Number(payload.totalPoints) || 0,
    fetchedAt: payload.fetchedAt || new Date().toISOString(),
  };
}

async function loadLeaderboard() {
  try {
    const response = await fetch('./data/leaderboard.json', { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    state.leaderboard = normalizeLeaderboard(await response.json());
    state.leaderboardIsFallback = false;
  } catch (error) {
    state.leaderboard = fallbackLeaderboard;
    state.leaderboardIsFallback = true;
  }
  renderLeaderboard();
  renderLiveData();
  updateScenario();
}

function getSelectedYtMeta() {
  const market = YT_MARKETS[$('#ytType').value] || YT_MARKETS.yt_strusd;
  const live = state.pendleLive.get(market.market.toLowerCase());
  return {
    market,
    price: live?.price ?? market.fallbackPrice,
    underlyingPrice: live?.underlyingPrice ?? market.fallbackUnderlyingPrice,
    underlyingApy: live?.underlyingApy ?? market.fallbackUnderlyingApy,
    expiry: live?.expiry ?? market.expiry,
    updatedAt: live?.updatedAt ?? '2026-07-28T01:12:15.000Z',
    isLive: Boolean(live),
  };
}

function syncYtPrice(resetPrice = false) {
  const meta = getSelectedYtMeta();
  if (resetPrice || !Number($('#ytPrice').value)) $('#ytPrice').value = meta.price ? meta.price.toFixed(8) : '0';
  const status = $('#pendleStatus');
  status.classList.toggle('stale', !meta.isLive);
  status.querySelector('span').textContent = meta.isLive ? t('live') : t('snapshot');
  const template = t('livePriceMeta', {
    source: meta.isLive ? t('live') : t('snapshot'),
    price: formatCurrency(meta.price, 6),
    apy: `${(meta.underlyingApy * 100).toFixed(2)}%`,
    time: formatTimestamp(meta.updatedAt),
  });
  $('#ytMeta').textContent = template;
}

async function fetchPendleMarket(market) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 9000);
  try {
    const response = await fetch(`https://api-v2.pendle.finance/core/v1/${market.chainId}/markets/${market.market}`, {
      cache: 'no-store', signal: controller.signal,
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return {
      price: Number(data?.yt?.price?.usd) || market.fallbackPrice,
      underlyingPrice: Number(data?.underlyingAsset?.price?.usd ?? data?.sy?.price?.usd) || market.fallbackUnderlyingPrice,
      underlyingApy: Number(data?.underlyingInterestApy ?? data?.underlyingApy) || 0,
      expiry: data?.yt?.expiry || data?.expiry || market.expiry,
      updatedAt: data?.yt?.priceUpdatedAt || new Date().toISOString(),
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function loadPendle() {
  const unique = [...new Map(Object.values(YT_MARKETS).map((market) => [market.market.toLowerCase(), market])).values()];
  const results = await Promise.allSettled(unique.map((market) => fetchPendleMarket(market)));
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') state.pendleLive.set(unique[index].market.toLowerCase(), result.value);
  });
  state.pendleIsLive = state.pendleLive.size > 0;
  syncYtPrice(true);
  updateScenario();
}

function valueOf(id) {
  return Number($(`#${id}`).value) || 0;
}

function updatePositionCards(result) {
  result.positionRows.forEach((row) => {
    const card = $(`.position-card[data-position-id="${row.id}"]`);
    if (card) $('.position-daily strong', card).textContent = formatNumber(row.dailyCores, 0);
  });
}

function updateScenario() {
  const meta = getSelectedYtMeta();
  const market = { ...meta.market, expiry: meta.expiry };
  const simulationDays = daysUntil($('#airdropDate').value);
  const result = calculateScenario({
    currentCores: valueOf('currentCores'),
    positions: state.positions,
    days: simulationDays,
    networkTotal: state.leaderboard.totalPoints,
    networkDailyGrowthPercent: valueOf('networkGrowth'),
    fdv: valueOf('fdv'),
    airdropPercent: valueOf('airdropPercent'),
    yt: {
      market,
      investment: valueOf('ytInvestment'),
      price: valueOf('ytPrice'),
      underlyingPrice: meta.underlyingPrice,
      underlyingApy: meta.underlyingApy,
      feeRate: 0.03,
    },
  });
  const hasValuation = result.tokenPoolValue > 0;

  $('#airdropDateHint').textContent = t('targetDays', { days: simulationDays });
  updatePositionCards(result);
  $('#positionDailyTotal').textContent = formatNumber(result.positionDailyCores, 0);
  $('#ytQuantity').textContent = formatNumber(result.yt.quantity, 4);
  $('#ytLeverage').textContent = `${formatNumber(result.yt.leverage, 2)}×`;
  $('#ytNotional').textContent = formatCurrency(result.yt.notional, 0);
  $('#ytDaily').textContent = formatNumber(result.yt.dailyCores, 0);
  $('#ytPointDays').textContent = `${result.yt.pointDays} ${t('days')}`;
  $('#ytExpiry').textContent = market.expiry.slice(0, 10);

  $('#resultAirdropValue').textContent = hasValuation ? formatCurrency(result.projectedAirdropValue) : '—';
  $('#resultShare').textContent = `${(result.share * 100).toFixed(4)}% share`;
  $('#resultUserCores').textContent = formatNumber(result.projectedUserCores, 0);
  $('#resultIncrement').textContent = `+${formatNumber(result.incrementalCores, 0)} ${t('newCores')}`;
  $('#resultMillionValue').textContent = hasValuation ? formatCurrency(result.valuePerMillion) : '—';
  $('#resultApy').textContent = hasValuation ? `${formatNumber(result.coresApy, 2)}%` : '—';
  $('#resultCapital').textContent = `${formatCurrency(result.totalCapital, 0)} ${t('capital')}`;
  $('#resultNetwork').textContent = formatNumber(result.projectedNetworkCores, 0);
  $('#resultYtCores').textContent = formatNumber(result.yt.totalCores, 0);
  $('#resultYtDays').textContent = `${result.yt.pointDays} ${t('days')}`;
  $('#resultYtNet').textContent = hasValuation ? formatCurrency(result.yt.netValue) : '—';
  $('#resultYtRoi').textContent = hasValuation && result.yt.investment > 0 ? `${formatNumber(result.yt.roi, 2)}%` : '—';
  $('#resultYtBreakdown').textContent = hasValuation
    ? t('ytBreakdown', {
      airdrop: formatCurrency(result.yt.airdropValue, 0), yield: formatCurrency(result.yt.baseYield, 0),
      residual: formatCurrency(result.yt.residualValue, 0), cost: formatCurrency(result.yt.investment, 0),
    })
    : '—';
}

function bindEvents() {
  $('#languageButton').addEventListener('click', () => {
    state.locale = state.locale === 'zh' ? 'en' : 'zh';
    localStorage.setItem('tori-calculator-locale', state.locale);
    applyLanguage();
    syncYtPrice(false);
  });
  $('#addPosition').addEventListener('click', () => {
    state.positions.push({ id: state.nextPositionId++, strategyId: 'tori_strusd', amount: 1000 });
    renderPositions();
    updateScenario();
  });
  ['currentCores', 'airdropDate', 'fdv', 'airdropPercent', 'networkGrowth', 'ytPrice', 'ytInvestment']
    .forEach((id) => $(`#${id}`).addEventListener('input', updateScenario));
  $('#ytType').addEventListener('change', () => { syncYtPrice(true); updateScenario(); });

  const dialog = $('#multipliersDialog');
  $('#openMultipliers').addEventListener('click', () => dialog.showModal());
  $('#closeMultipliers').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
}

renderYtOptions();
bindEvents();
applyLanguage();
syncYtPrice(true);
loadLeaderboard();
loadPendle();
