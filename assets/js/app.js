(function () {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);

  // Configuration
  const FORCE_TOP_DOMAINS = [
    "addrproof.top", "alipay.com", "stripe.com", "paypal.com"
  ];
  const IFRAME_ALLOW_HOSTS = ["menglayer.lol"];

  // Helpers
  function canIframe(url) {
    try { const h = new URL(url).hostname; return IFRAME_ALLOW_HOSTS.some(d => h === d || h.endsWith("." + d)); } catch { return false; }
  }
  function shouldForceTop(url) {
    try { const u = new URL(url); return FORCE_TOP_DOMAINS.some(d => u.hostname.includes(d)); } catch { return false; }
  }
  function fuzzyScore(q, text) {
    if (!q) return 1;
    q = q.toLowerCase(); text = (text || "").toLowerCase();
    let i = 0, score = 0;
    for (const ch of text) {
      if (ch === q[i]) { score += 2; i++; if (i === q.length) break; }
      else if (q.includes(ch)) score += 1;
    }
    return i === q.length ? score : 0;
  }

  // ✅ 降级复制方案
  function fallbackCopyText(text, btn) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        const raw = btn.textContent;
        btn.textContent = "OK!";
        btn.setAttribute('aria-label', '已复制');
        setTimeout(() => {
          btn.textContent = raw;
          btn.removeAttribute('aria-label');
        }, 1000);
      }
    } catch (err) {
      console.warn('降级复制也失败:', err);
    }
    document.body.removeChild(textArea);
  }

  // ✅ 防抖函数（优化版）
  function debounce(fn, delay) {
    let timer = null;
    return function (...args) {
      const ctx = this;
      clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        fn.apply(ctx, args);
      }, delay);
    };
  }

  // ✅ 节流函数（用于滚动等高频事件）
  function throttle(fn, delay) {
    let lastCall = 0;
    return function (...args) {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        fn.apply(this, args);
      }
    };
  }

  // State
  let searchQuery = "";

  // i18n
  function applyLang(lang) {
    const dict = (window.I18N?.[lang]) || {};
    document.documentElement.setAttribute("lang", lang);
    $$("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (dict[key]) el.textContent = dict[key];
    });
    $$("[data-i18n-attr]").forEach(el => {
      el.getAttribute("data-i18n-attr").split(",").forEach(pair => {
        const [attr, key] = pair.split(":").map(s => s.trim());
        if (dict[key]) el.setAttribute(attr, dict[key]);
      });
    });
    const search = $("#search");
    if (search && dict.search_placeholder) search.placeholder = dict.search_placeholder;
    const sel = $("#lang");
    if (sel) sel.innerHTML = `
      <option value="zh" ${lang === 'zh' ? 'selected' : ''}>中文</option>
      <option value="en" ${lang === 'en' ? 'selected' : ''}>English</option>
    `;

    renderCards();

    const emptyTxt = $("#emptyText");
    if (emptyTxt) emptyTxt.textContent = dict.no_results_found || "No results found";
  }

  // Render Cards（性能优化版）
  function renderCards() {
    const lang = localStorage.getItem("lang") || "zh";
    const dictCards = (window.I18N?.[lang] || {}).cards || {};
    const q = (searchQuery || "").trim().toLowerCase();

    // ✅ 数据健壮性检查
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
      }).filter(x => x.score > 0).sort((a, b) => b.score - a.score) : list.map(item => ({ item, score: 1 })));

      const section = el.closest("section");
      if (scored.length === 0) {
        el.innerHTML = "";
        if (section) section.style.display = "none";
      } else {
        if (section) section.style.display = "";
        totalItems += scored.length;

        // ✅ 使用 DocumentFragment 优化 DOM 操作
        const fragment = document.createDocumentFragment();
        const tempDiv = document.createElement('div');

        scored.forEach(({ item }) => {
          const isTool = container === "tools";
          const openBlank = isTool ? (!canIframe(item.href) || item.open === "blank" || shouldForceTop(item.href)) : true;
          const delayStyle = `animation-delay: ${animDelayIndex++ * 0.04}s`;

          const card = document.createElement('div');
          card.className = 'card';
          card.style.animationDelay = `${(animDelayIndex - 1) * 0.04}s`;
          card.setAttribute('role', 'listitem');

          const link = document.createElement('a');
          if (openBlank) {
            link.href = item.href;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
          } else {
            link.href = "#";
            link.rel = "noopener";
            link.setAttribute('data-open', 'tool');
            link.setAttribute('data-href', item.href);
            link.setAttribute('data-id', item.id);
          }

          const row = document.createElement('div');
          row.className = 'row';

          const iconDiv = document.createElement('div');
          iconDiv.className = 'icon';
          const img = document.createElement('img');
          img.src = item.img;
          img.alt = dictCards[item.id]?.title || item.id;
          img.loading = "lazy";
          img.decoding = "async";
          img.style.opacity = "0";
          img.style.transition = "opacity 0.4s";
          img.onload = function () { this.style.opacity = '1'; };
          img.onerror = function () {
            this.onerror = null;
            this.src = 'assets/images/favicon.jpg';
            this.style.opacity = '1';
          };
          iconDiv.appendChild(img);

          const textDiv = document.createElement('div');
          const title = document.createElement('p');
          title.className = 'title';
          title.textContent = dictCards[item.id]?.title || item.id;
          const desc = document.createElement('p');
          desc.className = 'desc';
          desc.textContent = dictCards[item.id]?.desc || "";
          textDiv.appendChild(title);
          textDiv.appendChild(desc);

          row.appendChild(iconDiv);
          row.appendChild(textDiv);
          link.appendChild(row);
          card.appendChild(link);
          fragment.appendChild(card);
        });

        el.innerHTML = "";
        el.appendChild(fragment);
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

  function resetLoader() {
    clearTimeout(toolTick); clearTimeout(toolSlow);
    if (toolLoader) { toolLoader.classList.remove("show", "slow"); toolLoader.querySelector(".tool-loader-fill").style.width = "0%"; }
  }
  function startLoader() {
    if (!toolLoader) return;
    resetLoader();
    toolLoader.classList.add("show");
    let p = 5;
    const fill = toolLoader.querySelector(".tool-loader-fill");
    const progressBar = toolLoader.querySelector(".tool-loader-bar");
    const tick = () => {
      if (p < 95) {
        p += (95 - p) * 0.05;
        fill.style.width = p + "%";
        if (progressBar) {
          progressBar.setAttribute('aria-valuenow', Math.round(p));
        }
        toolTick = setTimeout(tick, 200);
      }
    };
    tick();
    toolSlow = setTimeout(() => { toolLoader.classList.add("slow"); }, 8000);
  }

  function openToolModal(url, id) {
    if (!toolModal || !toolFrame) return;

    // ✅ Analytics Hook (预留)
    if (window.console && console.log) {
      console.log(`[Analytics] Tool: ${id}`);
    }

    const lang = localStorage.getItem("lang") || "zh";
    const titleEl = $("#toolTitle");
    if (titleEl) {
      titleEl.textContent = (window.I18N?.[lang]?.cards?.[id]?.title) || "Tool";
    }
    startLoader();
    toolFrame.src = url;
    toolModal.classList.add("open");
    toolModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    // ✅ 焦点管理：将焦点移到模态框
    const closeBtn = $("#toolClose");
    if (closeBtn) {
      setTimeout(() => closeBtn.focus(), 100);
    }
  }
  function closeToolModal() {
    resetLoader();
    toolModal.classList.remove("open");
    toolModal.setAttribute("aria-hidden", "true");
    toolFrame.src = "about:blank";
    document.body.style.overflow = "";

    // ✅ 恢复焦点到触发元素
    const activeElement = document.activeElement;
    if (activeElement && activeElement.closest('.modal')) {
      const trigger = document.querySelector('[data-open="tool"]:focus, [data-open="tool"]:hover');
      if (trigger) trigger.focus();
    }
  }

  if (toolFrame) on(toolFrame, "load", resetLoader);

  // WeChat Modal
  const wechatModal = $("#wechatModal");

  function toggleModal(m, show) {
    if (!m) return;
    m.classList.toggle("open", show);
    m.setAttribute("aria-hidden", show ? "false" : "true");
    document.body.style.overflow = show ? "hidden" : "";

    // ✅ 焦点管理
    if (show) {
      const closeBtn = m.querySelector('.modal-close');
      if (closeBtn) {
        setTimeout(() => closeBtn.focus(), 100);
      }
    }
  }

  // ✅ 性能监控（开发环境）
  function perfMark(name) {
    if (window.performance && window.performance.mark) {
      window.performance.mark(name);
    }
  }

  function perfMeasure(name, startMark, endMark) {
    if (window.performance && window.performance.measure) {
      try {
        window.performance.measure(name, startMark, endMark);
      } catch (e) {
        // 忽略测量错误
      }
    }
  }

  // ✅ 图片加载优化：Intersection Observer
  function setupImageObserver() {
    if (!('IntersectionObserver' in window)) return;

    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            observer.unobserve(img);
          }
        }
      });
    }, {
      rootMargin: '50px'
    });

    // 观察所有懒加载图片
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }

  // Init
  document.addEventListener("DOMContentLoaded", () => {
    perfMark('dom-ready');

    let lang = localStorage.getItem("lang");
    if (!lang) {
      lang = navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en";
      localStorage.setItem("lang", lang);
    }
    applyLang(lang);

    // ✅ 设置图片观察器
    setupImageObserver();

    perfMark('init-complete');
    perfMeasure('init-duration', 'dom-ready', 'init-complete');

    on($("#lang"), "change", (e) => {
      localStorage.setItem("lang", e.target.value);
      applyLang(e.target.value);
    });

    const searchInput = $("#search");
    if (searchInput) {
      // ✅ 搜索防抖
      on(searchInput, "input", debounce(() => {
        searchQuery = searchInput.value;
        renderCards();
      }, 300));
    }

    // ✅ 回到顶部逻辑（节流优化）
    const backBtn = $("#backToTop");
    if (backBtn) {
      window.addEventListener("scroll", throttle(() => {
        backBtn.classList.toggle("show", window.scrollY > 300);
      }, 100), { passive: true });
      backBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    // Global Click Delegation
    document.addEventListener("click", e => {
      const tool = e.target.closest('[data-open="tool"]');
      if (tool) { e.preventDefault(); openToolModal(tool.dataset.href, tool.dataset.id); return; }

      if (e.target.closest('[data-open="wechat"]')) { e.preventDefault(); toggleModal(wechatModal, true); return; }
      if (e.target.closest('[data-close="wechat"]')) { e.preventDefault(); toggleModal(wechatModal, false); return; }

      if (e.target.id === "toolClose") { e.preventDefault(); closeToolModal(); return; }

      const btn = e.target.closest(".copybtn");
      if (btn) {
        const text = btn.dataset.copy;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(() => {
            const raw = btn.textContent;
            btn.textContent = "OK!";
            btn.setAttribute('aria-label', '已复制');
            setTimeout(() => {
              btn.textContent = raw;
              btn.removeAttribute('aria-label');
            }, 1000);
          }).catch(err => {
            console.warn('复制失败:', err);
            // 降级方案：使用传统方法
            fallbackCopyText(text, btn);
          });
        } else {
          fallbackCopyText(text, btn);
        }
      }

      if (e.target.classList.contains("modal")) {
        if (e.target === toolModal) closeToolModal();
        else toggleModal(e.target, false);
      }
    });

    document.addEventListener("keydown", e => {
      if (e.key === "Escape") {
        closeToolModal();
        toggleModal(wechatModal, false);
      }
      // ✅ Tab 键陷阱：在模态框内循环焦点
      if (e.key === "Tab" && (toolModal?.classList.contains("open") || wechatModal?.classList.contains("open"))) {
        const modal = toolModal?.classList.contains("open") ? toolModal : wechatModal;
        if (!modal) return;
        const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    });
  });
})();