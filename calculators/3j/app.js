const CONVEX_URL = "https://opulent-crocodile-74.convex.cloud";
const DEFAULT_JANE_FDV = 100_000_000;
const DEFAULT_JANE_SUPPLY = 3_330_000_000;
const DEFAULT_TGE_BOUNDS = { min: 1_111_111_111, max: 6_666_666_666 };
const YT_EXPIRY_DATE = new Date("2026-12-17T00:00:00Z");
const CACHE_KEY = "three-jane-farm-calculator-cache-v6";
const ETH_RPC_URLS = ["https://ethereum-rpc.publicnode.com", "https://cloudflare-eth.com"];
const fetchData = (url, options = {}) => fetch(url, { ...options, signal: options.signal || AbortSignal.timeout(12000) });

const ADDRESSES = {
  janeDepositHelper: "0x2a66f992bf227d2e50ef19edd21503c3c4f3f682",
  pendleUsd3Market: "0x4a5067c3ff1abb7449244025b0e37feaf77d8e3e",
  pendleSusd3Market: "0x7972DE1c2f9F11f622a188FBae8c0a943880424F",
  usd3: "0x056b269eb1f75477a8666ae8c7fe01b64dd55ecc",
  susd3: "0xf689555121e529ff0463e191f9bd9d1e496164a7",
  ytUsd3: "0x5cffcc9ddef0fdcf395e2ea24ca5ed5a12032706",
  ytSusd3: "0xC7Aa07578e1F7b3E2c567F8feCE72Ee1FD218437",
  curvePool: "0x7BA89Bc658c07569cfa6d7947adAA80181a24568",
  morphoVault: "0xe05faDf242331808f504661BEA65972594869826",
};

const ASSETS = {
  usd3: "https://app.3jane.xyz/tokens/usd3.svg",
  susd3: "https://app.3jane.xyz/tokens/susd3.svg",
  usdc: "https://static.debank.com/image/eth_token/logo_url/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48/fffcd27b9efff5a86ab942084c05924d.png",
  ptUsd3: "https://app.3jane.xyz/tokens/pt-usd3.png",
  ytUsd3: "https://app.3jane.xyz/tokens/yt-usd3.png",
  plpUsd3: "https://app.3jane.xyz/tokens/plp-usd3.png",
  ptSusd3: "https://app.3jane.xyz/tokens/pt-susd3.svg",
  ytSusd3: "https://app.3jane.xyz/tokens/yt-susd3.svg",
  plpSusd3: "https://app.3jane.xyz/tokens/plp-susd3.svg",
  frxusd: "https://app.3jane.xyz/tokens/frxusd.png",
};

