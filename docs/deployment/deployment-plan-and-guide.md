# TARCMS Deployment Plan & Production Operations Guide

> **Document Status**: Production Deployment Specification  
> **Primary Deployment Target**: Multi-Container Docker Orchestration (Self-Hosted / On-Premise VPS)  
> **Secondary Deployment Target**: Managed Cloud PaaS (Vercel + Railway / Render)

---

## 1. Production Topology & Architecture

```
                                 [ Internet Visitors & Center Staff ]
                                                 │
                                                 ▼
                         ┌───────────────────────────────────────────────┐
                         │   Nginx Reverse Proxy / Cloudflare (Port 443) │
                         │   - Automated SSL/TLS (Let's Encrypt / Certbot)│
                         │   - Gzip / Brotli Compression & Static Caching│
                         └───────────────────────┬───────────────────────┘
                                                 │
                      ┌──────────────────────────┼──────────────────────────┐
                      │ /api/v1/* traffic        │ /* (Public Web Portal)   │ /dashboard/* (Admin)
                      ▼                          ▼                          ▼
      ┌──────────────────────────────┐ ┌──────────────────────────┐ ┌──────────────────────────┐
      │  tarcms-api (Node/Express)   │ │  tarcms-public (Nginx)   │ │ tarcms-dashboard (Nginx) │
      │  - Port 5000 (Internal)      │ │  - Port 80 (Internal)    │ │ - Port 80 (Internal)     │
      │  - Auto-restart: always      │ │  - HTML5 PushState       │ │ - HTML5 PushState        │
      └──────────────┬───────────────┘ └──────────────────────────┘ └──────────────────────────┘
                     │
                     ▼
      ┌──────────────────────────────┐      ┌──────────────────────────────┐
      │      MySQL 8.0 Container     │      │     Persistent File Volume   │
      │  - Port 3306 (Internal Only) │      │  - /app/apps/server/uploads  │
      │  - Volume: mysql_prod_data   │      │  - PDFs, Gallery, Portraits  │
      └──────────────────────────────┘      └──────────────────────────────┘
```

---

## 2. Server Prerequisites & System Requirements

### 2.1 Hardware Requirements
- **CPU**: Minimum 2 Cores (Recommended: 4 Cores)
- **RAM**: Minimum 4 GB RAM (Recommended: 8 GB RAM)
- **Storage**: 40 GB SSD storage minimum (allowing for publication PDFs and gallery images)
- **OS**: Ubuntu 22.04 LTS or 24.04 LTS (or Debian 12 / Rocky Linux 9)

### 2.2 Software Dependencies on Host
- **Docker Engine**: Version 24.0+
- **Docker Compose**: Version 2.20+
- **Git**: Version 2.40+

---

## 3. Step-by-Step Production Deployment Guide

### Step 1: Server Provisioning & Docker Installation
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Docker Engine & Docker Compose plugin
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add current user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Verify installations
docker --version && docker compose version
```

---

### Step 2: Clone Repository & Configure Environment Variables
```bash
# Clone the repository
git clone https://github.com/your-org/tarcms.git /opt/tarcms
cd /opt/tarcms

# Create production .env file
cp .env.example .env
```

Edit `/opt/tarcms/.env` with production secrets:
```ini
# --- APPLICATION ENVIRONMENT ---
NODE_ENV=production
PORT=5000
CLIENT_URL=https://tarc.gov.et

# --- DATABASE CONFIGURATION ---
MYSQL_ROOT_PASSWORD=CHANGE_ME_ROOT_SECURE_PASSWORD_2026
MYSQL_DATABASE=tarcms_db
MYSQL_USER=tarc_admin
MYSQL_PASSWORD=CHANGE_ME_TARC_USER_PASSWORD_2026
DATABASE_URL=mysql://tarc_admin:CHANGE_ME_TARC_USER_PASSWORD_2026@tarcms-db:3306/tarcms_db

# --- SECURITY & AUTHENTICATION ---
JWT_SECRET=CHANGE_ME_CRYPTOGRAPHICALLY_SECURE_JWT_SECRET_STRING_64_CHARACTERS

# --- STORAGE ---
STORAGE_DRIVER=local
UPLOAD_DIR=/app/apps/server/uploads
```

---

### Step 3: Launch Containers & Execute Migrations
```bash
# 1. Build and start all production containers in background
docker compose -f docker-compose.prod.yml up -d --build

# 2. Run Drizzle database migrations inside API container
docker compose -f docker-compose.prod.yml exec tarcms-server npm run db:migrate

# 3. Seed initial admin account and baseline institutional data (First-time setup only)
docker compose -f docker-compose.prod.yml exec tarcms-server npm run db:seed

# 4. Verify running health status of all 3 containers
docker compose -f docker-compose.prod.yml ps
```

---

### Step 4: SSL/TLS Setup with Certbot & Nginx Reverse Proxy
```bash
# Install Certbot and Nginx on Host (or via Traefik container)
sudo apt install certbot python3-certbot-nginx -y

# Obtain free SSL Certificate from Let's Encrypt
sudo certbot --nginx -d tarc.gov.et -d www.tarc.gov.et
```

Sample Host Nginx Configuration (`/etc/nginx/sites-available/tarcms.conf`):
```nginx
server {
    server_name tarc.gov.et www.tarc.gov.et;

    # Client Web Application
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend REST API
    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        client_max_body_size 30M; # Support large publication PDF uploads
    }

    # Uploaded media assets
    location /uploads/ {
        proxy_pass http://127.0.0.1:5000/uploads/;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
}
```

---

## 4. Database Backup & Disaster Recovery Procedures

### 4.1 Automated Daily MySQL Backups (Cron Job)
Create a backup script at `/opt/tarcms/scripts/backup-db.sh`:
```bash
#!/bin/bash
BACKUP_DIR="/opt/tarcms/backups/mysql"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
mkdir -p "$BACKUP_DIR"

docker compose -f /opt/tarcms/docker-compose.prod.yml exec -T tarcms-db \
  mysqldump -u tarc_admin -pCHANGE_ME_TARC_USER_PASSWORD_2026 tarcms_db \
  | gzip > "$BACKUP_DIR/tarcms_backup_$TIMESTAMP.sql.gz"

# Keep only the last 30 daily backups
find "$BACKUP_DIR" -type f -name "*.sql.gz" -mtime +30 -exec rm {} +
```
Schedule in crontab (`crontab -e`):
```cron
0 2 * * * /opt/tarcms/scripts/backup-db.sh >> /var/log/tarcms-backup.log 2>&1
```

### 4.2 Restoring Database from Backup
```bash
gunzip < /opt/tarcms/backups/mysql/tarcms_backup_YYYYMMDD_HHMMSS.sql.gz | \
  docker compose -f docker-compose.prod.yml exec -T tarcms-db \
  mysql -u tarc_admin -pCHANGE_ME_TARC_USER_PASSWORD_2026 tarcms_db
```

---

## 5. Zero-Downtime Update / Deployment Procedure

When pushing a new release to production:
```bash
cd /opt/tarcms
git pull origin main
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d --no-deps tarcms-server tarcms-web
docker compose -f docker-compose.prod.yml exec tarcms-server npm run db:migrate
```
