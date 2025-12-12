(function () {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);

  // Configuration
  const FORCE_TOP_DOMAINS = [
    "addrproof.top", "alipay.com", "stripe.com", "paypal.com"
  ];
  const IFRAME_ALLOW_HOSTS = ["menglayer.cc"];

  // Tiny placeholder used for lazy-loaded icons
  const TRANSPARENT_PIXEL = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
  const FALLBACK_ICON = "assets/images/favicon.jpg";

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

    if (window.__searchTextCache) window.__searchTextCache.clear();
    renderCards();
    // ✅ 重新观察新渲染的图片（解决语言切换后图标变白的问题）
    setupImageObserver();

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
        scored.forEach(({ item }) => {
          const isTool = container === "tools";
          const openBlank = isTool ? (!canIframe(item.href) || item.open === "blank" || shouldForceTop(item.href)) : true;
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
          // Lazy-load via IntersectionObserver (fallbacks to native lazy-loading)
          img.dataset.src = item.img;
          img.src = TRANSPARENT_PIXEL;

          img.alt = dictCards[item.id]?.title || item.id;
          img.loading = "lazy";
          img.decoding = "async";
          img.style.opacity = "0";
          img.style.transition = "opacity 0.4s";

          img.onload = function () {
            // Ignore placeholder load; only fade in after real src is applied
            if (this.dataset && this.dataset.src) return;
            this.style.opacity = "1";
            iconDiv.classList.add("loaded");
          };

          img.onerror = function () {
            this.onerror = null;
            // Stop trying to lazy-load and show a deterministic fallback
            try { delete this.dataset.src; } catch (e) { this.removeAttribute("data-src"); }
            this.src = FALLBACK_ICON;
            this.style.opacity = "1";
            iconDiv.classList.add("loaded");
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

    // ✅ 渲染完成后，立即检查并加载已在视口中的图片
    requestAnimationFrame(() => {
      document.querySelectorAll('img[data-src]').forEach(img => {
        const rect = img.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight + 100 && rect.bottom > -100;
        if (isVisible) {
          const src = img.dataset.src;
          if (src) {
            img.src = src;
            img.removeAttribute('data-src');
            img.removeAttribute('data-observed');
            if (__imageObserver) __imageObserver.unobserve(img);
          }
        }
      });
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
  let lastToolTrigger = null;
  let lastToolUrl = "";


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
    // 记录触发元素，关闭时恢复焦点
    lastToolTrigger = document.activeElement;

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
    lastToolUrl = url;

    // ✅ 无障碍：隐藏并禁用背景
    const appRoot = document.getElementById("app");
    if (appRoot) {
      try { appRoot.inert = true; } catch (e) { }
      appRoot.setAttribute("aria-hidden", "true");
    }
    document.documentElement.classList.add("modal-open");
    document.body.classList.add("modal-open");


    toolModal.classList.add("open");
    toolModal.setAttribute("aria-hidden", "false");

    // ✅ 焦点管理：将焦点移到模态框
    const closeBtn = $("#toolClose");
    if (closeBtn) {
      setTimeout(() => closeBtn.focus(), 100);
    }
  }
  function closeToolModal() {
    resetLoader();
    if (!toolModal) return;
    toolModal.classList.remove("open");
    toolModal.setAttribute("aria-hidden", "true");
    if (toolFrame) toolFrame.src = "about:blank";

    // ✅ 恢复背景交互
    const appRoot = document.getElementById("app");
    if (appRoot) {
      try { appRoot.inert = false; } catch (e) { }
      appRoot.removeAttribute("aria-hidden");
    }
    // Keep scroll lock if any other modal is still open
    const wm = document.getElementById("wechatModal");
    const anyOpen = !!(wm && wm.classList.contains("open"));
    document.documentElement.classList.toggle("modal-open", anyOpen);
    document.body.classList.toggle("modal-open", anyOpen);
    // ✅ 恢复焦点
    if (lastToolTrigger && typeof lastToolTrigger.focus === "function") {
      lastToolTrigger.focus();
    }
    lastToolTrigger = null;
    lastToolUrl = "";
  }



  if (toolFrame) on(toolFrame, "load", resetLoader);

  // WeChat Modal
  const wechatModal = $("#wechatModal");

  function toggleModal(m, show) {
    if (!m) return;
    m.classList.toggle("open", show);
    m.setAttribute("aria-hidden", show ? "false" : "true");

    // ✅ Scroll lock via CSS class (and keep it if another modal is open)
    const anyOpen = !!(show || (toolModal && toolModal.classList.contains("open")));
    document.documentElement.classList.toggle("modal-open", anyOpen);
    document.body.classList.toggle("modal-open", anyOpen);

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
  let __imageObserver = null;
  function setupImageObserver() {
    if (!('IntersectionObserver' in window)) {
      // 降级：如果没有 IntersectionObserver，直接加载所有图片
      document.querySelectorAll('img[data-src]').forEach(img => {
        const src = img.dataset.src;
        if (src) {
          img.src = src;
          img.removeAttribute('data-src');
        }
      });
      return;
    }

    if (!__imageObserver) {
      __imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.dataset && img.dataset.src;
            if (src) {
              img.src = src;
              try { delete img.dataset.src; } catch (e) { img.removeAttribute('data-src'); }
            }
            observer.unobserve(img);
          }
        });
      }, { rootMargin: '50px' });
    }

    // 观察所有未观察的懒加载图片
    document.querySelectorAll('img[data-src]:not([data-observed])').forEach(img => {
      img.setAttribute('data-observed', '1');
      __imageObserver.observe(img);

      // ✅ 如果图片已经在视口中，立即加载（解决语言切换后图标变白的问题）
      const rect = img.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight + 50 && rect.bottom > -50;
      if (isVisible) {
        const src = img.dataset.src;
        if (src) {
          img.src = src;
          img.removeAttribute('data-src');
          img.removeAttribute('data-observed');
          __imageObserver.unobserve(img);
        }
      }
    });
  }


  // Init
  document.addEventListener("DOMContentLoaded", () => {
    // ✅ PWA: Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./assets/js/sw.js').catch(() => { });
    }

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
      // ✅ 支持 URL 参数：/?q=xxx
      const params = new URLSearchParams(window.location.search);
      const initialQ = params.get("q") || "";
      if (initialQ) {
        searchInput.value = initialQ;
        searchQuery = initialQ;
      }

      const syncUrl = (q) => {
        const p = new URLSearchParams(window.location.search);
        if (q && q.trim()) p.set("q", q.trim());
        else p.delete("q");
        const qs = p.toString();
        const next = window.location.pathname + (qs ? `?${qs}` : "") + window.location.hash;
        window.history.replaceState(null, "", next);
      };

      // ✅ 搜索防抖 + 同步 URL（方便分享）
      on(searchInput, "input", debounce(() => {
        searchQuery = searchInput.value;
        syncUrl(searchQuery);
        renderCards();
      }, 250));
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

      if (e.target.id === "toolOpenNewtab") {
        e.preventDefault();
        const url = (toolFrame && toolFrame.src) ? toolFrame.src : lastToolUrl;
        if (url && url !== "about:blank") window.open(url, "_blank", "noopener,noreferrer");
        closeToolModal();
        return;
      }

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

  // ✅ Observe newly rendered lazy images
  setupImageObserver();

})();