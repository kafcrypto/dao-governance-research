const RESEARCH_DATE = "25 AUGUST 2026";

const SCENARIOS = {
  attention: {
    code: "01",
    title: "ATTENTION OVERLOAD",
    short: "Healthy voting power. Routine participation is falling because tokenholders cannot rationally read every proposal.",
    cause: "INFORMATION OVERLOAD",
    burden: "ATTENTION COST",
    principal: "TOKENHOLDERS",
    possible: "General representation or triage / fewer votes.",
    source: "Handbook p. 11",
    stress: ["principals_inattentive", "firm_changes"]
  },
  quorum: {
    code: "02",
    title: "QUORUM FRAGILITY",
    short: "The DAO occasionally misses quorum because large amounts of voting power remain inactive.",
    cause: "INACTIVE VOTING POWER",
    burden: "QUORUM / ACTIVATION RISK",
    principal: "DAO / TOKENHOLDERS",
    possible: "Delegator incentives, temporary treasury bootstrap or quorum redesign.",
    source: "Handbook p. 11",
    stress: ["incentive_ends", "bootstrap_dominant"]
  },
  technical: {
    code: "03",
    title: "TECHNICAL BOTTLENECK",
    short: "Generalist governance participants repeatedly struggle to review specialized technical or risk decisions.",
    cause: "EXPERTISE GAP",
    burden: "EXPERTISE GAP",
    principal: "DAO / TOKENHOLDERS",
    possible: "Domain delegate / expert body or optimistic approval + veto.",
    source: "Handbook p. 11",
    stress: ["expert_wrong", "materiality_shift"]
  },
  latency: {
    code: "04",
    title: "OPERATIONAL LATENCY",
    short: "Routine parameter changes take too long because every adjustment requires full governance.",
    cause: "GOVERNANCE LATENCY",
    burden: "EXECUTION LATENCY",
    principal: "DAO / TOKENHOLDERS",
    possible: "Bounded steward authority or hard-coded automation.",
    source: "Handbook p. 11",
    stress: ["steward_compromised", "materiality_shift"]
  },
  institution: {
    code: "05",
    title: "INSTITUTIONAL FRICTION",
    short: "A professional holder has governance rights, but custody and authorization make proposal-by-proposal signing difficult.",
    cause: "CUSTODY / AUTHORIZATION WORKFLOW",
    burden: "CUSTODY FRICTION",
    principal: "INSTITUTIONAL HOLDER",
    possible: "External delegate or custodian-enabled internal vote.",
    source: "Handbook pp. 48–51",
    stress: ["client_conflict", "firm_changes"]
  },
  quiet: {
    code: "06",
    title: "QUIET GOVERNANCE",
    short: "The forum is quiet and voting activity is low because there is little material governance work.",
    cause: "LITTLE MATERIAL WORK",
    burden: "NOTHING MATERIAL",
    principal: "TOKENHOLDERS",
    possible: "None. Do not manufacture activity.",
    source: "Handbook pp. 11, 55",
    stress: ["calendar_quiet", "materiality_shift"]
  }
};

const AUTHORITY_OBJECTS = {
  vote: { title: "VOTING POWER", copy: "Cast the principal's weight on proposals.", scope: "POLITICAL", breadth: 3 },
  representation: { title: "REPRESENTATION", copy: "Exercise broad judgment on behalf of a principal or constituency.", scope: "BROAD POLITICAL", breadth: 4 },
  domain: { title: "DOMAIN AUTHORITY", copy: "Exercise judgment only inside a specified topic or track.", scope: "SPECIALIZED", breadth: 2 },
  veto: { title: "VETO / OVERRIDE", copy: "Stop or challenge an otherwise optimistic action.", scope: "EXCEPTION CONTROL", breadth: 2 },
  operational: { title: "OPERATIONAL AUTHORITY", copy: "Change live parameters inside predefined boundaries.", scope: "BOUNDED EXECUTION", breadth: 2 },
  execution: { title: "EXECUTION AUTHORITY", copy: "Translate an approved decision into a transaction or operational act.", scope: "EXECUTION", breadth: 2 },
  none: { title: "NO AUTHORITY", copy: "Keep direct control. No intermediary receives discretion.", scope: "DIRECT", breadth: 0 }
};

