/** Fixed S1 points share; independent of time and holdings. */
function calculateAllocation(points, total, fdv) {
  if (!Number.isFinite(total) || total <= 0) return { error: 'missing' };
  if (![points, fdv].every(Number.isFinite) || points < 0 || points > total || fdv < 0) return { error: 'invalid' };
  const tokens = (points / total) * DEFAULTS.tokenSupply * DEFAULTS.airdropPercent / 100;
  const price = fdv / DEFAULTS.tokenSupply;
  return { tokens, price, value: tokens * price };
}
function formatNumber(value, decimals = 2) {
  return value.toLocaleString('en-US', { maximumFractionDigits: decimals });
}
function updateResults() {
  const read = id => {
    const value = document.getElementById(id).value.trim();
    return value === '' ? NaN : Number(value);
  };
  const result = calculateAllocation(read('currentPoints'), s1TotalPoints, read('fdv'));
  document.getElementById('result_tokens').textContent = result.error ? '—' : formatNumber(result.tokens, 4);
  document.getElementById('result_value').textContent = result.error ? '—' : `$${formatNumber(result.value)}`;
  document.getElementById('result_price').textContent = result.error ? '' : `${t('price')}: $${formatNumber(result.price, 6)}`;
  document.getElementById('calculationStatus').textContent = result.error ? t(result.error) : '';
  document.getElementById('s1TotalPoints').textContent = s1TotalPoints === null ? '—' : formatNumber(s1TotalPoints, 2);
  document.getElementById('pointsStatus').textContent = t(pointsStatus);
  document.getElementById('fdvStatus').textContent = t(fdvStatus);
}
