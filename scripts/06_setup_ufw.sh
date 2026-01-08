#!/usr/bin/env bash
set -euo pipefail

ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw deny 8090/tcp
ufw deny 3000/tcp
ufw deny 8006/tcp
ufw --force enable