const FARMS = [
  {
    id: "3jane-usd3-supply",
    name: "USD3",
    protocol: "3Jane",
    asset: "USD3",
    icon: ASSETS.usd3,
    base: { type: "convexApy", path: "onchain:getUsd3Apy", label: "USD3 底层 APY" },
    emissionsKey: "USD3",
    tvlKey: "USD3",
    href: "https://app.3jane.xyz/supply",
  },
  {
    id: "3jane-susd3-supply",
    name: "sUSD3",
    protocol: "3Jane",
    asset: "sUSD3",
    icon: ASSETS.susd3,
    base: { type: "convexApy", path: "onchain:getSusd3Apy", label: "sUSD3 底层 APY" },
    emissionsKey: "SUSD3",
    tvlKey: "SUSD3",
    href: "https://app.3jane.xyz/supply",
  },
  {
    id: "3jane-usdc-ecosystem-vault",
    name: "CS-USDC-3JANECO",
    protocol: "Morpho",
    asset: "USDC",
    icon: ASSETS.usdc,
    base: { type: "morphoVault", label: "Morpho Vault 净 APY" },
    emissionsKey: "MORPHO_3JANE_ECOSYSTEM_VAULT",
    tvlKey: "MORPHO_3JANE_ECOSYSTEM_VAULT",
    href: "https://app.morpho.org/ethereum/vault/0xe05faDf242331808f504661BEA65972594869826/3jane-ecosystem-vault",
  },
  {
    id: "pendle-buy-usd3-pt",
    name: "PT-USD3-17DEC2026",
    protocol: "Pendle",
    asset: "USD3",
    icon: ASSETS.ptUsd3,
    base: { type: "pendle", market: ADDRESSES.pendleUsd3Market, mode: "pt", label: "Pendle PT APY" },
    emissionsKey: null,
    tvlKey: "PENDLE_PT",
    href: `https://app.pendle.finance/trade/markets/${ADDRESSES.pendleUsd3Market}/swap?view=pt&chain=ethereum`,
  },
  {
    id: "pendle-buy-usd3-yt",
    name: "YT-USD3-17DEC2026",
    protocol: "Pendle",
    asset: "USD3",
    icon: ASSETS.ytUsd3,
    ytAddress: ADDRESSES.ytUsd3,
    underlyingAddress: ADDRESSES.usd3,
    base: { type: "pendle", market: ADDRESSES.pendleUsd3Market, mode: "yt", label: "底层 APY" },
    emissionsKey: "PENDLE_YT",
    tvlKey: "PENDLE_YT",
    href: "https://app.pendle.finance/trade/markets/0x4a5067c3ff1abb7449244025b0e37feaf77d8e3e/swap?view=yt&chain=ethereum&tab=info",
  },
  {
    id: "pendle-buy-usd3-lpt",
    name: "PLP-USD3-17DEC2026",
    protocol: "Pendle",
    asset: "USD3",
    icon: ASSETS.plpUsd3,
    base: { type: "pendle", market: ADDRESSES.pendleUsd3Market, mode: "lp", label: "Pendle LP APY" },
    emissionsKey: "PENDLE_LP",
    tvlKey: "PENDLE_LP",
    href: `https://app.pendle.finance/trade/pools/${ADDRESSES.pendleUsd3Market}/zap/in?chain=ethereum`,
  },
  {
    id: "pendle-buy-susd3-pt",
    name: "PT-sUSD3-17DEC2026",
    protocol: "Pendle",
    asset: "sUSD3",
    icon: ASSETS.ptSusd3,
    base: { type: "pendle", market: ADDRESSES.pendleSusd3Market, mode: "pt", label: "Pendle PT APY" },
    emissionsKey: null,
    tvlKey: "PENDLE_SUSD3_PT",
    href: `https://app.pendle.finance/trade/markets/${ADDRESSES.pendleSusd3Market}/swap?view=pt&chain=ethereum`,
  },
  {
    id: "pendle-buy-susd3-yt",
    name: "YT-sUSD3-17DEC2026",
    protocol: "Pendle",
    asset: "sUSD3",
    icon: ASSETS.ytSusd3,
    ytAddress: ADDRESSES.ytSusd3,
    underlyingAddress: ADDRESSES.susd3,
    base: { type: "pendle", market: ADDRESSES.pendleSusd3Market, mode: "yt", label: "底层 APY" },
    emissionsKey: "PENDLE_SUSD3_YT",
    tvlKey: "PENDLE_SUSD3_YT",
    href: `https://app.pendle.finance/trade/markets/${ADDRESSES.pendleSusd3Market}/swap?view=yt&chain=ethereum`,
  },
  {
    id: "pendle-buy-susd3-lpt",
    name: "PLP-sUSD3-17DEC2026",
    protocol: "Pendle",
    asset: "sUSD3",
    icon: ASSETS.plpSusd3,
    base: { type: "pendle", market: ADDRESSES.pendleSusd3Market, mode: "lp", label: "Pendle LP APY" },
    emissionsKey: "PENDLE_SUSD3_LP",
    tvlKey: "PENDLE_SUSD3_LP",
    href: `https://app.pendle.finance/trade/pools/${ADDRESSES.pendleSusd3Market}/zap/in?chain=ethereum`,
  },
  {
    id: "frax-usd3-frxusd-lp",
    name: "USD3/frxUSD",
    protocol: "Curve",
    asset: "USD3/frxUSD",
    icon: ASSETS.frxusd,
    base: { type: "curve", label: "Curve LP APY" },
    emissionsKey: "CURVE_USD3_FRXUSD_LP",
    tvlKey: "CURVE_USD3_FRXUSD_LP",
    href: `https://www.curve.finance/dex/ethereum/pools/${ADDRESSES.curvePool}/deposit`,
  },
  {
    id: "3jane-pull-usdc",
    name: "3JANE-USDC-PULL",
    protocol: "3Jane",
    asset: "USDC",
    icon: ASSETS.usdc,
    base: { type: "zero", label: "借款激励" },
    emissionsKey: "MORPHO_BORROWERS",
    tvlKey: "MORPHO_BORROWERS",
    href: "https://app.3jane.xyz/pull",
  },
];

const state = {
  farms: [],
  selectedId: FARMS[0].id,
  amount: 10000,
  days: daysUntilExpiry(),
  janeFdv: DEFAULT_JANE_FDV,
  janeSupply: DEFAULT_JANE_SUPPLY,
  tgeBounds: { ...DEFAULT_TGE_BOUNDS },
  supplyTouched: false,
  compounding: "simple",
  dataMode: "loading",
  depositCap: null,
};

const dom = {
  statusPill: document.querySelector("#statusPill"),
  refreshButton: document.querySelector("#refreshButton"),
  farmList: document.querySelector("#farmList"),
  amountInput: document.querySelector("#amountInput"),
  daysInput: document.querySelector("#daysInput"),
  fdvRange: document.querySelector("#fdvRange"),
  fdvInput: document.querySelector("#fdvInput"),
  janeSupplyRange: document.querySelector("#janeSupplyRange"),
  janeSupplyInput: document.querySelector("#janeSupplyInput"),
  lastUpdated: document.querySelector("#lastUpdated"),
  selectedProtocol: document.querySelector("#selectedProtocol"),
  dataSource: document.querySelector("#dataSource"),
  stripTotalApy: document.querySelector("#stripTotalApy"),
  stripBaseApy: document.querySelector("#stripBaseApy"),
  stripJaneApr: document.querySelector("#stripJaneApr"),
  stripTvl: document.querySelector("#stripTvl"),
  depositCapMetric: document.querySelector("#depositCapMetric"),
  depositCapRemaining: document.querySelector("#depositCapRemaining"),
  depositCapMeta: document.querySelector("#depositCapMeta"),
  janePrice: document.querySelector("#janePrice"),
  ytPriceRow: document.querySelector("#ytPriceRow"),
  ytPosition: document.querySelector("#ytPosition"),
  ytMaturityRow: document.querySelector("#ytMaturityRow"),
  ytMaturityCost: document.querySelector("#ytMaturityCost"),
  ytBaseInterestRow: document.querySelector("#ytBaseInterestRow"),
  ytBaseInterest: document.querySelector("#ytBaseInterest"),
  ytJaneAmountRow: document.querySelector("#ytJaneAmountRow"),
  ytJaneAmount: document.querySelector("#ytJaneAmount"),
  ytWeeklyJaneRow: document.querySelector("#ytWeeklyJaneRow"),
  ytWeeklyJane: document.querySelector("#ytWeeklyJane"),
  baseRate: document.querySelector("#baseRate"),
  janeRate: document.querySelector("#janeRate"),
  totalRate: document.querySelector("#totalRate"),
  projectedYield: document.querySelector("#projectedYield"),
  endingBalance: document.querySelector("#endingBalance"),
  dailyYield: document.querySelector("#dailyYield"),
  annualYield: document.querySelector("#annualYield"),
  effectiveApy: document.querySelector("#effectiveApy"),
  projectionLabel: document.querySelector("#projectionLabel"),
  projectionBars: document.querySelector("#projectionBars"),
};

