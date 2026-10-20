export const STRATEGIES = [
  { id: 'tori_strusd', labelZh: 'Tori 持有 strUSD', labelEn: 'Tori Hold strUSD', multiplier: 5, category: 'tori' },
  { id: 'tori_trusd', labelZh: 'Tori 持有 trUSD', labelEn: 'Tori Hold trUSD', multiplier: 25, category: 'tori' },
  { id: 'morpho_usdc_vault', labelZh: 'Morpho · RockawayX 生态金库 USDC', labelEn: 'Morpho · RockawayX Ecosystem Vault USDC', multiplier: 10, category: 'morpho' },
  { id: 'morpho_strusd_usdc', labelZh: 'Morpho 出借 strUSD/USDC', labelEn: 'Morpho Lend strUSD/USDC', multiplier: 5, category: 'morpho' },
  { id: 'morpho_trusd_usdc', labelZh: 'Morpho 出借 trUSD/USDC', labelEn: 'Morpho Lend trUSD/USDC', multiplier: 25, category: 'morpho' },
  { id: 'curve_trusd_usdc', labelZh: 'Curve LP · trUSD/USDC', labelEn: 'Curve LP · trUSD/USDC', multiplier: 30, category: 'curve' },
  { id: 'curve_strusd_trusd', labelZh: 'Curve LP · strUSD/trUSD', labelEn: 'Curve LP · strUSD/trUSD', multiplier: 15, category: 'curve' },
  { id: 'curve_frxusd_trusd', labelZh: 'Curve LP · frxUSD/trUSD', labelEn: 'Curve LP · frxUSD/trUSD', multiplier: 30, category: 'curve' },
  { id: 'pendle_lp_strusd', labelZh: 'Pendle LP · strUSD（26 Nov）', labelEn: 'Pendle LP · strUSD (26 Nov)', multiplier: 9, category: 'pendle' },
  { id: 'pendle_lp_trusd', labelZh: 'Pendle LP · trUSD（26 Nov）', labelEn: 'Pendle LP · trUSD (26 Nov)', multiplier: 45, category: 'pendle' },
  { id: 'upshift_vault', labelZh: 'Upshift · Tori 生态金库 USDC/USDT', labelEn: 'Upshift · Tori Ecosystem Vault USDC/USDT', multiplier: 15, category: 'vault' },
  { id: 'royco_senior', labelZh: 'Royco Senior · srStrUSD', labelEn: 'Royco Senior · srStrUSD', multiplier: 5, category: 'royco' },
  { id: 'royco_junior', labelZh: 'Royco Junior · jrStrUSD', labelEn: 'Royco Junior · jrStrUSD', multiplier: 5, category: 'royco' },
];

export const YT_MARKETS = {
  yt_strusd: {
    id: 'yt_strusd',
    labelZh: 'Pendle YT-strUSD（6x）',
    labelEn: 'Pendle YT-strUSD (6x)',
    asset: 'strUSD',
    multiplier: 6,
    chainId: 1,
    market: '0xac028348c46d3455899a2b9b50077c11960eaddb',
    expiry: '2026-11-26T00:00:00.000Z',
    fallbackPrice: 0.03645091217209273,
    fallbackUnderlyingPrice: 1.0083486001471138,
    fallbackUnderlyingApy: 0.1303505788116308,
  },
  locked_yt_strusd: {
    id: 'locked_yt_strusd',
    labelZh: 'Tori 锁定 YT-strUSD（9x）',
    labelEn: 'Tori Locked YT-strUSD (9x)',
    asset: 'strUSD',
    multiplier: 9,
    chainId: 1,
    market: '0xac028348c46d3455899a2b9b50077c11960eaddb',
    expiry: '2026-11-26T00:00:00.000Z',
    fallbackPrice: 0.03645091217209273,
    fallbackUnderlyingPrice: 1.0083486001471138,
    fallbackUnderlyingApy: 0.1303505788116308,
  },
  yt_trusd: {
    id: 'yt_trusd',
    labelZh: 'Pendle YT-trUSD（30x）',
    labelEn: 'Pendle YT-trUSD (30x)',
    asset: 'trUSD',
    multiplier: 30,
    chainId: 1,
    market: '0xfcf009cb3135da12a6eb1f73f3ee05392a7bc947',
    expiry: '2026-11-26T00:00:00.000Z',
    fallbackPrice: 0.03588720507910741,
    fallbackUnderlyingPrice: 0.99989979,
    fallbackUnderlyingApy: 0,
  },
  locked_yt_trusd: {
    id: 'locked_yt_trusd',
    labelZh: 'Tori 锁定 YT-trUSD（45x）',
    labelEn: 'Tori Locked YT-trUSD (45x)',
    asset: 'trUSD',
    multiplier: 45,
    chainId: 1,
    market: '0xfcf009cb3135da12a6eb1f73f3ee05392a7bc947',
    expiry: '2026-11-26T00:00:00.000Z',
    fallbackPrice: 0.03588720507910741,
    fallbackUnderlyingPrice: 0.99989979,
    fallbackUnderlyingApy: 0,
  },
};

export const ALL_MULTIPLIERS = [
  ...STRATEGIES,
  ...Object.values(YT_MARKETS).map((market) => ({
    id: market.id,
    labelZh: market.labelZh,
    labelEn: market.labelEn,
    multiplier: market.multiplier,
    category: 'yt',
  })),
];

const DAY_MS = 86_400_000;

export function numberOrZero(value) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, number) : 0;
}

export function daysUntil(expiry, now = new Date()) {
  const expiryDate = new Date(expiry);
  if (Number.isNaN(expiryDate.getTime())) return 0;
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  expiryDate.setHours(0, 0, 0, 0);
  return Math.max(0, Math.ceil((expiryDate - start) / DAY_MS));
}

