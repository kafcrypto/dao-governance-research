const brandSheet=document.createElement('link');
brandSheet.rel='stylesheet';
brandSheet.href=location.pathname.includes('/h001/')||location.pathname.includes('/h002/')?'../brand.css':'brand.css';
document.head.appendChild(brandSheet);

const libraryItems=[
{id:'H002',title:'The DAO Delegation Handbook',type:'Handbook',status:'Ready',url:'h002/'},
{id:'H001',title:'The Tokenholder Governance Handbook',type:'Handbook',status:'Ready',url:'h001/'},
{id:'H003',title:'AI Agents in Onchain Proposal Processing and Materiality Filtering',type:'Research Note',status:'Coming next',url:null},
{id:'H004',title:'Institutional Checkpoints Across Bicameral Protocol Governance',type:'Framework',status:'Research',url:null}
];

const ideas={
'001':{tag:'ASYMMETRY',title:'Equal voice ≠ equal context',quote:'Equal voting rights do not create equal information, expertise or attention.',body:'Governance systems often treat participation rights and decision capacity as if they were the same thing. They are not. Delegation, specialization and filtering emerge because context is unevenly distributed.',related:'H002 — The DAO Delegation Handbook',url:'h002/'},
'002':{tag:'VELOCITY',title:'Output scaled. Responsibility did not.',quote:'AI makes visible governance output cheaper faster than it makes accountability easier.',body:'Summaries, rationales and proposal analysis can now be produced at near-zero marginal cost. The institutional question shifts from who can produce output to who owns judgment, conflict disclosure and consequences.',related:'H002 — The DAO Delegation Handbook',url:'h002/'},
'003':{tag:'ATTENTION',title:'99% of governance is discovering what you can ignore.',quote:'Professional stewardship begins with materiality, not maximum participation.',body:'A governance feed is not a decision system. Serious tokenholders need a way to distinguish events that alter economics, risk or control from the long tail of routine governance activity.',related:'H001 — The Tokenholder Governance Handbook',url:'h001/'},
'004':{tag:'POLICY',title:'Participation maximalism meets policy.',quote:'Good stewardship is not voting on everything. It is knowing when action is justified.',body:'Participation can be active, delegated, monitored, passive or restricted. The correct posture depends on materiality, mandate, expertise and operational cost.',related:'H001 — The Tokenholder Governance Handbook',url:'h001/'},
'005':{tag:'EXPOSURE',title:'You bought exposure to treasury policy, issuance, upgrades and emergency powers.',quote:'Governance rights are an asset attribute.',body:'Tokens can carry radically different forms of control. Portfolio analysis that ignores governance architecture misses a layer of economic and institutional exposure.',related:'H001 — The Tokenholder Governance Handbook',url:'h001/'},
'006':{tag:'STEWARDSHIP',title:'Delegation is not abandonment.',quote:'Authority can be delegated without surrendering control.',body:'A robust delegation architecture defines source of authority, scope, discretion, execution and revocation. The principal remains responsible for choosing, monitoring and replacing the intermediary.',related:'H002 — The DAO Delegation Handbook',url:'h002/'}
};

function renderLibrary(filter='All',query=''){
 const root=document.querySelector('#libraryRows');
 if(!root)return;
 const q=query.trim().toLowerCase();
 const rows=libraryItems.filter(item=>{
   const typeMatch=filter==='All'||item.type===filter;
   const qMatch=!q||(`${item.id} ${item.title} ${item.type} ${item.status}`).toLowerCase().includes(q);
   return typeMatch&&qMatch;
 });
 root.innerHTML=rows.map(item=>`<a class="lib-row" ${item.url?`href="${item.url}"`:'href="#library" aria-disabled="true"'}>
   <div class="lib-id">${item.id}</div>
   <div class="lib-title">${item.title}</div>
   <div><span class="pill ${item.status==='Ready'?'live':'queue'}">${item.status}</span></div>
   <div class="lib-action">${item.url?'READ →':'IN QUEUE'}</div>
 </a>`).join('') || `<div class="lib-row"><div class="lib-id">—</div><div class="lib-title">No matching research.</div></div>`;
}

function initLibrary(){
 const filters=document.querySelectorAll('[data-filter]');
 const search=document.querySelector('#librarySearch');
 let active='All';
 filters.forEach(btn=>btn.addEventListener('click',()=>{
   filters.forEach(x=>x.classList.remove('active'));btn.classList.add('active');active=btn.dataset.filter;renderLibrary(active,search?.value||'');
 }));
 search?.addEventListener('input',()=>renderLibrary(active,search.value));
 renderLibrary();
}

function initIdeas(){
 const modal=document.querySelector('#ideaModal');
 if(!modal)return;
 document.querySelectorAll('[data-idea]').forEach(card=>card.addEventListener('click',()=>{
   const d=ideas[card.dataset.idea];
   document.querySelector('#modalMeta').textContent=`IDEA / ${card.dataset.idea} · ${d.tag}`;
   document.querySelector('#modalTitle').textContent=d.title;
   document.querySelector('#modalQuote').textContent=d.quote;
   document.querySelector('#modalBody').textContent=d.body;
   const related=document.querySelector('#modalRelated');related.textContent=`RELATED: ${d.related} →`;related.href=d.url;
   modal.classList.add('open');document.body.style.overflow='hidden';
 }));
 const close=()=>{modal.classList.remove('open');document.body.style.overflow=''};
 document.querySelector('#modalClose')?.addEventListener('click',close);
 modal.addEventListener('click',e=>{if(e.target===modal)close()});
 document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
}

function initFrameworks(){
 document.querySelectorAll('.step button').forEach(btn=>btn.addEventListener('click',()=>btn.parentElement.classList.toggle('open')));
}

function initField(){
 const field=document.querySelector('.field');
 if(!field)return;
 const nodes=[...field.querySelectorAll('.node')];
 field.addEventListener('pointermove',e=>{
   const r=field.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5;const y=(e.clientY-r.top)/r.height-.5;
   nodes.forEach((n,i)=>n.style.transform=`translate(${x*(i+1)*18}px,${y*(i+1)*18}px)`);
 });
 field.addEventListener('pointerleave',()=>nodes.forEach(n=>n.style.transform=''));
}

function initNav(){document.querySelector('.mobile-toggle')?.addEventListener('click',()=>document.querySelector('.nav')?.classList.toggle('open'))}

function initBrandCopy(){
 const homeHero=document.querySelector('.hero h1');
 if(homeHero)homeHero.innerHTML='Better systems for collective action — <em>then act.</em>';
 document.querySelectorAll('.navcta').forEach(el=>el.textContent='START A CONVERSATION ↗');
}

document.addEventListener('DOMContentLoaded',()=>{initLibrary();initIdeas();initFrameworks();initField();initNav();initBrandCopy();});