const AGENTS = {
  individual: { title:"INDIVIDUAL DELEGATE", copy:"A person receives delegated judgment." },
  professional: { title:"PROFESSIONAL GOVERNANCE ORGANIZATION", copy:"An organization provides recurring governance judgment." },
  expert: { title:"DOMAIN EXPERT / EXPERT BODY", copy:"A specialist actor or body receives narrow technical authority." },
  council: { title:"COUNCIL", copy:"A multi-member body receives defined representative, veto or expert authority." },
  steward: { title:"STEWARD", copy:"An operator receives bounded execution authority." },
  representative: { title:"VALIDATOR / REPRESENTATIVE", copy:"Representation follows a network or constitutional role." },
  custodian: { title:"CUSTODIAN WORKFLOW", copy:"The execution path stays inside institutional authorization rails." },
  software: { title:"SOFTWARE / RULE-BASED AGENT", copy:"A machine acts under an encoded rule or policy boundary." },
  none: { title:"NO AGENT", copy:"The principal keeps authority directly." }
};

const ALLOCATIONS = {
  organic: { title:"ORGANIC", copy:"Independent principals choose the agent with their own power.", risk:"Inertia / low-information selection.", provenance:"ORGANIC" },
  treasury: { title:"TREASURY / FOUNDATION", copy:"A DAO-controlled allocator bootstraps the agent.", risk:"Allocator dependence and legitimacy questions.", provenance:"ALLOCATED" },
  incentivized: { title:"INCENTIVIZED", copy:"Principals receive an economic reason to delegate.", risk:"Yield-driven concentration.", provenance:"INCENTIVIZED" },
  default: { title:"DEFAULT / EMBEDDED", copy:"Representation follows another relationship unless overridden.", risk:"Passive / stale consent.", provenance:"EMBEDDED" },
  election: { title:"ELECTION", copy:"A defined constituency selects the agent through a formal process.", risk:"Election design and incumbent advantage.", provenance:"ELECTED" },
  appointment: { title:"DIRECT APPOINTMENT / CONTRACT", copy:"A principal appoints a bounded role directly.", risk:"Principal dependence; scope must remain explicit.", provenance:"APPOINTED" },
  none: { title:"NO ALLOCATION", copy:"No delegation layer is created.", risk:"The principal retains the original workload.", provenance:"DIRECT" }
};

const MANDATES = {
  instructional: { title:"INSTRUCTIONAL", copy:"Optimize explicit principal preferences." },
  representative: { title:"REPRESENTATIVE", copy:"Represent delegators or a defined constituency." },
  stewardship: { title:"STEWARDSHIP", copy:"Use judgment for protocol or ecosystem health." },
  policy: { title:"POLICY-BASED", copy:"Follow published decision principles." },
  expert: { title:"EXPERT", copy:"Use domain-specific technical judgment." },
  none: { title:"NO DISCRETION", copy:"Execute predefined instructions only." }
};

const CONFLICT_RULES = {
  disclose: "DISCLOSE",
  abstain: "ABSTAIN",
  escalate: "ESCALATE TO PRINCIPAL",
  priority: "FOLLOW PUBLISHED PRIORITY RULE",
  return: "RETURN AUTHORITY",
  undefined: "NO DEFINED RULE"
};

const DISCRETION = {
  general: { title:"GENERAL", copy:"Broad judgment across governance." },
  bounded: { title:"BOUNDED", copy:"Judgment inside a defined scope." },
  rule: { title:"RULE-BASED", copy:"Action only when explicit conditions are satisfied." },
  instruction: { title:"INSTRUCTION-ONLY", copy:"No independent judgment." }
};

const DURATIONS = {
  open: "OPEN-ENDED",
  term: "FIXED TERM",
  event: "EVENT-BASED",
  sunset: "SUNSET CONDITION",
  revoke: "UNTIL REVOKED",
  one: "ONE ACTION ONLY"
};