export function projectNetworkTotal(currentTotal, dailyGrowthPercent, days, userIncrement = 0) {
  const current = numberOrZero(currentTotal);
  const growth = numberOrZero(dailyGrowthPercent) / 100;
  const duration = Math.max(0, Math.floor(numberOrZero(days)));
  return current * Math.pow(1 + growth, duration) + numberOrZero(userIncrement);
}

export function calculateYtPosition({
  market,
  investment,
  price,
  underlyingPrice,
  underlyingApy,
  days,
  feeRate = 0.03,
  now = new Date(),
}) {
  const cost = numberOrZero(investment);
  const ytPrice = numberOrZero(price);
  const basePrice = numberOrZero(underlyingPrice) || 1;
  const apy = numberOrZero(underlyingApy);
  const requestedDays = Math.max(0, Math.floor(numberOrZero(days)));
  const expiryDays = daysUntil(market?.expiry, now);
  const pointDays = Math.min(requestedDays, expiryDays);
  const residualDays = Math.max(0, expiryDays - pointDays);
  const quantity = ytPrice > 0 ? cost / ytPrice : 0;
  const notional = quantity * basePrice;
  const leverage = ytPrice > 0 ? basePrice / ytPrice : 0;
  const grossDailyCores = notional * numberOrZero(market?.multiplier);
  const dailyCores = grossDailyCores * (1 - Math.min(1, numberOrZero(feeRate)));
  const totalCores = dailyCores * pointDays;
  const netFactor = 1 - Math.min(1, numberOrZero(feeRate));
  const baseYield = notional * apy * (pointDays / 365) * netFactor;
  const residualValue = expiryDays > 0 ? cost * (residualDays / expiryDays) : 0;

  return {
    investment: cost,
    price: ytPrice,
    underlyingPrice: basePrice,
    underlyingApy: apy,
    expiryDays,
    pointDays,
    residualDays,
    quantity,
    notional,
    leverage,
    grossDailyCores,
    dailyCores,
    totalCores,
    baseYield,
    residualValue,
  };
}

export function calculateScenario({
  currentCores = 0,
  positions = [],
  referredDailyCores = 0,
  days = 30,
  networkTotal = 0,
  networkDailyGrowthPercent = 0,
  fdv = 0,
  airdropPercent = 0,
  yt = null,
  now = new Date(),
}) {
  const duration = Math.max(0, Math.floor(numberOrZero(days)));
  const positionRows = positions.map((position) => {
    const strategy = STRATEGIES.find((item) => item.id === position.strategyId) || STRATEGIES[0];
    const amount = numberOrZero(position.amount);
    return { ...position, strategy, amount, dailyCores: amount * strategy.multiplier };
  });
  const positionCapital = positionRows.reduce((sum, row) => sum + row.amount, 0);
  const positionDailyCores = positionRows.reduce((sum, row) => sum + row.dailyCores, 0);
  const referralDailyCores = numberOrZero(referredDailyCores) * 0.1;
  const ytMarket = yt?.market || YT_MARKETS.yt_strusd;
  const ytMetrics = calculateYtPosition({
    market: ytMarket,
    investment: yt?.investment,
    price: yt?.price,
    underlyingPrice: yt?.underlyingPrice,
    underlyingApy: yt?.underlyingApy,
    days: duration,
    feeRate: yt?.feeRate ?? 0.03,
    now,
  });
  const positionCores = positionDailyCores * duration;
  const referralCores = referralDailyCores * duration;
  const incrementalCores = positionCores + referralCores + ytMetrics.totalCores;
  const projectedUserCores = numberOrZero(currentCores) + incrementalCores;
  const projectedNetworkCores = projectNetworkTotal(
    networkTotal,
    networkDailyGrowthPercent,
    duration,
    incrementalCores,
  );
  const tokenPoolValue = numberOrZero(fdv) * (numberOrZero(airdropPercent) / 100);
  const share = projectedNetworkCores > 0 ? Math.min(1, projectedUserCores / projectedNetworkCores) : 0;
  const valuePerMillion = projectedNetworkCores > 0 ? tokenPoolValue / projectedNetworkCores * 1_000_000 : 0;
  const projectedAirdropValue = tokenPoolValue * share;
  const incrementalAirdropValue = projectedNetworkCores > 0
    ? tokenPoolValue * (incrementalCores / projectedNetworkCores)
    : 0;
  const ytAirdropValue = projectedNetworkCores > 0
    ? tokenPoolValue * (ytMetrics.totalCores / projectedNetworkCores)
    : 0;
  const totalCapital = positionCapital + ytMetrics.investment;
  const coresApy = totalCapital > 0 && duration > 0
    ? incrementalAirdropValue / totalCapital * (365 / duration) * 100
    : 0;
  const ytNetValue = ytAirdropValue + ytMetrics.baseYield + ytMetrics.residualValue - ytMetrics.investment;
  const ytRoi = ytMetrics.investment > 0 ? ytNetValue / ytMetrics.investment * 100 : 0;

  return {
    duration,
    positionRows,
    positionCapital,
    positionDailyCores,
    positionCores,
    referralDailyCores,
    referralCores,
    incrementalCores,
    projectedUserCores,
    projectedNetworkCores,
    tokenPoolValue,
    share,
    valuePerMillion,
    projectedAirdropValue,
    incrementalAirdropValue,
    totalCapital,
    coresApy,
    yt: {
      ...ytMetrics,
      airdropValue: ytAirdropValue,
      netValue: ytNetValue,
      roi: ytRoi,
    },
  };
}
