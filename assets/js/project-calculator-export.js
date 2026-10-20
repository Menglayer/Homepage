(function () {
  'use strict';
  function ready() {
    const root = document.querySelector('.pc-root');
    if (!root) return;
    const id = document.body.dataset.calculator;
    const name = id === '3j' ? '3Jane' : id.toUpperCase();
    const en = new URLSearchParams(location.search).get('lang') === 'en';
    const text = (zh, english) => en ? english : zh;
    const make = (tag, className, content) => {
      const node = document.createElement(tag);
      node.className = className;
      if (content) node.textContent = content;
      return node;
    };
    const head = make('div', 'pc-document-head');
    const title = make('div', 'pc-document-title', name + text(' 计算器', ' calculator'));
    title.prepend(make('span', 'pc-document-brand', 'MengLayer'));
    const actions = make('div', 'pc-export-actions');
    const print = make('button', '', text('打印 / PDF', 'Print / PDF'));
    const download = make('button', '', text('下载截图', 'Download PNG'));
    print.type = download.type = 'button';
    actions.append(print, download);
    head.append(title, actions);
    const status = make('p', 'pc-export-status');
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    const stamp = make('p', 'pc-document-stamp');
    const updateStamp = () => {
      stamp.textContent = text('生成时间：', 'Generated: ') + new Date().toLocaleString(en ? 'en-GB' : 'zh-CN', {hour12:false}) + ' · menglayer.cc/airdrop/' + id + '/';
    };
    root.prepend(head, status);
    root.append(stamp);

    let collapsed = null;
    function beforePrint() {
      if (collapsed) return;
      updateStamp();
      collapsed = [...root.querySelectorAll('details:not([open])')];
      collapsed.forEach(node => {node.open = true;});
    }
    function afterPrint() {
      collapsed?.forEach(node => {node.open = false;});
      collapsed = null;
    }
    window.addEventListener('beforeprint', beforePrint);
    window.addEventListener('afterprint', afterPrint);
    print.addEventListener('click', () => window.print());

    let library;
    let fontCss;
    let lastUrl;
    async function embeddedFont() {
      if (!fontCss) fontCss = fetch('/assets/fonts/pretendard-latin.woff2').then(response => {
        if (!response.ok) throw new Error('Font unavailable');
        return response.blob();
      }).then(blob => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => resolve('@font-face{font-family:Pretendard;src:url(' + reader.result + ') format("woff2")}');
        reader.readAsDataURL(blob);
      }));
      try {return await fontCss;} catch {fontCss = null; return '';}
    }
    function renderer() {
      if (!library) library = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = '/assets/vendor/html-to-image/dist/html-to-image.js';
        script.onload = () => resolve(window.htmlToImage);
        script.onerror = () => {script.remove(); library = null; reject(new Error('Image renderer unavailable'));};
        document.head.append(script);
      });
      return library;
    }
    download.addEventListener('click', async () => {
      if (download.disabled) return;
      print.disabled = download.disabled = true;
      download.textContent = text('正在生成…', 'Generating…');
      status.textContent = '';
      try {
        const [image, fontEmbedCSS] = await Promise.all([renderer(), embeddedFont()]);
        await document.fonts.ready;
        updateStamp();
        // Clone once so live data and user edits cannot change the image mid-export.
        const snapshot = root.cloneNode(true);
        const inputs = root.querySelectorAll('input,select,textarea');
        snapshot.querySelectorAll('input,select,textarea').forEach((node, index) => {
          const source = inputs[index];
          node.value = source.value;
          if (node.tagName === 'INPUT') node.checked = source.checked;
        });
        const width = Math.ceil(root.getBoundingClientRect().width);
        snapshot.classList.add('pc-snapshot');
        snapshot.setAttribute('aria-hidden', 'true');
        snapshot.inert = true;
        snapshot.style.width = width + 'px';
        snapshot.style.position = 'fixed';
        snapshot.style.left = '-100000px';
        snapshot.style.top = '0';
        document.body.append(snapshot);
        try {
          const height = Math.ceil(snapshot.getBoundingClientRect().height);
          // Bound canvas memory and dimensions on mobile browsers and long pages.
          const pixelRatio = Math.min(2, Math.sqrt(12000000 / (width * height)), 16000 / Math.max(width, height));
          const blob = await image.toBlob(snapshot, {
            width, height, pixelRatio, backgroundColor:'#f3f8fc', fontEmbedCSS, skipFonts:!fontEmbedCSS,
            style:{position:'static',left:'auto',top:'auto',margin:'0'},
            filter:node => {
              if (!node.tagName) return true;
              if (node.matches('.pc-export-actions,.pc-export-status,.pc-sr-only') || getComputedStyle(node).display === 'none') return false;
              // Closed details must not fetch hidden images or contribute content.
              return !(node.parentElement?.tagName === 'DETAILS' && !node.parentElement.open && node.tagName !== 'SUMMARY');
            }
          });
          if (!blob || !blob.size) throw new Error('Empty image');
          if (lastUrl) URL.revokeObjectURL(lastUrl);
          lastUrl = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = lastUrl;
          link.download = 'MengLayer-' + name + '-' + new Date().toISOString().slice(0,10) + '.png';
          document.body.append(link);
          link.click();
          link.remove();
          status.textContent = text('截图已生成，包含当前展开的内容。', 'Screenshot ready, including the currently expanded sections.');
          const save = link.cloneNode();
          save.textContent = text('再次保存 PNG ↗', 'Save PNG again ↗');
          status.append(' ', save);
        } finally {
          snapshot.remove();
        }
      } catch (error) {
        console.warn('Calculator image export failed', error);
        status.textContent = text('截图生成失败，请重试，或使用「打印 / PDF」保存。', 'Could not create the screenshot. Retry or use Print / PDF.');
      } finally {
        print.disabled = download.disabled = false;
        download.textContent = text('下载截图', 'Download PNG');
      }
    });
    window.addEventListener('pagehide', event => {if (!event.persisted && lastUrl) URL.revokeObjectURL(lastUrl);});
  }
  if (document.readyState !== 'complete') document.addEventListener('DOMContentLoaded',ready,{once:true}); else ready();
})();
