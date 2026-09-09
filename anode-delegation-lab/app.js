const STEPS = ["landing","scenario","authority","allocation","mandate","execution","accountability","exit","stress","result"];
const STORE_KEY = "anode-delegation-lab-v1";

const defaultState = {
  step:"landing", scenario:null, burden:null, acceptedRisk:null,
  principal:null, object:null, agent:null, allocation:null,
  mandate:null, conflictRule:null, discretion:null, duration:null,
  incentive:null, rewarded:null, execution:null, limit:null,
  monitoring:[], consequences:[], revoker:null, revokeSpeed:null,
  contestability:null, stressTest:null
};
let state = loadState();

const app = document.getElementById("app");
const progressIndex = document.getElementById("progressIndex");
const progressLabel = document.getElementById("progressLabel");
const progressFill = document.getElementById("progressFill");
const progressSteps = document.getElementById("progressSteps");
document.getElementById("resetHeader").addEventListener("click", resetLab);

restoreFromHash();
render();

function loadState(){
  try { return {...defaultState, ...JSON.parse(localStorage.getItem(STORE_KEY)||"{}")}; }
  catch { return {...defaultState}; }
}
function save(){ localStorage.setItem(STORE_KEY, JSON.stringify(state)); }
function setState(patch, next){ state={...state,...patch}; if(next) state.step=next; save(); render(); window.scrollTo({top:0,behavior:"smooth"}); }
function resetLab(){ if(!confirm("Reset the Delegation Lab and clear this design?")) return; state={...defaultState}; localStorage.removeItem(STORE_KEY); history.replaceState(null,"",location.pathname); render(); }
function goBack(){ const i=STEPS.indexOf(state.step); if(i>0){ state.step=STEPS[i-1]; save(); render(); window.scrollTo({top:0,behavior:"smooth"}); } }
function updateProgress(){
  const idx=Math.max(0,STEPS.indexOf(state.step));
  progressIndex.textContent=String(idx).padStart(2,"0");
  progressLabel.textContent=(progressSteps.querySelector(`[data-step="${state.step}"]`)?.textContent||"ENTRY");
  progressFill.style.width=`${(idx/(STEPS.length-1))*100}%`;
  [...progressSteps.children].forEach((li,i)=>li.classList.toggle("active",i<=idx));
}
function render(){ updateProgress(); const fn=renderers[state.step]||renderLanding; app.innerHTML=fn(); wire(); }

function chain(){
  const source = state.principal || (state.scenario?SCENARIOS[state.scenario].principal:"—");
  const scope = state.object ? AUTHORITY_OBJECTS[state.object].title : "—";
  const disc = state.discretion ? DISCRETION[state.discretion].title : "—";
  const exec = state.execution ? EXECUTION_PATHS[state.execution] : "—";
  const rev = state.revoker ? REVOKERS[state.revoker] : "—";
  return `<div class="design-chain">
    ${[["SOURCE",source],["SCOPE",scope],["DISCRETION",disc],["EXECUTION",exec],["REVOCATION",rev]].map(([k,v],i)=>`<div class="chain-cell ${v!=="—"?"active":""}"><span class="chain-label">0${i+1} / ${k}</span><span class="chain-value">${v}</span></div>`).join("")}
  </div>`;
}

const renderers = {
  landing: renderLanding,
  scenario: renderScenario,
  authority: renderAuthority,
  allocation: renderAllocation,
  mandate: renderMandate,
  execution: renderExecution,
  accountability: renderAccountability,
  exit: renderExit,
  stress: renderStress,
  result: renderResult
};