const pendleMarketCache = new Map();
const pendlePriceCache = new Map();

function daysUntilExpiry() {
  const diff = YT_EXPIRY_DATE.getTime() - Date.now();
  return Math.max(1, Math.ceil(diff / 86_400_000));
}

function setStatus(text, mode) {
  dom.statusPill.textContent = text;
  dom.statusPill.classList.toggle("is-live", mode === "live");
  dom.statusPill.classList.toggle("is-error", mode === "error");
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function toBillions(value) {
  return value / 1_000_000_000;
}

function formatBillions(value) {
  const floored = Math.floor(toBillions(value) * 100) / 100;
  return floored.toFixed(2);
}

function formatPercent(value) {
  if (!Number.isFinite(value)) return "--";
  const abs = Math.abs(value);
  const digits = abs >= 100 ? 1 : abs >= 10 ? 2 : 3;
  return `${value.toFixed(digits)}%`;
}

function formatUsd(value, compact = false) {
  if (!Number.isFinite(value)) return "--";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: compact ? 2 : 2,
  }).format(value);
}

function formatTokenPrice(value) {
  if (!Number.isFinite(value)) return "--";
  const maximumFractionDigits = value >= 1 ? 2 : value >= 0.01 ? 5 : 8;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: Math.min(2, maximumFractionDigits),
    maximumFractionDigits,
  }).format(value);
}

function formatTokenAmount(value) {
  if (!Number.isFinite(value)) return "--";
  return new Intl.NumberFormat("en-US", {
    notation: value >= 1_000_000 ? "compact" : "standard",
    maximumFractionDigits: value >= 1000 ? 2 : 4,
  }).format(value);
}

function parseNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function getJanePrice() {
  return state.janeSupply > 0 ? state.janeFdv / state.janeSupply : 0;
}

async function ethCall(to, data) {
  let lastError;
  for (const url of ETH_RPC_URLS) {
    try {
      const response = await fetchData(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "eth_call",
          params: [{ to, data }, "latest"],
        }),
      });
      const payload = await response.json();
      if (payload.error) throw new Error(payload.error.message || "RPC call failed");
      return payload.result;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error("RPC unavailable");
}

function padAddressParam(address) {
  return address.toLowerCase().replace(/^0x/, "").padStart(64, "0");
}

function decodeAddress(value) {
  return `0x${value.slice(-40)}`;
}

function decodeUint(value) {
  return BigInt(value);
}

function formatUnits(value, decimals) {
  return Number(value) / 10 ** decimals;
}

async function getJaneDepositCap() {
  const selectors = {
    usd3: "0xfcd72b86",
    decimals: "0x313ce567",
    totalAssets: "0x01e1d114",
    availableDepositLimit: "0x46aa2f12",
  };
  const helper = ADDRESSES.janeDepositHelper;
  const usd3 = decodeAddress(await ethCall(helper, selectors.usd3));
  const decimals = Number(decodeUint(await ethCall(usd3, selectors.decimals)));
  const [totalAssetsRaw, remainingRaw] = await Promise.all([
    ethCall(usd3, selectors.totalAssets),
    ethCall(usd3, `${selectors.availableDepositLimit}${padAddressParam("0x0000000000000000000000000000000000000000")}`),
  ]);
  const used = formatUnits(decodeUint(totalAssetsRaw), decimals);
  const remaining = formatUnits(decodeUint(remainingRaw), decimals);
  const cap = used + remaining;

  return {
    helper,
    usd3,
    used,
    remaining,
    cap,
    usedPct: cap > 0 ? (used / cap) * 100 : 0,
    remainingPct: cap > 0 ? (remaining / cap) * 100 : 0,
    updatedAt: Date.now(),
  };
}

