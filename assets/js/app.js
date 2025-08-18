
(function(){
  const $ = (sel, ctx=document) => ctx.querySelector(sel);
  const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

  // Render cards for sections based on i18n + LINKS
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
      el.innerHTML = (list || []).map(item => `
        <div class="card">
          <a ${
  container === "tools"
    ? (item.open === "blank"
        ? `href="${item.href}" target="_blank" rel="noopener"`
        : `href="#" data-open="tool" data-href="${item.href}" data-id="${item.id}" data-img="${item.img || ''}"`)
    : `href="${item.href}" target="_blank" rel="noopener"`
}>
            <div class="row">
              <div class="icon"><img src="${item.img}" alt="${item.id} logo" /></div>
              <div>
                <p class="title">${(dict[item.id]?.title) || ""}</p>
                <p class="desc">${(dict[item.id]?.desc) || ""}</p>
              </div>
            </div>
          </a>
        </div>
      `).join("");
    });

    // Bind tool modal
    $$('[data-open="tool"]').forEach(a => {
      a.addEventListener("click", e => {
        e.preventDefault();
        const url = a.getAttribute("data-href");
        const id  = a.getAttribute("data-id");
        const img = a.getAttribute("data-img");
        if (url) openToolModal(url, id, img);
      });
    });
  }

  // Apply language to text nodes
  function applyLang(lang){
    const map = window.I18N?.[lang];
    if (!map) return;
    document.documentElement.lang = (lang === "zh" ? "zh-CN" : "en");
    $$("[data-i18n]").forEach(node => {
      const key = node.getAttribute("data-i18n");
      // Use textContent by default for safety
      if (Object.prototype.hasOwnProperty.call(map, key)) {
        node.textContent = map[key];
      }
    });
    localStorage.setItem("lang", lang);
    const sel = $("#lang"); if (sel) sel.value = lang;
    renderCards();
  }

  // ===== Modals: tool (iframe) =====
  const modalEl   = $("#toolModal");
  const iframeEl  = $("#toolFrame");
  const closeBtn  = $("#toolClose");
  const titleEl   = $("#toolTitle") || (modalEl ? modalEl.querySelector(".modal-title") : null);
  const iconEl    = $("#toolTitleIcon") || null;

  function openToolModal(url, id, img){
    const lang = localStorage.getItem("lang") || "zh";
    // Set dynamic title (fallback to id if no i18n)
    const dict = (window.I18N?.[lang] || {}).cards || {};
    const title = (id && dict[id]?.title) ? dict[id].title : (id || "");
    if (titleEl) titleEl.textContent = title;
    if (iconEl && img) {
      iconEl.src = img;
      iconEl.alt = (id ? (id + " logo") : "tool");
      iconEl.style.display = "inline-block";
    }
    // Load iframe with lang passthrough
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

  // ===== WeChat Modal =====
  const wechatBtn   = $("#joinWechat");
  const wechatModal = $("#wechatModal");
  const wechatClose = $("#wechatClose");

  function openWechatModal(){
    if (wechatModal) {
      wechatModal.classList.add("open");
      wechatModal.setAttribute("aria-hidden","false");
      document.body.style.overflow = "hidden";
    }
  }
  function closeWechatModal(){
    if (wechatModal) {
      wechatModal.classList.remove("open");
      wechatModal.setAttribute("aria-hidden","true");
    }
    document.body.style.overflow = "";
  }

  // ===== Init =====
  document.addEventListener("DOMContentLoaded", ()=>{
    // Init language
    const saved = localStorage.getItem("lang") || "zh";
    applyLang(saved);

    // Lang selector
    const langSel = $("#lang");
    if (langSel) {
      langSel.addEventListener("change", e => applyLang(e.target.value));
    }

    // Tool modal events
    if (closeBtn) closeBtn.addEventListener("click", closeToolModal);
    if (modalEl) {
      modalEl.addEventListener("click", (e)=>{ if(e.target === modalEl) closeToolModal(); });
    }
    window.addEventListener("keydown", (e)=>{ if(e.key === "Escape" && modalEl?.classList.contains("open")) closeToolModal(); });

    // WeChat modal events
    if (wechatBtn) wechatBtn.addEventListener("click", e => { e.preventDefault(); openWechatModal(); });
    if (wechatClose) wechatClose.addEventListener("click", closeWechatModal);
    if (wechatModal) wechatModal.addEventListener("click", (e)=>{ if(e.target === wechatModal) closeWechatModal(); });
  });

  // Expose for debugging if needed
  window.__ML__ = { applyLang, renderCards };

})();