function renderLanding(){ return `<div class="screen">
  <p class="eyebrow">ANODE / INTERACTIVE RESEARCH 002</p>
  <h1 class="hero-title">DESIGN THE <span class="outline">DELEGATION.</span></h1>
  <p class="lede">Delegation is not the transfer of a vote. It is the transfer of discretion.</p>
  <p class="body-copy">A short governance design lab. Start with a real coordination problem, move authority deliberately, then stress-test whether the principal can still understand where its power went — and take it back.</p>
  <div class="hero-meta"><div>6 GOVERNANCE PROBLEMS</div><div>MULTIPLE ARCHITECTURES</div><div>NO SINGLE MAGIC SCORE</div></div>
  <div class="actions"><button class="btn primary" data-action="start">ENTER THE LAB <span>→</span></button><a class="btn" href="../anode-governance-rights-checkup/">GOVERNANCE RIGHTS CHECKUP <span>↗</span></a></div>
  <div class="note" style="margin-top:40px"><strong>RESEARCH NOTE</strong>The default should not be maximum delegation. The default should be minimum necessary discretion.</div>
</div>`; }

function renderScenario(){ return `<div class="screen">
  <p class="eyebrow">01 / DIAGNOSIS BEFORE DELEGATION</p>
  <h2 class="screen-title">WHAT PROBLEM ARE YOU <span class="outline">ACTUALLY SOLVING?</span></h2>
  <p class="lede">Low participation is a symptom, not a diagnosis. Choose the governance burden first.</p>
  <div class="scenario-grid">${Object.entries(SCENARIOS).map(([k,s])=>`<button class="choice-card ${state.scenario===k?"selected":""}" data-scenario="${k}"><span class="code">${s.code} / ${s.cause}</span><span class="title">${s.title}</span><span class="copy">${s.short}</span><span class="risk">DESIGN SPACE: ${s.possible}</span><span class="arrow">↗</span></button>`).join("")}</div>
  <div class="actions"><button class="btn" data-action="back">← BACK</button><button class="btn" data-action="random">RANDOM PROBLEM ↗</button></div>
</div>`; }

function renderAuthority(){
  const sc=SCENARIOS[state.scenario];
  return `<div class="screen">
    <p class="eyebrow">02 / AUTHORITY OBJECT</p>
    <h2 class="screen-title">WHAT AUTHORITY <span class="outline">MOVES?</span></h2>
    <div class="context-strip"><div><span class="micro">SCENARIO</span><strong>${sc.title}</strong></div><div><span class="micro">LIKELY CAUSE</span><strong>${sc.cause}</strong></div><div><span class="micro">PRINCIPAL</span><strong>${sc.principal}</strong></div><div><span class="micro">SOURCE</span><strong>${sc.source}</strong></div></div>
    ${chain()}
    <p class="subhead">WHAT CAN THE AGENT DO WITHOUT RETURNING TO THE PRINCIPAL?</p>
    <div class="choice-grid four">${Object.entries(AUTHORITY_OBJECTS).map(([k,o])=>`<button class="choice-card ${state.object===k?"selected":""}" data-object="${k}"><span class="code">${o.scope}</span><span class="title">${o.title}</span><span class="copy">${o.copy}</span><span class="arrow">↗</span></button>`).join("")}</div>
    <p class="subhead">WHO OWNS OR CREATES THE AUTHORITY?</p>
    <div class="segmented" data-group="principal">${["TOKENHOLDERS","DAO / TOKENHOLDERS","INSTITUTIONAL HOLDER","FOUNDATION / TREASURY","CONSTITUTIONAL BODY"].map(v=>`<button class="${state.principal===v?"selected":""}" data-value="${v}">${v}</button>`).join("")}</div>
    <div class="actions"><button class="btn" data-action="back">← BACK</button><button class="btn primary" data-action="authority-next" ${!state.object?"disabled":""}>DEFINE THE AGENT →</button></div>
  </div>`;
}

