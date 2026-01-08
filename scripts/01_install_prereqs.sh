#!/usr/bin/env bash
set -euo pipefail

apt-get update
apt-get install -y nginx certbot python3-certbot-nginx docker.io docker-compose-plugin
systemctl enable --now nginx
systemctl enable --now docker
