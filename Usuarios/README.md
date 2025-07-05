# Taller 2 de arquitectura

Este es un proyecto de una aplicacion con arquitectura de microservicios. En este repositorio se encuentra el MS de Usuarios

## Instalacion del proyecto

1- Clonar el repositorio

```
git clone https://github.com/Taller-2-Arquitectura/MS-Videos.git
```

2- Navegar a la carpeta del proyecto

```
cd Usuarios
```

3- Instalar las dependencias

```
npm install
```

4- Crear un archivo `.env` y ingresar las variables de entorno

```
cp .env.example .env
```

## Base de datos y Docker

1- Levantar los contenedores docker para las bases de datos

```
docker compose up -d
```

2- Al estar usando un ORM (prisma) se debe generar los archivos necesarios para su ejecución.
Ejecutar el siguiente comando para generar el cliente:

```
npm run build
```

Ese comando ejecuta lo siguiente:

```
npx prisma generate --schema=prisma/mariadb/schema.prisma   
```

3- Luego creamos las bases de datos

```
npm run migrate
```

Ese comando ejecuta lo siguiente:

```
npx prisma db push --schema=prisma/mariadb/schema.prisma
```

## Ejecucion de la aplicacion

Para ejecutar la aplicacion utilizaremos

```
npm start
```

Puede accederse mediante `http://localhost:3003` ya que la aplicacion se ejecuta en el puerto 3003

## Seeder

Para poblar la base de datos usar el siguiente comando

```
npm run seed
```

## Testing

En el repositorio se encuentra una coleccion de postman la cual se puede utilizar para los testeos de los endpoints aparte de los flujos pedidos
