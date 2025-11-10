@echo off
REM Double-click this file to deploy the project locally on Windows.
REM Requirements: Docker Desktop with Kubernetes enabled, Git, and kubectl in PATH.
powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Process powershell -ArgumentList '-NoProfile -ExecutionPolicy Bypass -File "%~dp0kube\deploy-local.ps1"' -Verb runAs"
pause
