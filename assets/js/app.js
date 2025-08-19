(function(){
  'use strict';

  // ---------------------- Tiny helpers ----------------------
  const $  = (sel, ctx=document) => ctx.querySelector(sel);
  const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));
  const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);

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
    try{
      const u = new URL(url);
      return FORCE_TOP_DOMAINS.some(d => hostnameMatch(u.hostname, d));
    }catch(e){
      return false;
    }
  }

  // ---------------------- Fuzzy search (very light) ----------------------
  function fuzzyScore(q, text){
    if (!q) return 1;
    q = q.toLowerCase();
    text = (text || "").toLowerCase();
    let i = 0, score = 0;
    for (const ch of text){
      if (ch === q[i]){ score += 2; i++; if (i === q.length) break; }
      else if (q.includes(ch)) score += 1;
    }
    return i === q.length ? score : 0;
  }

  // ---------------------- Global state ----------------------
  let searchQuery = "";

  // ---------------------- i18n apply ----------------------
  function applyLang(lang){
    const dict = (window.I18N?.[lang]) || {};
    document.documentElement.setAttribute("lang", lang);

    // Fill [data-i18n]
    $$("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      const val = key ? (dict[key] ?? el.textContent) : null;
      if (val != null) el.textContent = val;
    });

    // Search placeholder
    const search = $("#search");
    if (search && dict.search_placeholder){
      search.placeholder = dict.search_placeholder;
      search.setAttribute("aria-label", dict.search_placeholder);
    }

    // Lang selector
    const sel = $("#lang");
    if (sel){
      const options = [
        { value: "zh", label: "中文" },
        { value: "en", label: "English" }
      ];
      sel.innerHTML = options.map(o => `<option value="${o.value}" ${o.value===lang?'selected':''}>${o.label}</option>`).join("");
    }

    // Re-render sections and donation cards
    renderCards();
    renderDonateCards();
  }

  // ---------------------- Render cards ----------------------
  function renderCards(){
    const lang = localStorage.getItem("lang") || "zh";
    const dictCards = (window.I18N?.[lang] || {}).cards || {};
    const q = (searchQuery || "").trim().toLowerCase();

    const containers = {
      tools: window.LINKS?.tools || [],
      exchanges: window.LINKS?.exchanges || [],
      broker: window.LINKS?.broker || []
    };

    Object.entries(containers).forEach(([container, list]) => {
      const el = $(`#${container}`);
      if (!el) return;

      // Score + filter by fuzzy
      const scored = (q ? list.map(item => {
        const text = [
          item.id,
          (dictCards[item.id]?.title)||"",
          (dictCards[item.id]?.desc)||""
        ].join(" ");
        return { item, score: fuzzyScore(q, text) };
      }).filter(x => x.score > 0).sort((a,b)=>b.score-a.score) : list.map(item => ({ item, score: 1 })));

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
                <p class="title">${(dictCards[item.id]?.title) || ""}</p>
                <p class="desc">${(dictCards[item.id]?.desc) || ""}</p>
              </div>
            </div>
          </a>
        </div>
        `;
      }).join("");
    });
  }

  // ---------------------- Tool Modal ----------------------
  const toolModal = $("#toolModal");
  const toolFrame = $("#toolFrame");
  const toolClose = $("#toolClose");

  function openToolModal(url, id, img){
    if (!toolModal || !toolFrame) return;

    // title
    const lang = localStorage.getItem("lang") || "zh";
    const dict = (window.I18N?.[lang] || {}).cards || {};
    const title = dict?.[id]?.title || "Tool";
    const titleEl = $("#toolTitle");
    if (titleEl) titleEl.textContent = title;

    // set src
    toolFrame.src = url;

    toolModal.classList.add("open");
    toolModal.setAttribute("aria-hidden","false");
    document.body.style.overflow = "hidden";
  }
  function closeToolModal(){
    if (!toolModal) return;
    if (toolFrame) toolFrame.src = "about:blank";
    toolModal.classList.remove("open");
    toolModal.setAttribute("aria-hidden","true");
    document.body.style.overflow = "";
  }
  on(toolClose, "click", e => { e.preventDefault(); closeToolModal(); });

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

  // ---------------------- Donate Modal (NEW) ----------------------
  // Configurable addresses – update these to your own
  window.DONATE_METHODS = window.DONATE_METHODS || [
    { id: "btc", icon: "₿", labelKey: "donate_btc", address: "bc1p3u0hpz4cyfyk6sxsjlnqaj97gctxpjruc70cpp0rf3cm7p96ejwsgkfa98" },
    { id: "eth", icon: "Ξ", labelKey: "donate_eth", address: "0xe682aca5ee271827c828214952811ac34c90b8b5" },
    { id: "sol", icon: "◎", labelKey: "donate_sol", address: "EYC2CX5ddSSzGbT88RzeiBNFDVntan8yYmPx5sNEmZ7K" },
	 { id: "Tron", icon: "☘️", labelKey: "USDT（TRC20）", address: "TWiQw7UkZrwpG9orCbZ4NmSQN2ej1QjHAk" }
  ];

  const donateModal = $("#donateModal");
  const donateGrid  = donateModal ? donateModal.querySelector(".donate-grid") : null;

  function renderDonateCards(){
    if (!donateGrid || !Array.isArray(window.DONATE_METHODS)) return;
    const lang = localStorage.getItem("lang") || "zh";
    const dict = (window.I18N?.[lang] || {});
    donateGrid.innerHTML = window.DONATE_METHODS.map(m => {
      const label = dict[m.labelKey] || m.labelKey || "";
      const addr  = m.address || "";
      const safeId = `addr_${m.id}`;
      const copyText = dict.donate_copy || "Copy";
      return `
        <div class="donate-card">
          <div class="donate-head">
            <span class="donate-emoji" aria-hidden="true">${m.icon || ""}</span>
            <span class="donate-label">${label}</span>
          </div>
          <div class="donate-addr">
            <code id="${safeId}" class="addr-code" title="${addr}">${addr}</code>
            <button class="copybtn" data-copy="${addr}" aria-label="${copyText}">${copyText}</button>
          </div>
        </div>
      `;
    }).join("");
  }

  function openDonateModal(){
    if (!donateModal) return;
    renderDonateCards();
    donateModal.classList.add("open");
    donateModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeDonateModal(){
    if (!donateModal) return;
    donateModal.classList.remove("open");
    donateModal.setAttribute("aria-hidden", "true");
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

    // search
    const input = $("#search");
    if (input){
      const handler = () => { searchQuery = input.value || ""; renderCards(); };
      on(input, "input", handler);
      on(input, "change", handler);
    }

    // Click delegation
    document.addEventListener("click", (e) => {
      // Open tool in modal (unless forced-top)
      const toolLink = e.target.closest('[data-open="tool"]');
      if (toolLink){
        e.preventDefault();
        const href = toolLink.getAttribute("data-href");
        const id   = toolLink.getAttribute("data-id");
        if (href && !shouldForceTop(href)){
          openToolModal(href, id, toolLink.getAttribute("data-img")||"");
        } else if (href){
          window.open(href, "_blank", "noopener");
        }
        return;
      }

      // WeChat modal
      const openWechat = e.target.closest('[data-open="wechat"]');
      if (openWechat){ e.preventDefault(); openWechatModal(); return; }

      const closeWechat = e.target.closest('[data-close="wechat"]');
      if (closeWechat){ e.preventDefault(); closeWechatModal(); return; }

      // Donate modal
      const openDonate = e.target.closest('[data-open="donate"]');
      if (openDonate){ e.preventDefault(); openDonateModal(); return; }

      const closeDonate = e.target.closest('[data-close="donate"]');
      if (closeDonate){ e.preventDefault(); closeDonateModal(); return; }

      // Copy buttons in donate modal
      const copyBtn = e.target.closest('.copybtn');
      if (copyBtn && copyBtn.dataset.copy){
        const text = copyBtn.dataset.copy;
        const lang2 = localStorage.getItem("lang") || "zh";
        const dict2 = (window.I18N?.[lang2] || {});
        const orig = copyBtn.textContent;
        const doneText = dict2.donate_copied || "Copied!";
        (async () => {
          try{
            await navigator.clipboard.writeText(text);
          }catch{
            // Fallback
            const ta = document.createElement("textarea");
            ta.value = text; document.body.appendChild(ta);
            ta.select(); document.execCommand("copy"); ta.remove();
          } finally {
            copyBtn.textContent = doneText;
            setTimeout(()=>{ copyBtn.textContent = orig; }, 1200);
          }
        })();
        return;
      }

      // Tool modal close via head button
      if (e.target.closest('#toolClose')) { e.preventDefault(); closeToolModal(); return; }
    });

    // Keyboard: ESC to close modals
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      if (toolModal?.classList.contains("open")) { e.preventDefault(); closeToolModal(); return; }
      if (wechatModal?.classList.contains("open")) { e.preventDefault(); closeWechatModal(); return; }
      if (donateModal?.classList.contains("open")) { e.preventDefault(); closeDonateModal(); return; }
    });

    // Safety: blur clicked card buttons/links to remove persistent focus ring
    document.addEventListener('click', e => {
      const el = e.target.closest('.card a, .card button');
      if (el) el.blur();
    });
  });

  // Expose small debug surface
  window.__ML__ = {
    applyLang,
    renderCards,
    openToolModal, closeToolModal,
    openWechatModal, closeWechatModal,
    openDonateModal, closeDonateModal, renderDonateCards
  };
})();
