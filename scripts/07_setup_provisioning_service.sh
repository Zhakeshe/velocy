#!/usr/bin/env bash
set -euo pipefail

mkdir -p /opt/velocy-theme
cp -f deploy/theme/tokens.css /opt/velocy-theme/tokens.css
cp -f deploy/proxmox/velocy-theme.css /opt/velocy-theme/proxmox.css
cp -f deploy/pterodactyl/velocy-theme.css /opt/velocy-theme/pterodactyl.css
cp -f deploy/cyberpanel/velocy-theme.css /opt/velocy-theme/cyberpanel.css

cron_job="* * * * * curl -sS -X POST -H 'x-provisioning-token: change-me' https://velocy.cloud/api/provisioning/run?limit=2 >/dev/null"
( crontab -l 2>/dev/null | grep -v provision | cat; echo "${cron_job}" ) | crontab -