function renderAllocation(){ return `<div class="screen">
  <p class="eyebrow">03 / AGENT + POWER PROVENANCE</p>
  <h2 class="screen-title">WHO GETS THE POWER — <span class="outline">AND HOW?</span></h2>
  ${chain()}
  <p class="subhead">WHO OR WHAT RECEIVES IT?</p>
  <div class="choice-grid">${Object.entries(AGENTS).map(([k,o])=>`<button class="choice-card ${state.agent===k?"selected":""}" data-agent="${k}"><span class="code">AGENT</span><span class="title">${o.title}</span><span class="copy">${o.copy}</span><span class="arrow">↗</span></button>`).join("")}</div>
  <p class="subhead">HOW DOES POWER REACH THE AGENT?</p>
  <div class="choice-grid two">${Object.entries(ALLOCATIONS).map(([k,o])=>`<button class="choice-card ${state.allocation===k?"selected":""}" data-allocation="${k}"><span class="code">${o.provenance}</span><span class="title">${o.title}</span><span class="copy">${o.copy}</span><span class="risk">PRIMARY RISK: ${o.risk}</span></button>`).join("")}</div>
  ${allocationWarning()}
  <div class="actions"><button class="btn" data-action="back">← BACK</button><button class="btn primary" data-action="allocation-next" ${!(state.agent&&state.allocation)?"disabled":""}>DEFINE THE MANDATE →</button></div>
</div>`; }

function allocationWarning(){
  if(state.agent==="software" && state.object==="representation") return `<div class="warning"><span class="symbol">!</span><div><strong>ARCHITECTURAL WARNING</strong><p>Broad open-ended representative judgment assigned to software pushes the design toward an experimental autonomy boundary. The handbook does not treat autonomous representatives as a mature substitute for accountable human governance.</p></div></div>`;
  if(state.allocation==="treasury") return `<div class="warning"><span class="symbol">↗</span><div><strong>POWER PROVENANCE</strong><p>Voting power is a quantity; legitimacy has provenance. Treasury bootstrap can solve an activation problem while creating allocator dependence.</p></div></div>`;
  if(state.allocation==="incentivized") return `<div class="warning"><span class="symbol">↗</span><div><strong>DISCOVERY IS ALLOCATION</strong><p>Incentives and featured interfaces can activate dormant power while also concentrating it. ZKsync's pilot is the handbook's clearest warning.</p></div></div>`;
  return "";
}

function renderMandate(){ return `<div class="screen">
  <p class="eyebrow">04 / MANDATE + DISCRETION</p>
  <h2 class="screen-title">WHAT GUIDES THE AGENT WHEN <span class="outline">THE ANSWER ISN'T OBVIOUS?</span></h2>
  ${chain()}
  <div class="choice-grid">${Object.entries(MANDATES).map(([k,o])=>`<button class="choice-card ${state.mandate===k?"selected":""}" data-mandate="${k}"><span class="code">MANDATE</span><span class="title">${o.title}</span><span class="copy">${o.copy}</span></button>`).join("")}</div>
  <p class="subhead">WHEN INTERESTS CONFLICT</p>
  <div class="segmented" data-group="conflictRule">${Object.entries(CONFLICT_RULES).map(([k,v])=>`<button class="${state.conflictRule===k?"selected":""}" data-value="${k}">${v}</button>`).join("")}</div>
  <p class="subhead">HOW MUCH FREEDOM DOES THE AGENT HAVE?</p>
  <div class="choice-grid two">${Object.entries(DISCRETION).map(([k,o])=>`<button class="choice-card ${state.discretion===k?"selected":""}" data-discretion="${k}"><span class="code">DISCRETION</span><span class="title">${o.title}</span><span class="copy">${o.copy}</span></button>`).join("")}</div>
  <p class="subhead">HOW LONG DOES THE AUTHORITY LAST?</p>
  <div class="segmented" data-group="duration">${Object.entries(DURATIONS).map(([k,v])=>`<button class="${state.duration===k?"selected":""}" data-value="${k}">${v}</button>`).join("")}</div>
  ${state.conflictRule==="undefined"?`<div class="warning"><span class="symbol">≠</span><div><strong>A STATEMENT IS NOT A MANDATE</strong><p>If the design cannot explain what happens when principal, constituency and agent interests diverge, the mandate is weak exactly where it matters most.</p></div></div>`:""}
  <div class="actions"><button class="btn" data-action="back">← BACK</button><button class="btn primary" data-action="mandate-next" ${!(state.mandate&&state.conflictRule&&state.discretion&&state.duration)?"disabled":""}>DESIGN EXECUTION →</button></div>
</div>`; }

