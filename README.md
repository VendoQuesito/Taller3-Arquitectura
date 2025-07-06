## Taller 3 Arquitectura de sistemas

Este es el Taller N3 de arquitectura de sistemas que son los microservicios y API Gateway del 2do taller pero ahora dockerizado para su despliegue.

---

## Herramientas

| Componente            | Tecnología                                    |
| --------------------- | ---------------------------------------------- |
| Lenguaje principal    | Node.js                                        |
| API Gateway           | Express + NGINX                                |
| Microservicios        | Express (Node.js)                              |
| Bases de datos        | MongoDB, MariaDB, PostgreSQL                   |
| ORM                   | Prisma                                         |
| Comunicación interna | HTTP vía NGINX / API Gateway<br />MS por GRPC |
| Autenticación        | JWT                                            |
| Contenerización      | Docker, Docker Compose                         |
| CI/CD                 | GitHub Actions                                 |
| Testing E2E           | Jest + Supertest                               |

---

## Instalación y ejecución

### 1. Clona este repositorio

```
git clone https://github.com/VendoQuesito/Taller3-Arquitectura.git
```

Para navegar a la carpeta del proyecto

```
cd Taller3
```

### 3. Construye y levanta todos los servicios

```
docker-compose up -d --build
```

Esto levantará:

* Bases de datos
* Todos los MS
* NGINX en el puerto `80` actuando como balanceador/API Gateway

### 4. Accede a los servicios

* API Gateway: `http://localhost3001`

---

## Pruebas End-to-End (E2E)

Las pruebas E2E se ejecutan automáticamente en **GitHub Actions**

Las pruebas validan el **flujo completo de CRUD de usuarios** a través de la  **API Gateway** , incluyendo casos exitosos y errores en los endpoints:

* `POST /auth/login`
* `POST /usuarios`
* `GET /usuarios/{id}`
* `PATCH /usuarios/{id}`
* `DELETE /usuarios/{id}`
* `GET /usuarios`

Para correrlas hay que:

```
cd Gateway
npm i
npm test
```

De esta manera nos iremos a la carpeta de la gateway, instalaremos las dependencias y ejecutaremos los testeos

---

## CI/CD (GitHub Actions)

### Docker Push (Producción)

Cada microservicio tiene configurado un pipeline que:

* Se activa al hacer push a `main`
* Construye la imagen Docker del microservicio
* La sube a Docker Hub con el tag `latest`
* Le asigna localmente el tag `sha` del commit

### E2E Tests

El pipeline de pruebas:

* Se activa cuando hay cambios en el microservicio de usuarios o en las pruebas
* Levanta todo el stack con Docker Compose
* Ejecuta los tests E2E usando Jest + Supertest


### Seeders

En caso de querer crear algunos datos de prueba simplemente ejecutar en los contenedores

```
npm run seed
```
