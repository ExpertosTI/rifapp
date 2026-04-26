#!/bin/bash
# healthcheck.sh - Script para monitorear y alertar si la app o la DB fallan

URL="https://rifapp.renace.space/api/healthz"
ALERT_EMAIL="tu-correo@dominio.com"

STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$URL")
if [ "$STATUS" != "200" ]; then
  echo "[ALERTA] Healthcheck falló ($STATUS) en $URL" | mail -s "[ALERTA] Rifapp caída" "$ALERT_EMAIL"
fi
