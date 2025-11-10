#!/bin/sh
set -e

# Esperar a que MySQL esté disponible
until mysql -h "$DB_HOST" -u root -p"$DB_PASS" -e 'SELECT 1'; do
  echo "MySQL is unavailable - sleeping"
  sleep 1
done

echo "MySQL is up - executing seed"
# Ejecutar seed una sola vez
node src/seed.js

echo "Starting application"
# Iniciar la aplicación
node src/server.js