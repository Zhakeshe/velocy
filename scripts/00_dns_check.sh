#!/usr/bin/env bash
set -euo pipefail

domains=(
  velocy.cloud
  panelweb.velocy.cloud
  panelgame.velocy.cloud
  panelvps.velocy.cloud
  sso.velocy.cloud
)

for domain in "${domains[@]}"; do
  echo "Checking ${domain}..."
  dig +short "${domain}" || true
  echo "-----"
done
