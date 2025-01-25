# Proyecto de Software Seguro 2B

Este proyecto consiste en un conjunto de microservicios implementados con NestJS, cuyo objetivo es proporcionar una arquitectura segura y escalable.

## Requisitos previos

Antes de comenzar, asegúrate de tener instalados los siguientes programas en tu máquina:

- **Node.js**: Versión recomendada (al menos la versión LTS más reciente)
- **npm**: Administrador de paquetes de Node.js
- **NestJS CLI**: Herramienta de línea de comandos para trabajar con NestJS

## Clonar el repositorio

Para clonar el repositorio en tu máquina local, utiliza el siguiente comando:

```bash
git clone https://github.com/Joxxx69/Proyecto-Software-Seguro-2B.git
```

## Instalación de dependencias
Una vez que hayas clonado el repositorio, debes instalar las dependencias de los microservicios. Dirígete al directorio de cada microservicio y ejecuta:

```bash
npm install
```

Esto instalará todas las dependencias necesarias para que los microservicios funcionen correctamente.


## Generar módulos en los microservicios

Para generar nuevos módulos dentro de un microservicio, puedes utilizar el comando de NestJS CLI. Desde el directorio del microservicio correspondiente, ejecuta:

```bash
nest g res nombre-modulo --no-spec
```

Este comando generará un módulo de tipo resource (recurso), que incluye un controlador, servicio y el módulo correspondiente, sin los archivos de prueba (ya que hemos utilizado la opción --no-spec).