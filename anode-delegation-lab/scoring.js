function clamp(n, min=0, max=4){ return Math.max(min, Math.min(max, n)); }

function evaluateArchitecture(state){
  const s = {
    authorityClarity:2,
    scopeDiscipline:2,
    principalControl:2,
    concentrationRisk:2,
    allocatorDependency:1,
    contestability:2,
    accountability:1,
    reversibility:2,
    monitoringBurden:2,
    automationRisk:0
  };

  const notes = [];

  if(state.object === "none"){
    s.authorityClarity = 4; s.scopeDiscipline = 4; s.principalControl = 4;
    s.concentrationRisk = 0; s.allocatorDependency = 0; s.reversibility = 4;
    s.accountability = 3; s.monitoringBurden = 1;
    notes.push("No intermediary receives discretion; control remains with the principal.");
  }

  if(state.object === "representation"){
    s.scopeDiscipline -= 2; s.principalControl -= 1; s.monitoringBurden += 1;
    notes.push("Broad representation creates the widest agency surface in this design.");
  }
  if(state.object === "domain" || state.object === "veto" || state.object === "operational") s.scopeDiscipline += 1;
  if(state.object === "execution") s.scopeDiscipline += 1;

  if(state.discretion === "general"){ s.scopeDiscipline -= 1; s.principalControl -= 1; }
  if(state.discretion === "bounded"){ s.scopeDiscipline += 1; s.principalControl += 1; }
  if(state.discretion === "rule" || state.discretion === "instruction"){ s.scopeDiscipline += 2; s.principalControl += 1; }

  if(state.allocation === "organic"){
    s.allocatorDependency -= 1;
    s.concentrationRisk -= 1;
    notes.push("Power provenance reflects direct principal choice, though inertia can still remain.");
  }
  if(state.allocation === "treasury"){
    s.allocatorDependency += 3; s.concentrationRisk += 1;
    notes.push("Treasury-allocated power introduces allocator dependence even when operationally useful.");
  }
  if(state.allocation === "incentivized"){
    s.concentrationRisk += 2; s.allocatorDependency += 1;
    notes.push("Delegator incentives can activate idle power while changing where political capital accumulates.");
  }
  if(state.allocation === "default"){
    s.monitoringBurden -= 1; s.principalControl -= 1;
    notes.push("Default representation lowers attention cost but creates passive-consent risk.");
  }
  if(state.allocation === "appointment") s.authorityClarity += 1;

  if(state.mandate === "policy" || state.mandate === "instructional" || state.mandate === "expert") s.authorityClarity += 1;
  if(state.mandate === "stewardship" || state.mandate === "representative") s.authorityClarity -= 1;
  if(state.conflictRule === "undefined"){
    s.authorityClarity -= 2; s.accountability -= 1;
    notes.push("The mandate does not define what happens when interests diverge.");
  }
  if(["abstain","escalate","priority","return"].includes(state.conflictRule)) s.principalControl += 1;

  if(state.duration === "sunset" || state.duration === "term" || state.duration === "event" || state.duration === "one"){
    s.reversibility += 1; s.principalControl += 1;
  }
  if(state.duration === "open"){
    s.reversibility -= 1;
    if(state.allocation === "treasury") notes.push("Open-ended bootstrap authority lacks the review or sunset discipline emphasized in the handbook.");
  }

  if(state.incentive === "performance" && ["votes","rationales"].includes(state.rewarded)){
    notes.push("The compensation metric rewards visible activity, which may be a poor proxy for judgment.");
  }
  if(state.incentive === "service" || state.incentive === "expert") s.authorityClarity += 1;
  if(state.incentive === "delegator") s.concentrationRisk += 1;

  if(state.limit && state.limit !== "none"){
    s.principalControl += 1; s.scopeDiscipline += 1;
  }
  if(state.limit === "human") s.principalControl += 1;
  if(state.execution === "automated"){
    s.automationRisk = 3;
    if(state.limit === "human") s.automationRisk -= 1;
    if(state.discretion === "general") s.automationRisk += 1;
    if(state.limit === "none") s.automationRisk += 1;
    if(state.revokeSpeed !== "immediate" && state.revokeSpeed !== "short") s.automationRisk += 1;
    notes.push("Automation risk rises as analysis moves toward irreversible execution without stronger approval and revocation controls.");
  }

  const monitoringCount = (state.monitoring || []).filter(x=>x!=="none").length;
  if(monitoringCount >= 3) s.accountability += 1;
  if(monitoringCount >= 6) s.monitoringBurden += 1;
  if((state.monitoring || []).includes("provenance")) s.authorityClarity += 1;

  const consequenceCount = (state.consequences || []).filter(x=>x!=="nothing").length;
  if(consequenceCount === 0){
    s.accountability = Math.min(s.accountability,1);
    if(monitoringCount > 0) notes.push("Transparency is present, but poor performance does not change the authority relationship.");
  } else {
    s.accountability += 2;
  }

  if(state.revoker === "none"){
    s.reversibility = 0; s.principalControl -= 2;
  }
  if(state.revokeSpeed === "immediate") s.reversibility += 2;
  if(state.revokeSpeed === "short") s.reversibility += 1;
  if(state.revokeSpeed === "vote" || state.revokeSpeed === "unclear") s.reversibility -= 2;

  if(state.contestability === "strong") s.contestability = 4;
  if(state.contestability === "friction") s.contestability = 2;
  if(state.contestability === "weak") s.contestability = 0;
  if(state.contestability === "unknown") s.contestability = 1;
  if(s.reversibility >= 3 && s.contestability <= 1) notes.push("Exit is technically available, but contestability remains weak because replacement is not credible.");

  Object.keys(s).forEach(k=>s[k]=clamp(s[k]));

  const architecture = inferArchitecture(state);
  const strengths = buildStrengths(state, s);
  const weaknesses = buildWeaknesses(state, s);
  const revisit = buildRevisit(state, s);
  const cases = pickCases(state);
  const principles = assessPrinciples(state, s);
  const stress = assessStress(state, s);

  return { scores:s, architecture, strengths, weaknesses, revisit, cases, principles, notes:[...new Set(notes)], stress };
}

