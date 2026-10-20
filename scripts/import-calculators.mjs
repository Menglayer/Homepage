// Import only the owner's public calculator front ends; retain original formulas.
import {mkdir,writeFile,access} from 'node:fs/promises';
import path from 'node:path';
const target=path.resolve('calculators');
try {
 await access(path.join(target,'sources.json'));
 if(!process.argv.includes('--overwrite')) throw new Error('Calculators already imported. Back up local integration changes before using --overwrite.');
} catch(error) { if(error.code!=='ENOENT') throw error; }
const sites={axis:'https://axis.menglayer.cc/',tori:'https://tori.menglayer.cc/','3j':'https://3j.menglayer.cc/',option:'https://option.menglayer.cc/',civcalc:'https://civ.menglayer.cc/',airdrop_universal:'https://airdropestimator.menglayer.cc/',apr:'https://apr.menglayer.cc/',borrow_risk:'https://borrow.menglayer.cc/',clammv3:'https://clamm.menglayer.cc/'};
const provenance=[];
for(const [id,origin] of Object.entries(sites)) {
 const queue=[new URL(origin)],seen=new Set(),files=[];
 while(queue.length) {
  const url=queue.shift(); if(seen.has(url.pathname)) continue; seen.add(url.pathname);
  const response=await fetch(url); if(!response.ok) throw new Error(id+': '+url+' '+response.status);
  const destination=path.join(target,id,url.pathname==='/'?'index.html':decodeURIComponent(url.pathname));
  if(!destination.startsWith(path.join(target,id)+path.sep)) throw new Error('Invalid asset path');
  const bytes=Buffer.from(await response.arrayBuffer());
  let body=['.html','.js','.mjs','.css','.json'].includes(path.extname(destination))?bytes.toString('utf8'):null;
  if(body!==null) {
   const refs=new Set();
   for(const match of body.matchAll(/(?:src|href)=["']([^"']+)["']|(?:from|import|fetch)[ (]*["']([^"']+)["']|url[(]["']?([^"')]+)["']?[)]/g)) refs.add(match[1]||match[2]||match[3]);
   for(const ref of refs) {
    if(/^(data:|#|javascript:)/.test(ref)||ref.includes('$'+'{')) continue;
    let dependency;try{dependency=new URL(ref,url);}catch{continue;}
    if(dependency.origin!==new URL(origin).origin||dependency.pathname.startsWith('/api/')) continue;
    if(!/[.](?:js|mjs|css|json|svg|png|jpe?g|webp|ico|woff2?)$/.test(dependency.pathname)) continue;
    queue.push(dependency);
    if(ref.startsWith('/')) body=body.split(ref).join('/calculators/'+id+ref);
   }
   body=body.replaceAll('fetch("/api/','fetch("'+origin+'api/').replaceAll("fetch('/api/","fetch('"+origin+'api/');
  }
  if(url.pathname==='/') {
   body=body.replace(/<head([^>]*)>/i,'<head$1><meta name="menglayer-source" content="'+origin+'">');
   body=body.replace('</head>','<link rel="stylesheet" href="../../assets/css/calculator-theme.css"><script defer src="../../assets/js/calculator-bridge.js"></script></head>');
  }
  await mkdir(path.dirname(destination),{recursive:true}); await writeFile(destination,body===null?bytes:body);
  files.push(path.relative(target,destination).split(path.sep).join('/'));
 }
 provenance.push({id,source:origin,importedAt:new Date().toISOString(),files}); console.log(id,files.length);
}
await writeFile(path.join(target,'sources.json'),JSON.stringify({note:'Public source snapshots. Original formulas and freshness checks retained.',calculators:provenance},null,2));
