
(function(){
  const $ = (sel, ctx=document) => ctx.querySelector(sel);
  const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

  // ---------------------- Force-top domains (don't iframe) ----------------------
  const FORCE_TOP_DOMAINS = [
    "addrproof.top",
    "alipay.com", "alipayobjects.com",
    "checkout.stripe.com", "hooks.stripe.com", "stripe.com",
    "weixin.qq.com", "wx.tenpay.com",
    "paypal.com", "pay.google.com", "pay.apple.com"
  ];
  function hostnameMatch(h, domain){
    return h === domain || h.endsWith("." + domain);
  }
  function shouldForceTop(url){
    try { const u = new URL(url); return FORCE_TOP_DOMAINS.some(d => hostnameMatch(u.hostname, d)); }
    catch(e){ return false; }
  }

  // ---------------------- Search (fuzzy) helpers ----------------------
  let searchQuery = "";

  function debounce(fn, delay = 100){
    let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
  }

  // Fuzzy score: substring -> high score; otherwise subsequence with adjacency bonus
  function fuzzyScore(q, s){
    if (!q) return 1;
    q = q.toLowerCase(); s = s.toLowerCase();
    if (s.includes(q)) return 100 + q.length;
    let score = 0, last = -1, bonus = 0;
    for (let i = 0; i < q.length; i++){
      const ch = q[i];
      const idx = s.indexOf(ch, last + 1);
      if (idx === -1) return 0;
      score += 1;
      if (idx === last + 1) bonus += 1;
      last = idx;
    }
    return score + bonus;
  }

  // ---------------------- Render cards ----------------------
  function renderCards(){
    const lang = localStorage.getItem("lang") || "zh";
    const dict = (window.I18N?.[lang] || {}).cards || {};
    const q = (searchQuery || "").trim().toLowerCase();

    const containers = {
      tools: window.LINKS?.tools || [],
      exchanges: window.LINKS?.exchanges || [],
      broker: window.LINKS?.broker || []
    };

    Object.entries(containers).forEach(([container, list]) => {
      const el = document.getElementById(container);
      if (!el) return;

      const scored = (!q ? list.map(item => ({ item, score: 1 })) :
        list.map(item => {
          const text = `${item.id} ${(dict[item.id]?.title || "")} ${(dict[item.id]?.desc || "")}`;
          return { item, score: fuzzyScore(q, text) };
        }).filter(x => x.score > 0).sort((a, b) => b.score - a.score)
      );

      // Hide empty section during search
      const section = el.closest("section");
      if (q && scored.length === 0){
        el.innerHTML = "";
        if (section) section.style.display = "none";
        return;
      } else {
        if (section) section.style.display = "";
      }

      el.innerHTML = scored.map(({ item }) => {
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

      // Rebind tool openers for non-blank
      $$('[data-open="tool"]', el).forEach(a => {
        a.addEventListener("click", e => {
          e.preventDefault();
          const url = a.getAttribute("data-href");
          const id  = a.getAttribute("data-id");
          const img = a.getAttribute("data-img");
          if (shouldForceTop(url)) { window.open(url, "_blank", "noopener"); return; }
          if (url) openToolModal(url, id, img);
        });
      });
    });
  }

  // ---------------------- Language & i18n ----------------------
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

    // Search placeholder (if exists)
    const searchEl = $("#search");
    if (searchEl) {
      searchEl.placeholder = map.search_placeholder
        || (lang === "zh" ? "搜索 工具 / 交易所 / 券商…" : "Search tools / exchanges / brokerage…");
    }

    // set select value
    const sel = $("#lang"); if (sel) sel.value = lang;

    renderCards();
  }

  // ---------------------- Tool Modal (iframe) ----------------------
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
    if (iframeEl) iframeEl.src = url;
    if (modalEl) {
      modalEl.classList.add("open");
      modalEl.setAttribute("aria-hidden","false");
    }
    document.body.style.overflow = "hidden";
  }

  function closeToolModal(){
    if (modalEl) {
      modalEl.classList.remove("open");
      modalEl.setAttribute("aria-hidden","true");
    }
    if (iframeEl) iframeEl.src = "about:blank";
    document.body.style.overflow = "";
  }

  // ---------------------- WeChat Modal ----------------------
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

  // ---------------------- Init ----------------------
  document.addEventListener("DOMContentLoaded", () => {
    // language init
    let lang = localStorage.getItem("lang");
    if (!lang) {
      const sys = (navigator.language || "zh").toLowerCase();
      lang = sys.startsWith("zh") ? "zh" : "en";
      localStorage.setItem("lang", lang);
    }
    applyLang(lang);

    // lang switch
    const sel = $("#lang");
    if (sel) {
      sel.addEventListener("change", () => {
        const v = sel.value === "en" ? "en" : "zh";
        localStorage.setItem("lang", v);
        applyLang(v);
      });
    }

    // search bind
    const searchEl = $("#search");
    if (searchEl){
      const onInput = debounce(e => { searchQuery = e.target.value.trim(); renderCards(); }, 80);
      searchEl.addEventListener("input", onInput);
      // ESC to clear
      searchEl.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && searchEl.value){
          e.preventDefault(); searchEl.value = ""; searchQuery = ""; renderCards();
        }
      });
    }

    // Global hotkeys: Ctrl/Cmd+K and "/" to focus search
    document.addEventListener("keydown", (e) => {
      const tag = document.activeElement?.tagName;
      const inField = tag === "INPUT" || tag === "TEXTAREA" || document.activeElement?.isContentEditable;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k"){
        e.preventDefault(); $("#search")?.focus(); $("#search")?.select();
      } else if (!inField && !e.ctrlKey && !e.metaKey && e.key === "/"){
        e.preventDefault(); $("#search")?.focus();
      } else if (e.key === "Escape" && modalEl?.classList.contains("open")){
        e.preventDefault(); closeToolModal();
      } else if (e.key === "Escape" && wechatModal?.classList.contains("open")){
        e.preventDefault(); closeWechatModal();
      }
    });

    // Tool modal basic events
    if (closeBtn) closeBtn.addEventListener("click", closeToolModal);
    if (modalEl) {
      modalEl.addEventListener("click", (e)=>{ if(e.target === modalEl) closeToolModal(); });
    }

    // WeChat modal: event delegation
    document.addEventListener("click", (e) => {
      const opener = e.target.closest('[data-open="wechat"]');
      if (opener) { e.preventDefault(); openWechatModal(); return; }

      const closer = e.target.closest('[data-close="wechat"]');
      if (closer) { e.preventDefault(); closeWechatModal(); return; }
    });

    // Safety: blur clicked card buttons/links to remove persistent focus ring
    document.addEventListener('click', e => {
      const el = e.target.closest('.card a, .card button');
      if (el) el.blur();
    });
  });

  // Expose small debug surface
  window.__ML__ = { applyLang, renderCards, openToolModal, closeToolModal, openWechatModal, closeWechatModal };
})();
