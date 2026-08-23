/**
 * @file apps/server/src/middleware/validate.ts
 * @description Generic Express middleware for runtime request validation using Zod schemas from @tarcms/shared.
 * Intercepts incoming requests, validates body/query/params against the schema,
 * and returns structured 400 Bad Request error envelopes if validation fails.
 */

import { NextFunction, Request, Response } from 'express';
import { ZodError, ZodSchema } from 'zod';

/**
 * Validates req.body against a provided Zod schema.
 * If validation fails, responds with standard API error envelope containing field-level issues.
 *
 * @param schema - The Zod schema to validate req.body against
 */
export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const zodError = result.error as ZodError;
      const details = zodError.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_FAILED',
          message: 'Invalid request payload provided.',
          details,
        },
      });
    }

    // Replace req.body with the sanitized and parsed data
    req.body = result.data;
    next();
  };
}

/**
 * Validates req.query against a provided Zod schema.
 *
 * @param schema - The Zod schema to validate req.query against
 */
export function validateQuery<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      const zodError = result.error as ZodError;
      const details = zodError.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      return res.status(400).json({
        success: false,
        error: {
          code: 'QUERY_VALIDATION_FAILED',
          message: 'Invalid query parameters provided.',
          details,
        },
      });
    }

    req.query = result.data as unknown as Request['query'];
    next();
  };
}