async function convexCall(kind, path, args = {}) {
  const response = await fetchData(`${CONVEX_URL}/api/${kind}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ path, args }),
  });

  if (!response.ok) throw new Error(`${path} failed with ${response.status}`);

  const payload = await response.json();
  if (payload.status !== "success") {
    throw new Error(payload.errorMessage || `${path} returned an error`);
  }
  return payload.value;
}

async function getEmissions(opportunityKey) {
  if (!opportunityKey) return null;
  return convexCall("action", "farm:getEmissions", { opportunityKey });
}

async function getTvl(opportunityKey) {
  if (!opportunityKey) return null;
  return convexCall("action", "farm:getTvl", { opportunityKey });
}

async function getMorphoVault() {
  const query = `
    query GetMorphoVaultV2($vaultAddress: String!, $chainId: Int!) {
      vaultV2ByAddress(address: $vaultAddress, chainId: $chainId) {
        address
        name
        symbol
        totalAssetsUsd
        avgNetApy
        avgNetApyExcludingRewards
        asset { symbol decimals }
        rewards { supplyApr asset { symbol } }
      }
    }
  `;

  const response = await fetchData("https://api.morpho.org/graphql", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      query,
      variables: { chainId: 1, vaultAddress: ADDRESSES.morphoVault },
    }),
  });

  if (!response.ok) throw new Error(`Morpho failed with ${response.status}`);
  const payload = await response.json();
  if (payload.errors?.length) throw new Error(payload.errors[0].message);
  return payload.data?.vaultV2ByAddress || null;
}

async function getCurveApy() {
  try {
    const response = await fetchData("https://api.curve.finance/api/getSubgraphData/ethereum");
    if (!response.ok) throw new Error("Curve subgraph failed");
    const payload = await response.json();
    const pool = payload.data?.poolList?.find(
      (item) => item.address?.toLowerCase() === ADDRESSES.curvePool.toLowerCase(),
    );
    if (pool) return Number(pool.latestWeeklyApy ?? pool.latestDailyApy ?? 0);
  } catch (error) {
    console.warn(error);
  }

  const now = Math.floor(Date.now() / 1000);
  const url = `https://prices.curve.finance/v1/snapshots/ethereum/${ADDRESSES.curvePool}?start=${now - 172800}&end=${now}`;
  const response = await fetchData(url);
  if (!response.ok) throw new Error(`Curve prices failed with ${response.status}`);
  const payload = await response.json();
  const latest = [...(payload.data || [])].sort((a, b) => b.timestamp - a.timestamp)[0];
  return Number((latest?.base_weekly_apr ?? latest?.base_daily_apr ?? 0) * 100);
}

async function getPendleMarket(address) {
  const key = address.toLowerCase();
  if (pendleMarketCache.has(key)) return pendleMarketCache.get(key);

  let skip = 0;
  const limit = 100;
  while (skip < 700) {
    const url = `https://api-v2.pendle.finance/core/v2/markets/all?chainId=1&limit=${limit}&skip=${skip}`;
    const response = await fetchData(url);
    if (!response.ok) throw new Error(`Pendle failed with ${response.status}`);
    const payload = await response.json();
    const market = payload.results?.find((item) => item.address?.toLowerCase() === key);
    if (market) {
      pendleMarketCache.set(key, market);
      return market;
    }
    if (skip + limit >= Number(payload.total || 0)) break;
    skip += limit;
  }

  throw new Error(`Pendle market not found: ${address}`);
}

async function getPendleAssetPrice(address) {
  const key = address.toLowerCase();
  if (pendlePriceCache.has(key)) return pendlePriceCache.get(key);

  const url = `https://api-v2.pendle.finance/core/v1/prices/assets?addresses=${key}&skip=0`;
  const response = await fetchData(url);
  if (!response.ok) throw new Error(`Pendle price failed with ${response.status}`);
  const payload = await response.json();
  const price = Number(payload.prices?.[`1-${key}`]);
  if (!Number.isFinite(price) || price <= 0) throw new Error(`Pendle price missing: ${address}`);
  pendlePriceCache.set(key, price);
  return price;
}

async function getPendleOrderbookSize(marketAddress) {
  const url = new URL(`https://api-v2.pendle.finance/limit-order/v2/order-book/1`);
  url.searchParams.set("market", marketAddress.toLowerCase());
  url.searchParams.set("precisionDecimal", "3");
  url.searchParams.set("includeAmm", "false");
  url.searchParams.set("limit", "50");

  const response = await fetchData(url.toString());
  if (!response.ok) return 0;
  const payload = await response.json();
  const entries = [...(payload.longYieldEntries || []), ...(payload.shortYieldEntries || [])];
  return entries.reduce((sum, item) => {
    try {
      return sum + Number(BigInt(item.pySize || "0")) / 1_000_000;
    } catch {
      return sum;
    }
  }, 0);
}

function sumPendleYtApy(market) {
  const categories = market.ytApyBreakdown?.categories || [];
  if (!categories.length) return Number(market.details?.underlyingApy || 0);
  return categories.reduce((sum, item) => sum + Number(item.apy || 0), 0);
}

async function getBaseApy(farm) {
  switch (farm.base.type) {
    case "convexApy": {
      const value = await convexCall("action", farm.base.path, {});
      return { min: Number(value) * 100, label: farm.base.label };
    }
    case "morphoVault": {
      const vault = await getMorphoVault();
      return {
        min: Number(vault?.avgNetApy || 0) * 100,
        label: farm.base.label,
        externalTvl: Number(vault?.totalAssetsUsd || 0),
      };
    }
    case "curve": {
      const value = await getCurveApy();
      return { min: value, label: farm.base.label };
    }
    case "pendle": {
      const [market, ytPrice, underlyingPrice, orderbookSize] = await Promise.all([
        getPendleMarket(farm.base.market),
        farm.ytAddress ? getPendleAssetPrice(farm.ytAddress) : Promise.resolve(null),
        farm.underlyingAddress
          ? getPendleAssetPrice(farm.underlyingAddress)
          : Promise.resolve(null),
        getPendleOrderbookSize(farm.base.market).catch(() => 0),
      ]);
      const details = market.details || {};
      let value = 0;
      if (farm.base.mode === "pt") value = Number(details.impliedApy || 0) * 100;
      if (farm.base.mode === "yt") value = sumPendleYtApy(market) * 100;
      if (farm.base.mode === "lp") value = Number(details.aggregatedApy || 0) * 100;
      return {
        min: value,
        label: farm.base.label,
        ytPrice,
        underlyingPrice,
        externalTvl: Number(details.liquidity ?? details.totalTvl ?? 0) + Number(orderbookSize || 0),
      };
    }
    case "zero":
    default:
      return { min: 0, label: farm.base.label };
  }
}

function getEmissionDenominator(emissions) {
  const candidates = [
    emissions?.aprDenominatorTvl,
    emissions?.earningTvl,
    emissions?.tvl,
    ...(emissions?.components || []).flatMap((component) => [
      component?.aprDenominatorTvl,
      component?.tvl,
    ]),
  ];
  const value = candidates.map(Number).find((item) => Number.isFinite(item) && item > 0);
  return value || 0;
}

function getRewardMetrics(farm, rewardBase, principal, activeDays, annualizeDays = activeDays) {
  const denominator = Number(
    farm.base?.mode === "yt" ? farm.rewardDenominator : farm.tvl,
  );
  const totalWeeklyJane = Number(farm.emissions || 0);
  const weeklyJaneAmount =
    denominator > 0 && totalWeeklyJane > 0 && rewardBase > 0
      ? totalWeeklyJane * (rewardBase / denominator)
      : 0;
  const janeAmount = weeklyJaneAmount * (Math.max(0, activeDays) / 7);
  const janeValue = janeAmount * getJanePrice();
  const janeApr =
    principal > 0 && annualizeDays > 0
      ? (janeValue / principal) * (365 / annualizeDays) * 100
      : 0;

  return {
    weeklyJaneAmount,
    totalWeeklyJane,
    janeAmount,
    janeValue,
    janeApr,
  };
}

function normalizeFarmData(farm, base, emissions, tvl) {
  const baseMin = Number(base.min || 0);
  const tvlNumber = Number(tvl);
  const rewardDenominator = getEmissionDenominator(emissions);
  const ytPrice = Number(base.ytPrice || 0);
  const underlyingPrice = Number(base.underlyingPrice || 0);
  const ytLeverage =
    farm.base?.mode === "yt" && ytPrice > 0 && underlyingPrice > 0
      ? underlyingPrice / ytPrice
      : 0;
  let tvlValue =
    Number.isFinite(tvlNumber) && tvlNumber > 0
      ? tvlNumber
      : Number(emissions?.tvl || base.externalTvl || 0);
  if (ytLeverage > 0 && rewardDenominator > 0) {
    tvlValue = rewardDenominator / ytLeverage;
  }

  return {
    ...farm,
    baseLabel: base.label,
    baseMin,
    ytPrice,
    underlyingPrice,
    ytLeverage,
    tvl: tvlValue,
    rewardDenominator,
    emissions: Number(emissions?.emissions || 0),
    updatedAt: Date.now(),
  };
}

async function loadFarm(farm) {
  const [baseResult, emissionsResult, tvlResult] = await Promise.allSettled([
    getBaseApy(farm),
    getEmissions(farm.emissionsKey),
    getTvl(farm.tvlKey),
  ]);

  if (baseResult.status === "rejected") throw baseResult.reason;
  if (farm.emissionsKey && emissionsResult.status === "rejected") throw emissionsResult.reason;

  const emissions = emissionsResult.status === "fulfilled" ? emissionsResult.value : null;
  const tvl = tvlResult.status === "fulfilled" ? tvlResult.value : null;
  return normalizeFarmData(farm, baseResult.value, emissions, tvl);
}

function configureSupplyControls() {
  const minB = toBillions(state.tgeBounds.min);
  const maxB = toBillions(state.tgeBounds.max);
  dom.janeSupplyRange.min = formatBillions(state.tgeBounds.min);
  dom.janeSupplyRange.max = formatBillions(state.tgeBounds.max);
  dom.janeSupplyInput.min = formatBillions(state.tgeBounds.min);
  dom.janeSupplyInput.max = formatBillions(state.tgeBounds.max);
  if (!state.supplyTouched) {
    setJaneSupplyFromBillions(toBillions(DEFAULT_JANE_SUPPLY), "program", false);
  }
}

async function loadLiveData() {
  setStatus("正在更新实时数据", "loading");
  dom.refreshButton.disabled = true;

  const [boundsResult, farmResults, depositCapResult] = await Promise.all([
    convexCall("query", "farm:getTTSBounds", {}).catch((error) => {
      console.warn(error);
      return null;
    }),
    Promise.allSettled(FARMS.map((farm) => loadFarm(farm))),
    getJaneDepositCap().catch((error) => {
      console.warn(error);
      return null;
    }),
  ]);

  if (boundsResult?.min && boundsResult?.max) {
    state.tgeBounds = { min: Number(boundsResult.min), max: Number(boundsResult.max) };
    configureSupplyControls();
  }

  const farms = farmResults.map((result, index) =>
    result.status === "fulfilled"
      ? result.value
      : { ...normalizeFarmData(FARMS[index], { min: 0, label: FARMS[index].base.label }, null, null), unavailable: true },
  );

  const failed = farmResults.filter((result) => result.status === "rejected").length;
  if (failed === FARMS.length && loadCachedData()) {
    dom.refreshButton.disabled = false;
    return;
  }
  state.farms = farms;
  state.depositCap = depositCapResult;
  state.dataMode = failed ? "partial" : "live";
  localStorage.setItem(
    CACHE_KEY,
    JSON.stringify({ farms, tgeBounds: state.tgeBounds, depositCap: state.depositCap, savedAt: Date.now() }),
  );

  dom.refreshButton.disabled = false;
  setStatus(failed === FARMS.length ? "数据不可用" : failed ? "部分实时数据可用" : "实时数据已同步", failed ? "error" : "live");
  render();
}

function loadCachedData() {
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
    if (cached?.farms?.length) {
      state.farms = cached.farms;
      if (cached.tgeBounds) state.tgeBounds = cached.tgeBounds;
      if (cached.depositCap) state.depositCap = cached.depositCap;
      configureSupplyControls();
      state.dataMode = "cache";
      setStatus("使用本地缓存", "error");
      render();
      return true;
    }
  } catch (error) {
    console.warn(error);
  }
  return false;
}

