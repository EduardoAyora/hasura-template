# Hasura Template

Docker Compose con ambiente de desarrollo y producción

## Acerca de

En la aplicación se utiliza Hasura y Node con Express. En la base de datos tenemos postgres.

## Uso

Clonar el proyecto

```
git clone git@github.com:EduardoAyora/hasura-template.git
cd ./hasura-template
```

Crear archivo .env y agregar las variables de entorno:

```
HASURA_GRAPHQL_ADMIN_SECRET=contraseña-para-usar-hasura-como-admin
HASURA_GRAPHQL_JWT_SECRET=secret-para-jwt
HASURA_GRAPHQL_JWT_SECRET_JSON={"key":"mismo-secret-para-jwt","type":"HS256"}
```

Arrancar el ambiente de desarrollo:

```
docker-compose -f "docker-compose.dev.yml" up -d
```


Arrancar el ambiente de producción:

```
docker-compose up -d
```