const DEFAULTS = {
  points: 0,
  fdv: 200,
  airdrop: 5,
  growth: 2,
  tge: "2026-12-03",
  boost: true,
  strategy: "origin-vault",
  strategyAmount: 10_000,
  strategyTge: "2026-12-03",
  strategyBoost: true,
};

const STRATEGY_LABELS = {
  zh: {
    "origin-vault": "Origin Vault",
    "hold-usdx": "持有 USDx",
    "stake-usdx": "质押 USDx",
    "curve-usdx-usdt": "Curve · USDx / USDT",
    "curve-susdx-usdx": "Curve · sUSDx / USDx",
    "pendle-susdx-yt": "Pendle · sUSDx YT",
    "pendle-susdx-lp": "Pendle · sUSDx LP",
    "pendle-usdx-yt": "Pendle · USDx YT",
    "pendle-usdx-lp": "Pendle · USDx LP",
  },
  en: {
    "origin-vault": "Origin Vault",
    "hold-usdx": "Hold USDx",
    "stake-usdx": "Stake USDx",
    "curve-usdx-usdt": "Curve · USDx / USDT",
    "curve-susdx-usdx": "Curve · sUSDx / USDx",
    "pendle-susdx-yt": "Pendle · sUSDx YT",
    "pendle-susdx-lp": "Pendle · sUSDx LP",
    "pendle-usdx-yt": "Pendle · USDx YT",
    "pendle-usdx-lp": "Pendle · USDx LP",
  },
};

const FALLBACK_STATS = {
  totalPoints: 56_863_778_618.03561,
  totalWallets: 2_033,
  timestamp: "2026-09-08T07:40:45.961Z",
  source: "AXIS official API snapshot",
  pointsPerUsdPerDay: 1,
  pointsRateSource: "https://api.axis.to/api/v1/points/campaigns",
  pointsCampaign: "Origin Season 1",
  earnUpdatedAt: "2026-09-08T07:40:25.365Z",
  earnSource: "https://app.axis.to/earn",
  strategyTge: "2026-12-03",
  earnOpportunities: [
    { id: "origin-vault", multiplier: 10, apy: { type: "rate", value: "7.31%" }, tge: "2026-12-03", url: "https://app.axis.to/origin" },
    { id: "hold-usdx", multiplier: 16, apy: { type: "coordinates-only" }, tge: "2026-12-03", url: "https://app.axis.to/stake#swap" },
    { id: "stake-usdx", multiplier: 4, apy: { type: "rate", value: "29.92%" }, tge: "2026-12-03", url: "https://app.axis.to/stake" },
    { id: "curve-usdx-usdt", multiplier: 20, apy: { type: "not-quoted" }, tge: "2026-12-03", url: "https://curve.finance/dex/ethereum/pools/factory-stable-ng-1051/deposit" },
    { id: "curve-susdx-usdx", multiplier: 10, apy: { type: "not-quoted" }, tge: "2026-12-03", url: "https://curve.finance/dex/ethereum/pools/factory-stable-ng-1052/deposit" },
    { id: "pendle-susdx-yt", multiplier: 6, apy: { type: "variable" }, tge: "2026-12-03", url: "https://app.pendle.finance/trade/markets/0x5e572498e9f83650f0ff24194999bddb4b390928/swap?view=yt&chain=ethereum" },
    { id: "pendle-susdx-lp", multiplier: 5, apy: { type: "not-quoted" }, tge: "2026-12-03", url: "https://app.pendle.finance/trade/markets/0x5e572498e9f83650f0ff24194999bddb4b390928/swap?view=pool&chain=ethereum" },
    { id: "pendle-usdx-yt", multiplier: 24, apy: { type: "variable" }, tge: "2026-12-03", url: "https://app.pendle.finance/trade/markets/0x0bef762d2094ac80821c657dea6783fc43435292/swap?view=yt&chain=ethereum" },
    { id: "pendle-usdx-lp", multiplier: 20, apy: { type: "not-quoted" }, tge: "2026-12-03", url: "https://app.pendle.finance/trade/markets/0x0bef762d2094ac80821c657dea6783fc43435292/swap?view=pool&chain=ethereum" },
  ],
};

