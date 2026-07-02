# Generate yarn.lock (bounty #216 supplement)
# Run on Ubuntu/macOS where git+https deps resolve correctly:
#   ./scripts/generate-yarn-lock.sh
# Windows: use GitHub Actions artifact from workflow generate-yarn-lock.yml

set -e
git config --global url."https://github.com/".insteadOf git://github.com/ || true
npx yarn@1.22.22 import || npx yarn@1.22.22 install --ignore-scripts
echo "yarn.lock generated. Commit and push."
