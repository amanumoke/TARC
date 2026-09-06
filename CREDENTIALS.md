# TARCMS User Credentials & Official Center Information

## Institutional Alignment
- **Parent Institute**: Ethiopian Institute of Agricultural Research (EIAR) — [http://eiar.gov.et/](http://eiar.gov.et/)
- **Center Director**: **Dr. Dereje Tulu** (DVM, MSc, Center Director & Senior Researcher)
- **Official Contact Phone / Mobile**: `092 065 4572` (or `+251 92 065 4572`)
- **Official Center Email**: `tepiagriculturalresearchcenter@eiar.gov.et`
- **Location**: Tepi, Yeki Woreda, Sheka Zone, Southwest Ethiopia

## Dashboard Login

| Role | Name | Email | Password |
|------|------|-------|----------|
| Super Admin (Center Director) | Dr. Dereje Tulu | `admin@tarc.gov.et` | `admin123456` |
| Researcher (Lead Spice Breeder) | Abebe Tadesse | `abebe.tadesse@tarc.gov.et` | `researcher123456` |
| Researcher (Coffee Quality Specialist) | Dr. Tigist Hailu | `tigist.hailu@tarc.gov.et` | `researcher123456` |

## Database (Local MySQL)

| Setting | Value |
|---------|-------|
| Host | `localhost` |
| Port | `3306` |
| Database | `tarcms_db` |
| Username | `tarc_user` |
| Password | `tarc_password` |
| Connection URL | `mysql://tarc_user:tarc_password@localhost:3306/tarcms_db` |

## Server & Applications

| Service | URL |
|---------|-----|
| REST API | `http://localhost:5000` |
| Health Check | `http://localhost:5000/api/health` |
| Management Portal (Dashboard) | `http://localhost:3001` |
| Public Discovery Website | `http://localhost:3000` |
| Official EIAR Website | `http://eiar.gov.et/` |

## Docker Container

| Service | Container | Port |
|---------|-----------|------|
| MySQL | `tarcms-mysql` | `3306` |
