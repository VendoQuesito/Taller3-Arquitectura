# Taller 2 de arquitectura

Este es un proyecto de una aplicacion con arquitectura de microservicios en este caso este es la API gateway que conectara todos los microservicios creados

## Instalacion del proyecto

1- Clonar el repositorio

```
git clone https://github.com/Taller-2-Arquitectura/API-Gateway.git
```

2- Navegar a la carpeta del proyecto

```
cd Gateway
```

3- Instalar las dependencias

```
npm install
```

4- Crear un archivo `.env` y ingresar las variables de entorno

```
cp .env.example .env
```

## Contenedores de Docker

1- Levantar los contenedores docker para las bases de datos

```
docker compose up -d
```

## Ejecucion de la aplicacion

Para ejecutar la aplicacion utilizaremos

```
npm start
```

Puede accederse mediante `http://localhost:3001` ya que la aplicacion se ejecuta en el puerto 3001

## Testing

En el repositorio se encuentra una coleccion de postman la cual se puede utilizar para los testeos de los endpoints aparte de los flujos pedidos
