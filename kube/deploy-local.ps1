# Deploy script for local Docker Desktop Kubernetes
# Usage: Open PowerShell in the repo root and run:
#   powershell -ExecutionPolicy Bypass -File .\kube\deploy-local.ps1

Set-StrictMode -Version Latest

function ExitWith($msg, $code=1) {
    Write-Host "ERROR: $msg" -ForegroundColor Red
    exit $code
}

# Prereqs
$required = @('docker','kubectl','git')
foreach ($r in $required) {
    if (-not (Get-Command $r -ErrorAction SilentlyContinue)) {
        ExitWith "Required command '$r' not found. Please install and try again."
    }
}

# Check Docker Desktop / Kubernetes
$context = (& kubectl config current-context) -replace "\s+",""
if (-not $context) {
    Write-Host "kubectl has no current context. Ensure Docker Desktop Kubernetes is enabled and kubectl is configured." -ForegroundColor Yellow
} else {
    Write-Host "kubectl current-context: $context"
}

Write-Host "Building images (this may take a few minutes)..." -ForegroundColor Cyan
# Backend
docker build -t tartarusboss/oasis-backend:latest -f backend/Dockerfile . || ExitWith "Failed to build backend image"
# Frontend
docker build -t tartarusboss/oasis-frontend:latest -f frontend/Dockerfile . || ExitWith "Failed to build frontend image"
# DB custom image
docker build -t tartarusboss/oasis-db:latest -f backend/dockerfiles/mysql-custom/Dockerfile . || ExitWith "Failed to build db image"

Write-Host "Applying Kubernetes manifests (recursive)..." -ForegroundColor Cyan
# Apply recursively to include observability manifests under subfolders
kubectl apply -R -f .\kube | ForEach-Object { Write-Host $_ }

Write-Host "Waiting for deployments to roll out..." -ForegroundColor Cyan
$deployments = @('oasis-db','oasis-backend','oasis-frontend')
foreach ($d in $deployments) {
    Write-Host "Waiting rollout for $d..."
    kubectl rollout status deployment/$d --timeout=120s
}

Write-Host "Current pods:" -ForegroundColor Green
kubectl get pods -A

Write-Host "Current services:" -ForegroundColor Green
kubectl get svc -A

Write-Host "PersistentVolumeClaims:" -ForegroundColor Green
kubectl get pvc -A

# Detect context and print the best URL for the frontend
$ctx = (& kubectl config current-context) -replace "\s+",""
if ($ctx -match "minikube") {
    Write-Host "Detected Minikube context. Obtaining service URL via minikube..." -ForegroundColor Cyan
    try {
        $url = & minikube service oasis-frontend --url 2>&1
        Write-Host "Frontend URL (minikube): $url" -ForegroundColor Magenta
    } catch {
        Write-Host "Could not obtain minikube service URL. You can run: minikube service oasis-frontend --url" -ForegroundColor Yellow
    }
} else {
    Write-Host "Frontend should be available at http://localhost:30080 and backend at http://localhost:30400" -ForegroundColor Magenta
    Write-Host "If the frontend doesn't load, try: kubectl port-forward svc/oasis-backend 4000:4000" -ForegroundColor Yellow
}

Write-Host "Done." -ForegroundColor Green