function renderExecution(){ return `<div class="screen">
  <p class="eyebrow">05 / INCENTIVES + EXECUTION</p>
  <h2 class="screen-title">HOW DOES JUDGMENT BECOME <span class="outline">ACTION?</span></h2>
  ${chain()}
  <p class="subhead">WHO PAYS — AND WHAT ARE THEY BUYING?</p>
  <div class="choice-grid">${Object.entries(INCENTIVES).map(([k,o])=>`<button class="choice-card ${state.incentive===k?"selected":""}" data-incentive="${k}"><span class="code">INCENTIVE</span><span class="title">${o.title}</span><span class="copy">${o.copy}</span></button>`).join("")}</div>
  <p class="subhead">WHAT BEHAVIOR DOES PAYMENT REWARD?</p>
  <div class="segmented" data-group="rewarded">${Object.entries(REWARDED_BEHAVIOR).map(([k,v])=>`<button class="${state.rewarded===k?"selected":""}" data-value="${k}">${v}</button>`).join("")}</div>
  <p class="subhead">EXECUTION PATH</p>
  <div class="segmented" data-group="execution">${Object.entries(EXECUTION_PATHS).map(([k,v])=>`<button class="${state.execution===k?"selected":""}" data-value="${k}">${v}</button>`).join("")}</div>
  <p class="subhead">HARD LIMIT BEFORE EXECUTION</p>
  <div class="segmented" data-group="limit">${Object.entries(HARD_LIMITS).map(([k,v])=>`<button class="${state.limit===k?"selected":""}" data-value="${k}">${v}</button>`).join("")}</div>
  ${state.rewarded&&["votes","rationales"].includes(state.rewarded)?`<div class="warning"><span class="symbol">≠</span><div><strong>ACTIVITY ≠ JUDGMENT</strong><p>The handbook warns against paying representation, research, technical review and execution with one generic activity score. The metric should correspond to the service actually being purchased.</p></div></div>`:""}
  ${state.execution==="automated"?`<div class="warning"><span class="symbol">AI</span><div><strong>AUTHORITY, NOT AUTHORSHIP</strong><p>Automation can compress information cost without removing mandate, key-control or accountability problems. The control surface should become stricter as the system moves toward irreversible action.</p></div></div>`:""}
  <div class="actions"><button class="btn" data-action="back">← BACK</button><button class="btn primary" data-action="execution-next" ${!(state.incentive&&state.rewarded&&state.execution&&state.limit)?"disabled":""}>ADD ACCOUNTABILITY →</button></div>
</div>`; }

function renderAccountability(){ return `<div class="screen">
  <p class="eyebrow">06 / MONITORING + CONSEQUENCE</p>
  <h2 class="screen-title">CAN THE PRINCIPAL SEE WHAT HAPPENED — <span class="outline">AND CHANGE WHAT HAPPENS NEXT?</span></h2>
  ${chain()}
  <p class="subhead">MONITORING / EVIDENCE</p>
  <div class="multi-grid" data-multi="monitoring">${Object.entries(MONITORING).map(([k,v])=>`<button class="multi-option ${(state.monitoring||[]).includes(k)?"selected":""}" data-value="${k}">${v}</button>`).join("")}</div>
  <p class="subhead">WHAT CHANGES AFTER POOR PERFORMANCE OR CONFLICT?</p>
  <div class="multi-grid" data-multi="consequences">${Object.entries(CONSEQUENCES).map(([k,v])=>`<button class="multi-option ${(state.consequences||[]).includes(k)?"selected":""}" data-value="${k}">${v}</button>`).join("")}</div>
  ${(state.monitoring||[]).filter(x=>x!=="none").length>0&&(state.consequences||[]).filter(x=>x!=="nothing").length===0?`<div class="warning"><span class="symbol">≠</span><div><strong>TRANSPARENCY ≠ ACCOUNTABILITY</strong><p>Visibility matters only when somebody can evaluate behavior and change the state of the relationship.</p></div></div>`:""}
  <div class="actions"><button class="btn" data-action="back">← BACK</button><button class="btn primary" data-action="accountability-next" ${!(state.monitoring?.length&&state.consequences?.length)?"disabled":""}>DESIGN EXIT →</button></div>
</div>`; }

