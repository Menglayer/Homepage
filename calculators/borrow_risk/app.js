
(function(){
  'use strict';

  // ---------- Help content (template literals) ----------
  const HELP_ZH = `
<ol>
  <li><b>选择平台与资产</b>：选择 Preset（Aave / Morpho / Compound / 自定义），再选择抵押与借入资产。</li>
  <li><b>价格</b>：点“刷新价格”自动获取，或手动输入。</li>
  <li><b>LTV 与 LLTV</b>：LTV 决定最大可借；LLTV 用于清算。公式：<code>HF = 抵押价值 × LLTV ÷ 债务价值</code>。</li>
  <li><b>目标（HF / 缓冲）</b>：二选一——目标 HF(≥1) 或 安全缓冲%(距离清算的余量)；用于“建议最大可借”。</li>
  <li><b>利率</b>：填写存款 APY 与借款 APY；净年化(按权益)=<code>(收益 − 利息) ÷ 净资产</code>。</li>
  <li><b>计算</b>：点“计算”或 <code>Ctrl/⌘ + Enter</code> 更新结果。</li>
  <li><b>指标</b>：抵押/债务价值、当前 HF、LTV 用量、清算价、建议最大可借、净年化、年收益/年利息、安全缓冲。</li>
  <li><b>价格压力测试</b>：调节价格变化与范围，曲线显示 HF；虚线为清算边界(HF=1)。</li>
  <li><b>循环贷</b>：设置循环次数 n、每轮借入比例 b、交易费与 APY；图表展示总抵押/总负债/净杠杆/净年化。极限杠杆≈<code>1/(1-b)</code>。</li>
  <li><b>风险标记</b>：HF&lt;1 为“已触发清算”；1~1.1 极高风险；1.1~1.5 中高风险；≥1.5 较安全。</li>
</ol>`;

  const HELP_EN = `
<ol>
  <li><b>Choose platform & assets</b>: Pick a preset (Aave / Morpho / Compound / Custom), then select collateral & debt assets.</li>
  <li><b>Prices</b>: Click “Refresh Prices” or enter prices manually.</li>
  <li><b>LTV & LLTV</b>: LTV sets max borrow; LLTV is for liquidation. Formula: <code>HF = Collateral Value × LLTV ÷ Debt Value</code>.</li>
  <li><b>Target (HF/Buffer)</b>: Fill ONE—target HF (≥1) or Safety Buffer % (distance to liquidation) to compute “Suggested Max Borrow”.</li>
  <li><b>APYs</b>: Provide Supply APY & Borrow APY; Net APY (on equity) = <code>(Yield − Interest) ÷ Net Assets</code>.</li>
  <li><b>Run</b>: Click “Calculate” or use <code>Ctrl/⌘ + Enter</code> to update.</li>
  <li><b>Metrics</b>: Collateral/Debt value, current HF, LTV used, liquidation price, suggested max borrow, net APY, yearly yield/interest, and safety buffer.</li>
  <li><b>Stress Test</b>: Adjust price changes & range; the curve shows HF. Dashed line marks HF=1 (liquidation).</li>
  <li><b>Looping</b>: Set loop count n, per-round borrow b, fees & APYs; the chart shows total collateral/debt/net leverage/net APY. Infinite leverage ≈ <code>1/(1-b)</code>.</li>
  <li><b>Risk badge</b>: HF&lt;1 “Liquidated”; 1–1.1 very high risk; 1.1–1.5 medium/high risk; ≥1.5 safer.</li>
</ol>`;

  const HELP_DUAL = `
<ol class="help-dual">
  <li><div class="cn"><b>选择平台与资产</b>：选择 Preset（Aave / Morpho / Compound / 自定义），再选择抵押与借入资产。</div><div class="en"><b>Pick platform & assets</b>: Choose a preset (Aave / Morpho / Compound / Custom), then select collateral & debt assets.</div></li>
  <li><div class="cn"><b>价格</b>：点“刷新价格”自动获取，或手动输入。</div><div class="en"><b>Prices</b>: Click “Refresh Prices” or type values manually.</div></li>
  <li><div class="cn"><b>LTV 与 LLTV</b>：LTV 决定最大可借；LLTV 用于清算。公式：<code>HF = 抵押价值 × LLTV ÷ 债务价值</code>。</div><div class="en"><b>LTV & LLTV</b>: LTV sets max borrow; LLTV drives liquidation. Formula: <code>HF = Collateral Value × LLTV ÷ Debt Value</code>.</div></li>
  <li><div class="cn"><b>目标（HF / 缓冲）</b>：二选一——目标 HF(≥1) 或 安全缓冲%(距离清算的余量)；用于“建议最大可借”。</div><div class="en"><b>Target (HF / Buffer)</b>: Choose ONE—target HF (≥1) or Safety Buffer % (distance to liquidation) to compute “Suggested Max Borrow”.</div></li>
  <li><div class="cn"><b>利率</b>：填写存款 APY 与借款 APY；净年化(按权益)=<code>(收益 − 利息) ÷ 净资产</code>。</div><div class="en"><b>Rates</b>: Provide Supply APY & Borrow APY; Net APY (on equity) = <code>(Yield − Interest) ÷ Net Assets</code>.</div></li>
  <li><div class="cn"><b>计算</b>：点“计算”或 <code>Ctrl/⌘ + Enter</code> 更新结果。</div><div class="en"><b>Run</b>: Click “Calculate” or use <code>Ctrl/⌘ + Enter</code> to update.</div></li>
  <li><div class="cn"><b>指标</b>：抵押/债务价值、当前 HF、LTV 用量、清算价、建议最大可借、净年化、年收益/年利息、安全缓冲。</div><div class="en"><b>Metrics</b>: Collateral/Debt value, current HF, LTV used, liquidation price, suggested max borrow, net APY, yearly yield/interest, and safety buffer.</div></li>
  <li><div class="cn"><b>价格压力测试</b>：调节价格变化与范围，曲线显示 HF；虚线为清算边界(HF=1)。</div><div class="en"><b>Stress Test</b>: Adjust price changes & range; the curve shows HF. Dashed line marks HF=1 (liquidation).</div></li>
  <li><div class="cn"><b>循环贷</b>：设置循环次数 n、每轮借入比例 b、交易费与 APY；图表展示总抵押/总负债/净杠杆/净年化。极限杠杆≈<code>1/(1-b)</code>。</div><div class="en"><b>Looping</b>: Set loop count n, per-round borrow b, fees & APYs; the chart shows total collateral/debt/net leverage/net APY. Infinite leverage ≈ <code>1/(1-b)</code>.</div></li>
  <li><div class="cn"><b>风险标记</b>：HF&lt;1 为“已触发清算”；1~1.1 极高风险；1.1~1.5 中高风险；≥1.5 较安全。</div><div class="en"><b>Risk badge</b>: HF&lt;1 “Liquidated”; 1–1.1 very high risk; 1.1–1.5 medium/high risk; ≥1.5 safer.</div></li>
</ol>`;

  // ---------- I18N ----------
  var I18N = {
    zh: {
      title:"借贷风险 & 循环贷计算器",
      subtitle:"Aave / Morpho / Compound / 自定义",
      help:"使用说明",
      follow:"关注我 X",
      calc:"计算",
      refresh:"刷新价格",
      presetLabel:"平台 Preset",
      opt_custom:"自定义",
      opt_aavev3:"Aave v3",
      opt_morpho:"Morpho Blue",
      opt_comp:"Compound v3",
      presetHint:"注：可尝试“刷新价格”拉取 CoinGecko 价格；参数可手动改，最终以输入为准。",
      collateralLabel:"抵押资产（Collateral）",
      debtLabel:"借入资产（Debt）",
      collAmtLabel:"抵押数量（单位：抵押币）",
      debtAmtLabel:"借入数量（单位：借入币）",
      targetLabel:"目标健康因子 HF 或安全缓冲",
      targetHint:"二选一：填写 HF（≥1）或安全缓冲 %（= 距离清算的余量）。用于计算“最多可借/建议借”。",
      collPriceLabel:"抵押价（USD）",
      debtPriceLabel:"借入价（USD）",
      ltvLabel:"LTV（可借上限 %）",
      liqThrLabel:"清算阈值（Liquidation Threshold % / LLTV）",
      liqPenaltyLabel:"清算罚金（%）",
      apySupplyLabel:"存款年化（APY %）",
      apyBorrowLabel:"借款年化（APY %）",
      rateTypeLabel:"稳定/浮动利率",
      rateVar:"浮动",
      rateFix:"稳定",
      presetBtn:"载入平台示例参数",
      m_collValLabel:"抵押价值",
      m_debtValLabel:"债务价值",
      m_hfLabel:"当前 HF",
      m_ltvUseLabel:"LTV 用量",
      m_liqPriceLabel:"清算价（抵押）",
      m_suggestLabel:"建议最大可借",
      m_netApyLabel:"名义净年化（不含点差/税）",
      m_costYearLabel:"利息成本/年",
      m_yieldYearLabel:"收益/年",
      m_bufferLabel:"安全缓冲",
      stressTitle:"价格压力测试",
      collChangeLabel:"抵押价格变化（-80%~+100%）",
      debtChangeLabel:"借入价格变化（-80%~+100%）",
      rangeLabel:"图表范围（%）",
      stressHint:"图表：X 轴为抵押价变化（%），Y 轴为健康因子（HF）。横线 = HF=1（清算边界）。",
      loopTitle:"循环贷（Looping）",
      loopsLabel:"循环次数 n",
      perRoundBorrowLabel:"每轮借入比例（≤LTV %）",
      loopStableLabel:"是否借稳定币",
      loopStableYes:"是（借稳定→买抵押）",
      loopStableNo:"否（两边波动）",
      loopFeeLabel:"交易费/轮（%）",
      loopSupplyLabel:"存款 APY（%）",
      loopBorrowLabel:"借款 APY（%）",
      loopHint:"图表：展示 n=0..N 的“总抵押/总负债/净杠杆/净年化（按权益）”。无限循环极限杠杆 ≈ 1/(1-b)，其中 b=每轮借入比例。",
      footHint:"⚠️ 仅供教育用途：不同平台的实际参数（LTV / Liquidation Threshold / 罚金 / 速率曲线）会变动；请在链上或官方界面核对真实数据。您可尝试“载入平台示例参数”或手动修改。支持价格拉取（CoinGecko，若跨域失败请手填）。",
      helpTitle:"使用说明",
      helpHTML: HELP_ZH,
      helpDualHTML: HELP_DUAL,
      gotIt:"知道了",
      risk:{ safe:"安全", liq:"已触发清算", vhigh:"极高风险", high:"高风险", mid:"中风险" },
      chart:{ hf:"健康因子 HF", liqLine:"清算边界（HF=1）", x:"抵押价格变化（%）", y:"HF", loopX:"循环次数 n", loopY:"倍数 / 年化(小数)" },
      suggestSuffix:"（按目标）"
    },
    en: {
      title:"Lending Risk & Looping Calculator",
      subtitle:"Aave / Morpho / Compound / Custom",
      help:"Help",
      follow:"Follow me on X",
      calc:"Calculate",
      refresh:"Refresh Prices",
      presetLabel:"Platform Preset",
      opt_custom:"Custom",
      opt_aavev3:"Aave v3 ",
      opt_morpho:"Morpho Blue ",
      opt_comp:"Compound v3 ",
      presetHint:"Tip: Try “Refresh Prices” to fetch CoinGecko quotes. You can always override params; inputs take precedence.",
      collateralLabel:"Collateral Asset",
      debtLabel:"Debt Asset",
      collAmtLabel:"Collateral Amount",
      debtAmtLabel:"Debt Amount",
      targetLabel:"Target HF or Safety Buffer",
      targetHint:"Choose ONE: target HF (≥1) or safety buffer % (= distance to liquidation). Used to compute suggested max borrow.",
      collPriceLabel:"Collateral Price (USD)",
      debtPriceLabel:"Debt Price (USD)",
      ltvLabel:"LTV (max borrow %)",
      liqThrLabel:"Liquidation Threshold % (LLTV)",
      liqPenaltyLabel:"Liquidation Penalty (%)",
      apySupplyLabel:"Supply APY (%)",
      apyBorrowLabel:"Borrow APY (%)",
      rateTypeLabel:"Rate Type",
      rateVar:"Variable",
      rateFix:"Stable",
      presetBtn:"Load Sample Params",
      m_collValLabel:"Collateral Value",
      m_debtValLabel:"Debt Value",
      m_hfLabel:"Current HF",
      m_ltvUseLabel:"LTV Used",
      m_liqPriceLabel:"Liquidation Price (collateral)",
      m_suggestLabel:"Suggested Max Borrow",
      m_netApyLabel:"Net APY (nominal)",
      m_costYearLabel:"Interest Cost / yr",
      m_yieldYearLabel:"Yield / yr",
      m_bufferLabel:"Safety Buffer",
      stressTitle:"Price Stress Test",
      collChangeLabel:"Collateral Price Change (-80%~+100%)",
      debtChangeLabel:"Debt Price Change (-80%~+100%)",
      rangeLabel:"Chart Range (%)",
      stressHint:"Chart: X = collateral price change (%); Y = Health Factor (HF). Horizontal line = HF=1 (liquidation boundary).",
      loopTitle:"Looping",
      loopsLabel:"Loop Count n",
      perRoundBorrowLabel:"Borrow per Round (≤LTV %)",
      loopStableLabel:"Borrow Stablecoin?",
      loopStableYes:"Yes (borrow stable → buy collateral)",
      loopStableNo:"No (both volatile)",
      loopFeeLabel:"Trading Fee / round (%)",
      loopSupplyLabel:"Supply APY (%)",
      loopBorrowLabel:"Borrow APY (%)",
      loopHint:"Chart: shows total collateral/debt/net leverage/net APY over n=0..N. Infinite-loop leverage ≈ 1/(1-b), where b is per-round borrow ratio.",
      footHint:"⚠️ For education only. Real platform params (LTV / LT / penalty / rate curves) change. Verify on-chain/official UIs. You can load samples or edit manually. CoinGecko fetching supported (fill manually if blocked).",
      helpTitle:"Help",
      helpHTML: HELP_EN,
      helpDualHTML: HELP_DUAL,
      gotIt:"Got it",
      risk:{ safe:"Safe", liq:"Liquidated", vhigh:"Very High Risk", high:"High Risk", mid:"Medium Risk" },
      chart:{ hf:"Health Factor HF", liqLine:"Liquidation boundary (HF=1)", x:"Collateral Price Change (%)", y:"HF", loopX:"Loop Count n", loopY:"Multiples / APY (decimal)" },
      suggestSuffix:" (by target)"
    }
  };

  // ---------- State ----------
  var LANG = localStorage.getItem("lc_lang") || ((navigator.language||"zh").toLowerCase().startsWith("zh") ? "zh" : "en");
  // ---------- Utils ----------
  function $(id){ return document.getElementById(id); }
  function money(v){ return isFinite(v) ? "$" + Number(v).toLocaleString(undefined,{maximumFractionDigits:2}) : "—"; }
  function pctTxt(v){ return isFinite(v) ? (v*100).toFixed(2) + "%" : "—"; }

  // ---------- I18N apply ----------
  function setLangButtons(){
    $("btnZH").classList.toggle("active", LANG==="zh");
    $("btnEN").classList.toggle("active", LANG==="en");
    document.documentElement.lang = (LANG==="zh"?"zh-CN":"en");
  }

  function renderHelp(){ var d = I18N[LANG]; $("helpContent").innerHTML = d.helpHTML;; }
  function applyI18n(){
    var d = I18N[LANG], other = I18N[LANG==="zh"?"en":"zh"];
    document.querySelectorAll("[data-i18n]").forEach(function(el){ var k = el.getAttribute("data-i18n"); if (d[k] != null) { el.textContent = d[k]; }});
    renderHelp();
    document.title = d.title + " | MengLayer";
    var rate = $("rateType") ? $("rateType").options : null;
    if (rate && rate.length>=2){ rate[0].textContent = d.rateVar; rate[1].textContent = d.rateFix; }
    var plat = $("platform") ? $("platform").options : null;
    if (plat && plat.length>=4){
      plat[0].textContent = d.opt_custom;
      plat[1].textContent = d.opt_aavev3;
      plat[2].textContent = d.opt_morpho;
      plat[3].textContent = d.opt_comp;
    }
    if (chartHF){
      chartHF.options.scales.x.title.text = d.chart.x;
      chartHF.options.scales.y.title.text = d.chart.y;
      chartHF.data.datasets[0].label = d.chart.hf;
      chartHF.data.datasets[1].label = d.chart.liqLine;
      chartHF.update();
    }
    if (chartLoop){
      chartLoop.options.scales.x.title.text = d.chart.loopX;
      chartLoop.options.scales.y.title.text = d.chart.loopY;
      chartLoop.data.datasets[0].label = (LANG==='zh'?'总抵押（倍数）':'Total Collateral (x)');
      chartLoop.data.datasets[1].label = (LANG==='zh'?'总负债（倍数）':'Total Debt (x)');
      chartLoop.data.datasets[2].label = (LANG==='zh'?'净杠杆（抵押-负债）':'Net Leverage');
      chartLoop.data.datasets[3].label = (LANG==='zh'?'净年化（按权益）':'Net APY (on equity)');
      chartLoop.update();
    }
    setLangButtons();

  }

  // ---------- Risk & badges ----------
  function tRisk(hf){
    var r = I18N[LANG].risk;
    if (hf < 1.0) return r.liq;
    if (hf < 1.1) return r.vhigh;
    if (hf < 1.25) return r.high;
    if (hf < 1.5) return r.mid;
    return r.safe;
  }
  function riskClass(hf){
    if (hf < 1.1) return "red";
    if (hf < 1.5) return "yellow";
    return "green";
  }
  function riskBadge(hf){
    return ' <span class="badge ' + riskClass(hf) + '">' + tRisk(hf) + '</span>';
  }

  // ---------- Data fetch ----------
  var PROXY_ROOT = "https://api.menglayer.lol/cors?url=";
  function smartFetch(url, timeoutMs){
    if (timeoutMs == null) timeoutMs = 5000;
    var ctrl = new AbortController();
    var t = setTimeout(function(){ try{ ctrl.abort(); }catch(e){} }, timeoutMs);
    return fetch(url, { signal: ctrl.signal }).then(function(r){
      clearTimeout(t);
      if (!r.ok) throw new Error("HTTP "+r.status);
      return r;
    }).catch(function(){
      clearTimeout(t);
      return fetch(PROXY_ROOT + encodeURIComponent(url));
    });
  }
  var CG_IDS = {
    ETH:"ethereum", WETH:"weth", wstETH:"wrapped-steth", WBTC:"wrapped-bitcoin",
    USDC:"usd-coin", USDT:"tether", DAI:"dai", cbETH:"coinbase-wrapped-staked-eth",
    USDE:"ethena-usde", USDe:"ethena-usde",
    sUSDE:"staked-usde", sUSDe:"staked-usde", susde:"staked-usde"
  };
  function refreshPrices(){
    var col = $("collateral").value, deb = $("debt").value;
    var ids = []; if (CG_IDS[col]) ids.push(CG_IDS[col]); if (CG_IDS[deb]) ids.push(CG_IDS[deb]);
    if (!ids.length) return Promise.resolve();
    var url = "https://api.coingecko.com/api/v3/simple/price?ids=" + ids.join(",") + "&vs_currencies=usd";
    return smartFetch(url).then(function(r){ return r.ok ? r.json() : {}; }).then(function(j){
      if (j && CG_IDS[col] && j[CG_IDS[col]]) $("collPrice").value = j[CG_IDS[col]].usd;
      if (j && CG_IDS[deb] && j[CG_IDS[deb]]) $("debtPrice").value = j[CG_IDS[deb]].usd;
    }).catch(function(){});
  }

  // ---------- Presets ----------
  var PRESETS = {
    aavev3: {
      WETH_USDC:{ltv:80, liqThr:82.5, liqPenalty:5, apySupply:2.0, apyBorrow:5.0},
      wstETH_USDC:{ltv:70, liqThr:78, liqPenalty:7.5, apySupply:3.5, apyBorrow:6.0},
      WBTC_USDC:{ltv:70, liqThr:77, liqPenalty:7, apySupply:0.2, apyBorrow:4.5}
    },
    morphoblue: {
      WETH_USDC:{ltv:75, liqThr:77.5, liqPenalty:5, apySupply:2.0, apyBorrow:5.5},
      WBTC_USDC:{ltv:68, liqThr:72, liqPenalty:7, apySupply:0.3, apyBorrow:5.0}
    },
    compoundv3: {
      WETH_USDC:{ltv:75, liqThr:80, liqPenalty:5, apySupply:1.5, apyBorrow:5.0},
      WBTC_USDC:{ltv:68, liqThr:75, liqPenalty:6, apySupply:0.2, apyBorrow:4.8}
    }
  };
  function loadPreset(){
    var p = $("platform").value, col = $("collateral").value, deb = $("debt").value, key = (col+"_")+deb;
    var pr = PRESETS[p] && PRESETS[p][key];
    if (pr){
      $("ltv").value = pr.ltv; $("liqThr").value = pr.liqThr; $("liqPenalty").value = pr.liqPenalty;
      $("apySupply").value = pr.apySupply; $("apyBorrow").value = pr.apyBorrow;
    } else {
      alert(LANG==='zh' ? "该平台示例未覆盖这对资产，可手动填写参数。" : "Sample not available for this pair. Please fill params manually.");
    }
  }

  // ---------- Core calc ----------
  function calcCore(){
    var collAmt = Number($("collAmt").value||0), debtAmt = Number($("debtAmt").value||0);
    var Pc = Number($("collPrice").value||0), Pd = Number($("debtPrice").value||0);
    var LTV = Number($("ltv").value||0)/100, LT = Number($("liqThr").value||0)/100;
    var apySupply = Number($("apySupply").value||0)/100, apyBorrow = Number($("apyBorrow").value||0)/100;
    var CV = collAmt*Pc, DV = debtAmt*Pd;
    var HF = DV>0 ? (CV*LT)/DV : Infinity;
    var ltvUsed = (CV>0 && LTV>0) ? DV/(CV*LTV) : 0;
    var liqPrice = collAmt>0 && LT>0 ? DV/(collAmt*LT) : NaN;
    var buffer = (CV*LT>0) ? (1 - DV/(CV*LT)) : NaN;
    var thf = Number($("targetHF").value||0), bufPct = Number($("bufferPct").value||0)/100;
    var dvMax = NaN;
    if (thf && thf>=1){ dvMax = (CV*LT)/thf; }
    else if (bufPct && bufPct>0){ dvMax = (CV*LT)*(1 - bufPct); }
    var borrowSuggest = isFinite(dvMax) ? (dvMax/Pd) : NaN;
    var netAsset = CV - DV, yieldYear = CV*apySupply, costYear = DV*apyBorrow;
    var netApy = netAsset>0 ? (yieldYear - costYear)/netAsset : NaN;
    return {CV:CV, DV:DV, HF:HF, ltvUsed:ltvUsed, liqPrice:liqPrice, borrowSuggest:borrowSuggest, netApy:netApy, yieldYear:yieldYear, costYear:costYear, buffer:buffer, Pc:Pc, Pd:Pd, LTV:LTV, LT:LT};
  }
  function renderCore(r){
    $("m_collVal").textContent = money(r.CV);
    $("m_debtVal").textContent = money(r.DV);
    $("m_hf").innerHTML = isFinite(r.HF) ? (r.HF.toFixed(2) + riskBadge(r.HF)) : "—";
    $("m_ltvUse").textContent = isFinite(r.ltvUsed) ? (r.ltvUsed*100).toFixed(2) + "%" : "—";
    $("m_liqPrice").textContent = isFinite(r.liqPrice) ? "$" + r.liqPrice.toFixed(2) : "—";
    $("m_suggest").textContent = isFinite(r.borrowSuggest) ? (r.borrowSuggest.toFixed(6)) + (I18N[LANG].suggestSuffix||"") : "—";
    $("m_netApy").textContent = isFinite(r.netApy) ? pctTxt(r.netApy) : "—";
    $("m_costYear").textContent = money(r.costYear);
    $("m_yieldYear").textContent = money(r.yieldYear);
    $("m_buffer").textContent = isFinite(r.buffer) ? (r.buffer*100).toFixed(2) + "%" : "—";
  }

  // ---------- Charts ----------
  var chartHF = null, chartLoop = null;
  function ensureChartHF(){
    if(!window.Chart) return null;
    if(chartHF) return chartHF;
    var d = I18N[LANG];
    chartHF = new Chart(document.getElementById("chartHF").getContext("2d"),{
      type:"line",
      data:{ labels:[], datasets:[
        {label:d.chart.hf, data:[], borderWidth:2, tension:0.25},
        {label:d.chart.liqLine, data:[], borderWidth:1.5, tension:0, borderDash:[6,6]}
      ]},
      options:{ responsive:true, animation:false, interaction:{mode:"index", intersect:false},
        scales:{ x:{title:{display:true, text:d.chart.x}}, y:{title:{display:true, text:d.chart.y}, min:0} },
        plugins:{ legend:{display:true} }
      }
    });
    return chartHF;
  }
  function ensureChartLoop(){
    if(!window.Chart) return null;
    if(chartLoop) return chartLoop;
    var d = I18N[LANG];
    chartLoop = new Chart(document.getElementById("chartLoop").getContext("2d"),{
      type:"line",
      data:{ labels:[], datasets:[
        {label:(LANG==='zh'?'总抵押（倍数）':'Total Collateral (x)'), data:[], borderWidth:2, tension:0.25},
        {label:(LANG==='zh'?'总负债（倍数）':'Total Debt (x)'), data:[], borderWidth:2, tension:0.25},
        {label:(LANG==='zh'?'净杠杆（抵押-负债）':'Net Leverage'), data:[], borderWidth:2, tension:0.25, borderDash:[6,6]},
        {label:(LANG==='zh'?'净年化（按权益）':'Net APY (on equity)'), data:[], borderWidth:2, tension:0.25}
      ]},
      options:{ responsive:true, animation:false, interaction:{mode:"index", intersect:false},
        scales:{ x:{title:{display:true, text:d.chart.loopX}}, y:{title:{display:true, text:d.chart.loopY}} },
        plugins:{ legend:{display:true} }
      }
    });
    return chartLoop;
  }
  function stressRun(){
    var r = calcCore();
    var range = Math.max(10, Math.min(90, Number($("stressRange").value||80)));
    var debChange = Number($("stressDebt").value||0)/100;
    var from = -range, to = range, step = 5;
    var labels = [], hfs = [], ones = [];
    for (var x=from; x<=to; x+=step){
      var CV2 = r.CV*(1+x/100);
      var DV2 = r.DV*(1+debChange);
      var HF2 = DV2>0 ? (CV2*r.LT)/DV2 : Infinity;
      labels.push((x>0?"+":"")+x+"%");
      hfs.push(HF2); ones.push(1);
    }
    var c = ensureChartHF(); if(!c) return;
    c.data.labels = labels; c.data.datasets[0].data = hfs; c.data.datasets[1].data = ones; c.update();
  }
  function loopRun(){
    var n = Math.max(0, Math.min(20, Number($("loops").value||0)));
    var bPct = Math.min(Number($("loopBorrowPct").value||0)/100, 0.99);
    var fee = Number($("loopFee").value||0)/100;
    var s = Number($("loopSupply").value||0)/100;
    var r = Number($("loopBorrow").value||0)/100;
    var labels = [], dep = [], debt = [], net = [], apy = [];
    for (var i=0; i<=n; i++){
      var sumDep = (1 - Math.pow(bPct, i+1)) / (1 - bPct);
      var sumDebt = (bPct) * (1 - Math.pow(bPct, i)) / (1 - bPct);
      var tradeCost = (i) * fee;
      var netEquity = sumDep - sumDebt;
      var netApy = ((sumDep*s) - (sumDebt*r)) / Math.max(1e-9, netEquity) - tradeCost;
      labels.push(i); dep.push(sumDep); debt.push(sumDebt); net.push(netEquity); apy.push(netApy);
    }
    var c = ensureChartLoop(); if(!c) return;
    c.data.labels = labels; c.data.datasets[0].data = dep; c.data.datasets[1].data = debt; c.data.datasets[2].data = net; c.data.datasets[3].data = apy; c.update();
  }
  function calcAll(){ var r = calcCore(); renderCore(r); stressRun(); loopRun(); }

  // ---------- DOM Ready ----------
  document.addEventListener("DOMContentLoaded", function(){
    $("btnZH").addEventListener("click", function(){ LANG="zh"; localStorage.setItem("lc_lang","zh"); applyI18n(); });
    $("btnEN").addEventListener("click", function(){ LANG="en"; localStorage.setItem("lc_lang","en"); applyI18n(); });

        $("calcBtn").addEventListener("click", calcAll);
    $("calcBtnTop").addEventListener("click", calcAll);
    $("presetBtn").addEventListener("click", loadPreset);
    $("refreshBtn").addEventListener("click", refreshPrices);
    document.addEventListener("keydown", function(e){ if((e.key==="Enter") && (e.ctrlKey||e.metaKey)){ calcAll(); }});

    var modal = $("helpModal");
    function openHelp(){ modal.classList.add("open"); modal.setAttribute("aria-hidden","false"); }
    function closeHelp(){ modal.classList.remove("open"); modal.setAttribute("aria-hidden","true"); }
    $("helpBtn").addEventListener("click", openHelp);
    $("helpClose").addEventListener("click", closeHelp);
    $("helpGotIt").addEventListener("click", closeHelp);
    modal.addEventListener("click", function(e){ if(e.target===modal) closeHelp(); });
    document.addEventListener("keydown", function(e){ if(e.key==="Escape") closeHelp(); });

    setLangButtons();

    applyI18n();
    try{ loadPreset(); }catch(e){}
    refreshPrices().then(calcAll);
  });
})();