function getYtMetrics(farm, principal = state.amount, days = state.days) {
  if (
    farm.base?.mode !== "yt" ||
    !(farm.ytPrice > 0) ||
    !(farm.underlyingPrice > 0) ||
    !(principal > 0)
  ) return null;

  const remainingDays = daysUntilExpiry();
  const activeDays = Math.min(Math.max(1, days), remainingDays);
  const units = principal / farm.ytPrice;
  const leverage = farm.underlyingPrice / farm.ytPrice;
  const rewardNotional = principal * leverage;
  const grossBaseYield = rewardNotional * (farm.baseMin / 100) * (activeDays / 365);
  const maturityCost = principal * Math.min(activeDays / remainingDays, 1);
  const netBaseYield = grossBaseYield - maturityCost;
  const grossBaseApr = (grossBaseYield / principal) * (365 / days) * 100;
  const maturityCostApr = (maturityCost / principal) * (365 / days) * 100;
  const baseApr = (netBaseYield / principal) * (365 / days) * 100;
  const rewardMetrics = getRewardMetrics(farm, rewardNotional, principal, activeDays, days);
  const totalValue = netBaseYield + rewardMetrics.janeValue;
  const totalApr = baseApr + rewardMetrics.janeApr;

  return {
    units,
    leverage,
    rewardNotional,
    activeDays,
    grossBaseYield,
    maturityCost,
    netBaseYield,
    grossBaseApr,
    maturityCostApr,
    baseApr,
    ...rewardMetrics,
    totalValue,
    totalApr,
  };
}

