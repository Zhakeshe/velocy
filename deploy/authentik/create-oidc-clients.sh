#!/usr/bin/env bash
set -euo pipefail

AK_URL=${AK_URL:-"https://sso.velocy.cloud"}
AK_TOKEN=${AK_TOKEN:-""}

if [[ -z "${AK_TOKEN}" ]]; then
  echo "Missing AK_TOKEN" >&2
  exit 1
fi

create_app() {
  local name="$1"
  local redirect_uri="$2"

  curl -sS -X POST "${AK_URL}/api/v3/core/applications/" \
    -H "Authorization: Bearer ${AK_TOKEN}" \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"${name}\",\"slug\":\"${name}\",\"provider\":\"\"}" >/dev/null

  curl -sS -X POST "${AK_URL}/api/v3/providers/oauth2/" \
    -H "Authorization: Bearer ${AK_TOKEN}" \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"${name}\",\"client_type\":\"confidential\",\"redirect_uris\":\"${redirect_uri}\",\"jwt_alg\":\"RS256\"}" >/dev/null
}

create_app "velocy-cloud" "https://velocy.cloud/api/auth/oidc"
create_app "panelweb" "https://panelweb.velocy.cloud/oauth2/callback"
create_app "panelgame" "https://panelgame.velocy.cloud/oauth2/callback"
create_app "panelvps" "https://panelvps.velocy.cloud/oauth2/callback"