function renderExit(){ return `<div class="screen">
  <p class="eyebrow">07 / REVOCATION + CONTESTABILITY</p>
  <h2 class="screen-title">CAN THE PRINCIPAL ACTUALLY <span class="outline">TAKE THE POWER BACK?</span></h2>
  ${chain()}
  <p class="subhead">WHO CAN REVOKE IT?</p>
  <div class="segmented" data-group="revoker">${Object.entries(REVOKERS).map(([k,v])=>`<button class="${state.revoker===k?"selected":""}" data-value="${k}">${v}</button>`).join("")}</div>
  <p class="subhead">HOW FAST?</p>
  <div class="segmented" data-group="revokeSpeed">${Object.entries(REVOCATION_SPEED).map(([k,v])=>`<button class="${state.revokeSpeed===k?"selected":""}" data-value="${k}">${v}</button>`).join("")}</div>
  <p class="subhead">CAN A CREDIBLE ALTERNATIVE REPLACE THE INCUMBENT?</p>
  <div class="choice-grid two">${Object.entries(CONTESTABILITY).map(([k,v])=>`<button class="choice-card ${state.contestability===k?"selected":""}" data-contestability="${k}"><span class="code">CONTESTABILITY</span><span class="title">${v}</span><span class="copy">Replacement is a practical governance question, not merely a smart-contract affordance.</span></button>`).join("")}</div>
  ${state.revokeSpeed==="immediate"&&["weak","unknown"].includes(state.contestability)?`<div class="warning"><span class="symbol">≠</span><div><strong>REVOCABILITY ≠ CONTESTABILITY</strong><p>Removing an agent is weak protection when there is no credible replacement.</p></div></div>`:""}
  <div class="actions"><button class="btn" data-action="back">← BACK</button><button class="btn primary" data-action="exit-next" ${!(state.revoker&&state.revokeSpeed&&state.contestability)?"disabled":""}>STRESS TEST →</button></div>
</div>`; }

function renderStress(){
  const candidates = [...new Set([...(SCENARIOS[state.scenario]?.stress||[]), state.execution==="automated"?"agent_irreversible":null, "materiality_shift"].filter(Boolean))];
  return `<div class="screen">
    <p class="eyebrow">08 / FAILURE IS DATA</p>
    <h2 class="screen-title">NOW ATTACK THE <span class="outline">ARCHITECTURE.</span></h2>
    ${chain()}
    <p class="lede">A delegation architecture is incomplete until failure changes something.</p>
    <div class="choice-grid">${candidates.map(k=>{const t=STRESS_TESTS[k];return `<button class="choice-card ${state.stressTest===k?"selected":""}" data-stress="${k}"><span class="code">STRESS TEST</span><span class="title">${t.title}</span><span class="copy">${t.copy}</span><span class="arrow">↗</span></button>`}).join("")}</div>
    ${state.stressTest?`<div class="stress-card"><span class="micro">SELECTED FAILURE</span><h3>${STRESS_TESTS[state.stressTest].title}</h3><p>${STRESS_TESTS[state.stressTest].copy}</p></div>`:""}
    <div class="actions"><button class="btn" data-action="back">← BACK</button><button class="btn primary" data-action="stress-next" ${!state.stressTest?"disabled":""}>SEE THE ARCHITECTURE →</button></div>
  </div>`;
}

