# Taller 2 de arquitectura

Este es un proyecto de una aplicacion con arquitectura de microservicios. En este repositorio se encuentra el MS de Monitoreo

## Instalacion del proyecto

1- Clonar el repositorio

```
git clone https://github.com/Taller-2-Arquitectura/MS-Monitoreo.git
```

2- Navegar a la carpeta del proyecto

```
cd Monitoreo
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

## Ejecucion de la aplicacion

Para ejecutar la aplicacion utilizaremos

```
npm start
```

Puede accederse mediante `http://localhost:3006` ya que la aplicacion se ejecuta en el puerto 3006

## Testing

En el repositorio se encuentra una coleccion de postman la cual se puede utilizar para los testeos de los endpoints aparte de los flujos pedidos