const TRANSLATIONS = {
  zh: {
    ytMarketApy: "YT 重算 APY · 不含积分",
    documentTitle: "AXIS 空投计算器",
    metaDescription: "基于 AXIS Coordinates 官方数据与最新 Earn 倍率估算潜在空投价值。默认 FDV 2 亿美元、全网积分每日复利增幅 2%、空投比例 5%。",
    axisLogoAria: "打开 AXIS Coordinates",
    navAria: "主要导航",
    navCalculator: "计算器",
    navEarn: "Earn 倍率",
    openAxis: "打开 AXIS",
    heroLine1: "空投价值，",
    heroLine2: "一眼算清。",
    heroCopy: "基于 AXIS 官方 Coordinates 总量快照，输入你的积分即可估算潜在空投价值。",
    creatorAria: "在 X 上关注 MengLayer",
    boostAria: "AXIS 邀请码活动",
    boostTitle: "使用邀请码，获得 20% Boost 加成",
    boostCopy: "进入 AXIS Origin Vault 开始赚取 Coordinates",
    boostCta: "立即参与",
    parameters: "估算参数",
    reset: "恢复默认",
    yourPoints: "已有 Coordinates",
    airdropRatio: "空投比例",
    growthToTge: "全网积分每日复利增幅",
    tgeDate: "TGE 时间",
    referralBoost: "已有积分的邀请码加成",
    boostNote: "若输入的积分已经包含邀请加成，请关闭 20% Boost。",
    estimatedValue: "预估空投价值",
    effectivePoints: "有效积分",
    estimatedShare: "预计全网占比",
    poolValue: "空投池价值",
    millionPointValue: "每百万积分估值",
    formulaLabel: "计算公式",
    formula: "FDV × 空投比例 × 有效积分 ÷ [全网积分 × (1 + 日增幅)^天数]",
    marketTotal: "官方总 Coordinates",
    marketProjected: "复利至 TGE 总量",
    marketTge: "TGE 日期",
    marketWallets: "参与钱包",
    marketUpdated: "数据更新时间",
    earnTitle: "积分估值 × Earn 收益",
    earnCopy: "在同一个计算器内调整投入、积分估值与策略参数，查看综合收益。",
    earnCta: "查看实时 Earn",
    earnGroupAxis: "USDx 产品",
    earnGroupCurve: "Curve 池",
    earnGroupPendle: "Pendle 市场",
    earnOriginVault: "Origin Vault",
    earnHoldUsdx: "持有 USDx",
    earnStakeUsdx: "质押 USDx",
    earnUpdated: "倍率数据更新",
    earnBoostNote: "符合条件时，邀请码 +20% 会叠加在官方基础倍率之上；倍率不等于 APY。",
    apyCoordinatesOnly: "仅积分",
    apyVariable: "收益随市场变化",
    apyNotQuoted: "暂无 APY",
    strategyKicker: "STRATEGY ESTIMATOR",
    strategyTitle: "策略收益计算器",
    strategyLabel: "当前策略",
    strategyAmount: "投入金额",
    strategyApy: "采用 APY / YT 底层 APY",
    strategyMultiplier: "Coordinates 倍率",
    strategyTge: "策略结束日期",
    ytExpiryHint: "YT 到期日",
    strategyBoost: "应用邀请码倍率加成",
    strategyResultTitle: "预计净收益 · 含新增积分空投",
    strategyProfitCaption: "资金收益 + 新增积分估值 − YT 买入成本（如适用）",
    strategyPointsTitle: "TGE 预计积分收益",
    strategyPointsRateNote: "每 $1 每日 {rate} Coordinates，再乘策略倍率",
    strategyTotal: "预计回收金额 · 含新增空投",
    strategyDailyPoints: "预计每日积分",
    strategyDays: "计息天数",
    strategyEffectiveApy: "采用 APY",
    strategyEffectiveMultiplier: "含 Boost 倍率",
    strategyOpen: "打开所选策略",
    strategyOfficialApy: "已带入 AXIS 当前展示 APY；按此收益率不变估算。",
    strategyVariableApy: "AXIS 未提供固定 APY；YT 收益取决于市场价格与到期前收益，请输入你的预期 APY。",
    strategyCoordinatesApy: "该策略仅展示 Coordinates 收益，APY 默认按 0% 处理，可自行修改。",
    strategyUnquotedApy: "AXIS 暂未展示该策略 APY，默认按 0% 处理，可自行修改。",
    howTitle: "计算方式",
    howCopy: "从今天到 TGE，将全网 Coordinates 按每日增幅复利计算，再用 FDV 与空投比例得到空投池价值，按你的有效积分占复利后总积分的比例分配。",
    disclaimer: "本工具由 MengLayer 独立制作，仅供情景估算，不代表 AXIS 官方承诺或投资建议。FDV、TGE、空投比例、积分规则及 20% Boost 均可能变化，请以项目最终公告为准。",
    loadingData: "正在更新官方数据",
    liveData: "AXIS 积分实时更新",
    officialSnapshot: "AXIS 实时更新失败 · 使用官方快照",
    fallbackSnapshot: "使用内置官方快照",
    switchLanguage: "Switch to English",
    daysLeft: "{days} 天后",
    tgeToday: "今天",
    tgePassed: "已到达",
    ytPrice: "YT 实际单价",
    strategyYield: "资金净收益",
    strategyAirdrop: "新增积分空投估值",
    combinedAirdrop: "已有 + 新增积分空投",
    existingAirdrop: "已有积分空投估值",
    existingPointsNote: "按统一 TGE 积分价格估值；无需新增投资。已含邀请加成的积分请关闭 Boost。",
    existingShare: "已有积分预计占比",
    portfolioTotal: "总回收金额 · 含已有积分",
    sharedPointPrice: "统一积分估值",
    totalApy: "总 APY · 积分 + 底息",
    totalApyNote: "按至 TGE 的总净回报复利年化；不含已有积分，非保证收益。",
    periodReturn: "期间总回报率",
  },
  en: {
    ytMarketApy: "YT recalculated APY · excluding points",
    documentTitle: "AXIS Airdrop Calculator",
    metaDescription: "Estimate a potential AXIS airdrop using official Coordinates data and the latest Earn multipliers. Defaults: $200M FDV, 2% daily compound growth, and 5% allocation.",
    axisLogoAria: "Open AXIS Coordinates",
    navAria: "Primary navigation",
    navCalculator: "Calculator",
    navEarn: "Earn rates",
    openAxis: "Open AXIS",
    heroLine1: "Airdrop value,",
    heroLine2: "made clear.",
    heroCopy: "Enter your points to estimate a potential airdrop value using the official AXIS Coordinates snapshot.",
    creatorAria: "Follow MengLayer on X",
    boostAria: "AXIS referral campaign",
    boostTitle: "Use the invite link and get a 20% Boost",
    boostCopy: "Enter AXIS Origin Vault and start earning Coordinates",
    boostCta: "Join now",
    parameters: "Estimate settings",
    reset: "Reset defaults",
    yourPoints: "Existing Coordinates",
    airdropRatio: "Airdrop allocation",
    growthToTge: "Daily compound points growth",
    tgeDate: "TGE date",
    referralBoost: "Referral boost on existing points",
    boostNote: "Turn off the 20% Boost if your input already includes the referral bonus.",
    estimatedValue: "Estimated airdrop value",
    effectivePoints: "Effective points",
    estimatedShare: "Estimated network share",
    poolValue: "Airdrop pool value",
    millionPointValue: "Value per 1M points",
    formulaLabel: "Formula",
    formula: "FDV × allocation × effective points ÷ [network points × (1 + daily growth)^days]",
    marketTotal: "Official Coordinates",
    marketProjected: "Compounded at TGE",
    marketTge: "TGE date",
    marketWallets: "Participating wallets",
    marketUpdated: "Data updated",
    earnTitle: "Points value × Earn returns",
    earnCopy: "Adjust investment, points valuation and strategy settings in one calculator.",
    earnCta: "View live Earn",
    earnGroupAxis: "USDx products",
    earnGroupCurve: "Curve pools",
    earnGroupPendle: "Pendle markets",
    earnOriginVault: "Origin Vault",
    earnHoldUsdx: "Hold USDx",
    earnStakeUsdx: "Stake USDx",
    earnUpdated: "Rates updated",
    earnBoostNote: "When eligible, the +20% referral boost stacks on the official base rate. Multipliers are not APY.",
    apyCoordinatesOnly: "Coordinates only",
    apyVariable: "Market-dependent return",
    apyNotQuoted: "APY not quoted",
    strategyKicker: "STRATEGY ESTIMATOR",
    strategyTitle: "Strategy yield calculator",
    strategyLabel: "Current strategy",
    strategyAmount: "Principal",
    strategyApy: "APY used / YT underlying APY",
    strategyMultiplier: "Coordinates multiplier",
    strategyTge: "Strategy end date",
    ytExpiryHint: "YT expiry",
    strategyBoost: "Apply referral multiplier boost",
    strategyResultTitle: "Estimated net return · including new points",
    strategyProfitCaption: "Capital yield + new points value − YT purchase cost (if applicable)",
    strategyPointsTitle: "Estimated Coordinates at TGE",
    strategyPointsRateNote: "{rate} Coordinates per $1 per day, then multiplied by the strategy rate",
    strategyTotal: "Estimated proceeds · including new airdrop",
    strategyDailyPoints: "Estimated daily Coordinates",
    strategyDays: "Earning days",
    strategyEffectiveApy: "APY used",
    strategyEffectiveMultiplier: "Multiplier with Boost",
    strategyOpen: "Open selected strategy",
    strategyOfficialApy: "Using the APY currently shown by AXIS. You can edit it.",
    strategyVariableApy: "AXIS does not quote a fixed APY. YT return depends on market price and yield to expiry; enter your own APY assumption.",
    strategyCoordinatesApy: "This strategy shows Coordinates only. APY defaults to 0% and remains editable.",
    strategyUnquotedApy: "AXIS does not currently quote an APY for this strategy. It defaults to 0% and remains editable.",
    howTitle: "How it works",
    howCopy: "From today to TGE, network Coordinates compound at the daily growth rate. We then derive the airdrop pool from FDV and allocation and apply your effective share of the compounded total.",
    disclaimer: "Built independently by MengLayer for scenario estimates only. This is not an official AXIS commitment or investment advice. FDV, TGE, allocation, points rules, and the 20% Boost may change; refer to the project's final announcement.",
    loadingData: "Refreshing official data",
    liveData: "AXIS points updated live",
    officialSnapshot: "AXIS live update unavailable · snapshot",
    fallbackSnapshot: "Using built-in official snapshot",
    switchLanguage: "切换至中文",
    daysLeft: "{days} days left",
    tgeToday: "Today",
    tgePassed: "Reached",
    ytPrice: "YT market price",
    strategyYield: "Net capital return",
    strategyAirdrop: "New points airdrop value",
    combinedAirdrop: "Existing + new points airdrop",
    existingAirdrop: "Existing points airdrop value",
    existingPointsNote: "Valued at the shared TGE point price; no new investment required. Disable Boost if already included.",
    existingShare: "Existing points projected share",
    portfolioTotal: "Total proceeds · including existing points",
    sharedPointPrice: "Shared points value",
    totalApy: "Total APY · points + yield",
    totalApyNote: "Compound annualized net return through TGE; excludes existing points. An estimate, not guaranteed yield.",
    periodReturn: "Total period return",
  },
};