function renderResult(){
  const ev=evaluateArchitecture(state), s=ev.scores, scenario=SCENARIOS[state.scenario];
  const summary = buildShareText(ev);
  const metrics=[
    ["authorityClarity","AUTHORITY CLARITY"],["scopeDiscipline","SCOPE DISCIPLINE"],["principalControl","PRINCIPAL CONTROL"],["concentrationRisk","CONCENTRATION RISK"],["allocatorDependency","ALLOCATOR DEPENDENCY"],["contestability","CONTESTABILITY"],["accountability","ACCOUNTABILITY"],["reversibility","REVERSIBILITY"],["monitoringBurden","MONITORING BURDEN"]
  ];
  if(state.agent==="software"||state.execution==="automated") metrics.push(["automationRisk","AUTOMATION RISK"]);
  return `<div class="screen">
    <p class="eyebrow">09 / ARCHITECTURE RESULT</p>
    <div class="result-hero"><span class="result-label">DESCRIPTIVE ARCHITECTURE / NOT AN OFFICIAL TAXONOMY</span><div class="result-type">${ev.architecture}</div><p class="lede">${scenario.title} → ${AUTHORITY_OBJECTS[state.object].title} → ${AGENTS[state.agent].title}</p></div>
    <div class="result-summary"><div><span class="micro">PROBLEM</span><strong>${scenario.title}</strong></div><div><span class="micro">POWER PROVENANCE</span><strong>${ALLOCATIONS[state.allocation].provenance}</strong></div><div><span class="micro">DISCRETION</span><strong>${DISCRETION[state.discretion].title}</strong></div><div><span class="micro">EXIT</span><strong>${REVOCATION_SPEED[state.revokeSpeed]}</strong></div></div>
    ${chain()}
    <h3 class="subhead">ARCHITECTURE DASHBOARD</h3><p class="body-copy">No aggregate governance score. The dimensions can move in different directions, which is precisely the point.</p>
    <div class="dashboard">${metrics.map(([k,label])=>`<div class="metric"><span class="m-title">${label}</span><span class="m-band">${scoreBand(k,s[k])}</span><span class="m-track"><i style="width:${(s[k]/4)*100}%"></i></span></div>`).join("")}</div>
    <div class="warning"><span class="symbol">${ev.stress.verdict.includes("DEFINED")?"↗":"!"}</span><div><strong>${ev.stress.verdict}</strong><p>${ev.stress.title}<br>${ev.stress.copy}</p></div></div>

    <div class="split"><div class="list-block"><h3>WHAT THIS DESIGN DOES WELL</h3><ul>${ev.strengths.map(x=>`<li>${x}</li>`).join("")}</ul></div><div class="list-block"><h3>MAIN CONTROL FAILURE</h3><ul>${ev.weaknesses.map(x=>`<li>${x}</li>`).join("")}</ul></div></div>
    <div class="list-block" style="margin-top:36px"><h3>WHAT WOULD CHANGE THE RESULT?</h3><ul>${ev.revisit.map(x=>`<li>${x}</li>`).join("")}</ul></div>

    <h3 class="subhead">DELEGATION ARCHITECTURE CANVAS</h3>
    <div class="canvas-grid">${canvasCells().map(([k,v])=>`<div class="canvas-cell"><span class="micro">${k}</span><strong>${v}</strong></div>`).join("")}</div>

    <h3 class="subhead">HANDBOOK PRINCIPLES CHECK</h3>
    <div class="principles">${ev.principles.map((p,i)=>`<div class="principle"><span class="n">${String(i+1).padStart(2,"0")}</span><span>${p.text}</span><span class="status ${p.status.replaceAll(" ","-")}">${p.status}</span></div>`).join("")}</div>

    <h3 class="subhead">CASE EVIDENCE</h3>
    <div class="case-grid">${ev.cases.map(c=>`<div class="case-card"><h4>${c.title}</h4><p>${c.copy}</p><span class="ref">${c.ref}</span></div>`).join("")}</div>

    <div class="share-box"><span class="micro">SHAREABLE SUMMARY</span><pre id="shareText">${escapeHtml(summary)}</pre></div>
    <div class="actions"><button class="btn primary" data-action="copy-result">COPY ARCHITECTURE ↗</button><button class="btn" data-action="copy-link">COPY SHARE LINK ↗</button><button class="btn" data-action="redesign">REDESIGN THE SYSTEM ↺</button><a class="btn" href="https://www.anode.gg/" target="_blank" rel="noreferrer">EXPLORE ANODE RESEARCH ↗</a></div>
    <div class="note" style="margin-top:36px"><strong>RESEARCH BASIS</strong>Based on The DAO Delegation Handbook V2 / September 2026 by Enrique Alles Fernandez. Research current through ${RESEARCH_DATE}. Cases are evidence of mechanisms and trade-offs, not proof that one architecture should be copied universally.</div>
  </div>`;
}

