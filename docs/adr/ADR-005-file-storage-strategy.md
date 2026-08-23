# ADR-005: File & Media Storage Architecture

## Status
Accepted

## Context
TARCMS handles PDF publication downloads, high-resolution gallery images, news cover photos, and staff portraits.

## Decision
We define an abstract `FileStorageService` interface (seam) in `apps/server/src/storage`:
- **Development / Default Adapter**: `LocalStorageAdapter` writes uploaded files to local disk under `apps/server/uploads/` with UUID-based sanitized filenames and mime-type verification via Multer.
- **Production / S3 Adapter**: An S3-compatible adapter (`S3StorageAdapter`) can be enabled via environment variable `STORAGE_DRIVER=s3` without altering any domain controller or database entity.

## Consequences
### Positive
- Zero external cloud dependencies required for local development and self-hosted on-premise deployments.
- Pluggable architecture allowing seamless transition to AWS S3, Cloudflare R2, or MinIO when required by the Center.