function baseAprForInvestment(farm, days = state.days, principal = state.amount) {
  const ytMetrics = getYtMetrics(farm, principal, days);
  return ytMetrics ? ytMetrics.baseApr : farm.baseMin;
}

function adjustedRates(farm, days = state.days, principal = state.amount) {
  const ytMetrics = getYtMetrics(farm, principal, days);
  if (ytMetrics) {
    return {
      baseApr: ytMetrics.baseApr,
      janeApr: ytMetrics.janeApr,
      totalApr: ytMetrics.totalApr,
      janeAprPerNotional:
        ytMetrics.leverage > 0 ? ytMetrics.janeApr / ytMetrics.leverage : 0,
    };
  }

  const rewardMetrics = getRewardMetrics(farm, principal, principal, days, days);
  const janeApr = rewardMetrics.janeApr;
  const baseApr = baseAprForInvestment(farm, days, principal);
  const totalApr = baseApr + janeApr;
  return { baseApr, janeApr, totalApr, janeAprPerNotional: janeApr, rewardMetrics };
}

function calculateProjectedYield(farm, principal, days) {
  const rates = adjustedRates(farm, days, principal);
  const ytMetrics = getYtMetrics(farm, principal, days);
  if (ytMetrics) {
    return { value: ytMetrics.totalValue, rates, ytMetrics, rewardMetrics: ytMetrics };
  }
  const rewardMetrics = getRewardMetrics(farm, principal, principal, days, days);
  const baseYield = estimateYield(principal, farm.baseMin, days, state.compounding);
  return { value: baseYield + rewardMetrics.janeValue, rates, ytMetrics: null, rewardMetrics };
}

function estimateYield(principal, ratePercent, days, compounding) {
  const rate = ratePercent / 100;
  if (!Number.isFinite(rate) || principal <= 0 || days <= 0) return 0;

  if (compounding === "simple") {
    return principal * rate * (days / 365);
  }

  const periods = { daily: 365, weekly: 52, monthly: 12 }[compounding] || 365;
  return principal * ((1 + rate / periods) ** (periods * (days / 365)) - 1);
}

function effectiveApy(ratePercent, compounding) {
  if (compounding === "simple") return ratePercent;
  const periods = { daily: 365, weekly: 52, monthly: 12 }[compounding] || 365;
  const rate = ratePercent / 100;
  return ((1 + rate / periods) ** periods - 1) * 100;
}