const elements = {
  points: document.querySelector("#pointsInput"),
  fdv: document.querySelector("#fdvInput"),
  airdrop: document.querySelector("#airdropInput"),
  growth: document.querySelector("#growthInput"),
  tge: document.querySelector("#tgeInput"),
  boost: document.querySelector("#boostInput"),
  languageToggle: document.querySelector("#languageToggle"),
  totalPoints: document.querySelector("#totalPoints"),
  projectedPoints: document.querySelector("#projectedPoints"),
  tgeSummary: document.querySelector("#tgeSummary"),
  totalWallets: document.querySelector("#totalWallets"),
  updatedAt: document.querySelector("#updatedAt"),
  earnUpdatedAt: document.querySelector("#earnUpdatedAt"),
  earnRows: document.querySelectorAll("[data-earn-id]"),
  strategyForm: document.querySelector("#strategyForm"),
  strategySelect: document.querySelector("#strategySelect"),
  strategyAmount: document.querySelector("#strategyAmountInput"),
  strategyApy: document.querySelector("#strategyApyInput"),
  strategyMultiplier: document.querySelector("#strategyMultiplierInput"),
  strategyTge: document.querySelector("#strategyTgeInput"),
  strategyBoost: document.querySelector("#strategyBoostInput"),
  strategyReset: document.querySelector("#strategyResetButton"),
  strategyApyNote: document.querySelector("#strategyApyNote"),
  strategyProfit: document.querySelector("#strategyProfit"),
  strategyPoints: document.querySelector("#strategyPoints"),
  strategyDailyPoints: document.querySelector("#strategyDailyPoints"),
  strategyPointsRateNote: document.querySelector("#strategyPointsRateNote"),
  strategyTotal: document.querySelector("#strategyTotal"),
  strategyDays: document.querySelector("#strategyDays"),
  strategyApySummary: document.querySelector("#strategyApySummary"),
  strategyMultiplierSummary: document.querySelector("#strategyMultiplierSummary"),
  strategyLink: document.querySelector("#strategyLink"),
  dataStatus: document.querySelector("#dataStatus"),
  dataStatusText: document.querySelector("#dataStatusText"),
  metaDescription: document.querySelector('meta[name="description"]'),
};

