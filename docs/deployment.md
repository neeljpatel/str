# Deployment Guide

**Droplet:** 143.198.176.92 (DigitalOcean, NYC)  
**Repo:** github.com/neeljpatel/str  
**Server path:** `/var/www/str/`  
**SSH:** `ssh root@143.198.176.92`

---

## Architecture

| Domain | Upstream | Process |
|--------|----------|---------|
| `chicagoavecollective.com` | `localhost:3000` | PM2 (`chicago-collective`) |
| `admin.chicagoavecollective.com` | `localhost:3000` | PM2 (`chicago-collective`) |
| `api.chicagoavecollective.com` | `localhost:8000` | systemd (`fastapi-backend`) |

Nginx routes all traffic. Cloudflare sits in front with A records for `@`, `www`, `admin`, and `api`.

---

## Frontend Deploys

The frontend is a Next.js app at `/var/www/str/frontend`, served by PM2.

### Standard deploy (code change only)

```bash
ssh root@143.198.176.92
cd /var/www/str
git pull origin main
cd frontend
NODE_OPTIONS='--max-old-space-size=1536' npm run build
pm2 restart chicago-collective
```

> `NODE_OPTIONS` is required — the droplet has 512MB RAM and the build OOMs without it.

### Adding a new npm dependency

```bash
npm install <package>
```

Commit the updated `package-lock.json`, then run the standard deploy above.

### Checking logs

```bash
pm2 logs chicago-collective --lines 50
```

---

## Backend Deploys

The backend is a FastAPI app at `/var/www/str/backend`, served by systemd (`fastapi-backend.service`).

### Standard deploy (code change only)

```bash
ssh root@143.198.176.92
cd /var/www/str
git pull origin main
systemctl restart fastapi-backend
```

### Adding a new Python dependency

1. Locally: `cd backend && source venv/bin/activate && pip install <package> && pip freeze > requirements.txt`
2. Commit `requirements.txt`
3. On the server:

```bash
cd /var/www/str/backend
git pull origin main
source venv/bin/activate
pip install -r requirements.txt
systemctl restart fastapi-backend
```

### Checking logs

```bash
journalctl -u fastapi-backend -n 50 --no-pager
```

### Service management

```bash
systemctl status fastapi-backend
systemctl stop fastapi-backend
systemctl start fastapi-backend
systemctl restart fastapi-backend
```

---

## Environment Variables

**Never committed to git.** Set directly on the server.

### Frontend — `/var/www/str/frontend/.env.local`

```
NEXT_PUBLIC_API_URL=https://api.chicagoavecollective.com
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

After changing frontend env vars, a full rebuild + PM2 restart is required.

### Backend — `/var/www/str/backend/.env`

```
DATABASE_URL=...
SUPABASE_URL=...
SUPABASE_KEY=...
SUPABASE_JWT_SECRET=...
SUPABASE_SERVICE_KEY=...
HOSPITABLE_ACCESS_TOKEN=...
CORS_ORIGINS=https://chicagoavecollective.com,https://admin.chicagoavecollective.com,http://localhost:3000
BACKEND_URL=https://api.chicagoavecollective.com
```

After changing backend env vars, only a `systemctl restart fastapi-backend` is needed.

---

## Nginx

Config lives at `/etc/nginx/sites-available/chicagoavecollective.com`, symlinked into `sites-enabled`.

```bash
# Edit config
nano /etc/nginx/sites-available/chicagoavecollective.com

# Test and reload
nginx -t && systemctl reload nginx
```

---

## Health Checks

```bash
curl https://api.chicagoavecollective.com/health   # {"status":"ok"}
curl -o /dev/null -w "%{http_code}" https://chicagoavecollective.com/
```

---

## Initial Setup (reference — already done)

These steps were run once to provision the server. Only needed again if re-provisioning.

### Backend

```bash
apt-get install -y python3-pip python3-venv
cd /var/www/str/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
# write .env (see above)
cp /etc/systemd/system/fastapi-backend.service  # (see below)
systemctl daemon-reload && systemctl enable fastapi-backend && systemctl start fastapi-backend
```

`/etc/systemd/system/fastapi-backend.service`:
```ini
[Unit]
Description=Chicago Collective FastAPI Backend
After=network.target

[Service]
User=root
WorkingDirectory=/var/www/str/backend
Environment="PATH=/var/www/str/backend/venv/bin"
ExecStart=/var/www/str/backend/venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8000
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
```

### Frontend

```bash
cd /var/www/str/frontend
# write .env.local (see above)
npm install
NODE_OPTIONS='--max-old-space-size=1536' npm run build
pm2 start npm --name 'chicago-collective' -- start
pm2 save
```
