# TARCMS Core Business Workflows

> **Document Status**: Operational & System Workflow Specifications

---

## 1. Research & Publication Lifecycle Workflow

```
+-----------------------------------------------------------------------------------+
|                        RESEARCH OUTPUT MANAGEMENT WORKFLOW                        |
|                                                                                   |
|  1. Department Definition:                                                        |
|     Admin creates Department (e.g., Spices & Essential Oils).                     |
|                                                                                   |
|  2. Program Inception:                                                            |
|     Admin / Researcher creates Research Program linked to Department.             |
|     (e.g., Cardamom & Korarima Genetic Improvement Program).                      |
|                                                                                   |
|  3. Project Authorization:                                                        |
|     Researcher registers specific Research Project under the Program.             |
|     Specifies Start/End dates, Objectives, and Co-Researchers.                    |
|                                                                                   |
|  4. Publication Submission:                                                       |
|     Lead Author submits Scientific Publication.                                   |
|     - Uploads PDF file or supplies external DOI / URL.                            |
|     - Associates Internal Staff Authors + External Collaborating Authors.        |
|     - Links Publication to parent Research Project.                               |
|                                                                                   |
|  5. Verification & Public Listing:                                                |
|     Admin reviews and toggles `is_featured` / publication status.                 |
|     Publication immediately appears in Public Search & Researcher Portfolio.      |
+-----------------------------------------------------------------------------------+
```

---

## 2. Vehicle Operational & Assignment Workflow

```
[ Center Staff Member ]
        |
        | 1. Submits Vehicle Requisition Request (Destination, Purpose, Dates)
        v
[ Assignment Log: Status = 'PENDING' ]
        |
        | 2. Center Administrator / Transport Officer Reviews Requisition
        v
   /         \
  / Approved  \ Rejected / Cancelled
 v             v
[ Status = 'APPROVED' ]       [ Status = 'CANCELLED' ]
        |
        | 3. Vehicle Dispatched on Field Trip
        v
[ Vehicle Status: 'IN_USE' | Assignment: 'ACTIVE' ]
        |
        | 4. Vehicle Returns & Fuel/Mileage Logged
        v
[ Vehicle Status: 'AVAILABLE' | Assignment: 'COMPLETED' ]
```

---

## 3. Contact Inquiries & Feedback Moderation Workflow

```
[ Public Visitor ]
        |
        | 1. Completes Public Contact Form (Name, Email, Subject, Message)
        v
[ Server Validates with Zod ] ---> [ Message Stored in DB: Status = 'UNREAD' ]
                                                      |
                                                      | 2. Admin views in Management Inbox
                                                      v
                                            [ Status = 'READ' ]
                                                      |
                                                      | 3. Admin / Staff draft response / notes
                                                      v
                                            [ Status = 'REPLIED' ]
                                            (Audit: Timestamp & Notes logged)
                                                      |
                                                      | 4. Older messages archived
                                                      v
                                            [ Status = 'ARCHIVED' ]
```

---

## 4. Authentication & Role-Guarded Access Workflow

```
[ User Enters Credentials ]
            |
            v
[ POST /api/auth/login ] ---> [ Server verifies bcrypt hash & active status ]
                                                |
                                    +-----------+-----------+
                                    | Success               | Failure
                                    v                       v
                         [ Generate JWT Token ]   [ Return 401 Unauthorized ]
                         (Payload: id, email, role)
                                    |
                                    v
     [ Client stores token in secure storage / Authorization Bearer Header ]
                                    |
            +-----------------------+-----------------------+
            |                                               |
            v                                               v
[ Accessing Public Endpoint ]                [ Accessing Admin API /api/admin/* ]
(e.g., GET /api/public/publications)                            |
(No Auth Required -> Return Data)               [ authenticateToken Middleware ]
                                                                |
                                                [ requireRole('SUPER_ADMIN'|'ADMIN') ]
                                                                |
                                                +---------------+---------------+
                                                | Authorized    | Forbidden     |
                                                v               v               |
                                           [ Execute API ] [ Return 403 ]       |
```