function inferArchitecture(state){
  if(state.object === "none" || state.agent === "none") return "DIRECT GOVERNANCE";
  if(state.object === "operational" && state.agent === "steward") return "BOUNDED STEWARD SYSTEM";
  if(state.object === "domain" || state.agent === "expert") return "DOMAIN-DELEGATED SYSTEM";
  if(state.object === "veto" || state.execution === "optimistic") return "OPTIMISTIC OVERSIGHT SYSTEM";
  if(state.allocation === "treasury" && ["sunset","term","event"].includes(state.duration)) return "TEMPORARY BOOTSTRAP SYSTEM";
  if(state.allocation === "default") return "DEFAULT REPRESENTATION SYSTEM";
  if(state.agent === "software" && ["rule","instruction"].includes(state.discretion)) return "AUTOMATED BOUNDED SYSTEM";
  if(state.agent === "professional" && state.object === "representation") return "PROFESSIONAL REPRESENTATIVE SYSTEM";
  if(state.object === "representation" || state.object === "vote") return "GENERAL REPRESENTATIVE SYSTEM";
  return "HYBRID DELEGATION ARCHITECTURE";
}

function buildStrengths(state, s){
  const out=[];
  if(s.scopeDiscipline>=3) out.push("Authority is narrowed before monitoring is asked to compensate for broad discretion.");
  if(s.principalControl>=3) out.push("The principal retains meaningful residual control over the delegated relationship.");
  if(s.accountability>=3) out.push("Observed failure can change the state of the relationship, not merely produce more reporting.");
  if(s.reversibility>=3) out.push("Authority has a comparatively clear path back to the principal.");
  if(s.contestability>=3) out.push("Replacement is practically credible, not just technically possible.");
  if(state.object==="none") out.push("The design avoids creating an intermediary where delegation does not solve a defined problem.");
  return out.slice(0,4).length?out.slice(0,4):["The architecture makes the authority relationship explicit enough to inspect and redesign."];
}

function buildWeaknesses(state, s){
  const out=[];
  if(s.scopeDiscipline<=1) out.push("Discretion is broad relative to the control surfaces around it.");
  if(s.allocatorDependency>=3) out.push("The architecture depends heavily on an allocator rather than an independently chosen constituency.");
  if(s.concentrationRisk>=3) out.push("The allocation mechanism can concentrate power even if activation improves.");
  if(s.accountability<=1) out.push("Monitoring exists without a strong consequence mechanism.");
  if(s.reversibility<=1) out.push("Taking authority back is slow, unclear or politically expensive.");
  if(s.contestability<=1) out.push("A credible alternative may not be able to replace the incumbent in practice.");
  if(s.automationRisk>=3) out.push("Automation sits too close to irreversible action for the strength of the current control stack.");
  return out.slice(0,3).length?out.slice(0,3):["No single control failure dominates; the remaining trade-offs are contextual rather than obviously structural."];
}

