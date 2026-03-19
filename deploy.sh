#!/usr/bin/env bash
set -euo pipefail

# Configuración
SERVICE_NAME="rifapp_app"
IMAGE="ghcr.io/expertosti/rifapp:latest"

# 1) Obtener últimos cambios y build de imagen en CI
# (Este script se ejecuta DESPUÉS del push; aquí solo actualizamos el servicio.)

echo "[1/3] Verificando acceso al registro"
docker login ghcr.io -u "${GITHUB_USER:-token}" -p "${GITHUB_TOKEN:-token}"

echo "[2/3] Actualizando servicio ${SERVICE_NAME} a imagen ${IMAGE}"
docker service update \
  --with-registry-auth \
  --image "${IMAGE}" \
  --force \
  "${SERVICE_NAME}"

echo "[3/3] Estado del servicio"
docker service ps "${SERVICE_NAME}" --no-trunc

echo "Listo. Usa 'docker service logs -f ${SERVICE_NAME}' para monitorear."
