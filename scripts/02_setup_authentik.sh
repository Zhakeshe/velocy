#!/usr/bin/env bash
set -euo pipefail

install_dir=/opt/authentik
mkdir -p "${install_dir}"
cp -f deploy/authentik/docker-compose.yml "${install_dir}/docker-compose.yml"

cat <<'ENV' > "${install_dir}/.env"
AUTHENTIK_SECRET_KEY=change-me
POSTGRES_PASSWORD=authentik
ENV

docker compose -f "${install_dir}/docker-compose.yml" up -d
