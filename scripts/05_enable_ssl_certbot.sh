#!/usr/bin/env bash
set -euo pipefail

certbot --nginx \
  -d panelweb.velocy.cloud \
  -d panelgame.velocy.cloud \
  -d panelvps.velocy.cloud \
  -d sso.velocy.cloud \
  --agree-tos \
  --redirect \
  -m admin@velocy.cloud
