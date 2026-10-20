/** Saturn S1 points-to-token calculator. */
let fdvEdited = false;
let fdvStatus = 'loading';
let s1TotalPoints = null;
let pointsStatus = 'pointsLoading';

function renderAll() {
  document.getElementById('appHeader').innerHTML = `
    <div class="header-content">
      <div class="header-left"><div class="logo"><div class="logo-ring"></div><span class="logo-text">S</span></div>
        <div class="header-titles"><h1>${t('title')}</h1><p class="subtitle">${t('subtitle')}</p></div>
      </div>
      <button class="btn-pill" onclick="toggleLang()">${t('langSwitch')}</button>
    </div>`;
  document.getElementById('inputCards').innerHTML = `
    <div class="card card-input">
      <h2 class="card-title">${t('yourPoints')}</h2>
      <div class="field"><label for="currentPoints">${t('yourPoints')}</label>
        <input type="number" id="currentPoints" min="0" step="any" value="0" oninput="updateResults()">
      </div>
      <div class="info-box"><p>${t('formula')}</p></div>
    </div>
    <div class="card card-input">
      <h2 class="card-title">${t('parameters')}</h2>
      <div class="field"><label>${t('s1Total')}</label>
        <div class="daily-points-display" id="s1TotalPoints">—</div>
        <div class="field-hint" id="pointsStatus"></div>
      </div>
      <div class="field"><label for="fdv">${t('fdv')}</label>
        <input type="number" id="fdv" min="0" step="1000000" value="${DEFAULTS.fdv}" oninput="fdvEdited = true; updateResults()">
        <div class="field-hint" id="fdvStatus"></div>
      </div>
      <div class="positions-total"><span>${t('supply')}</span><span>1B $STRN</span></div>
      <div class="positions-total"><span>${t('allocation')}</span><span>${DEFAULTS.airdropPercent}% · 50M $STRN</span></div>
    </div>`;
  document.getElementById('resultCards').innerHTML = `
    <div class="card card-result card-highlight-gold"><div class="result-label">${t('tokens')}</div>
      <div class="result-value result-big" id="result_tokens">—</div><div class="result-sub">$STRN</div></div>
    <div class="card card-result card-highlight"><div class="result-label">${t('value')}</div>
      <div class="result-value result-big" id="result_value">—</div><div class="result-sub" id="result_price"></div></div>
    <p class="calculation-status" id="calculationStatus" role="status"></p>`;
  renderFooter();
  updateResults();
}

async function loadFdv() {
  const result = await fetchAspectaPremarketFdv().catch(() => null);
  fdvStatus = result ? 'synced' : 'manual';
  if (result && !fdvEdited) document.getElementById('fdv').value = Math.round(result.fdvUsd);
  updateResults();
}

function renderFooter() {
  const footer = document.getElementById('appFooter');
  if (!footer) return;
  footer.innerHTML = `
    <p class="footer-disclaimer">${t('footer_note')}</p>
    <p class="footer-credit">
      v1.0.0 · made by
      <a href="https://x.com/MengLayer" target="_blank" rel="noopener">X: @MengLayer</a> ·
      <a href="https://app.saturn.credit/" target="_blank" rel="noopener">Saturn App</a> ·
      <a href="https://saturncredit.gitbook.io/saturn-docs" target="_blank" rel="noopener">Docs</a>
    </p>
  `;
}

function formatUnits(value, decimals = 18) {
  const amount = typeof value === 'bigint' ? value : BigInt(value);
  if (decimals === 0) return amount.toString();

  const negative = amount < 0n;
  const raw = (negative ? -amount : amount).toString().padStart(decimals + 1, '0');
  const integer = raw.slice(0, raw.length - decimals) || '0';
  const fraction = raw.slice(raw.length - decimals).replace(/0+$/, '');
  return `${negative ? '-' : ''}${integer}${fraction ? `.${fraction}` : ''}`;
}

function unitsToNumber(value, decimals = 18) {
  const num = Number(formatUnits(value, decimals));
  return Number.isFinite(num) ? num : null;
}

function decodeUint256Word(data, index = 0) {
  const clean = String(data || '').replace(/^0x/, '');
  const word = clean.slice(index * 64, index * 64 + 64);
  return word ? BigInt(`0x${word}`) : 0n;
}

