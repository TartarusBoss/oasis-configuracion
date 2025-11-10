# Oasis Configuración

Sistema de gestión de escenarios deportivos.

**Autor**: Matias Herrera Vanegas  
**Universidad**: Universidad de Medellín  
**Asignatura**: Gestión de la Configuración  
**Semestre**: 2025-2


**Frontend**: Aplicación web desarrollada en **React + Vite**.
**Backend**: API REST creada con **Node.js + Express** y documentada con **Swagger (OpenAPI)**.
**Base de datos**: Persistencia de datos en **MySQL** utilizando **Sequelize** como ORM.
**Contenerización**: Implementación de contenedores con **Docker** y orquestación con **Docker Compose**.
**Documentacion**: Implementacion con Swagger (OpenAPI).


La aplicación permite la gestión de reservas y está diseñada con un enfoque modular, facilitando su despliegue tanto en entornos locales como en entornos contenerizados.



Ejecutar proyecto con Docker:
0. Clonar el repositorio: git clone https://github.com/TartarusBoss/oasis-configuracion.git
1. Ir a la carpeta raíz del proyecto donde está docker-compose.yml (Carpeta Oasis - Configuracion)
2. Ejecutar el comando docker-compose up --build, eso levanta los servicios db, backend y frontend
3. Para verificar los servicios se acceden a las siguientes direcciones: 

    Frontend: http://localhost:5173

    Backend: http://localhost:4000 -> responde status:ok si está bien

    Swagger: http://localhost:4000/api/docs

4. Detener contenedor con docker-compose down    