function canvasCells(){
  const scenario=SCENARIOS[state.scenario];
  return [
    ["WHY",scenario.title],["PRINCIPAL",state.principal||scenario.principal],["OBJECT",AUTHORITY_OBJECTS[state.object].title],["AGENT",AGENTS[state.agent].title],["ALLOCATION",ALLOCATIONS[state.allocation].title],["MANDATE",MANDATES[state.mandate].title],["DISCRETION",DISCRETION[state.discretion].title],["DURATION",DURATIONS[state.duration]],["INCENTIVES",INCENTIVES[state.incentive].title],["EXECUTION",EXECUTION_PATHS[state.execution]],["MONITORING",(state.monitoring||[]).map(x=>MONITORING[x]).join(" / ")],["CONSEQUENCE",(state.consequences||[]).map(x=>CONSEQUENCES[x]).join(" / ")],["REVOCATION",`${REVOKERS[state.revoker]} / ${REVOCATION_SPEED[state.revokeSpeed]}`],["CONTESTABILITY",CONTESTABILITY[state.contestability]]
  ];
}

function buildShareText(ev){
  return `ANODE DELEGATION LAB\n\n${ev.architecture}\n\nProblem: ${SCENARIOS[state.scenario].title}\nAuthority: ${AUTHORITY_OBJECTS[state.object].title}\nAgent: ${AGENTS[state.agent].title}\nAllocation: ${ALLOCATIONS[state.allocation].title}\nDiscretion: ${DISCRETION[state.discretion].title}\nExecution: ${EXECUTION_PATHS[state.execution]}\nExit: ${REVOKERS[state.revoker]} / ${REVOCATION_SPEED[state.revokeSpeed]}\nContestability: ${CONTESTABILITY[state.contestability]}\n\nMain trade-off: ${ev.weaknesses[0]}\n\nResearch basis: The DAO Delegation Handbook V2 / 2026 — Anode interactive research.`;
}
function escapeHtml(str){return str.replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}

