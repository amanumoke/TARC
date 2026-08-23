# TARCMS RESTful API Design Specification

> **Base URL**: `/api/v1`  
> **Payload Format**: `application/json` (Multipart for uploads)  
> **Authentication**: `Authorization: Bearer <JWT_TOKEN>`

---

## 1. Standard Response Envelope & Error Codes

### 1.1 Success Envelope
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 142,
    "totalPages": 8
  }
}
```

### 1.2 Error Envelope
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Invalid publication submission.",
    "details": [
      { "field": "publicationYear", "message": "Publication year must be between 1970 and 2030." }
    ]
  }
}
```

---

## 2. API Route Endpoints Matrix

### 2.1 Authentication & Profile (`/api/v1/auth`)

| Method | Endpoint | Access Guard | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/login` | Public | Authenticates user with email/password; returns JWT + User. |
| `POST` | `/api/v1/auth/logout` | Authenticated | Clears session/token cookies. |
| `GET` | `/api/v1/auth/me` | Authenticated | Fetches current user profile and role permissions. |
| `PUT` | `/api/v1/auth/profile` | Authenticated | Updates name, phone, bio, and avatar. |
| `PUT` | `/api/v1/auth/password` | Authenticated | Changes password with current password verification. |

---

### 2.2 Public Discovery APIs (`/api/v1/public/*`)

| Method | Endpoint | Query Parameters | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/public/settings` | None | Returns institution info, leadership message, contact info. |
| `GET` | `/api/v1/public/departments` | None | Returns all active departments with staff and program counts. |
| `GET` | `/api/v1/public/departments/:code` | None | Returns single department with full description and staff roster. |
| `GET` | `/api/v1/public/research-programs` | `?departmentId=&status=` | Returns research programs list. |
| `GET` | `/api/v1/public/research-programs/:slug`| None | Returns single program with active research projects. |
| `GET` | `/api/v1/public/projects` | `?programId=&status=&search=` | Filterable list of research projects. |
| `GET` | `/api/v1/public/projects/:slug` | None | Single project details with milestones, lead, and publications. |
| `GET` | `/api/v1/public/publications` | `?type=&year=&search=&page=&limit=` | Searchable catalog of publications with pagination. |
| `GET` | `/api/v1/public/publications/:slug` | None | Single publication details with authors and download link. |
| `GET` | `/api/v1/public/staff` | `?departmentId=&featured=` | Public staff directory and expertise index. |
| `GET` | `/api/v1/public/news` | `?category=&featured=&page=&limit=` | Published news feed with pagination. |
| `GET` | `/api/v1/public/news/:slug` | None | Single news article details. |
| `GET` | `/api/v1/public/events` | `?type=&upcoming=true` | Events listing and upcoming schedule. |
| `GET` | `/api/v1/public/events/:slug` | None | Single event information. |
| `GET` | `/api/v1/public/gallery` | `?category=&page=&limit=` | Public photo gallery assets. |
| `POST` | `/api/v1/public/contact` | Body: ContactFormSchema | Submits public contact inquiry / feedback. |

---

### 2.3 Management / Admin APIs (`/api/v1/admin/*`)

| Method | Endpoint | Required Role | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/admin/dashboard/metrics` | `STAFF+` | Overview metrics (projects, pubs, vehicles, messages). |
| `CRUD` | `/api/v1/admin/departments[/:id]` | `ADMIN, SUPER_ADMIN` | Full CRUD for departments. |
| `CRUD` | `/api/v1/admin/staff[/:id]` | `ADMIN, SUPER_ADMIN` | Staff directory management and status toggle. |
| `CRUD` | `/api/v1/admin/research-programs[/:id]`| `RESEARCHER+` | Research program management. |
| `CRUD` | `/api/v1/admin/projects[/:id]` | `RESEARCHER+` | Research project management. |
| `CRUD` | `/api/v1/admin/publications[/:id]` | `RESEARCHER+` | Research publication submission & author mapping. |
| `CRUD` | `/api/v1/admin/news[/:id]` | `ADMIN, SUPER_ADMIN` | News publishing and draft management. |
| `CRUD` | `/api/v1/admin/events[/:id]` | `ADMIN, SUPER_ADMIN` | Event schedule management. |
| `CRUD` | `/api/v1/admin/gallery[/:id]` | `ADMIN, SUPER_ADMIN` | Gallery photo uploads and album management. |
| `CRUD` | `/api/v1/admin/vehicles[/:id]` | `ADMIN, SUPER_ADMIN` | Fleet inventory and vehicle record management. |
| `GET` | `/api/v1/admin/vehicles/assignments` | `STAFF+` | Vehicle assignment schedule and requisition logs. |
| `POST` | `/api/v1/admin/vehicles/assignments` | `STAFF+` | Requisition request creation. |
| `PATCH`| `/api/v1/admin/vehicles/assignments/:id`| `ADMIN, SUPER_ADMIN` | Approves / returns vehicle assignment. |
| `GET` | `/api/v1/admin/messages` | `ADMIN, SUPER_ADMIN` | Contact inbox with status filters (`UNREAD`, etc.). |
| `PATCH`| `/api/v1/admin/messages/:id/status` | `ADMIN, SUPER_ADMIN` | Updates message lifecycle status and logs reply notes. |
| `GET` | `/api/v1/admin/users` | `SUPER_ADMIN` | User accounts list and role management. |
| `PUT` | `/api/v1/admin/settings` | `SUPER_ADMIN` | Updates institutional settings and director message. |
| `POST` | `/api/v1/admin/upload` | `RESEARCHER+` | Multipart file upload for PDFs and images. |