const INCENTIVES = {
  unpaid: { title:"UNPAID REPRESENTATION", copy:"No direct role compensation." },
  fixed: { title:"FIXED ROLE COMPENSATION", copy:"A defined recurring role receives fixed compensation." },
  performance: { title:"PERFORMANCE / PARTICIPATION COMPENSATION", copy:"Payment responds to measured activity or performance." },
  delegator: { title:"DELEGATOR INCENTIVE", copy:"The principal is rewarded for activating delegation." },
  service: { title:"SERVICE-PROVIDER CONTRACT", copy:"Compensation is tied to operational scope or SLA." },
  expert: { title:"SCOPED EXPERT COMPENSATION", copy:"Payment is tied to a defined specialist role or review term." },
  none: { title:"NO ECONOMIC INCENTIVE", copy:"No direct economic reward is introduced." }
};

const REWARDED_BEHAVIOR = {
  votes: "VOTE COUNT",
  rationales: "RATIONALES / OUTPUT",
  availability: "AVAILABILITY",
  domain: "DOMAIN WORK",
  response: "RESPONSE TIME",
  mandate: "OUTCOME / MANDATE PERFORMANCE",
  activation: "DELEGATION / ACTIVATION",
  nothing: "NOTHING"
};

const EXECUTION_PATHS = {
  governor: "ONCHAIN GOVERNOR",
  snapshot: "SNAPSHOT / SIGNAL",
  multisig: "MULTISIG",
  steward: "STEWARD CONTRACT / MODULE",
  custodian: "CUSTODIAN WORKFLOW",
  optimistic: "OPTIMISTIC PROCESS",
  representative: "VALIDATOR / REPRESENTATIVE PATH",
  automated: "AUTOMATED RULE / CONTRACT",
  principal: "MANUAL PRINCIPAL EXECUTION"
};

const HARD_LIMITS = {
  transaction: "TRANSACTION LIMIT",
  parameter: "PARAMETER RANGE",
  timelock: "TIMELOCK",
  veto: "VETO WINDOW",
  multisig: "MULTISIG THRESHOLD",
  human: "HUMAN APPROVAL",
  none: "NONE"
};

const MONITORING = {
  votes:"VOTING LOGS",
  rationales:"PUBLIC RATIONALES",
  execution:"EXECUTION LOGS",
  conflicts:"CONFLICT DISCLOSURE",
  affiliation:"AFFILIATION DISCLOSURE",
  incidents:"INCIDENT REPORTING",
  review:"PERIODIC MANDATE REVIEW",
  provenance:"POWER PROVENANCE",
  response:"RESPONSE TIME",
  none:"NONE"
};

const CONSEQUENCES = {
  warning:"WARNING",
  reward:"REWARD REDUCTION",
  scope:"SCOPE REDUCTION",
  nonrenewal:"NON-RENEWAL",
  removal:"ROLE REMOVAL",
  signer:"SIGNER REMOVAL",
  recall:"TREASURY DELEGATION RECALL",
  review:"MANDATORY REDELEGATION REVIEW",
  override:"DIRECT OVERRIDE",
  nothing:"NOTHING"
};

const REVOKERS = {
  principal:"INDIVIDUAL PRINCIPAL",
  tokenholders:"TOKENHOLDERS",
  dao:"DAO VOTE",
  allocator:"FOUNDATION / ALLOCATOR",
  council:"COUNCIL",
  contract:"CONTRACT CONDITION",
  none:"NO CLEAR ACTOR"
};

const REVOCATION_SPEED = {
  immediate:"IMMEDIATE",
  short:"SHORT DELAY",
  timelock:"TIMELOCK",
  term:"END OF TERM",
  vote:"NEW GOVERNANCE VOTE",
  unclear:"UNCLEAR"
};