let pendleMarkets = [];
let stats = FALLBACK_STATS;
let dataState = "loadingData";
let language = getStoredLanguage();
let strategyInputsDirty = false;

function getStoredLanguage() {
  const requestedLanguage = new URLSearchParams(window.location.search).get("lang");
  if (requestedLanguage === "en" || requestedLanguage === "zh") {
    return requestedLanguage;
  }
  try {
    return localStorage.getItem("axis-language") === "en" ? "en" : "zh";
  } catch {
    return "zh";
  }
}

function numberValue(input, fallback = 0) {
  const value = Number.parseFloat(input.value);
  return Number.isFinite(value) ? value : fallback;
}

function compactNumber(value, maximumFractionDigits = 2) {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat(language === "zh" ? "zh-CN" : "en-US", {
    notation: "compact",
    maximumFractionDigits,
  }).format(value);
}

function integerNumber(value) {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value);
}

function currency(value) {
  if (!Number.isFinite(value)) return "$0";
  const digits = value < 10 ? 2 : value < 1_000 ? 1 : 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: digits,
  }).format(value);
}

function formatDate(timestamp) {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(language === "zh" ? "zh-CN" : "en-US", {
    timeZone: "Asia/Shanghai",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

function formatEarnApy(apy) {
  const copy = TRANSLATIONS[language];
  if (apy?.type === "rate" && typeof apy.value === "string") {
    return `${Number.parseFloat(apy.value).toFixed(2)}% APY`;
  }
  if (apy?.type === "coordinates-only") return copy.apyCoordinatesOnly;
  if (apy?.type === "variable") return copy.apyVariable;
  return copy.apyNotQuoted;
}

function getEarnOpportunities() {
  const base = Array.isArray(stats.earnOpportunities) ? stats.earnOpportunities : FALLBACK_STATS.earnOpportunities;
  const result = base.map(item => {
    const market = pendleMarkets.find(m => item.url?.includes(m.address));
    if (!market) return item;
    const apy = item.id.endsWith("-lp") ? market.lpApy : market.underlyingApy;
    return { ...item, market, apy: { type: "rate", value: `${apy * 100}%` } };
  });
  for (const market of pendleMarkets) {
    const token = market.address.startsWith("0x5e57") ? "susdx" : "usdx";
    result.push({ id: `pendle-${token}-pt`, multiplier: 0, market, apy: { type: "rate", value: `${market.ptApy * 100}%` }, tge: market.expiry.slice(0,10), url: `https://app.pendle.finance/trade/markets/${market.address}/swap?view=pt&chain=ethereum` });
  }
  return result;
}

function getStrategy() {
  const opportunities = getEarnOpportunities();
  return opportunities.find((item) => item.id === elements.strategySelect.value)
    ?? opportunities[0];
}

function getStrategyApyValue(opportunity) {
  if (opportunity?.apy?.type !== "rate") return 0;
  const value = Number.parseFloat(opportunity.apy.value);
  return Number.isFinite(value) ? value : 0;
}

function getStrategyApyNote(opportunity) {
  const copy = TRANSLATIONS[language];
  if (opportunity?.apy?.type === "rate") return copy.strategyOfficialApy;
  if (opportunity?.apy?.type === "variable") return copy.strategyVariableApy;
  if (opportunity?.apy?.type === "coordinates-only") return copy.strategyCoordinatesApy;
  return copy.strategyUnquotedApy;
}

function renderStrategyOptions() {
  const selectedId = elements.strategySelect.value || DEFAULTS.strategy;
  const labels = STRATEGY_LABELS[language];
  elements.strategySelect.replaceChildren(
    ...getEarnOpportunities().map((opportunity) => {
      const option = document.createElement("option");
      option.value = opportunity.id;
      option.textContent = `${labels[opportunity.id] ?? (opportunity.id === "pendle-susdx-pt" ? "Pendle · sUSDx PT" : opportunity.id === "pendle-usdx-pt" ? "Pendle · USDx PT" : opportunity.id)} · ${opportunity.multiplier}x`;
      return option;
    }),
  );
  elements.strategySelect.value = getEarnOpportunities().some((item) => item.id === selectedId)
    ? selectedId
    : DEFAULTS.strategy;
}

function applySelectedStrategyDefaults() {
  const opportunity = getStrategy();
  if (!opportunity) return;
  elements.strategyApy.value = getStrategyApyValue(opportunity).toFixed(4);
  elements.strategyMultiplier.value = opportunity.multiplier;
  elements.strategyTge.value = opportunity.tge || stats.strategyTge || DEFAULTS.strategyTge;
  elements.strategyLink.href = opportunity.url || stats.earnSource || FALLBACK_STATS.earnSource;
  elements.strategyApyNote.textContent = getStrategyApyNote(opportunity);
  updateStrategyContext();
  calculateStrategy();
}

function updateStrategyContext() {
  const opportunity = getStrategy();
  if (!opportunity) return;
  elements.strategyLink.href = opportunity.url || stats.earnSource || FALLBACK_STATS.earnSource;
  const yt = opportunity.id.endsWith('-yt');
  const market = opportunity.market;
  document.querySelector('#ytPriceField').hidden = !yt;
  document.querySelector('#ytMarketApyRow').hidden = !yt;
  document.querySelector('#ytMarketApy').textContent = market && Number.isFinite(market.ytApy) ? (market.ytApy * 100).toFixed(2) + '%' : '—';
  elements.strategyApy.readOnly = Boolean(market);
  elements.strategyApy.closest('label').querySelector('.field-hint').textContent = market ? 'PENDLE' : 'AXIS / EDITABLE';
  document.querySelector('#ytPriceInput').value = market?.ytPrice ?? '';
  elements.strategyTge.max = market?.expiry.slice(0,10) ?? '';
  const zh = language === 'zh';
  elements.strategyApyNote.textContent = market
    ? (market.live ? (zh ? 'Pendle 实时数据 · ' : 'Pendle live · ') : (zh ? 'Pendle 更新失败，使用快照 · ' : 'Pendle refresh failed, snapshot · ')) + formatDate(market.updatedAt) + (yt ? (zh ? '；YT 到期归零，按实际价格购买，底层利息按 APY 复利、奖励按 APR 单利估算，扣除 5% 收益费；提前结束不计 YT 卖出残值，未计交易费及滑点。' : '; YT expires at zero. Current price; underlying interest compounds, rewards accrue linearly, less 5% yield fee; excludes early-exit resale value, trading fees/slippage.') : (zh ? '；APY 按当前市场估算，PT 积分未确认，按 0x。LP 使用未加成 APY。' : '; Current APY estimate. PT points unconfirmed: 0x. LP uses unboosted APY.'))
    : getStrategyApyNote(opportunity);
}

function renderEarnData() {
  const opportunities = getEarnOpportunities();
  const byId = new Map(opportunities.map((opportunity) => [opportunity.id, opportunity]));

  elements.earnRows.forEach((row) => {
    const opportunity = byId.get(row.dataset.earnId);
    if (!opportunity) return;
    row.querySelector("[data-earn-multiplier]").textContent = `${opportunity.multiplier}x`;
    row.querySelector("[data-earn-apy]").textContent = opportunity.id.endsWith("-yt") && opportunity.market ? `${opportunity.market.ytPrice.toFixed(5)} / YT · ${(opportunity.market.ytApy * 100).toFixed(2)}% APY` : formatEarnApy(opportunity.apy);
  });
  elements.earnUpdatedAt.textContent = formatDate(stats.earnUpdatedAt ?? stats.timestamp);
}

function getDateData(input, fallback) {
  const rawDate = input.value || fallback;
  const [year, month, day] = rawDate.split("-").map(Number);
  const target = new Date(year, month - 1, day);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffDays = Number.isNaN(target.getTime())
    ? 0
    : Math.ceil((target.getTime() - today.getTime()) / 86_400_000);
  const dateLabel = `${String(year).padStart(4, "0")}.${String(month).padStart(2, "0")}.${String(day).padStart(2, "0")}`;
  return { dateLabel, diffDays };
}

function remainingDays(input, fallback) {
  const timestamp = Date.parse((input.value || fallback) + 'T00:00:00Z');
  return Number.isFinite(timestamp) ? Math.max(0, (timestamp - Date.now()) / 86400000) : 0;
}

function getTgeData() {
  return getDateData(elements.tge, DEFAULTS.tge);
}

function getTgeSummary({ dateLabel, diffDays }) {
  const copy = TRANSLATIONS[language];

  if (diffDays > 0) {
    return `${dateLabel} · ${copy.daysLeft.replace("{days}", integerNumber(diffDays))}`;
  }
  if (diffDays === 0) return `${dateLabel} · ${copy.tgeToday}`;
  return `${dateLabel} · ${copy.tgePassed}`;
}

function calculate() {
  const growth = Math.min(100, Math.max(0, numberValue(elements.growth)));
  const tgeData = getTgeData();
  const compoundingDays = remainingDays(elements.tge, DEFAULTS.tge);
  const projectedTotalPoints = Math.max(1, stats.totalPoints * Math.pow(1 + growth / 100, compoundingDays));
  elements.totalPoints.textContent = compactNumber(stats.totalPoints);
  elements.projectedPoints.textContent = compactNumber(projectedTotalPoints);
  elements.tgeSummary.textContent = getTgeSummary(tgeData);
  elements.totalWallets.textContent = integerNumber(stats.totalWallets);
  elements.updatedAt.textContent = formatDate(stats.timestamp);
  calculateStrategy();
}

function calculateStrategy() {
  const amount = Math.max(0, numberValue(elements.strategyAmount));
  const apy = getStrategy()?.market ? getStrategyApyValue(getStrategy()) : Math.max(0, numberValue(elements.strategyApy));
  const multiplier = Math.max(0, numberValue(elements.strategyMultiplier));
  const opportunity = getStrategy();
  const yt = opportunity?.id.endsWith('-yt');
  const market = opportunity?.market;
  const horizon = remainingDays(elements.tge, DEFAULTS.tge);
  const expiryDays = market ? Math.max(0, (Date.parse(market.expiry) - Date.now()) / 86400000) : Infinity;
  const days = Math.min(horizon, remainingDays(elements.strategyTge, DEFAULTS.strategyTge), expiryDays);
  const ytPrice = numberValue(document.querySelector('#ytPriceInput'));
  const ready = !opportunity?.id.startsWith('pendle-') || Boolean(market);
  const exposure = yt && market && ytPrice > 0 ? amount / ytPrice * market.accountingPrice : amount;
  const dailyRate = Math.pow(1 + apy / 100, 1 / 365) - 1;
  const ytInterest = market ? Math.expm1(Math.log1p(market.underlyingInterestApy) * days / 365) : 0;
  const ytRewards = market ? market.underlyingRewardApr * days / 365 : 0;
  if (yt && market) {
    const years = expiryDays / 365;
    const payout = market.accountingPrice * (Math.expm1(Math.log1p(market.underlyingInterestApy) * years) + market.underlyingRewardApr * years) * 0.95;
    const recalculatedApy = years > 0 && ytPrice > 0 ? Math.expm1(Math.log(payout / ytPrice) / years) * 100 : NaN;
    document.querySelector('#ytMarketApy').textContent = Number.isFinite(recalculatedApy) ? recalculatedApy.toFixed(2) + '%' : '—';
  }
  const total = yt ? exposure * (ytInterest + ytRewards) * 0.95 : amount * Math.pow(1 + dailyRate, days);
  const profit = total - amount;
  const effectiveMultiplier = multiplier * (elements.strategyBoost.checked ? 1.2 : 1);
  const configuredBaseRate = Number(stats.pointsPerUsdPerDay);
  const pointsPerUsdPerDay = Number.isFinite(configuredBaseRate) && configuredBaseRate > 0
    ? configuredBaseRate
    : FALLBACK_STATS.pointsPerUsdPerDay;
  const dailyPoints = exposure * pointsPerUsdPerDay * effectiveMultiplier;
  const totalPoints = dailyPoints * days;

  const pool = Math.max(0, numberValue(elements.fdv)) * 1e6 * Math.min(100, Math.max(0, numberValue(elements.airdrop))) / 100;
  const network = Math.max(1, stats.totalPoints * Math.pow(1 + Math.min(100, Math.max(0, numberValue(elements.growth))) / 100, horizon));
  const pointPrice = pool / network;
  const airdrop = Math.min(pool, totalPoints * pointPrice);
  const effectiveExistingPoints = Math.max(0, numberValue(elements.points)) * (elements.boost.checked ? 1.2 : 1);
  const existing = Math.min(pool, effectiveExistingPoints * pointPrice);
  const combined = Math.min(pool, existing + airdrop);
  // Points are valued at TGE, so annualize over the full wait to TGE.
  const annualized = amount > 0 && horizon > 0 && days > 0 && ready
    ? Math.expm1(Math.log((total + airdrop) / amount) * 365 / horizon) * 100 : NaN;
  document.querySelector('#totalApy').textContent = Number.isFinite(annualized) ? annualized.toLocaleString('en-US', { maximumFractionDigits: 2 }) + '%' : '—';
  document.querySelector('#periodReturn').textContent = amount > 0 && days > 0 && ready ? ((profit + airdrop) / amount * 100).toLocaleString('en-US', { maximumFractionDigits: 2 }) + '%' : '—';
  elements.strategyProfit.textContent = ready ? currency(profit + airdrop) : '—';
  document.querySelector('#strategyYield').textContent = ready ? currency(profit) : '—';
  document.querySelector('#strategyAirdrop').textContent = ready ? currency(airdrop) : '—';
  document.querySelector('#combinedAirdrop').textContent = ready ? currency(combined) : '—';
  document.querySelector('#existingAirdrop').textContent = currency(existing);
  document.querySelector('#effectiveExistingPoints').textContent = integerNumber(effectiveExistingPoints) + ' PTS';
  document.querySelector('#existingShare').textContent = (Math.min(1, effectiveExistingPoints / network) * 100).toLocaleString('en-US', { maximumFractionDigits: 8 }) + '%';
  document.querySelector('#portfolioTotal').textContent = ready ? currency(total + combined) : '—';
  document.querySelector('#sharedPointPrice').textContent = currency(pointPrice * 1e6) + ' / 1M PTS';
  elements.strategyPoints.textContent = `${compactNumber(totalPoints)} PTS`;
  elements.strategyDailyPoints.textContent = `${compactNumber(dailyPoints)} PTS`;
  elements.strategyPointsRateNote.textContent = TRANSLATIONS[language].strategyPointsRateNote.replace(
    "{rate}",
    pointsPerUsdPerDay.toLocaleString("en-US", { maximumFractionDigits: 4 }),
  );
  elements.strategyTotal.textContent = ready ? currency(total + airdrop) : '—';
  elements.strategyDays.textContent = days.toLocaleString('en-US', { maximumFractionDigits: 2 });
  elements.strategyApySummary.textContent = `${apy.toLocaleString("en-US", { maximumFractionDigits: 2 })}%`;
  elements.strategyMultiplierSummary.textContent = `${effectiveMultiplier.toLocaleString("en-US", { maximumFractionDigits: 2 })}x`;
}

function applyLanguage() {
  const copy = TRANSLATIONS[language];
  document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  document.title = copy.documentTitle;
  elements.metaDescription.setAttribute("content", copy.metaDescription);

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.dataset.i18n;
    if (copy[key]) node.textContent = copy[key];
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((node) => {
    const key = node.dataset.i18nAria;
    if (copy[key]) node.setAttribute("aria-label", copy[key]);
  });

  elements.languageToggle.textContent = language === "zh" ? "EN" : "中文";
  elements.languageToggle.setAttribute("aria-label", copy.switchLanguage);
  elements.dataStatusText.textContent = copy[dataState];
  renderEarnData();
  renderStrategyOptions();
  updateStrategyContext();
  calculateStrategy();
  calculate();
}

function resetDefaults() {
  elements.points.value = DEFAULTS.points;
  elements.fdv.value = DEFAULTS.fdv;
  elements.airdrop.value = DEFAULTS.airdrop;
  elements.growth.value = DEFAULTS.growth;
  elements.tge.value = DEFAULTS.tge;
  elements.boost.checked = DEFAULTS.boost;
  calculate();
}

function resetStrategyDefaults() {
  strategyInputsDirty = false;
  elements.strategySelect.value = DEFAULTS.strategy;
  elements.strategyAmount.value = DEFAULTS.strategyAmount;
  elements.strategyBoost.checked = DEFAULTS.strategyBoost;
  applySelectedStrategyDefaults();
}

async function loadStats() {
  let live = false;
  try {
    let payload;
    try {
      payload = await fetchJson('https://axis.menglayer.cc/api/axis-stats', 15000);
      if (!(Number(payload.totalPoints) > 0) || !Number.isInteger(payload.totalWallets)) throw new Error('Invalid live AXIS data');
      live = true;
    } catch {
      payload = await fetchJson(`./data/axis-stats.json?v=${Date.now()}`);
    }
    const totalPoints = Number.parseFloat(payload.totalPoints);
    const totalWallets = Number.parseInt(payload.totalWallets, 10);
    if (!Number.isFinite(totalPoints) || !Number.isFinite(totalWallets)) {
      throw new Error("Invalid AXIS snapshot");
    }
    stats = { ...payload, totalPoints, totalWallets };
    dataState = live ? "liveData" : "officialSnapshot";
    elements.dataStatus.classList.toggle("ready", live);
    elements.dataStatus.classList.toggle("stale", !live);
  } catch (error) {
    stats = FALLBACK_STATS;
    dataState = "fallbackSnapshot";
    elements.dataStatus.classList.add("stale");
    console.warn("AXIS stats snapshot unavailable; using fallback.", error);
  }
  elements.dataStatusText.textContent = TRANSLATIONS[language][dataState];
  renderEarnData();
  renderStrategyOptions();
  if (!strategyInputsDirty) applySelectedStrategyDefaults();
  else updateStrategyContext();
  calculateStrategy();
  calculate();
}



elements.strategyForm.addEventListener("input", (event) => {
  if (event.target !== elements.strategySelect) strategyInputsDirty = true;
  calculate();
});
elements.strategySelect.addEventListener("change", () => {
  strategyInputsDirty = true;
  applySelectedStrategyDefaults();
});
elements.strategyReset.addEventListener("click", () => { resetDefaults(); resetStrategyDefaults(); });
elements.strategyForm.addEventListener("submit", event => event.preventDefault());
elements.languageToggle.addEventListener("click", () => {
  language = language === "zh" ? "en" : "zh";
  try {
    localStorage.setItem("axis-language", language);
  } catch {
    // Language switching still works when storage is unavailable.
  }
  applyLanguage();
});

applyLanguage();
resetStrategyDefaults();
async function loadPendle() {
  try {
    const addresses = ['0x5e572498e9f83650f0ff24194999bddb4b390928', '0x0bef762d2094ac80821c657dea6783fc43435292'];
    const snapshot = await fetchJson('./data/pendle-markets.json?v=' + Date.now()).catch(() => ({ markets: [] }));
    pendleMarkets = (await Promise.all(addresses.map(async address => {
      try {
        const data = await fetchJson(`https://api-v2.pendle.finance/core/v1/1/markets/${address}`);
        const market = { address, expiry: data.expiry, updatedAt: data.dataUpdatedAt, ytPrice: data.yt?.price?.usd, accountingPrice: data.accountingAsset?.price?.usd, ptApy: data.impliedApy, lpApy: data.aggregatedApy, underlyingApy: data.underlyingApy, underlyingInterestApy: data.underlyingInterestApy, underlyingRewardApr: data.underlyingRewardApy, ytApy: data.ytFloatingApy, ytRoi: data.ytRoi, live: true };
        if (!validMarket(market)) throw new Error('Invalid live market');
        return market;
      } catch (error) {
        console.warn('Pendle live refresh failed', address, error);
        return snapshot.markets.find(m => m.address === address);
      }
    }))).filter(validMarket);
    renderStrategyOptions(); renderEarnData();
    if (!strategyInputsDirty) applySelectedStrategyDefaults();
    else { updateStrategyContext(); calculate(); }
  } catch (error) { console.warn(error); }
}
function validMarket(m) {
  return m && m.ytPrice > 0 && m.accountingPrice > 0 && Number.isFinite(Date.parse(m.expiry)) && ['ptApy', 'lpApy', 'underlyingApy', 'underlyingInterestApy', 'underlyingRewardApr'].every(key => Number.isFinite(m[key]) && m[key] >= 0) && Number.isFinite(m.ytApy) && m.ytApy >= -1;
}
async function fetchJson(url, timeout = 15000) {
  const response = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(timeout) });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}
Promise.allSettled([loadStats(), loadPendle()]);
window.addEventListener('pageshow', event => {
  if (event.persisted) Promise.allSettled([loadStats(), loadPendle()]);
});
