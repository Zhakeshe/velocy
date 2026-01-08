#!/usr/bin/env bash
set -euo pipefail

cp -f deploy/nginx/snippets/*.conf /etc/nginx/snippets/
cp -f deploy/nginx/sites/*.conf /etc/nginx/sites-available/

for site in panelweb.velocy.cloud panelgame.velocy.cloud panelvps.velocy.cloud sso.velocy.cloud; do
  ln -sf "/etc/nginx/sites-available/${site}.conf" "/etc/nginx/sites-enabled/${site}.conf"
done

nginx -t
systemctl reload nginx
