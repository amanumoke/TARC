/**
 * @file apps/server/src/storage/fileStorage.ts
 * @description Multer file upload configuration for PDF documents.
 * Handles file storage with size limits and validation.
 */

import { randomUUID } from 'node:crypto';
import path from 'node:path';
import multer from 'multer';

/** Maximum file size: 25MB */
const MAX_FILE_SIZE = 25 * 1024 * 1024;

/** Allowed MIME types for PDF uploads */
const ALLOWED_MIME_TYPES = ['application/pdf'];

/** Storage directory for uploaded files */
const UPLOAD_DIR = path.resolve('uploads');

/**
 * Multer storage configuration for PDF uploads.
 * Files are stored with UUID names to prevent conflicts.
 */
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const uniqueName = `${randomUUID()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

/**
 * File filter to only allow PDF uploads.
 */
function fileFilter(
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'));
  }
}

/**
 * Multer upload middleware configured for PDF documents.
 * Limits file size to 25MB and validates file type.
 */
export const uploadPdf = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});
