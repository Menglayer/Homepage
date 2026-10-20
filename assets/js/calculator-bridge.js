(function(){
  'use strict';
  const params=new URLSearchParams(location.search);
  const id=location.pathname.split('/').filter(Boolean).slice(-2)[0];
  const language=params.get('lang')==='en'?'en':'zh';
  document.body.dataset.calculator=id;
  document.documentElement.dataset.embedded=String(params.get('embed')==='1');
  function syncLanguage(){
    if(id==='axis'&&document.documentElement.lang.startsWith('en')!==(language==='en')) document.querySelector('#languageToggle')?.click();
    if(id==='tori'&&(document.querySelector('#languageButton')?.textContent.trim()==='EN')===(language==='en')) document.querySelector('#languageButton')?.click();
    if(id==='airdrop_universal') document.querySelector(language==='en'?'#enBtn':'#zhBtn')?.click();
    if(id==='borrow_risk') document.querySelector(language==='en'?'#btnEN':'#btnZH')?.click();
    if(id==='civcalc'&&language==='en'&&document.querySelector('#langText')?.textContent.includes('EN /')) document.querySelector('[onclick="toggleLang()"]')?.click();
  }
  function ready(){
    syncLanguage();
    if(id==='clammv3'&&language==='en'&&document.querySelector('h1')?.textContent.includes('区间')) document.querySelector('#btnLang')?.click();
    document.documentElement.lang=language==='en'?'en':'zh-CN';
    if(id==='civcalc'&&language==='en'){const title=document.querySelector('h1');if(title)title.textContent='Civilization Foundation DCA Calculator';}
    if(['apr','option','3j'].includes(id)&&language==='en'){const script=document.createElement('script');script.src='../../assets/js/calculator-locale.js';document.head.append(script);}
    if(id==='option'){
      const note=document.createElement('p');note.className='integration-data-note';note.textContent=language==='en'?'Model estimates: product tables and recommendations may include simulated quotes. A connected market feed does not verify executable exchange offers.':'模型测算提示：产品表格与推荐可能包含模拟报价。行情已连接不代表交易所产品报价可实时成交。';document.body.prepend(note);
    }
  }
  if(document.readyState!=='complete')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
  let scheduled=false;
  function notify(){if(scheduled||window.parent===window)return;scheduled=true;const enqueue=['axis','tori','3j'].includes(id)?queueMicrotask:requestAnimationFrame;enqueue(()=>{scheduled=false;const height=Math.ceil(document.body.getBoundingClientRect().height);if(height>0)window.parent.postMessage({type:'menglayer-calculator-size',id,height},location.origin);});}
  new ResizeObserver(notify).observe(document.body);
  window.addEventListener('load',notify);window.addEventListener('resize',notify);
  if(['axis','tori','3j'].includes(id)){document.addEventListener('toggle',notify,true);document.addEventListener('click',notify);document.addEventListener('input',notify);}
})();
