#!/usr/bin/env bash
set -euo pipefail

install_dir=/opt/oauth2-proxy
mkdir -p "${install_dir}"
cp -f deploy/oauth2-proxy/docker-compose.yml "${install_dir}/docker-compose.yml"
cp -f deploy/oauth2-proxy/web.cfg "${install_dir}/web.cfg"
cp -f deploy/oauth2-proxy/game.cfg "${install_dir}/game.cfg"
cp -f deploy/oauth2-proxy/vps.cfg "${install_dir}/vps.cfg"

cat <<'ENV' > "${install_dir}/.env"
OAUTH2_PROXY_CLIENT_ID=velocy-cloud
OAUTH2_PROXY_CLIENT_SECRET=change-me
OAUTH2_PROXY_COOKIE_SECRET=change-me
ENV

docker compose -f "${install_dir}/docker-compose.yml" up -d
