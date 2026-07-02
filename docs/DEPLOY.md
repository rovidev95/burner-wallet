# Deployment (bounty #203)

Burner Wallet deploys to static hosting (S3 + CloudFront per leapdao/burner-wallet#144).

## Branches

| Branch | Target | Notes |
|--------|--------|-------|
| `rim` / `master` | Staging (`test.xdai.io` proposed) | Rinkeby/test networks |
| `production` | Production (`xdai.io`) | Maintainer-only merges |

See `docs/BRANCHING.md` for full git flow.

## GitHub Actions

`.github/workflows/deploy.yml` runs on push to `rim` and `production`:

1. **build** — `npm run build`
2. **deploy** — `scripts/ci_deploy.sh` (needs secrets below)

## Required secrets (repository settings)

| Secret | Purpose |
|--------|---------|
| `AWS_ACCESS_KEY_ID` | S3 upload |
| `AWS_SECRET_ACCESS_KEY` | S3 upload |
| `S3_BUCKET_STAGING` | Staging bucket name |
| `S3_BUCKET_PRODUCTION` | Production bucket name |
| `CLOUDFRONT_DISTRIBUTION_ID_STAGING` | Optional cache invalidation |
| `CLOUDFRONT_DISTRIBUTION_ID_PRODUCTION` | Optional cache invalidation |

@austintgriffith must add these secrets before deploy jobs run. Until then, the **build** job still validates production builds on every push.

## Local deploy

```bash
npm install --legacy-peer-deps
export S3_BUCKET=your-bucket
export CLOUDFRONT_DISTRIBUTION_ID=your-distribution
./scripts/ci_deploy.sh
```

## Legacy scripts

`pushToRelay.sh` and similar manual scripts can be retired once CD is verified on staging.
