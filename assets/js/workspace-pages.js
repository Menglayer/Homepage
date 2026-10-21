(function(){
  'use strict';
  const {projectCalculatorIds,toolCalculatorIds,calculatorView}=window.WorkspaceRoutes;
  const calculatorIds=[...projectCalculatorIds,...toolCalculatorIds];
  const ratingOrder=['S+','S','S-','A+','A','A-','B+','B','B-','C+','C','C-'];
  const calculatorLabels={
    zh:{projectCalculators:'项目计算器',backTools:'全部工具'},
    en:{projectCalculators:'Project calculators',backTools:'All tools'}
  };
  const projectLabels={
    zh:{rating:'评级',raised:'融资金额',note:'项目评价',asOf:'清单更新',context:'评级为个人研究观点；融资金额沿用清单快照，下方列示部分公开投资机构，点击机构名称可查看披露来源。',investors:'投资机构',investorsUnknown:'机构未披露',fundingSource:'投资披露来源',undisclosed:'未披露',loading:'正在读取项目清单…',failed:'暂时无法读取项目清单',table:'空投项目评级与融资清单',source:'用户提供的项目清单'},
    en:{rating:'Rating',raised:'Raised',note:'What we know',asOf:'List updated',context:'Ratings reflect personal research views. Funding amounts retain the list snapshot; selected disclosed investors are shown below. Select an investor to view its source.',investors:'Investors',investorsUnknown:'Investors undisclosed',fundingSource:'Investment disclosure',undisclosed:'Undisclosed',loading:'Loading project list…',failed:'Project list unavailable',table:'Airdrop project ratings and funding',source:'User-provided project list'}
  };
  const labels={
    zh:{projects:'项目',calculators:'计算器',points:'空投与积分',yield:'收益与风险',all:'全部',select:'选择计算器',available:'已整合',open:'开始测算',original:'原版 ↗',back:'全部计算器',project:'项目',category:'分类',research:'研究说明',links:'链接',website:'官网',docs:'项目资料',calc:'计算器',projectNote:'收录已有研究工具的项目。估值、分配比例与奖励资格以项目公告为准。',projectCount:'个项目',calcCount:'个计算器',ready:'已有计算器',empty:'没有找到匹配内容',emptyHint:'换个关键词试试。',working:'当前计算器',frameNote:'沿用原计算公式与数据口径。外部数据的时间和可用性请以计算器内提示为准。',loading:'正在加载计算器…',slow:'加载较慢，可在新标签页打开。',source:'数据来源',snapshot:'公开页面快照',snapshotNote:'展示 Barker 公开页面的原始 APY 快照，未折算赎回等待期、服务费或分段额度；不是实时成交收益率。最新条件请查看原站。',fetched:'采集时间',updated:'源数据更新',refreshSource:'查看 Barker 最新活动 ↗',stale:'快照已超过 24 小时，请到原站核对最新数据。',activities:'个活动',exchanges:'家交易所',platform:'交易所',asset:'资产',apy:'源 APY',terms:'期限 / 赎回',limit:'额度 / 资格',status:'状态',details:'详情',active:'进行中',ended:'已结束',upcoming:'未开始',stablecoin:'稳定币',volatile:'其他资产',allAssets:'全部资产',allPlatforms:'全部交易所',allStatus:'全部状态',sort:'排序',apyDesc:'APY 从高到低',apyAsc:'APY 从低到高',ending:'到期时间',flexible:'活期',lock:'锁仓',days:'天',redemption:'赎回',notStated:'未注明',none:'无固定截止日期',start:'开始',end:'结束',minimum:'最低',maximum:'最高',newUser:'仅限新用户',tiered:'分段利率',fee:'收益服务费',viewCampaign:'Barker 活动详情 ↗',official:'活动公告 ↗',failed:'暂时无法读取活动快照',retry:'重试',conditions:'参与前核对额度、赎回时间与奖励条件。'},
    en:{projects:'Projects',calculators:'Calculators',points:'Airdrops & points',yield:'Yield & risk',all:'All',select:'Choose a calculator',available:'Integrated',open:'Calculate',original:'Original ↗',back:'All calculators',project:'Project',category:'Category',research:'Research notes',links:'Links',website:'Website',docs:'Resources',calc:'Calculator',projectNote:'Projects with existing research tools. Valuations, allocations, and eligibility are subject to project announcements.',projectCount:'projects',calcCount:'calculators',ready:'Calculator available',empty:'No matching results',emptyHint:'Try a different keyword.',working:'Current calculator',frameNote:'Original formulas and data conventions are retained. Check each calculator for data freshness and availability.',loading:'Loading calculator…',slow:'Taking longer than expected. Open in a new tab if needed.',source:'Data source',snapshot:'Public-page snapshot',snapshotNote:'Raw APY snapshot from Barker’s public page, before adjustments for redemption delays, service fees, or tiered limits. This is not a live quote. Check the source for current terms.',fetched:'Captured',updated:'Source updated',refreshSource:'Latest campaigns on Barker ↗',stale:'This snapshot is over 24 hours old. Verify current data at the source.',activities:'campaigns',exchanges:'exchanges',platform:'Exchange',asset:'Asset',apy:'Source APY',terms:'Lock / redemption',limit:'Limits / eligibility',status:'Status',details:'Details',active:'Active',ended:'Ended',upcoming:'Upcoming',stablecoin:'Stablecoins',volatile:'Other assets',allAssets:'All assets',allPlatforms:'All exchanges',allStatus:'All statuses',sort:'Sort',apyDesc:'APY: high to low',apyAsc:'APY: low to high',ending:'End date',flexible:'Flexible',lock:'Lock',days:'days',redemption:'Redemption',notStated:'Not specified',none:'No fixed end date',start:'Starts',end:'Ends',minimum:'Min',maximum:'Max',newUser:'New users only',tiered:'Tiered rates',fee:'Fee on earnings',viewCampaign:'Barker campaign details ↗',official:'Announcement ↗',failed:'Campaign snapshot unavailable',retry:'Retry',conditions:'Check limits, redemption timing, and reward conditions before participating.'}
  };
  let current,snapshot,pending,failed=false,frameTimer,projectData,projectPending,projectFailed=false;
  const filters={platform:'all',assets:'all',status:'active',sort:'apyDesc'};
  const platformNames={binance:'Binance',okx:'OKX',bybit:'Bybit',bitget:'Bitget',gate:'Gate',mexc:'MEXC'};
  const number=value=>value===null||value===undefined?'—':new Intl.NumberFormat(current.lang==='zh'?'zh-CN':'en-US',{maximumFractionDigits:2}).format(value);
  const pct=value=>typeof value==='number'&&Number.isFinite(value)?number(value*100)+'%':'—';
  const w=key=>labels[current.lang][key];
  const el=(tag,cls,label)=>current.make(tag,cls,label);
  const external=(title,url,cls='text-link')=>{const a=el('a',cls,title);try{const u=new URL(url);if(u.protocol!=='https:')return el('span','',title);a.href=u.href;}catch{return el('span','',title);}a.target='_blank';a.rel='noopener noreferrer';return a;};
  const match=value=>current.query.normalize('NFKC').trim().toLowerCase().split(/\s+/).every(token=>value.normalize('NFKC').toLowerCase().includes(token));
  const stamp=value=>{if(!value||!Number.isFinite(Date.parse(value)))return w('notStated');return new Intl.DateTimeFormat(current.lang==='zh'?'zh-CN':'en-GB',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date(value))+' UTC+8';};
  function empty(){const panel=el('div','empty-panel');panel.append(current.icon('search'),el('h2','',w('empty')),el('p','',w('emptyHint')));current.content.append(panel);}
  function render(context){current=context;clearTimeout(frameTimer);if(context.view==='earn'){renderEarn();return;}if(context.section==='calculator')renderCalculators();else renderProjects();}
  function renderProjects(){
    const copy=projectLabels[current.lang];
    if(!projectData){
      const panel=el('div','empty-panel'),status=el('p','',copy[projectFailed?'failed':'loading']);status.setAttribute('role','status');panel.append(status);
      if(projectFailed){const retry=el('button','small-button',w('retry'));retry.type='button';retry.addEventListener('click',()=>{projectFailed=false;current.content.replaceChildren();renderProjects();});panel.append(retry);}
      current.content.append(panel);if(!projectFailed)loadProjects();return;
    }
    const ranked=[...projectData.projects].sort((a,b)=>ratingOrder.indexOf(a.rating)-ratingOrder.indexOf(b.rating)||a.rank-b.rank);
    const list=ranked.filter(item=>match([item.name,item.rating,item.website,item.x,...(item.investors||[]).map(investor=>investor.name),...Object.values(item.note)].join(' ')));
    const updated=projectData.updatedAt||projectData.asOf;
    const info=el('div','ranking-intro'),meta=el('div','ranking-meta'),date=el('time','',updated);date.dateTime=updated;
    meta.append(el('span','',copy.asOf),date);const count=el('span','result-count',list.length+' / '+projectData.projects.length+' '+w('projectCount'));count.setAttribute('role','status');
    info.append(meta,count);current.content.append(info);
    if(!list.length){empty();return;}
    const wrap=el('div','ranking-wrap'),table=el('table','ranking-table'),head=el('thead'),hrow=el('tr');
    table.append(el('caption','sr-only',copy.table));
    ['#',w('project'),copy.rating,copy.raised,copy.note,w('links')].forEach(label=>{const cell=el('th','',label);cell.scope='col';hrow.append(cell);});head.append(hrow);table.append(head);const body=el('tbody');
    for(const item of list){
      const row=el('tr');row.dataset.project=item.id;row.append(el('td','ranking-number',String(ranked.indexOf(item)+1)));
      const title=el('th','ranking-project');title.scope='row';const identity=el('div','ranking-identity'),mark=el('span','ranking-logo'),fallback=el('span','ranking-monogram',item.name.slice(0,2).toUpperCase());fallback.setAttribute('aria-hidden','true');mark.append(fallback);
      if(item.logo){const img=el('img');img.src=item.logo;img.alt='';img.width=34;img.height=34;img.loading='lazy';img.decoding='async';img.addEventListener('error',()=>img.remove(),{once:true});mark.append(img);}
      const detail=el('div','ranking-project-copy'),name=external(item.name,item.website,'ranking-name'),sub=el('div','ranking-project-meta');sub.append(el('span','ranking-domain',new URL(item.website).hostname.replace(/^www\./,'')));
      if(item.calculatorId&&projectCalculatorIds.includes(item.calculatorId)){const calc=el('a','ranking-calculator',w('calc')+' ↗');calc.href=window.WorkspaceRoutes.href('airdrop','calculator/'+item.calculatorId);calc.setAttribute('aria-label',item.name+' · '+w('calc'));sub.append(calc);}
      detail.append(name,sub);identity.append(mark,detail);title.append(identity);row.append(title);
      const rating=el('td','ranking-rating');rating.dataset.label=copy.rating;const badge=el('span','rating-badge rating-'+item.rating.charAt(0).toLowerCase(),item.rating);badge.setAttribute('aria-label',copy.rating+' '+item.rating);rating.append(badge);row.append(rating);
      const raised=el('td','ranking-raised');raised.dataset.label=copy.raised;
      if(item.raisedUsd===null){raised.append(el('span','ranking-unreported',copy.undisclosed));}
      else{raised.append(el('strong','',new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',notation:'compact',maximumFractionDigits:2}).format(item.raisedUsd)));raised.title=new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(item.raisedUsd);}
      const investors=el('div','ranking-investors');investors.setAttribute('aria-label',copy.investors);
      if(item.investors?.length){for(const investor of item.investors.slice(0,3)){const link=external(investor.name,investor.url,'ranking-investor');link.setAttribute('aria-label',item.name+' · '+investor.name+' · '+copy.fundingSource);investors.append(link);}}
      else investors.append(el('span','ranking-investors-unknown',copy.investorsUnknown));
      raised.append(investors);
      row.append(raised);const note=el('td','ranking-note',item.note[current.lang]);note.dataset.label=copy.note;row.append(note);
      const links=el('td','ranking-links'),actions=el('div','ranking-actions');actions.append(projectLink(item.name+' · '+w('website'),item.website,'website'),projectLink(item.name+' · X',item.x,'x'));links.append(actions);row.append(links);body.append(row);
    }
    table.append(body);wrap.append(table);const foot=el('p','ranking-footnote',copy.context);current.content.append(wrap,foot);
  }
  function projectLink(label,url,type){
    const link=external('',url,'ranking-link');link.setAttribute('aria-label',label);link.title=label;
    const ns='http://www.w3.org/2000/svg',icon=document.createElementNS(ns,'svg');icon.setAttribute('viewBox','0 0 24 24');icon.setAttribute('aria-hidden','true');
    const paths=type==='website'?['M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z','M3 12h18M12 3c4 4.5 4 13.5 0 18-4-4.5-4-13.5 0-18Z']:['m5 4 14 16h-4L1 4h4Zm14 0L5 20'];
    for(const d of paths){const path=document.createElementNS(ns,'path');path.setAttribute('d',d);icon.append(path);}link.append(icon);return link;
  }
  function loadProjects(){
    if(projectPending)return;
    projectPending=fetch('/assets/data/airdrop-projects.json',{cache:'no-cache'}).then(response=>{if(!response.ok)throw new Error('Project list unavailable');return response.json();}).then(data=>{
      if(data.schemaVersion!==1||!/^\d{4}-\d{2}-\d{2}$/.test(data.asOf)||!Array.isArray(data.projects)||!data.projects.length)throw new Error('Invalid project list');
      for(const item of data.projects){if(!Number.isInteger(item.rank)||typeof item.name!=='string'||!/^([SABC])[+-]?$/.test(item.rating)||(item.raisedUsd!==null&&(!Number.isFinite(item.raisedUsd)||item.raisedUsd<0))||typeof item.note?.zh!=='string'||typeof item.note?.en!=='string')throw new Error('Invalid project');for(const url of [item.website,item.x]){if(new URL(url).protocol!=='https:')throw new Error('Invalid project URL');}}
      if(data.updatedAt&&!/^\d{4}-\d{2}-\d{2}$/.test(data.updatedAt))throw new Error('Invalid update date');
      for(const item of data.projects){if(item.investors!==undefined&&(!Array.isArray(item.investors)||item.investors.some(investor=>typeof investor?.name!=='string'||!investor.name.trim()||new URL(investor.url).protocol!=='https:')))throw new Error('Invalid investor');}
      projectData=data;projectFailed=false;
    }).catch(()=>{projectFailed=true;}).finally(()=>{projectPending=null;if(current?.view==='airdrop'&&current.section!=='calculator'){current.content.replaceChildren();renderProjects();}});
  }
  function renderCalculators(){
    const isProject=current.view==='airdrop',ids=isProject?projectCalculatorIds:toolCalculatorIds;
    const calculators=ids.map(id=>current.tools.find(tool=>tool.id===id)).filter(Boolean);
    const route=window.WorkspaceRoutes.href(current.view,'calculator');
    if(!current.id||!ids.includes(current.id)){
      const intro=el('div','section-intro');intro.append(el('p','',w('frameNote')),el('span','result-count',calculators.length+' '+w('calcCount')));current.content.append(intro);
      const filtered=calculators.filter(item=>match(item.id+' '+['zh','en'].map(lang=>{const copy=window.I18N[lang].cards[item.id];return copy.title+' '+copy.desc;}).join(' ')));
      if(!filtered.length){empty();return;}
      const sections=isProject?[[calculatorLabels[current.lang].projectCalculators,projectCalculatorIds]]:[[w('yield'),toolCalculatorIds]];
      for(const [title,groupIds] of sections){
        const items=filtered.filter(item=>groupIds.includes(item.id));if(!items.length)continue;const section=el('section','calculator-group');section.append(el('h2','catalog-group-title',title));const grid=el('div','calculator-grid');
        for(const item of items){const copy=current.copy(item),a=el('a','calculator-card');a.href=window.WorkspaceRoutes.href(current.view,'calculator/'+item.id);a.dataset.calculator=item.id;const top=el('div','calculator-card-top'),img=el('img');img.src=new URL(item.img,location.origin+'/').href;img.alt='';img.width=40;img.height=40;top.append(img,el('span','calculator-index',String(ids.indexOf(item.id)+1).padStart(2,'0')));const foot=el('div','calculator-card-foot');foot.append(el('span','',w('available')),el('span','',w('open')+' ↗'));a.append(top,el('h3','',copy.title),el('p','',copy.desc),foot);grid.append(a);}section.append(grid);current.content.append(section);
      }return;
    }
    const item=calculators.find(tool=>tool.id===current.id),copy=current.copy(item),toolbar=el('div','calculator-toolbar'),back=el('a','text-link','← '+calculatorLabels[current.lang][isProject?'projectCalculators':'backTools']);back.href=isProject?route:window.WorkspaceRoutes.href('tools');const select=el('select','calculator-select');select.setAttribute('aria-label',w('select'));
    if(!isProject){for(const tool of calculators){const option=el('option','',current.copy(tool).title);option.value=tool.id;option.selected=tool.id===item.id;select.append(option);}select.addEventListener('change',()=>current.navigate(current.view,'calculator/'+select.value));toolbar.append(back,select,external(w('original'),item.href));current.content.append(toolbar);
    const banner=el('div','calculator-banner');banner.append(el('p','section-kicker',w('working').toUpperCase()),el('h2','',copy.title),el('p','',copy.desc));current.content.append(banner);}
    const status=el('div','calculator-loading',w('loading'));status.setAttribute('role','status');const frame=el('iframe','calculator-frame');frame.title=copy.title;frame.id='calculatorFrame';const url=new URL('/calculators/'+item.id+'/index.html',location.origin);url.searchParams.set('embed','1');url.searchParams.set('lang',current.lang);frame.src=url.href;frame.referrerPolicy='no-referrer';
    frame.addEventListener('load',()=>{status.hidden=true;clearTimeout(frameTimer);});frameTimer=setTimeout(()=>{if(status.isConnected&&!status.hidden)status.textContent=w('slow');},15000);current.content.append(status,frame,el('p','calculator-footnote',w('frameNote')));
  }
  function campaignStatus(item){const now=Date.now();if(item.pool_status==='ended'||item.is_active===0||(item.end_date&&Date.parse(item.end_date)<=now))return 'ended';if(item.start_date&&Date.parse(item.start_date)>now)return 'upcoming';return 'active';}
  function choose(label,key,options){const wrap=el('label','earn-filter');wrap.append(el('span','',label));const select=el('select');select.dataset.earnFilter=key;select.setAttribute('aria-label',label);for(const [value,title] of options){const option=el('option','',title);option.value=value;option.selected=filters[key]===value;select.append(option);}select.addEventListener('change',()=>{filters[key]=select.value;current.content.replaceChildren();renderEarn();current.content.querySelector('[data-earn-filter="'+key+'"]')?.focus({preventScroll:true});});wrap.append(select);return wrap;}
  function renderEarn(){
    if(!snapshot){const panel=el('div','empty-panel');panel.append(el('h2','',failed?w('failed'):(current.lang==='zh'?'正在读取活动快照…':'Loading campaign snapshot…')),external(w('refreshSource'),'https://app.barker.money/campaigns'));if(failed){const retry=el('button','small-button',w('retry'));retry.addEventListener('click',()=>{failed=false;loadSnapshot();current.content.replaceChildren();renderEarn();});panel.append(retry);}current.content.append(panel);if(!failed)loadSnapshot();return;}
    const source=el('div','source-banner'),sourceLine=el('div','source-line');sourceLine.append(el('span','',w('source')+' '),external('@BarkerMoneyX','https://x.com/BarkerMoneyX'),el('span','snapshot-badge',w('snapshot')));const captured=el('time','source-timestamp',w('fetched')+' '+stamp(snapshot.fetchedAt));captured.dateTime=snapshot.fetchedAt;sourceLine.append(captured);source.append(sourceLine,el('p','',w('snapshotNote')),external(w('refreshSource'),snapshot.source));if(Date.now()-Date.parse(snapshot.fetchedAt)>86400000)source.append(el('p','stale-note',w('stale')));current.content.append(source);
    const toolbar=el('div','earn-filters'),platforms=[...new Set(snapshot.campaigns.map(item=>item.protocol_uid))].sort();toolbar.append(choose(w('platform'),'platform',[['all',w('allPlatforms')],...platforms.map(id=>[id,platformNames[id]||id])]),choose(w('asset'),'assets',[['all',w('allAssets')],['stablecoin',w('stablecoin')],['volatile',w('volatile')]]),choose(w('status'),'status',[['all',w('allStatus')],['active',w('active')],['ended',w('ended')],['upcoming',w('upcoming')]]),choose(w('sort'),'sort',[['apyDesc',w('apyDesc')],['apyAsc',w('apyAsc')],['ending',w('ending')]]));current.content.append(toolbar);
    const rows=snapshot.campaigns.filter(item=>(filters.platform==='all'||filters.platform===item.protocol_uid)&&(filters.assets==='all'||(filters.assets==='stablecoin'?item.asset_class==='stablecoin':item.asset_class!=='stablecoin'))&&(filters.status==='all'||campaignStatus(item)===filters.status)&&match([item.campaign_name,item.protocol_uid,platformNames[item.protocol_uid],item.asset_symbol,item.product_type,...Object.values(item.product_type_i18n||{}),...Object.values(item.notes_i18n||{})].join(' '))).sort((a,b)=>filters.sort==='ending'?(Date.parse(a.end_date)||Infinity)-(Date.parse(b.end_date)||Infinity):((a.campaign_apy??-Infinity)-(b.campaign_apy??-Infinity))*(filters.sort==='apyAsc'?1:-1));
    const summary=el('div','earn-summary');summary.append(el('span','',rows.length+' '+w('activities')+' · '+new Set(rows.map(item=>item.protocol_uid)).size+' '+w('exchanges')),el('span','',w('conditions')));current.content.append(summary);if(!rows.length){empty();return;}
    const wrap=el('div','earn-table'),headings=el('div','earn-row earn-table-head');['asset','platform','apy','terms','limit','status','details'].forEach(key=>headings.append(el('span','',w(key))));wrap.append(headings);
    for(const item of rows){
      const article=el('article','earn-entry');article.dataset.campaign=String(item.id);const row=el('div','earn-row'),asset=el('div','earn-asset');asset.append(el('strong','',item.campaign_name),el('span','',item.product_type_i18n?.[current.lang]||({onchain_earn:{zh:'链上赚币',en:'On-chain Earn'},simple_earn:{zh:'简单赚币',en:'Simple Earn'},staking:{zh:'质押',en:'Staking'}}[item.product_type]?.[current.lang])||item.product_type||'—'));row.append(asset);
      const platform=el('div','earn-platform',platformNames[item.protocol_uid]||item.protocol_uid);platform.dataset.label=w('platform');row.append(platform);const rate=el('div','earn-apy');rate.dataset.label=w('apy');rate.append(el('strong','',pct(item.campaign_apy)));if(item.tier_details?.length)rate.append(el('span','',w('tiered')));row.append(rate);
      const terms=el('div','earn-terms');terms.dataset.label=w('terms');terms.append(el('span','',item.lock_days===0?w('flexible'):item.lock_days===null?w('notStated'):w('lock')+' '+number(item.lock_days)+' '+w('days')),el('small','',w('redemption')+' '+(item.redemption_days===null?w('notStated'):'T+'+number(item.redemption_days))));row.append(terms);
      const amount=el('div','earn-limit');amount.dataset.label=w('limit');amount.append(el('span','',w('minimum')+' '+number(item.min_amount)+' '+item.asset_symbol),el('small','',item.is_new_user_only?w('newUser'):w('maximum')+' '+number(item.max_amount)));row.append(amount);const status=el('div','earn-status');status.append(el('span','status-pill status-'+campaignStatus(item),w(campaignStatus(item))));row.append(status);
      const details=el('details','campaign-details'),toggle=el('summary','small-button',w('details')+' +');toggle.setAttribute('aria-label',item.campaign_name+' · '+(platformNames[item.protocol_uid]||item.protocol_uid)+' · '+w('details'));details.append(toggle);const detail=el('div','campaign-detail-body'),dates=el('div','detail-dates');dates.append(el('p','',w('start')+': '+stamp(item.start_date)),el('p','',w('end')+': '+(item.end_date?stamp(item.end_date):w('none'))),el('p','',w('updated')+': '+stamp(item.updated_at)));detail.append(dates);
      const note=item.notes_i18n?.[current.lang]||item.notes_i18n?.en||item.notes;if(typeof note==='string'&&note)detail.append(el('p','campaign-notes',note));if(item.service_fee_pct!==null)detail.append(el('p','',w('fee')+': '+number(item.service_fee_pct)+'%'));if(item.tier_details?.length){const tiers=el('div','tier-list');tiers.append(el('strong','',w('tiered')));for(const tier of item.tier_details)tiers.append(el('p','',number(tier.min)+' – '+(tier.max===null?'∞':number(tier.max))+' '+(tier.asset||item.asset_symbol)+' · '+pct(tier.apy)));detail.append(tiers);}const sourceLinks=el('div','campaign-links');sourceLinks.append(external(w('viewCampaign'),'https://app.barker.money/campaigns/'+item.id));if(item.announcement_url)sourceLinks.append(external(w('official'),item.announcement_url));detail.append(sourceLinks);details.append(detail);row.append(details);article.append(row);wrap.append(article);
    }current.content.append(wrap);
  }
  function loadSnapshot(){if(pending)return;pending=fetch('/assets/data/barker-campaigns.json',{cache:'no-cache'}).then(response=>{if(!response.ok)throw new Error('Snapshot unavailable');return response.json();}).then(data=>{if(data.schemaVersion!==1||!Array.isArray(data.campaigns)||!Number.isFinite(Date.parse(data.fetchedAt)))throw new Error('Invalid snapshot');snapshot=data;failed=false;}).catch(()=>{failed=true;}).finally(()=>{pending=null;if(current?.view==='earn'){current.content.replaceChildren();renderEarn();}});}
  window.addEventListener('message',event=>{const frame=document.getElementById('calculatorFrame');if(event.origin!==location.origin||event.source!==frame?.contentWindow||event.data?.type!=='menglayer-calculator-size'||event.data.id!==current?.id)return;const height=Number(event.data.height);if(Number.isFinite(height)&&height>0)frame.style.height=Math.max(400,Math.min(16000,height+8))+'px';});
  window.WorkspacePages={render,calculatorIds,projectCalculatorIds,toolCalculatorIds,calculatorView};
})();