function buildRevisit(state, s){
  const out=[];
  if(s.scopeDiscipline<=2) out.push("Narrow the authority object or discretion before adding more monitoring.");
  if(state.allocation==="treasury" && !["sunset","term","event"].includes(state.duration)) out.push("Add a review or sunset tied to the bootstrap problem the allocation was created to solve.");
  if(s.accountability<=1) out.push("Pair disclosure with a defined consequence: scope reduction, non-renewal, recall, removal or override.");
  if(s.contestability<=1) out.push("Design a practical replacement path; technical revocation alone is insufficient.");
  if(s.automationRisk>=3) out.push("Move human approval or revocation closer to execution and impose harder scope limits.");
  return out.slice(0,3).length?out.slice(0,3):["Revisit the architecture when the original governance problem changes; delegated authority should remain purpose-bound."];
}

function pickCases(state){
  const keys=[];
  if(state.allocation==="treasury") keys.push("UNISWAP");
  if(state.allocation==="incentivized") keys.push("ENS","ZKSYNC");
  if(state.object==="operational" || state.agent==="steward") keys.push("AAVE");
  if(state.object==="domain") keys.push("POLKADOT");
  if(state.object==="veto" || state.execution==="optimistic") keys.push("OPTIMISM","RESERVE");
  if(state.scenario==="quiet") keys.push("SAFE");
  if(state.agent==="professional") keys.push("LIDO");
  if(!keys.length) keys.push("AAVE","UNISWAP","OPTIMISM");
  return [...new Set(keys)].slice(0,3).map(k=>CASES[k]);
}

function assessPrinciples(state, s){
  const statuses=[];
  statuses.push(state.scenario ? "ALIGNED" : "NOT ADDRESSED");
  statuses.push(state.object && state.object!=="representation" ? "ALIGNED" : "PARTIAL");
  statuses.push((state.monitoring||[]).includes("provenance") || state.allocation==="none" ? "ALIGNED" : "PARTIAL");
  statuses.push(s.scopeDiscipline>=3 ? "ALIGNED" : s.scopeDiscipline===2 ? "PARTIAL" : "NOT ADDRESSED");
  statuses.push(state.rewarded==="votes" || state.rewarded==="rationales" ? "PARTIAL" : "ALIGNED");
  statuses.push(s.accountability>=3 ? "ALIGNED" : s.accountability===2 ? "PARTIAL" : "NOT ADDRESSED");
  statuses.push(s.contestability>=3 ? "ALIGNED" : s.contestability>=1 ? "PARTIAL" : "NOT ADDRESSED");
  statuses.push(state.scenario==="technical" && ["domain","veto"].includes(state.object) ? "ALIGNED" : "PARTIAL");
  statuses.push(state.allocation!=="treasury" ? "PARTIAL" : ["sunset","term","event"].includes(state.duration) ? "ALIGNED" : "NOT ADDRESSED");
  statuses.push(s.principalControl>=3 && s.reversibility>=3 ? "ALIGNED" : "PARTIAL");
  return PRINCIPLES.map((text,i)=>({text,status:statuses[i]}));
}

function assessStress(state, s){
  const test = STRESS_TESTS[state.stressTest];
  if(!test) return {title:"NO STRESS TEST", verdict:"NO DEFINED TEST", copy:"Select a failure condition to test the control surface."};
  let verdict="PARTIAL CONTROL SURFACE";
  let copy="The design contains some controls, but the failure still depends on judgment and replacement capacity.";
  if(s.principalControl>=3 && s.reversibility>=3 && s.accountability>=2){ verdict="DEFINED CONTROL SURFACE"; copy="The failure maps to explicit limits, consequences or a credible route back to the principal."; }
  if(s.principalControl<=1 || s.reversibility<=1){ verdict="NO RELIABLE CONTROL SURFACE"; copy="The architecture can observe the failure, but it lacks a strong mechanism to stop, narrow or reverse the authority."; }
  if(state.stressTest==="agent_irreversible" && s.automationRisk>=3){ verdict="AUTOMATION BOUNDARY TOO PERMISSIVE"; copy="Authority may not be revocable faster than an irreversible machine action can occur."; }
  return {title:test.title, verdict, copy};
}

function scoreBand(key, value){
  const positive = ["authorityClarity","scopeDiscipline","principalControl","contestability","accountability","reversibility"];
  if(positive.includes(key)) return value>=3?"STRONG":value===2?"MODERATE":"WEAK";
  if(key==="monitoringBurden") return value>=3?"HIGH":value===2?"MODERATE":"LOW";
  return value>=3?"ELEVATED":value===2?"MODERATE":"LOW";
}
