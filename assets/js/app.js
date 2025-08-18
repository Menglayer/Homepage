
(function(){
  const $ = (sel, ctx=document) => ctx.querySelector(sel);
  const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

  // --- Domains that usually break inside iframes (payment / deep links) ---
  const FORCE_TOP_DOMAINS = [
    "addrproof.top",
    "alipay.com", "alipayobjects.com",
    "checkout.stripe.com", "hooks.stripe.com", "stripe.com",
    "weixin.qq.com", "wx.tenpay.com",
    "paypal.com", "pay.google.com", "pay.apple.com"
  ];
  function hostnameMatch(h, domain){
    return h === domain || h.endsWith("."+domain);
  }
  function shouldForceTop(url){
    try {
      const u = new URL(url);
      return FORCE_TOP_DOMAINS.some(d => hostnameMatch(u.hostname, d));
    } catch(e){ return false; }
  }

  // --- Render cards for sections based on i18n + LINKS ---
  function renderCards(){
    const lang = localStorage.getItem("lang") || "zh";
    const dict = (window.I18N?.[lang] || {}).cards || {};

    const containers = {
      tools: window.LINKS?.tools || [],
      exchanges: window.LINKS?.exchanges || [],
      broker: window.LINKS?.broker || []
    };

    Object.entries(containers).forEach(([container, list]) => {
      const el = document.getElementById(container);
      if (!el) return;
      el.innerHTML = (list || []).map(item => {
        const isTool = container === "tools";
        const openBlank = isTool ? (item.open === "blank" || shouldForceTop(item.href)) : true;
        const aAttrs = openBlank
          ? `href="${item.href}" target="_blank" rel="noopener"`
          : `href="#" data-open="tool" data-href="${item.href}" data-id="${item.id}" data-img="${item.img || ''}"`;
        return `
        <div class="card">
          <a ${aAttrs}>
            <div class="row">
              <div class="icon"><img src="${item.img}" alt="${item.id} logo" /></div>
              <div>
                <p class="title">${(dict[item.id]?.title) || ""}</p>
                <p class="desc">${(dict[item.id]?.desc) || ""}</p>
              </div>
            </div>
          </a>
        </div>`;
      }).join("");
    });

    // Bind tool modal openers (non-blank)
    $$('[data-open="tool"]').forEach(a => {
      a.addEventListener("click", e => {
        e.preventDefault();
        const url = a.getAttribute("data-href");
        const id  = a.getAttribute("data-id");
        const img = a.getAttribute("data-img");
        if (shouldForceTop(url)) { window.open(url, "_blank", "noopener"); return; }
        if (url) openToolModal(url, id, img);
      });
    });
  }

  // --- Language application ---
  function applyLang(lang){
    const map = window.I18N?.[lang];
    if (!map) return;
    document.documentElement.lang = (lang === "zh" ? "zh-CN" : "en");
    $$("[data-i18n]").forEach(node => {
      const key = node.getAttribute("data-i18n");
      if (Object.prototype.hasOwnProperty.call(map, key)) {
        node.textContent = map[key];
      }
    });
    localStorage.setItem("lang", lang);
    const sel = $("#lang"); if (sel) sel.value = lang;
    renderCards();
  }

  // --- Tool Modal (iframe) ---
  const modalEl   = $("#toolModal");
  const iframeEl  = $("#toolFrame");
  const closeBtn  = $("#toolClose");
  const titleEl   = $("#toolTitle") || (modalEl ? modalEl.querySelector(".modal-title") : null);
  const iconEl    = $("#toolTitleIcon") || null;

  function setIframeAttrs(){
    if (!iframeEl) return;
    iframeEl.setAttribute("allow", "payment *; clipboard-read *; clipboard-write *; fullscreen *; geolocation *; web-share *");
    iframeEl.setAttribute("allowpaymentrequest", "");
    iframeEl.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
  }

  function openToolModal(url, id, img){
    const lang = localStorage.getItem("lang") || "zh";
    const dict = (window.I18N?.[lang] || {}).cards || {};
    const title = (id && dict[id]?.title) ? dict[id].title : (id || "");
    if (titleEl) titleEl.textContent = title;
    if (iconEl && img) {
      iconEl.src = img;
      iconEl.alt = (id ? (id + " logo") : "tool");
      iconEl.style.display = "inline-block";
    }
    if (shouldForceTop(url)) { window.open(url, "_blank", "noopener"); return; }

    setIframeAttrs();
    const q = url.includes("?") ? "&" : "?";
    if (iframeEl) iframeEl.src = url + q + "lang=" + encodeURIComponent(lang);
    if (modalEl) {
      modalEl.classList.add("open");
      modalEl.setAttribute("aria-hidden","false");
      document.body.style.overflow = "hidden";
    }
  }
  function closeToolModal(){
    if (modalEl) {
      modalEl.classList.remove("open");
      modalEl.setAttribute("aria-hidden","true");
    }
    if (iframeEl) iframeEl.src = "about:blank";
    document.body.style.overflow = "";
  }

  // --- WeChat Modal (event delegation; no hardcoded IDs) ---
  const wechatModal = $("#wechatModal");

  function openWechatModal(){
    if (!wechatModal) return;
    wechatModal.classList.add("open");
    wechatModal.setAttribute("aria-hidden","false");
    document.body.style.overflow = "hidden";
  }
  function closeWechatModal(){
    if (!wechatModal) return;
    wechatModal.classList.remove("open");
    wechatModal.setAttribute("aria-hidden","true");
    document.body.style.overflow = "";
  }

  // --- Init ---
  document.addEventListener("DOMContentLoaded", ()=>{
    const saved = localStorage.getItem("lang") || "zh";
    applyLang(saved);

    const langSel = $("#lang");
    if (langSel) {
      langSel.addEventListener("change", e => applyLang(e.target.value));
    }

    // Tool modal basic events
    if (closeBtn) closeBtn.addEventListener("click", closeToolModal);
    if (modalEl) {
      modalEl.addEventListener("click", (e)=>{ if(e.target === modalEl) closeToolModal(); });
    }
    window.addEventListener("keydown", (e)=>{ if(e.key === "Escape" && modalEl?.classList.contains("open")) closeToolModal(); });

    // WeChat modal: event delegation
    document.addEventListener("click", (e) => {
      const opener = e.target.closest('[data-open="wechat"]');
      if (opener) { e.preventDefault(); openWechatModal(); return; }

      const closer = e.target.closest('[data-close="wechat"]');
      if (closer) { e.preventDefault(); closeWechatModal(); return; }
    });
    if (wechatModal) {
      wechatModal.addEventListener("click", (e)=>{ if (e.target === wechatModal) closeWechatModal(); });
    }

    // Backward-compatibility: bind legacy IDs if present
    const legacyBtn = $("#joinWechat") || $("#btnWeChat");
    if (legacyBtn) legacyBtn.addEventListener("click", (e)=>{ e.preventDefault(); openWechatModal(); });
    const legacyClose = $("#wechatClose");
    if (legacyClose) legacyClose.addEventListener("click", (e)=>{ e.preventDefault(); closeWechatModal(); });
  });

  // Debug helpers
  window.__ML__ = { applyLang, renderCards, openWechatModal, closeWechatModal };
})();
document.addEventListener('click', e => {
  const el = e.target.closest('.card a, .card button');
  if (el) el.blur();
});