function selectedFarm() {
  return state.farms.find((farm) => farm.id === state.selectedId) || state.farms[0] || FARMS[0];
}

function renderFarmList() {
  const farms = state.farms.length ? state.farms : FARMS;
  dom.farmList.innerHTML = farms
    .map((farm) => {
      const rates = state.farms.length && !farm.unavailable ? adjustedRates(farm) : null;
      const total = rates ? formatPercent(rates.totalApr) : "--";
      return `
        <button class="farm-button ${farm.id === state.selectedId ? "is-active" : ""}" type="button" data-farm-id="${farm.id}">
          <span class="farm-icon">${farm.icon ? `<img src="${farm.icon}" alt="${farm.asset}" />` : farm.asset.slice(0, 3)}</span>
          <span class="farm-title">
            <strong>${farm.name}</strong>
            <span class="farm-meta">${farm.protocol} - ${farm.asset}</span>
          </span>
          <span class="farm-yield">${total}</span>
        </button>
      `;
    })
    .join("");

  dom.farmList.querySelectorAll(".farm-button").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedId = button.dataset.farmId;
      render();
    });
  });
}

function renderProjection(farm, principal, days) {
  const checkpoints = [
    { label: "7D", days: Math.min(7, days) },
    { label: "30D", days: Math.min(30, days) },
    { label: `${days}D`, days },
  ];
  const maxYield = Math.max(
    ...checkpoints.map((item) => Math.abs(calculateProjectedYield(farm, principal, item.days).value)),
    1,
  );

  dom.projectionBars.innerHTML = checkpoints
    .map((item) => {
      const value = calculateProjectedYield(farm, principal, item.days).value;
      const width = Math.max(2, Math.min(100, (Math.abs(value) / maxYield) * 100));
      return `
        <div class="bar-row">
          <span>${item.label}</span>
          <span class="bar-track"><span class="bar-fill" style="width: ${width}%"></span></span>
          <strong>${formatUsd(value)}</strong>
        </div>
      `;
    })
    .join("");
}

function renderPositionDetails(farm, principal, projection) {
  const isYt =
    farm.base?.mode === "yt" && farm.ytPrice > 0 && farm.underlyingPrice > 0;
  const rewardMetrics = projection.rewardMetrics;
  const hasRewards = rewardMetrics && rewardMetrics.totalWeeklyJane > 0;
  dom.ytPriceRow.hidden = !isYt;
  dom.ytMaturityRow.hidden = !isYt;
  dom.ytBaseInterestRow.hidden = !isYt;
  dom.ytJaneAmountRow.hidden = !hasRewards;
  dom.ytWeeklyJaneRow.hidden = !hasRewards;
  if (!isYt) {
    dom.ytPosition.textContent = "--";
    dom.ytMaturityCost.textContent = "--";
    dom.ytBaseInterest.textContent = "--";
  }

  if (!hasRewards) {
    dom.ytJaneAmount.textContent = "--";
    dom.ytWeeklyJane.textContent = "--";
  } else {
    dom.ytJaneAmount.textContent = `${formatTokenAmount(rewardMetrics.janeAmount)} JANE / ${formatUsd(rewardMetrics.janeValue)}`;
    dom.ytWeeklyJane.textContent = `${formatTokenAmount(rewardMetrics.totalWeeklyJane)} / ${formatTokenAmount(rewardMetrics.weeklyJaneAmount)} JANE`;
  }

  if (!isYt) return;

  const ytMetrics = getYtMetrics(farm, principal, state.days);
  dom.ytPosition.textContent = `${formatTokenPrice(farm.ytPrice)} / ${ytMetrics.leverage.toFixed(2)}x / ${formatTokenAmount(ytMetrics.units)} YT`;
  dom.ytMaturityCost.textContent = `-${formatUsd(ytMetrics.maturityCost)} (${formatPercent(-ytMetrics.maturityCostApr)})`;
  dom.ytBaseInterest.textContent = `${formatUsd(ytMetrics.grossBaseYield)} (${formatPercent(ytMetrics.grossBaseApr)})`;
}

function renderDepositCap() {
  const cap = state.depositCap;
  dom.depositCapMetric.classList.remove("is-warning", "is-danger");
  if (!cap) {
    dom.depositCapRemaining.textContent = "--";
    dom.depositCapMeta.textContent = "--";
    return;
  }

  dom.depositCapRemaining.textContent = formatUsd(cap.remaining, cap.remaining >= 1_000_000);
  dom.depositCapMeta.textContent = `${formatUsd(cap.used, true)} / ${formatUsd(cap.cap, true)} 已用 (${formatPercent(cap.usedPct)})`;
  if (cap.remainingPct <= 0.1) {
    dom.depositCapMetric.classList.add("is-danger");
  } else if (cap.remainingPct <= 5) {
    dom.depositCapMetric.classList.add("is-warning");
  }
}