function wire(){
  document.querySelectorAll("[data-action='start']").forEach(el=>el.onclick=()=>setState({},"scenario"));
  document.querySelectorAll("[data-action='back']").forEach(el=>el.onclick=goBack);
  document.querySelectorAll("[data-action='random']").forEach(el=>el.onclick=()=>{const keys=Object.keys(SCENARIOS);const k=keys[Math.floor(Math.random()*keys.length)];setState({scenario:k,principal:SCENARIOS[k].principal},"authority")});
  document.querySelectorAll("[data-scenario]").forEach(el=>el.onclick=()=>{const k=el.dataset.scenario;setState({scenario:k,burden:SCENARIOS[k].burden,principal:SCENARIOS[k].principal},"authority")});
  document.querySelectorAll("[data-object]").forEach(el=>el.onclick=()=>setState({object:el.dataset.object}));
  document.querySelectorAll("[data-agent]").forEach(el=>el.onclick=()=>setState({agent:el.dataset.agent}));
  document.querySelectorAll("[data-allocation]").forEach(el=>el.onclick=()=>setState({allocation:el.dataset.allocation}));
  document.querySelectorAll("[data-mandate]").forEach(el=>el.onclick=()=>setState({mandate:el.dataset.mandate}));
  document.querySelectorAll("[data-discretion]").forEach(el=>el.onclick=()=>setState({discretion:el.dataset.discretion}));
  document.querySelectorAll("[data-incentive]").forEach(el=>el.onclick=()=>setState({incentive:el.dataset.incentive}));
  document.querySelectorAll("[data-contestability]").forEach(el=>el.onclick=()=>setState({contestability:el.dataset.contestability}));
  document.querySelectorAll("[data-stress]").forEach(el=>el.onclick=()=>setState({stressTest:el.dataset.stress}));
  document.querySelectorAll(".segmented[data-group]").forEach(group=>group.querySelectorAll("button").forEach(btn=>btn.onclick=()=>setState({[group.dataset.group]:btn.dataset.value})));
  document.querySelectorAll("[data-multi]").forEach(group=>group.querySelectorAll("button").forEach(btn=>btn.onclick=()=>toggleMulti(group.dataset.multi,btn.dataset.value)));
  document.querySelectorAll("[data-action='authority-next']").forEach(el=>el.onclick=()=>{ if(!state.principal) state.principal=SCENARIOS[state.scenario].principal; if(state.object==="none") setState({agent:"none",allocation:"none",mandate:"none",conflictRule:"return",discretion:"instruction",duration:"one",incentive:"none",rewarded:"nothing",execution:"principal",limit:"human"},"accountability"); else setState({},"allocation"); });
  document.querySelectorAll("[data-action='allocation-next']").forEach(el=>el.onclick=()=>setState({},"mandate"));
  document.querySelectorAll("[data-action='mandate-next']").forEach(el=>el.onclick=()=>setState({},"execution"));
  document.querySelectorAll("[data-action='execution-next']").forEach(el=>el.onclick=()=>setState({},"accountability"));
  document.querySelectorAll("[data-action='accountability-next']").forEach(el=>el.onclick=()=>setState({},"exit"));
  document.querySelectorAll("[data-action='exit-next']").forEach(el=>el.onclick=()=>setState({},"stress"));
  document.querySelectorAll("[data-action='stress-next']").forEach(el=>el.onclick=()=>{writeHash();setState({},"result")});
  document.querySelectorAll("[data-action='redesign']").forEach(el=>el.onclick=()=>{state.step="scenario";save();render();window.scrollTo({top:0,behavior:"smooth"})});
  document.querySelectorAll("[data-action='copy-result']").forEach(el=>el.onclick=()=>copyText(buildShareText(evaluateArchitecture(state)),el,"COPIED"));
  document.querySelectorAll("[data-action='copy-link']").forEach(el=>el.onclick=()=>{writeHash();copyText(location.href,el,"LINK COPIED")});
}

function toggleMulti(key,value){
  let arr=[...(state[key]||[])];
  const exclusive = key==="monitoring"?"none":"nothing";
  if(value===exclusive){ arr=[value]; }
  else { arr=arr.filter(x=>x!==exclusive); arr.includes(value)?arr=arr.filter(x=>x!==value):arr.push(value); }
  state[key]=arr; save(); render();
}

function copyText(text,button,label){
  const old=button.textContent;
  const done=()=>{button.textContent=label;setTimeout(()=>button.textContent=old,1200)};
  if(navigator.clipboard?.writeText) navigator.clipboard.writeText(text).then(done).catch(()=>fallbackCopy(text,done)); else fallbackCopy(text,done);
}
function fallbackCopy(text,done){const ta=document.createElement("textarea");ta.value=text;document.body.appendChild(ta);ta.select();document.execCommand("copy");ta.remove();done();}

function writeHash(){
  const share={...state,step:"result"};
  const encoded=btoa(unescape(encodeURIComponent(JSON.stringify(share))));
  history.replaceState(null,"",`${location.pathname}${location.search}#design=${encoded}`);
}
function restoreFromHash(){
  const m=location.hash.match(/^#design=(.+)$/); if(!m) return;
  try{const parsed=JSON.parse(decodeURIComponent(escape(atob(m[1]))));state={...defaultState,...parsed,step:"result"};save();}catch{}
}