function normalizeAddress(value) {
  return typeof value === 'string' && /^0x[a-fA-F0-9]{40}$/.test(value) ? value : null;
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 8000) {
  if (typeof AbortController === 'undefined') {
    return fetch(url, options);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

function normalizeAspectaAsset(rawAsset = {}) {
  const source = rawAsset || {};
  const fallback = ASPECTA_PREMARKET.fallbackAsset;
  const assetDecimals = Number(source.decimals);
  const paymentTokenDecimals = Number(source.payment_token_decimals);

  return {
    poolAddress: normalizeAddress(source.pool_address) || fallback.poolAddress,
    paymentTokenAddress: normalizeAddress(source.payment_token_address) || fallback.paymentTokenAddress,
    assetDecimals: Number.isFinite(assetDecimals) ? assetDecimals : fallback.assetDecimals,
    paymentTokenDecimals: Number.isFinite(paymentTokenDecimals)
      ? paymentTokenDecimals
      : fallback.paymentTokenDecimals,
  };
}

async function fetchAspectaAssetMetadata() {
  try {
    const resp = await fetchWithTimeout(ASPECTA_PREMARKET.assetApi, { cache: 'no-store' }, 6000);
    if (!resp.ok) throw new Error('Aspecta metadata unavailable');
    const payload = await resp.json();
    const rows = Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload?.data?.list)
        ? payload.data.list
        : [];
    const saturn = rows.find(item => item?.project_data?.title === 'Saturn' || item?.wallet_address === 'Saturn') || rows[0];
    return normalizeAspectaAsset(saturn);
  } catch (_) {
    return normalizeAspectaAsset();
  }
}

async function fetchBscRpcCall(to, data) {
  for (const rpcUrl of ASPECTA_PREMARKET.rpcUrls) {
    try {
      const resp = await fetchWithTimeout(rpcUrl, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: Date.now(),
          method: 'eth_call',
          params: [{ to, data }, 'latest'],
        }),
      }, 7000);
      if (!resp.ok) continue;
      const payload = await resp.json();
      if (payload?.result && payload.result !== '0x') return payload.result;
    } catch (_) {
    }
  }
  return null;
}

async function fetchTokenDecimals(tokenAddress, fallbackDecimals) {
  const raw = await fetchBscRpcCall(tokenAddress, ASPECTA_PREMARKET.selectors.decimals);
  if (!raw) return fallbackDecimals;

  const decimals = Number(decodeUint256Word(raw, 0));
  return Number.isFinite(decimals) && decimals >= 0 && decimals <= 36
    ? decimals
    : fallbackDecimals;
}

async function fetchAspectaPremarketFdv() {
  const asset = await fetchAspectaAssetMetadata();
  const [currentPriceRaw, settlementRaw, paymentTokenDecimals] = await Promise.all([
    fetchBscRpcCall(asset.poolAddress, ASPECTA_PREMARKET.selectors.getCurrentPrice),
    fetchBscRpcCall(asset.poolAddress, ASPECTA_PREMARKET.selectors.getSettlementInfo),
    fetchTokenDecimals(asset.paymentTokenAddress, asset.paymentTokenDecimals),
  ]);

  if (!currentPriceRaw || !settlementRaw) return null;

  const currentPrice = decodeUint256Word(currentPriceRaw, 0);
  const redeemRatioRaw = decodeUint256Word(settlementRaw, 2);
  const keyPriceUsd = unitsToNumber(currentPrice, paymentTokenDecimals);
  const redeemRatio = unitsToNumber(redeemRatioRaw, 18);
  const fdvUsd = keyPriceUsd && redeemRatio ? keyPriceUsd / redeemRatio : null;

  return fdvUsd && fdvUsd > 0
    ? { fdvUsd, keyPriceUsd, redeemRatio }
    : null;
}

function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const particles = [];
  const count = 80;

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.5 + 0.2,
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.x += p.dx;
      p.y += p.dy;

      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(240, 185, 11, ${p.opacity})`;
      ctx.fill();
    });

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(240, 185, 11, ${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  renderAll();
  loadFdv();
  loadS1Points();
});

function parseMerklAmountToNumber(amountStr, decimals = 18) {
  if (!amountStr || !/^\d+$/.test(amountStr)) return null;
  const normalized = amountStr.replace(/^0+/, '') || '0';
  if (normalized === '0') return 0;

  let valueText;
  if (normalized.length <= decimals) {
    const padded = normalized.padStart(decimals, '0');
    valueText = `0.${padded.slice(0, 6)}`;
  } else {
    const intPart = normalized.slice(0, normalized.length - decimals);
    const fracPart = normalized.slice(normalized.length - decimals, normalized.length - decimals + 6);
    valueText = fracPart ? `${intPart}.${fracPart}` : intPart;
  }

  const num = Number(valueText);
  return Number.isFinite(num) ? num : null;
}


async function loadS1Points() {
  const base = 'https://api.merkl.xyz/v4/rewards/token/';
  const query = '?chainId=1&address=0xD223bbdd0421E394C0df9dFfe568f1dADfFd6f85';
  async function getAmount(url) {
    for (const source of [url, `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`]) {
      try {
        const response = await fetchWithTimeout(source, { cache: 'no-store' });
        if (!response.ok) continue;
        const data = await response.json();
        const amount = parseMerklAmountToNumber(Array.isArray(data) ? data[0]?.amount : data?.amount);
        if (amount !== null) return amount;
      } catch (_) {}
    }
    return null;
  }
  const [total, excluded] = await Promise.all([
    getAmount(`${base}total${query}`),
    getAmount(`${base}${query}&recipient=0x80c6a512b548229226c0676d6fdbaff81d325990`),
  ]);
  s1TotalPoints = total !== null && excluded !== null && total > excluded ? total - excluded : null;
  pointsStatus = s1TotalPoints === null ? 'pointsUnavailable' : 'totalHint';
  updateResults();
}
