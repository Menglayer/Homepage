(function () {
  'use strict';

  // Keep shared search links from the original homepage working.
  if (new URLSearchParams(location.search).has('q')) {
    location.replace('app.html' + location.search + location.hash);
    return;
  }

  const copy = {
    zh: {
      title: 'MengLayer LP DAO — 私人收益机会，让价值生长',
      description: '华语 DeFi LP 的私人流动性社区。专属 Deal，合作共赢。与 MengLayer 一起探索私人收益机会、专属收益机会与价值投资。',
      skip: '跳至正文', navLabel: '主导航', navValue: '价值投资', navPerformance: '收益表现', navCommunity: '萌芽社区', contact: '聊聊合作',
      heroLine1: '私人收益机会', heroLine2: '让价值生长',
      heroIntro1: '华语 DeFi LP 的私人流动性社区。', heroIntro2: '专属 Deal，合作共赢。', followX: '在 X 上关注我',
      portraitAlt: '陈小萌的个人头像：蓝色蝴蝶与花丛中的银发角色',
      participatedProjects: '累计参与项目', cumulativeCapital: '累计投入资金', operatingPeriod: '运行时间',
      privateMemberLabel: 'Private Member：联系私人社群助手',
      opportunitiesLabel: '我们的方向',
      opportunity1Title: '私人会员', opportunity1Desc: '聚焦 DeFi LP，在私人社群里交流研究与参与机会。',
      opportunity2Title: '专属收益机会', opportunity2Desc: '连接项目与社区，发现值得参与的专属 Deal。',
      opportunity3Title: '价值投资', opportunity3Desc: '以时间为尺度，寻找能够持续生长的价值。',
      timeFriends: '时间的朋友', timeyieldDescription: '与时间同行，让长期参与留下记录。',
      foundedLabel: '创建于', archiveLabel: '项目在案', longTermExploration: '长期探索', infinityLabel: '无限',
      projectsLabel: '合作项目', projectListLabel: '合作项目列表', projectsTitle: '部分合作项目',
      performanceTitle: '用结果，记录长期。', performanceDescription: '从参与资金到累计收益，记录 MengLayer LP DAO 的长期表现。',
      capitalLabel: '参与资金', capitalNote: '累计参与规模', profitLabel: '累计盈利', profitNote: '社区累计收益', yieldLabel: '年化收益率', yieldNote: '历史年化表现',
      dataSource: '社区汇总数据', dataScope: '资金与收益按社区统计口径展示。', openApp: '打开 APP',
      communityLine1: '私人交流，', communityLine2: '也有公开分享。',
      communityDescription: '私人社群里深挖 DeFi LP 机会，公开渠道里分享研究、工具与思考。你可以先从 X 和 Telegram 了解我们，再进一步加入私人交流。',
      joinCommunity: '加入公开社区', privateCommunity: '了解私人社群', publicChannels: '公开分享',
      footerMotto: '独立思考，长期生长。', footerContact: '商务合作 ↗', footerNote: '历史表现仅供参考，请保持独立判断。', backTop: '回到顶部 ↑',
      menuOpen: '打开导航', menuClose: '关闭导航', homeLabel: 'MengLayer 首页', mobileNavLabel: '手机导航', portraitLabel: 'MengLayer LP DAO 社区名片'
    },
    en: {
      title: 'MengLayer LP DAO — Private yield. Shared growth.',
      description: 'A private liquidity community for Chinese-speaking DeFi LPs. Exclusive deals, shared participation, and a long-term perspective.',
      skip: 'Skip to content', navLabel: 'Main navigation', navValue: 'Value investing', navPerformance: 'Performance', navCommunity: 'Community', contact: 'Let’s talk',
      heroLine1: 'Private yield.', heroLine2: 'Shared growth',
      heroIntro1: 'A private liquidity community for Chinese-speaking DeFi LPs.', heroIntro2: 'Exclusive deals. Growing together.', followX: 'Follow me on X',
      portraitAlt: 'MengLayer’s avatar: a silver-haired character among blue butterflies and flowers',
      participatedProjects: 'Projects', cumulativeCapital: 'Cumulative capital', operatingPeriod: 'Operating period',
      privateMemberLabel: 'Private Member: contact our Telegram assistant',
      opportunitiesLabel: 'Our focus',
      opportunity1Title: 'Private membership', opportunity1Desc: 'Discuss DeFi LP research and participation opportunities in the private community.',
      opportunity2Title: 'Exclusive opportunities', opportunity2Desc: 'Connecting projects and the community through exclusive deals.',
      opportunity3Title: 'Value investing', opportunity3Desc: 'Seeking lasting value, with time as our perspective.',
      timeFriends: 'FRIENDS OF TIME', timeyieldDescription: 'A record of participation, built over time.',
      foundedLabel: 'Founded in', archiveLabel: 'Projects in archive', longTermExploration: 'Long-term exploration', infinityLabel: 'Infinity',
      projectsLabel: 'Collaborating projects', projectListLabel: 'Collaborating projects', projectsTitle: 'SELECTED COLLABORATIONS',
      performanceTitle: 'A record, built over time.', performanceDescription: 'Capital participation and cumulative returns across the MengLayer LP DAO community.',
      capitalLabel: 'Capital participation', capitalNote: 'Cumulative participation', profitLabel: 'Cumulative profit', profitNote: 'Community aggregate', yieldLabel: 'Annualized yield', yieldNote: 'Historical performance',
      dataSource: 'Community-reported figures', dataScope: 'Capital and returns follow the community’s reporting basis.', openApp: 'Open APP',
      communityLine1: 'Private conversations.', communityLine2: 'Public perspectives.',
      communityDescription: 'We explore DeFi LP opportunities privately and share research, tools, and ideas publicly. Get to know us on X and Telegram, then explore the private community.',
      joinCommunity: 'Join the public community', privateCommunity: 'Private community', publicChannels: 'PUBLIC CHANNELS',
      footerMotto: 'Independent minds. Shared growth.', footerContact: 'Get in touch ↗', footerNote: 'Historical figures are for reference. Think independently.', backTop: 'Back to top ↑',
      menuOpen: 'Open navigation', menuClose: 'Close navigation', homeLabel: 'MengLayer home', mobileNavLabel: 'Mobile navigation', portraitLabel: 'MengLayer LP DAO community profile'
    }
  };

  const languageButton = document.getElementById('languageButton');
  const menuButton = document.getElementById('menuButton');
  const mobileNav = document.getElementById('mobileNav');
  const projectsSection = document.querySelector('.projects-section');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let lang = 'zh';
  try { if (localStorage.getItem('lang') === 'en') lang = 'en'; } catch (_) { /* Storage is optional. */ }

  function setMenu(open) {
    mobileNav.hidden = !open;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', copy[lang][open ? 'menuClose' : 'menuOpen']);
  }

  function updateProjectMotion() {
    if (!projectsSection) return;
    projectsSection.classList.toggle('is-animated', !reducedMotion.matches);
  }

  function setupProjects() {
    const list = document.querySelector('[data-project-list]');
    if (!list) return;
    // This copy makes the loop continuous and stays outside the accessibility tree.
    const loopCopy = list.cloneNode(true);
    loopCopy.removeAttribute('data-project-list');
    loopCopy.removeAttribute('data-copy-aria');
    loopCopy.removeAttribute('aria-label');
    loopCopy.setAttribute('aria-hidden', 'true');
    loopCopy.inert = true;
    loopCopy.classList.add('is-copy');
    loopCopy.querySelectorAll('img').forEach(img => { img.loading = 'eager'; });
    list.parentElement.appendChild(loopCopy);
    reducedMotion.addEventListener('change', updateProjectMotion);
    updateProjectMotion();
  }

  function applyLanguage() {
    const dict = copy[lang];
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    document.title = dict.title;
    for (const selector of ['meta[name="description"]', 'meta[property="og:description"]', 'meta[name="twitter:description"]']) {
      document.querySelector(selector).content = dict.description;
    }
    for (const selector of ['meta[property="og:title"]', 'meta[name="twitter:title"]']) {
      document.querySelector(selector).content = dict.title;
    }
    document.querySelector('meta[property="og:locale"]').content = lang === 'zh' ? 'zh_CN' : 'en_US';
    document.querySelectorAll('[data-copy]').forEach(el => { el.textContent = dict[el.dataset.copy] || el.textContent; });
    document.querySelectorAll('[data-copy-aria]').forEach(el => { el.setAttribute('aria-label', dict[el.dataset.copyAria]); });
    document.querySelectorAll('[data-copy-alt]').forEach(el => { el.alt = dict[el.dataset.copyAlt]; });
    document.querySelector('.heading-period').textContent = lang === 'en' ? '.' : '。';
    languageButton.textContent = lang === 'zh' ? 'EN' : '中';
    languageButton.setAttribute('aria-label', lang === 'zh' ? 'Switch to English' : '切换到中文');
    setMenu(false);
    updateProjectMotion();
  }

  languageButton.addEventListener('click', () => {
    lang = lang === 'zh' ? 'en' : 'zh';
    try { localStorage.setItem('lang', lang); } catch (_) { /* Switching does not depend on persistence. */ }
    applyLanguage();
  });
  menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  mobileNav.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('click', e => { if (!e.target.closest('.site-header')) setMenu(false); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !mobileNav.hidden) { setMenu(false); menuButton.focus(); }
  });
  window.matchMedia('(min-width: 681px)').addEventListener('change', e => { if (e.matches) setMenu(false); });

  // A single reporting snapshot is shared by the hero, archive and performance sections.
  document.querySelectorAll('[data-stat]').forEach(el => {
    const value = window.HOME_STATS?.[el.dataset.stat];
    if (value !== undefined && value !== null) el.textContent = String(value);
  });
  document.getElementById('year').textContent = String(new Date().getFullYear());
  setupProjects();
  applyLanguage();
})();
