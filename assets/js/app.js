(function(){
  'use strict';

  const $  = (sel, ctx=document) => ctx.querySelector(sel);
  const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));
  const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);

  // Configuration
  const FORCE_TOP_DOMAINS = [
    "addrproof.top", "alipay.com", "stripe.com", "paypal.com"
  ];
  const IFRAME_ALLOW_HOSTS = ["menglayer.lol"];

  // Helpers
  function canIframe(url){
    try{ const h = new URL(url).hostname; return IFRAME_ALLOW_HOSTS.some(d => h === d || h.endsWith("."+d)); }catch{ return false; }
  }
  function shouldForceTop(url){
    try{ const u = new URL(url); return FORCE_TOP_DOMAINS.some(d => u.hostname.includes(d)); }catch{ return false; }
  }
  function fuzzyScore(q, text){
    if (!q) return 1;
    q = q.toLowerCase(); text = (text||"").toLowerCase();
    let i=0, score=0;
    for (const ch of text){
      if (ch===q[i]){ score+=2; i++; if(i===q.length) break; }
      else if(q.includes(ch)) score+=1;
    }
    return i===q.length ? score : 0;
  }
  
  // ✅ 新增：防抖函数 (优化性能)
  function debounce(fn, delay) {
    let timer = null;
    return function(...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  // State
  let searchQuery = "";

  // i18n
  function applyLang(lang){
    const dict = (window.I18N?.[lang]) || {};
    document.documentElement.setAttribute("lang", lang);
    $$("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (dict[key]) el.textContent = dict[key];
    });
    $$("[data-i18n-attr]").forEach(el => {
      el.getAttribute("data-i18n-attr").split(",").forEach(pair => {
        const [attr, key] = pair.split(":").map(s=>s.trim());
        if (dict[key]) el.setAttribute(attr, dict[key]);
      });
    });
    const search = $("#search");
    if (search && dict.search_placeholder) search.placeholder = dict.search_placeholder;
    const sel = $("#lang");
    if (sel) sel.innerHTML = `
      <option value="zh" ${lang==='zh'?'selected':''}>中文</option>
      <option value="en" ${lang==='en'?'selected':''}>English</option>
    `;

    renderCards();
    renderDonateCards();
    
    const emptyTxt = $("#emptyText");
    if (emptyTxt) emptyTxt.textContent = dict.no_results_found || "No results found";
  }

  // Render Cards
  function renderCards(){
    const lang = localStorage.getItem("lang") || "zh";
    const dictCards = (window.I18N?.[lang] || {}).cards || {};
    const q = (searchQuery || "").trim().toLowerCase();

    // ✅ 优化：防止 window.LINKS 未加载导致的报错
    const containers = {
      tools: window.LINKS?.tools || [],
      exchanges: window.LINKS?.exchanges || [],
      broker: window.LINKS?.broker || []
    };

    let totalItems = 0;
    let animDelayIndex = 0; 

    Object.entries(containers).forEach(([container, list]) => {
      const el = $(`#${container}`);
      if (!el) return;

      const scored = (q ? list.map(item => {
        const text = [item.id, dictCards[item.id]?.title, dictCards[item.id]?.desc].join(" ");
        return { item, score: fuzzyScore(q, text) };
      }).filter(x => x.score > 0).sort((a,b)=>b.score-a.score) : list.map(item => ({ item, score: 1 })));

      const section = el.closest("section");
      if (scored.length === 0){
        el.innerHTML = "";
        if (section) section.style.display = "none";
      } else {
        if (section) section.style.display = "";
        totalItems += scored.length;
        
        el.innerHTML = scored.map(({ item }) => {
          const isTool = container === "tools";
          const openBlank = isTool ? (!canIframe(item.href) || item.open === "blank" || shouldForceTop(item.href)) : true;
          const delayStyle = `style="animation-delay: ${animDelayIndex++ * 0.04}s"`;
          
          const aAttrs = openBlank
            ? `href="${item.href}" target="_blank" rel="noopener noreferrer"`
            : `href="#" rel="noopener" data-open="tool" data-href="${item.href}" data-id="${item.id}"`;
          
          // ✅ 优化：图片 onerror 处理 (如果图片挂了，显示 favicon)
          return `
          <div class="card" ${delayStyle}>
            <a ${aAttrs}>
              <div class="row">
                <div class="icon">
                  <img src="${item.img}" alt="${item.id}" loading="lazy" 
                       onerror="this.onerror=null;this.src='assets/images/favicon.jpg';" />
                </div>
                <div>
                  <p class="title">${(dictCards[item.id]?.title) || item.id}</p>
                  <p class="desc">${(dictCards[item.id]?.desc) || ""}</p>
                </div>
              </div>
            </a>
          </div>
          `;
        }).join("");
      }
    });

    const emptyState = $("#emptyState");
    if (emptyState) {
      if (q && totalItems === 0) emptyState.classList.add("show");
      else emptyState.classList.remove("show");
    }
  }

  // Tool Modal
  const toolModal = $("#toolModal");
  const toolFrame = $("#toolFrame");
  const toolLoader = $("#toolLoader");
  let toolTick = null, toolSlow = null;

  function resetLoader(){
    clearTimeout(toolTick); clearTimeout(toolSlow);
    if(toolLoader) { toolLoader.classList.remove("show","slow"); toolLoader.querySelector(".tool-loader-fill").style.width="0%"; }
  }
  function startLoader(){
    if(!toolLoader) return;
    resetLoader();
    toolLoader.classList.add("show");
    let p = 5;
    const fill = toolLoader.querySelector(".tool-loader-fill");
    const tick = () => { if(p<95){ p += (95-p)*0.05; fill.style.width=p+"%"; toolTick=setTimeout(tick, 200); }};
    tick();
    toolSlow = setTimeout(()=>{ toolLoader.classList.add("slow"); }, 8000);
  }

  function openToolModal(url, id){
    if (!toolModal || !toolFrame) return;
    const lang = localStorage.getItem("lang") || "zh";
    $("#toolTitle").textContent = (window.I18N?.[lang]?.cards?.[id]?.title) || "Tool";
    startLoader();
    toolFrame.src = url;
    toolModal.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeToolModal(){
    resetLoader();
    toolModal.classList.remove("open");
    toolFrame.src = "about:blank";
    document.body.style.overflow = "";
  }
  
  if (toolFrame) on(toolFrame, "load", resetLoader);

  // Donate & WeChat
  const donateModal = $("#donateModal");
  const wechatModal = $("#wechatModal");
  
  function renderDonateCards(){
    const grid = donateModal?.querySelector(".donate-grid");
    if (!grid || !window.DONATE_METHODS) return;
    const lang = localStorage.getItem("lang") || "zh";
    const dict = window.I18N?.[lang] || {};
    grid.innerHTML = window.DONATE_METHODS.map(m => `
      <div class="donate-card">
        <div class="donate-head"><span class="donate-emoji">${m.icon}</span><span>${dict[m.labelKey]||m.labelKey}</span></div>
        <div class="donate-addr">
          <div class="addr-code">${m.address}</div>
          <button class="copybtn" data-copy="${m.address}">${dict.donate_copy||"Copy"}</button>
        </div>
      </div>
    `).join("");
  }

  function toggleModal(m, show){
    if(!m) return;
    m.classList.toggle("open", show);
    document.body.style.overflow = show ? "hidden" : "";
    if (show && m === donateModal) renderDonateCards();
  }

  // Init
  document.addEventListener("DOMContentLoaded", () => {
    let lang = localStorage.getItem("lang");
    if (!lang) { lang = navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en"; localStorage.setItem("lang", lang); }
    applyLang(lang);

    on($("#lang"), "change", (e) => {
      localStorage.setItem("lang", e.target.value);
      applyLang(e.target.value);
    });

    const searchInput = $("#search");
    if (searchInput){
      // ✅ 优化：使用防抖，输入停止 300ms 后再执行搜索
      on(searchInput, "input", debounce(() => { 
        searchQuery = searchInput.value; 
        renderCards(); 
      }, 300));
    }

    // Global Click Delegation
    document.addEventListener("click", e => {
      const tool = e.target.closest('[data-open="tool"]');
      if (tool) { e.preventDefault(); openToolModal(tool.dataset.href, tool.dataset.id); return; }

      if (e.target.closest('[data-open="wechat"]')) { e.preventDefault(); toggleModal(wechatModal, true); return; }
      if (e.target.closest('[data-close="wechat"]')) { e.preventDefault(); toggleModal(wechatModal, false); return; }

      if (e.target.closest('[data-open="donate"]')) { e.preventDefault(); toggleModal(donateModal, true); return; }
      if (e.target.closest('[data-close="donate"]')) { e.preventDefault(); toggleModal(donateModal, false); return; }
      if (e.target.id === "toolClose") { e.preventDefault(); closeToolModal(); return; }

      const btn = e.target.closest(".copybtn");
      if (btn) {
        navigator.clipboard.writeText(btn.dataset.copy).then(() => {
          const raw = btn.textContent; btn.textContent = "OK!"; setTimeout(()=>btn.textContent=raw, 1000);
        });
      }
      
      if (e.target.classList.contains("modal")) {
        if (e.target === toolModal) closeToolModal();
        else toggleModal(e.target, false);
      }
    });

    document.addEventListener("keydown", e => {
      if (e.key === "Escape") { closeToolModal(); toggleModal(wechatModal, false); toggleModal(donateModal, false); }
    });
  });
})();