// Read only data already published in Barker's public HTML. No private API or origin spoofing.
import {mkdir,writeFile} from 'node:fs/promises';
const source='https://app.barker.money/campaigns';
const response=await fetch(source);
if(!response.ok) throw new Error('Barker public page: '+response.status);
const html=await response.text();
const streams=[...html.matchAll(/self[.]__next_f[.]push[(]([[][^<]*?)[)]<[/]script>/g)].map(match=>{try{return JSON.parse(match[1])[1]||'';}catch{return '';}}).join('');
const marker='"initialCampaigns":';
const start=streams.indexOf(marker);
if(start<0) throw new Error('Public campaign data missing; previous snapshot is unchanged.');
let begin=streams.indexOf('[',start+marker.length),depth=0,quoted=false,escape=false,end=-1;
for(let i=begin;i<streams.length;i++){const c=streams[i];if(quoted){if(escape)escape=false;else if(c==='\\')escape=true;else if(c==='"')quoted=false;}else if(c==='"')quoted=true;else if(c==='[')depth++;else if(c===']'&&--depth===0){end=i+1;break;}}
if(begin<0||end<0) throw new Error('Invalid public campaign JSON');
const rows=JSON.parse(streams.slice(begin,end));
if(!Array.isArray(rows)||!rows.length||rows.some(x=>!Number.isInteger(x.id)||typeof x.protocol_uid!=='string')) throw new Error('Campaign validation failed');
const fields=['id','campaign_name','protocol_uid','asset_symbol','asset_class','campaign_apy','base_apy','reward_apy','reward_asset','lock_days','tier_details','min_amount','max_amount','redemption_days','service_fee_pct','reward_period_days','pool_status','entry_point','product_type','product_type_i18n','term_type','start_date','end_date','is_active','is_new_user_only','notes','notes_i18n','updated_at','announcement_url'];
const snapshot={schemaVersion:1,source,attribution:'@BarkerMoneyX',fetchedAt:new Date().toISOString(),rateBasis:'Public page campaign_apy as published; raw source APY before any dynamic fee/redemption adjustments. Not a live quote.',campaigns:rows.filter(x=>x.is_cex===1).map(row=>Object.fromEntries(fields.map(key=>[key,row[key]??null])))};
if(!snapshot.campaigns.length) throw new Error('No public exchange campaigns; previous snapshot is unchanged.');
await mkdir('assets/data',{recursive:true});
await writeFile('assets/data/barker-campaigns.json',JSON.stringify(snapshot,null,2));
console.log(JSON.stringify({campaigns:snapshot.campaigns.length,fetchedAt:snapshot.fetchedAt,source}));
