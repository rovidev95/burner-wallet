# Git Branching & Release Flow

This document proposes a branch model for [burner-wallet](https://github.com/austintgriffith/burner-wallet) to reduce instability on `master` while keeping fast iteration. It complements continuous deployment (see issue #203) once hosting access is configured.

## Branches

| Branch | Purpose | Deploy target (proposed) |
|--------|---------|---------------------------|
| `master` | Stable integration branch; only tested merges | Staging (e.g. `test.xdai.io`) |
| `rim` | Active feature development (Rimble UI, xDAI theme) | Preview / dev |
| `production` | Release branch tagged for mainnet xDAI deployment | Production (`xdai.io`) |
| `develop` | Optional integration branch for larger efforts | None (CI only) |

Feature branches should be short-lived: `feature/<issue>-<short-description>` or `fix/<issue>-<short-description>`.

## Workflow for contributors

1. **Fork** the repo and clone locally.
2. **Branch** from `rim` (or `master` if fixing production-only bugs) — e.g. `git checkout -b fix/issue-200-qr-no-reload rim`.
3. **Implement** with focused commits; reference the bounty issue in the PR body (`Fixes #200`).
4. **Open a PR** against `rim` (or `master` as directed by maintainers).
5. **Review** — bounty reviewers verify scope per the issue; gardener merges when approved.
6. **Merge upstream** — `rim` → `master` on a schedule or after a release checklist; `master` → `production` for production deploys only.

## Merge policy

- **Into `rim`**: Bounty PRs, UI migrations, non-breaking fixes. CI must pass.
- **Into `master`**: After QA on staging; no known regressions on send/receive/exchange.
- **Into `production`**: Maintainer-only; requires @austintgriffith or delegated deploy access.

## Protecting `master`

- Require PR reviews (at least one maintainer or bounty reviewer).
- Require CI (tests + lint + dependency pin check) — see `.github/workflows/ci.yml`.
- No direct pushes to `production`.

## New developer checklist

```bash
git clone https://github.com/<your-fork>/burner-wallet.git
cd burner-wallet
git remote add upstream https://github.com/austintgriffith/burner-wallet.git
git fetch upstream
git checkout -b my-fix upstream/rim
npm install --legacy-peer-deps
npm start
```

## Relation to other bounties

- **#212** — URL behavior documented in `docs/SPECIAL_URLS.md`
- **#203** — CD pipelines should trigger on `master` (staging) and `production` (xdai.io)
- **#228** — CI runs on all PRs via GitHub Actions

## Maintainer notes

Branch names and deploy URLs should be confirmed with @austintgriffith before changing production DNS or Firebase/hosting config. This document can be moved to the [project wiki](https://github.com/austintgriffith/burner-wallet/wiki) if preferred.
