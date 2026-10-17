#!/usr/bin/env bash
# .github/scripts/gitleaks-range.sh
# Conforms to BRD-QA-REL 1.0 (NFR-SEC-005)
# Scans git commit ranges including merge commits (-m) using verified gitleaks binary

set -euo pipefail

GITLEAKS_VERSION="8.18.4"
# Known sha256 checksum for gitleaks_8.18.4_linux_x64.tar.gz
GITLEAKS_SHA256="79930777e4860b73c4d9a4aa5303dfc807bcecf6e7887d15906d20ccbc0fcff7"

BIN_DIR="${RUNNER_TEMP:-/tmp}/gitleaks-bin"
mkdir -p "$BIN_DIR"

if [ ! -f "$BIN_DIR/gitleaks" ]; then
  echo "Downloading gitleaks v${GITLEAKS_VERSION}..."
  TARBALL="$BIN_DIR/gitleaks.tar.gz"
  curl -sSL "https://github.com/gitleaks/gitleaks/releases/download/v${GITLEAKS_VERSION}/gitleaks_${GITLEAKS_VERSION}_linux_x64.tar.gz" -o "$TARBALL"
  
  echo "${GITLEAKS_SHA256}  ${TARBALL}" | sha256sum -c -
  tar -xzf "$TARBALL" -C "$BIN_DIR" gitleaks
  chmod +x "$BIN_DIR/gitleaks"
fi

GITLEAKS="$BIN_DIR/gitleaks"

# Determine range
RANGE=""
if [ -n "${GITHUB_BASE_REF:-}" ]; then
  # Pull Request
  RANGE="origin/${GITHUB_BASE_REF}...HEAD"
elif [ -n "${GITHUB_EVENT_BEFORE:-}" ] && [ "${GITHUB_EVENT_BEFORE:-}" != "0000000000000000000000000000000000000000" ]; then
  # Push with valid before commit
  if git cat-file -e "${GITHUB_EVENT_BEFORE}" 2>/dev/null; then
    RANGE="${GITHUB_EVENT_BEFORE}..${GITHUB_SHA:-HEAD}"
  fi
fi

if [ -n "$RANGE" ]; then
  echo "Scanning commit range: $RANGE with merge commit inspection (-m)..."
  "$GITLEAKS" detect --source . --config .gitleaks.toml --log-opts="-m $RANGE" --verbose --redact
else
  echo "Scanning recent 50 commits with merge commit inspection (-m)..."
  "$GITLEAKS" detect --source . --config .gitleaks.toml --log-opts="-m -n 50" --verbose --redact
fi

echo "Gitleaks scan completed successfully."
