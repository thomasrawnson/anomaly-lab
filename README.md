# Anomaly Lab

A five-minute, phone-first daily paranormal deduction game set in the Department 42 universe. This game shares branding with Department 42, not its codebase.

## Current state
Single-case prototype. The multi-case engine, verified puzzle generator and daily mode are planned, not yet implemented.

The AL-A01 bounded repair resolves the baseline page startup collision, and all 15 automated tests pass. Browser/phone checks and hosted CI remain unverified; see [baseline evidence and status](docs/BASELINE-AUDIT.md).

## Local checks
Use Node.js 24. Run `npm test` for the case validator checks and prototype smoke suite, or `npm run test:smoke` for interactions alone. No dependencies or build step are required. Open `index.html` in a browser for manual testing; keep `case-001.js` beside it when serving the static site.

Smoke tests execute the actual page scripts using a small DOM adapter, including startup, tutorial, experiments, submission, final choice, result branches and restart. They do not replace browser or phone testing. The GitHub Actions workflow runs `npm test` on push, pull request and manual dispatch; adding the workflow locally does not prove a hosted CI run.

## Development documents
- [Roadmap and tasks](docs/ROADMAP.md)
- [Game design and formal validator contract](docs/GAME-DESIGN.md)
- [Studio Lite evaluation protocol](docs/STUDIO-LITE-TRIAL.md)
- [Development agent instructions](AGENTS.md)
- [Puzzle-validation skill](.agents/skills/puzzle-validation/SKILL.md)
- [AI skills register](docs/AI-SKILLS-REGISTER.md)

## First task
AL-A01: inspect local and remote repository state, establish reproducible baseline tests, verify Case 001 and CI without modifying gameplay. Findings and outstanding checks are recorded in [the baseline audit](docs/BASELINE-AUDIT.md). AL-A02 remains dependent on acceptance of this slice.

## Cloudflare deployment
Current site is a static HTML entrypoint (`index.html`). Verify GitHub integration, production branch and actual deployed commit in Cloudflare; GitHub push alone is not proof of deployment.
