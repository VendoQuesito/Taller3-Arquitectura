#!/bin/sh

echo "Esperando a que las bases de datos estén disponibles..."

# Esperar a que MariaDB (puerto 3306) esté lista
until nc -z mariadb-auth 3306; do
  echo "Esperando a MariaDB (mariadb-auth:3306)..."
  sleep 2
done

# Esperar a que PostgreSQL (puerto 5432) esté lista
until nc -z postgres-auth 5432; do
  echo "Esperando a PostgreSQL (postgres-auth:5432)..."
  sleep 2
done

echo "Bases de datos disponibles, ejecutando migraciones..."

# Ejecutar las migraciones con prisma
npx prisma db push --schema=prisma/mariadb/schema.prisma
npx prisma db push --schema=prisma/postgres/schema.prisma

echo "Migraciones aplicadas correctamente."

# Ejecuta el comando principal del contenedor (por ejemplo: npm start)
exec "$@"
