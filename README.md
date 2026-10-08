# Anomaly Lab

A five-minute, phone-first daily paranormal deduction game set in the Department 42 universe. This game shares branding with Department 42, not its codebase.

## Current state
Playable single-case prototype. The multi-case engine, verified puzzle generator and daily mode are planned, not yet implemented.

## Development documents
- [Roadmap and tasks](docs/ROADMAP.md)
- [Game design and formal validator contract](docs/GAME-DESIGN.md)
- [Studio Lite evaluation protocol](docs/STUDIO-LITE-TRIAL.md)
- [Development agent instructions](AGENTS.md)

## First task
AL-A01: inspect local and remote repository state, establish reproducible baseline tests, verify Case 001 and CI without modifying gameplay.

## Cloudflare deployment
Current site is a static HTML entrypoint (`index.html`). Verify GitHub integration, production branch and actual deployed commit in Cloudflare; GitHub push alone is not proof of deployment.
