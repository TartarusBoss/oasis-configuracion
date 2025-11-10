Observability docker-compose (Grafana + Loki + Promtail)

Run locally with Docker Desktop (Linux containers) to collect app logs and show login attempts per minute in Grafana.

Start services:

```powershell
# from repo root
docker compose -f docker-compose.observability.yml up -d
```

What it does:
- Loki (3100) stores logs
- Promtail (reads /var/lib/docker/containers/*/*.log) pushes logs to Loki
- Grafana (30000) provisions a Loki datasource and the Oasis dashboard

Grafana:
- URL: http://localhost:30000
- user: admin / password: admin

Dashboard query (LogQL):
- count_over_time({job="varlogs"} |= "Intento de login para" [1m])

Notes:
- On Windows+Docker Desktop the host paths mounted by Promtail should work with Linux containers. If you run into issues with Promtail not reading logs, we can adjust the config to use Docker socket-based discovery or run Promtail as privileged and map additional paths.
