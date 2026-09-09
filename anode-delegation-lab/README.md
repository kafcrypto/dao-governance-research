# Anode Delegation Lab

Static interactive governance-design experience based on **The DAO Delegation Handbook V2 / 2026**.

## What it does

Users select a governance problem, define the authority object, agent, power-allocation mechanism, mandate, discretion, incentives, execution controls, monitoring, consequence, revocation and contestability, then stress-test the design.

The result is a multidimensional architecture dashboard rather than a single governance score.

## Source basis

Research and terminology are derived from the handbook, including:

- Source → Scope → Discretion → Execution → Revocation
- the 12-question Delegation Architecture Canvas
- diagnosis-before-delegation table
- power provenance distinctions
- Transparency ≠ Accountability
- Revocability ≠ Contestability
- ten final design principles
- current/historical cases including Aave, Uniswap, ENS, ZKsync, Optimism, Polkadot, Lido, Safe and Reserve

Research current through 25 August 2026 unless otherwise noted in the handbook.

## Files

- `index.html` — shell and navigation
- `styles.css` — Anode-inspired editorial UI
- `data.js` — scenarios, choices, case evidence and handbook concepts
- `scoring.js` — transparent multidimensional evaluation rules
- `app.js` — rendering, state, localStorage and share-link logic

## Static hosting

The project requires no backend, wallet or API keys. It is compatible with GitHub Pages and public static-file services such as raw.githack.com.

Share URLs encode the finished architecture in the URL hash. No answers are transmitted to a server by the app itself.
