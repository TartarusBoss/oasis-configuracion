# Oasis Configuración

Sistema de gestión de escenarios deportivos.

**Autor**: Matias Herrera Vanegas  
**Universidad**: Universidad de Medellín  
**Asignatura**: Gestión de la Configuración  
**Semestre**: 2025-2

## Descripción del sistema (arquitectura general)

OASIS es una aplicación web de tres capas:
1.	Frontend (React + Vite): Interfaz web que ven los usuarios. Se ejecuta en el navegador y hace peticiones HTTP al backend.
2.	Backend (Node.js + Express): API REST que procesa la lógica de negocio (autenticación, validaciones, etc.) y se comunica con la base de datos.
3.	Database (MySQL): Almacena toda la información de usuarios, reservas y escenarios.
Flujo de una petición:
Usuario → Frontend (React) → Backend (Node.js) → Database (MySQL) → Respuesta
Stack tecnológico:
•	Frontend: React, Vite (bundler rápido), Axios (cliente HTTP)
•	Backend: Node.js, Express (framework web), Sequelize (ORM para MySQL)
•	Database: MySQL
•	DevOps: Docker (contenedores), Kubernetes (orquestación), GitHub Actions (automatización)
•	Testing: Jest (backend), Vitest (frontend), React Testing Library
•	El usuario interactúa con la UI; el frontend prepara una petición HTTP (JSON) hacia el backend.
•	El backend recibe la petición, pasa por middleware (logs, autenticación, validaciones). Si requiere autenticación valida el JWT.
•	El handler del endpoint usa Sequelize para consultar o modificar MySQL (consultas, transacciones).
•	El resultado se transforma a JSON y se devuelve al frontend, que actualiza la UI.
•	Errores y eventos se registran: entradas relevantes van al buffer de logs y al panel /admin; las líneas también salen a stdout para kubectl logs.



Enlaces: 
Link de imágenes Dockerhub:
https://hub.docker.com/repository/docker/tartarusboss/oasis-frontend/general
hub.docker.com/repository/docker/tartarusboss/oasis-backend
https://hub.docker.com/repository/docker/tartarusboss/oasis-db/general

Link de GitHub: https://github.com/TartarusBoss/oasis-configuracion.git

Link del Pipeline de GitHub:

Documentación técnica: https://docs.google.com/document/d/1dnU-oXIE7oFE6QvFcLgQkRtYCa_f77BiiPgnJZ0I1Y8/edit?usp=sharing




## Despliegue local (Minikube)

Pasos básicos para levantar la aplicación en Minikube:

1. tener instalados `minikube` y `kubectl`.
2. Arranca Minikube:

```powershell
minikube start
```

3. Aplica los manifiestos Kubernetes que están en la carpeta `kube`: 

```powershell
kubectl apply -f ./kube
```

4. Comprueba el estado de pods y servicios:

```powershell
kubectl get pods
kubectl get svc

Para acceder a la aplicación debes ejecutar este comando y abrir el link:

minikube service oasis-frontend --url

Y listo ahí verás la aplicación desplegada




## Ejecución alternativa(Docker / Docker Compose)

Opción A — Docker Compose 

1. Clona el repositorio 
```powershell
git clone https://github.com/TartarusBoss/oasis-configuracion.git
cd oasis-configuracion
```

2. Levanta los servicios con Docker Compose (desde la raíz del proyecto):

```powershell
docker-compose up --build
```

3. Servicios disponibles :

- Frontend: http://localhost:5173
- Backend: http://localhost:4000 (endpoint `/` responde `status: ok`)
- Swagger: http://localhost:4000/api/docs

4. Para parar y eliminar contenedores:

```powershell
docker-compose down
```





