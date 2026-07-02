#!/bin/sh
# Continuous deployment script (leapdao/burner-wallet#144 pattern).
# Requires: AWS CLI, S3_BUCKET, CLOUDFRONT_DISTRIBUTION_ID env vars.
set -e

npm run build

if [ -z "$S3_BUCKET" ]; then
  echo "S3_BUCKET not set — skipping S3 sync (build artifact only)."
  exit 0
fi

aws s3 sync ./build "s3://${S3_BUCKET}/" --acl public-read

if [ -n "$CLOUDFRONT_DISTRIBUTION_ID" ]; then
  aws configure set preview.cloudfront true
  aws cloudfront create-invalidation --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" --paths "/*"
fi

echo "Deploy complete."