function renderResults() {
  const farm = selectedFarm();
  if (!state.farms.length || farm.unavailable) {
    for (const key of ['stripTotalApy','stripBaseApy','stripJaneApr','stripTvl','baseRate','janeRate','totalRate','projectedYield','endingBalance','dailyYield','annualYield','effectiveApy']) dom[key].textContent = '—';
    dom.selectedProtocol.textContent = farm.protocol;
    dom.janePrice.textContent = formatTokenPrice(getJanePrice());
    dom.dataSource.textContent = state.dataMode === 'loading' ? '加载中' : '数据不可用';
    dom.projectionBars.replaceChildren();
    dom.projectionLabel.textContent = farm.name;
    for (const key of ['ytPriceRow','ytMaturityRow','ytBaseInterestRow','ytJaneAmountRow','ytWeeklyJaneRow']) dom[key].hidden = true;
    renderDepositCap();
    return;
  }
  const principal = Math.max(0, state.amount);
  const days = Math.max(1, state.days);
  const projection = calculateProjectedYield(farm, principal, days);
  const rates = projection.rates;
  const projectedYield = projection.value;
  const annualYield = principal * (rates.totalApr / 100);
  const effective = effectiveApy(rates.totalApr, state.compounding);

  dom.selectedProtocol.textContent = `${farm.protocol} - ${farm.baseLabel || farm.base?.label || ""}`;
  dom.stripTotalApy.textContent = formatPercent(rates.totalApr);
  dom.stripBaseApy.textContent = formatPercent(rates.baseApr);
  dom.stripJaneApr.textContent = formatPercent(rates.janeApr);
  dom.stripTvl.textContent = farm.tvl ? formatUsd(farm.tvl, true) : "--";
  dom.janePrice.textContent = formatTokenPrice(getJanePrice());
  dom.baseRate.textContent = formatPercent(rates.baseApr);
  dom.janeRate.textContent = formatPercent(rates.janeApr);
  dom.totalRate.textContent = formatPercent(rates.totalApr);
  dom.projectedYield.textContent = formatUsd(projectedYield);
  dom.endingBalance.textContent = formatUsd(principal + projectedYield);
  dom.dailyYield.textContent = formatUsd(projectedYield / days);
  dom.annualYield.textContent = formatUsd(annualYield);
  dom.effectiveApy.textContent = formatPercent(effective);
  dom.projectionLabel.textContent = farm.name;
  dom.dataSource.textContent = state.dataMode === "live" ? "实时" : state.dataMode === "cache" ? "缓存" : "部分";

  renderPositionDetails(farm, principal, projection);
  renderDepositCap();
  renderProjection(farm, principal, days);
}

function renderTimestamp() {
  const farm = selectedFarm();
  if (!farm.updatedAt || farm.unavailable) {
    dom.lastUpdated.textContent = "--";
    return;
  }

  dom.lastUpdated.textContent = new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(farm.updatedAt));
}

function render() {
  renderFarmList();
  renderResults();
  renderTimestamp();
}

function setJaneSupplyFromBillions(value, source, touched = true) {
  const minB = toBillions(state.tgeBounds.min);
  const maxB = toBillions(state.tgeBounds.max);
  const billions = clamp(parseNumber(value, maxB), minB, maxB);
  state.janeSupply = billions * 1_000_000_000;
  if (touched) state.supplyTouched = true;
  if (source !== "range") dom.janeSupplyRange.value = formatBillions(state.janeSupply);
  if (source !== "input") dom.janeSupplyInput.value = formatBillions(state.janeSupply);
}

function bindInputs() {
  dom.daysInput.value = String(state.days);
  dom.janeSupplyInput.value = formatBillions(state.janeSupply);
  dom.janeSupplyRange.value = formatBillions(state.janeSupply);

  dom.amountInput.addEventListener("input", () => {
    state.amount = parseNumber(dom.amountInput.value, 0);
    render();
  });

  dom.daysInput.addEventListener("input", () => {
    state.days = Math.max(1, parseNumber(dom.daysInput.value, daysUntilExpiry()));
    render();
  });

  const syncFdv = (value, source) => {
    const millions = Math.max(1, parseNumber(value, DEFAULT_JANE_FDV / 1_000_000));
    state.janeFdv = millions * 1_000_000;
    if (source !== "range") dom.fdvRange.value = String(Math.min(1000, Math.max(50, millions)));
    if (source !== "input") dom.fdvInput.value = String(millions);
    render();
  };

  dom.fdvRange.addEventListener("input", () => syncFdv(dom.fdvRange.value, "range"));
  dom.fdvInput.addEventListener("input", () => syncFdv(dom.fdvInput.value, "input"));

  dom.janeSupplyRange.addEventListener("input", () => {
    setJaneSupplyFromBillions(dom.janeSupplyRange.value, "range");
    render();
  });

  dom.janeSupplyInput.addEventListener("input", () => {
    setJaneSupplyFromBillions(dom.janeSupplyInput.value, "input");
    render();
  });

  document.querySelectorAll("[data-compounding]").forEach((button) => {
    button.addEventListener("click", () => {
      state.compounding = button.dataset.compounding;
      document.querySelectorAll("[data-compounding]").forEach((item) => {
        item.classList.toggle("is-active", item === button);
      });
      render();
    });
  });

  dom.refreshButton.addEventListener("click", () => {
    loadLiveData().catch((error) => {
      console.error(error);
      dom.refreshButton.disabled = false;
      setStatus("刷新失败", "error");
      if (!state.farms.length) loadCachedData();
    });
  });
}

async function boot() {
  bindInputs();
  configureSupplyControls();
  renderFarmList();
  renderResults();
  try {
    await loadLiveData();
  } catch (error) {
    console.error(error);
    dom.refreshButton.disabled = false;
    if (!loadCachedData()) {
      setStatus("数据不可用", "error");
    }
  }
}

boot();
