# Despliegue local (Docker Desktop Kubernetes)

Objetivo: que tu profesor ejecute el menor número posible de comandos para levantar todo en su máquina local.

Requisitos mínimos:
- Docker Desktop instalado y Kubernetes habilitado (Kubeadm, versión v1.34.1 recomendada).
- Git, Docker y kubectl en PATH.

Pasos (1 comando):

Abre PowerShell en la raíz del repo y ejecuta:

```powershell
powershell -ExecutionPolicy Bypass -File .\kube\deploy-local.ps1
```

Qué hace el script:
- Compila las imágenes locales (backend, frontend, DB personalizada).
- Aplica los manifiestos en `./kube` (Deployment, Service, ConfigMap, Secret, PVC).
- Espera a que los deployments completen el rollout y muestra pods, servicios y PVC.
- Indica las URLs locales: frontend -> http://localhost:30080, backend -> http://localhost:30400

Notas:
- El script asume Docker Desktop con Kubernetes; si usas Minikube deberás cargar las imágenes con `minikube image load ...` antes de aplicar los manifests (o hacer push a Docker Hub).
- Cambia `kube/secret.yaml` si quieres otro password/jwt secret antes de ejecutar el script.

Comandos de verificación manual rápida:

```powershell
kubectl get pods -A
kubectl get svc -A
kubectl get pvc -A
```

Si necesitas que el script también haga `docker push` a Docker Hub, puedo añadir esa funcionalidad (requiere DOCKERHUB credentials).

Ejecutar con doble clic (para tu profesor)
--------------------------------------
He incluido un archivo `run-deploy.bat` en la raíz del repositorio. Si tu profesor trabaja en Windows puede simplemente hacer doble clic sobre ese archivo. El archivo ejecutará `deploy-local.ps1` con la política de ejecución adecuada.

Notas importantes sobre "sin comandos":
- El doble clic ejecuta automáticamente los pasos, pero el equipo del profesor debe tener instaladas las herramientas requeridas (Docker Desktop con Kubernetes activado, `kubectl`, y `git` si lo desea). Si falta alguna herramienta, el script imprimirá una advertencia.
- Si prefieres soporte para macOS/Linux (un doble clic equivalente), puedo añadir un script `run-deploy.sh` que haga lo mismo en sistemas UNIX.

Observabilidad incluida
-----------------------
Este repositorio ahora incluye una integración mínima de observabilidad:
- Prometheus: recoge métricas expuestas por el backend en `/metrics`.
- Grafana: desplegada y pre-configurada con un dashboard simple que muestra intentos de login.

URLs tras ejecutar el script (doble clic):
- Grafana: http://localhost:30000  (user: admin / pass: admin)
- Prometheus: http://localhost:30900

Evidencia
---------
El dashboard de Grafana (panel "Login attempts") ya está importado automáticamente. Puedes abrir Grafana en http://localhost:30000 y ver el panel.

Si quieres, puedo exportar el JSON del dashboard a una carpeta `artifacts/` y añadir una captura; dime si la quieres incluida en el repo.
