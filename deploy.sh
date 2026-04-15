#!/usr/bin/env bash
set -euo pipefail

# Configuración
SERVICE_NAME="rifapp_app"
IMAGE="ghcr.io/expertosti/rifapp:latest"

# 1) Obtener últimos cambios y build de imagen en CI
# (Este script se ejecuta DESPUÉS del push; aquí solo actualizamos el servicio.)

# 1) Verificar acceso al registro (si no están las variables, asume que ya se hizo login manualmente)
echo "[1/3] Verificando acceso al registro"

if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

if [[ -n "${GITHUB_USER:-}" && -n "${GITHUB_TOKEN:-}" ]]; then
  echo "Intentando login automático con GITHUB_USER y GITHUB_TOKEN..."
  echo "${GITHUB_TOKEN}" | docker login ghcr.io -u "${GITHUB_USER}" --password-stdin
else
  echo "GITHUB_USER o GITHUB_TOKEN no definidos. Saltando login automático."
  echo "Asegúrate de haber ejecutado 'docker login ghcr.io' manualmente."
fi

echo "[2/3] Actualizando servicio ${SERVICE_NAME} a imagen ${IMAGE}"
docker service update \
  --with-registry-auth \
  --image "${IMAGE}" \
  --force \
  "${SERVICE_NAME}"

echo "[3/3] Estado del servicio"
docker service ps "${SERVICE_NAME}" --no-trunc

echo "Listo. Usa 'docker service logs -f ${SERVICE_NAME}' para monitorear."