const CONTESTABILITY = {
  strong:"YES — MULTIPLE ALTERNATIVES",
  friction:"YES — BUT WITH FRICTION",
  weak:"NO — INCUMBENT DOMINATES",
  unknown:"UNKNOWN"
};

const STRESS_TESTS = {
  expert_wrong:{ title:"THE EXPERT BODY IS WRONG.", copy:"Does the architecture narrow the blast radius, force review, or merely observe the mistake?" },
  steward_compromised:{ title:"THE STEWARD KEY IS COMPROMISED.", copy:"Can execution be stopped before bounded authority becomes an irreversible incident?" },
  bootstrap_dominant:{ title:"THE BOOTSTRAP DELEGATE BECOMES DOMINANT.", copy:"Does temporary allocated power have a review, sunset or recall path?" },
  firm_changes:{ title:"THE GOVERNANCE FIRM CHANGES TEAM.", copy:"Does authority follow an institution indefinitely, or can the principal reassess the relationship?" },
  client_conflict:{ title:"A MATERIAL CLIENT CONFLICT APPEARS.", copy:"Does the mandate define disclosure, abstention, escalation or return of authority?" },
  principals_inattentive:{ title:"PRINCIPALS STOP PAYING ATTENTION.", copy:"Is monitoring a substitute for control, or can the arrangement drift indefinitely?" },
  incentive_ends:{ title:"THE INCENTIVE PROGRAM ENDS.", copy:"Was the delegation relationship real, or dependent on yield and interface design?" },
  calendar_quiet:{ title:"THE GOVERNANCE CALENDAR BECOMES QUIET.", copy:"Does the system keep manufacturing activity to justify the intermediary?" },
  materiality_shift:{ title:"A ROUTINE PROCESS BECOMES HIGH-MATERIALITY.", copy:"Can the issue leave the delegated lane and return to the principal?" },
  agent_irreversible:{ title:"THE SOFTWARE AGENT PROPOSES AN IRREVERSIBLE ACTION.", copy:"Can authority be revoked faster than the agent can act?" }
};

const CASES = {
  AAVE:{ title:"AAVE", copy:"Representation and bounded operational execution can live in different roles.", ref:"Handbook pp. 15, 63, 66" },
  UNISWAP:{ title:"UNISWAP", copy:"Temporary treasury delegation can be recalled when the bootstrap rationale weakens.", ref:"Handbook pp. 19, 63, 66" },
  ENS:{ title:"ENS", copy:"Incentives can target delegators, not only delegates.", ref:"Handbook pp. 7, 63" },
  ZKSYNC:{ title:"ZKSYNC", copy:"Activation incentives can create second-order concentration and discovery problems.", ref:"Handbook pp. 20, 63, 66" },
  OPTIMISM:{ title:"OPTIMISM", copy:"Less visible voting can coexist with governance capacity when optimistic processes preserve oversight.", ref:"Handbook pp. 7, 63, 66" },
  POLKADOT:{ title:"POLKADOT", copy:"Different experts can receive authority for different decision tracks.", ref:"Handbook pp. 41, 64" },
  LIDO:{ title:"LIDO", copy:"Delegate political capital and governance labor can evolve at different speeds.", ref:"Handbook pp. 40, 64, 66" },
  SAFE:{ title:"SAFE", copy:"A large registry does not mean active representation.", ref:"Handbook pp. 40, 64, 66" },
  RESERVE:{ title:"RESERVE", copy:"A delegate's job can shift from frequent voting toward vigilant optimistic oversight.", ref:"Handbook pp. 41, 63, 66" }
};

const PRINCIPLES = [
  "Delegate a defined problem, not a fashionable role.",
  "Separate voting, representation, veto and execution authority.",
  "Make power provenance visible.",
  "Limit discretion before adding monitoring.",
  "Do not mistake activity for judgment.",
  "Design consequence, not just disclosure.",
  "Technical exit is insufficient without practical replacement.",
  "Use specialization when generalist delegation becomes a bottleneck.",
  "Give bootstrap authority a review or sunset.",
  "Delegate the minimum discretion necessary — and preserve a credible path to take it back."
];
