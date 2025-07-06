#!/bin/sh

echo "Esperando a que la base de datos esté disponible..."

# Espera a que la BD MariaDB esté disponible (ajusta el hostname y puerto si es necesario)
until nc -z mariadb 3306; do
  echo "Esperando a MariaDB..."
  sleep 2
done

echo "Base de datos disponible, ejecutando migraciones..."

# Ejecuta las migraciones o db push con prisma
npx prisma db push --schema=prisma/mariadb/schema.prisma

echo "Migraciones aplicadas."

# Ejecuta el comando que se pase como argumento (npm start)
exec "$@"
