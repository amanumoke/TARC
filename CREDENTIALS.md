# TARCMS User Credentials

## Dashboard Login

| Role | Email | Password |
|------|-------|----------|
| Super Admin | `admin@tarc.gov.et` | `admin123456` |
| Researcher | `abebe.tadesse@tarc.gov.et` | `researcher123456` |
| Researcher | `tigist.hailu@tarc.gov.et` | `researcher123456` |

## Database

| Setting | Value |
|---------|-------|
| Host | `localhost` |
| Port | `3307` |
| Database | `tarcms_db` |
| Username | `tarc_user` |
| Password | `tarc_password` |
| Connection URL | `mysql://tarc_user:tarc_password@localhost:3307/tarcms_db` |

## Server

| Setting | Value |
|---------|-------|
| API URL | `http://localhost:5000` |
| Health Check | `http://localhost:5000/api/health` |
| Login Endpoint | `POST http://localhost:5000/api/v1/auth/login` |

## Frontend Apps

| App | URL |
|-----|-----|
| Dashboard | `http://localhost:3001` |
| Public Portal | `http://localhost:3000` |

## Docker

| Service | Container | Port |
|---------|-----------|------|
| MySQL | `tarcms-mysql` | `3307` |
