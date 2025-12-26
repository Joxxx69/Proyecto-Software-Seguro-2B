


# Proyecto-Software-Seguro-2B

Plataforma basada en **microservicios** enfocada en **seguridad, privacidad y gobernanza de datos**: autenticación, gestión de usuarios, manejo de datos personales, consentimientos, transparencia, auditoría, políticas de seguridad y notificaciones, expuesta a través de un **API Gateway** y consumida por un **frontend**.

## 🧩 Arquitectura (alto nivel)

Este repositorio se compone de:

- Microservicios:
  - `auth-ms` – Autenticación / emisión-validación de tokens
  - `user-ms` – Gestión de usuarios
  - `personal-data-ms` – Datos personales (PII)
  - `consent-ms` – Registro y validación de consentimientos
  - `transparency-ms` – Transparencia / trazabilidad / solicitudes de acceso (según alcance)
  - `audit-ms` – Auditoría de eventos (acciones sobre recursos sensibles)
  - `security-ms` – Reglas/políticas de seguridad (según alcance)
  - `notification-ms` – Notificaciones (email/in-app/colas, según alcance)

- `client-gateway` – **Gateway/BFF** para centralizar acceso del cliente a los microservicios
- `front-end` – Aplicación web

> Los servicios y carpetas anteriores están presentes en la raíz del repo.  
> Ver estructura en la sección “Estructura del proyecto”.

## 📁 Estructura del proyecto

```

.
├── audit-ms/
├── auth-ms/
├── client-gateway/
├── consent-ms/
├── front-end/
├── notification-ms/
├── personal-data-ms/
├── security-ms/
├── transparency-ms/
├── user-ms/
├── docker-compose.yml
├── .env.template
├── .env
├── install-dependencies.sh
├── package.json
└── package-lock.json

````

## 🛠️ Tecnologías

- **Node.js / TypeScript / JavaScript** (principalmente)
- **Docker + Docker Compose** para ejecución local
- **Arquitectura de microservicios** + API Gateway
- Enfoque de “Software Seguro”: control de acceso, auditoría, privacidad y configuración por entorno

## ✅ Requisitos

- Docker + Docker Compose (recomendado para levantar todo)
- Node.js (si deseas ejecutar servicios localmente sin contenedores)
- Git

## 🔐 Variables de entorno

1. Copia el template a un archivo local:

```bash
cp .env.template .env
````

2. Completa las variables en `.env` según tu entorno.

> **Importante:** No subas secretos al repositorio.
> `.env` debe contener claves/credenciales **solo para tu entorno local**.

## 🚀 Quickstart (Docker)

Levantar todo el stack con Docker:

```bash
docker compose up --build
```

* Para detener:

```bash
docker compose down
```

> Puertos/URLs: revisa el archivo `docker-compose.yml` para ver los mapeos de cada servicio.

## ▶️ Instalación de dependencias (modo local)

Este repo incluye un script `install-dependencies.sh` para instalar dependencias (útil si necesitas correr sin Docker):

```bash
bash install-dependencies.sh
```

Luego, entra a cada microservicio / gateway / frontend y ejecuta el comando correspondiente (por ejemplo `npm run dev` o `npm start`), según el `package.json` de cada módulo.

## 🌐 Flujo de uso (típico)

1. El usuario interactúa con el **frontend**.
2. El frontend consume el **client-gateway**.
3. El gateway valida autenticación/autorización y enruta a microservicios:

   * `auth-ms` para login/refresh y emisión de tokens
   * `user-ms` para gestión de usuarios
   * `personal-data-ms` para datos personales (bajo políticas y consentimiento)
   * `consent-ms` para validación/registro de consentimientos
   * `audit-ms` para registrar eventos sensibles
   * `notification-ms` para notificaciones
   * `security-ms` y `transparency-ms` según el alcance del caso

## 🧪 Pruebas

Si cada servicio incluye tests, ejecútalos desde su carpeta:

```bash
npm test
```

Recomendado:

* unit tests por microservicio
* pruebas de integración para flujos críticos (login → acceso a datos → auditoría)

## 🛡️ Consideraciones de seguridad (checklist)

Sugerencias mínimas para un proyecto “software seguro”:

* ✅ No commitear secretos (`.env` no debe contener credenciales reales en el historial)
* ✅ Hash seguro de contraseñas (bcrypt/argon2)
* ✅ Tokens con expiración + refresh tokens (si aplica)
* ✅ Validación de entrada (DTO/schema validation) y manejo de errores consistente
* ✅ CORS controlado en gateway
* ✅ Rate limiting / protección anti brute force en endpoints de autenticación
* ✅ Auditoría de accesos y cambios a PII
* ✅ Principio de mínimo privilegio (roles/scopes claros)

## 🧑‍🤝‍🧑 Equipo / Autores

* Contributors: ver sección **Contributors** en GitHub.




