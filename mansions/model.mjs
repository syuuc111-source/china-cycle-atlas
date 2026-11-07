const aliases={'參':'参','畢':'毕','觜':'觜','軫':'轸','張':'张','婁':'娄','虛':'虚','蒼':'苍'};
const normalize=s=>s.trim().toLowerCase().replace(/[參畢軫張婁虛蒼]/g,c=>aliases[c]).replace(/[üǖǘǚǜ]/g,'v').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
export function searchMansions(list,query='',group='all'){
 const q=normalize(query);
 return list.filter(m=>(group==='all'||m.group===group)&&normalize([m.name,m.fullName,m.reading,m.summary,m.anchor.label,m.region].join(' ')).includes(q))
   .sort((a,b)=>Number(normalize(b.name)===q)-Number(normalize(a.name)===q));
}
export function parseRoute(hash){
 const parts=hash.replace(/^#/,'').split('/');
 if(parts[0]==='mansion'&&/^[a-z][a-z0-9]*$/.test(parts[1]||''))return {view:'mansion',id:parts[1]};
 if(parts[0]==='atlas')return {view:'atlas',group:['dragon','tortoise','tiger','bird'].includes(parts[1])?parts[1]:undefined};
 if(parts[0]==='guide')return {view:'guide',chapter:/^[0-5]$/.test(parts[1])?Number(parts[1]):0};
 return {view:['home','atlas','library','traditions','sources'].includes(parts[0])?parts[0]:'home'};
}
