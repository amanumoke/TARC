/**
 * @file apps/server/src/modules/departments/departments.controller.ts
 * @description HTTP request handlers for department endpoints.
 * Routes requests to appropriate service methods and formats responses.
 */

import { Request, Response } from 'express';
import {
  createDepartment,
  deleteDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
} from './departments.service.js';

/**
 * GET /api/v1/public/departments
 * Returns all active departments for public display.
 */
export async function handleGetPublicDepartments(_req: Request, res: Response) {
  try {
    const departments = await getAllDepartments();
    res.json({ success: true, data: departments });
  } catch (error) {
    console.error('Fetch public departments error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'FETCH_ERROR', message: 'Failed to fetch departments.' },
    });
  }
}

/**
 * GET /api/v1/admin/departments
 * Returns all departments for admin management.
 */
export async function handleGetAdminDepartments(_req: Request, res: Response) {
  try {
    const departments = await getAllDepartments();
    res.json({ success: true, data: departments });
  } catch (error) {
    console.error('Fetch admin departments error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'FETCH_ERROR', message: 'Failed to fetch departments.' },
    });
  }
}

/**
 * GET /api/v1/admin/departments/:id
 * Returns a single department by ID.
 */
export async function handleGetDepartmentById(req: Request, res: Response) {
  try {
    const dept = await getDepartmentById(req.params.id);
    if (!dept) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Department not found.' },
      });
    }
    res.json({ success: true, data: dept });
  } catch (error) {
    console.error('Fetch department error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'FETCH_ERROR', message: 'Failed to fetch department.' },
    });
  }
}

/**
 * POST /api/v1/admin/departments
 * Creates a new department.
 */
export async function handleCreateDepartment(req: Request, res: Response) {
  try {
    const { name, code, description, headId, establishedYear, sortOrder } = req.body;
    if (!name || !code) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Name and code are required.' },
      });
    }
    const dept = await createDepartment({
      name,
      code,
      description,
      headId,
      establishedYear,
      sortOrder,
    });
    res.status(201).json({ success: true, data: dept });
  } catch (error) {
    console.error('Create department error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'CREATE_ERROR', message: 'Failed to create department.' },
    });
  }
}

/**
 * PUT /api/v1/admin/departments/:id
 * Updates an existing department.
 */
export async function handleUpdateDepartment(req: Request, res: Response) {
  try {
    const dept = await updateDepartment(req.params.id, req.body);
    if (!dept) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Department not found.' },
      });
    }
    res.json({ success: true, data: dept });
  } catch (error) {
    console.error('Update department error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'UPDATE_ERROR', message: 'Failed to update department.' },
    });
  }
}

/**
 * DELETE /api/v1/admin/departments/:id
 * Deletes a department by ID.
 */
export async function handleDeleteDepartment(req: Request, res: Response) {
  try {
    const deleted = await deleteDepartment(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Department not found.' },
      });
    }
    res.json({ success: true, data: { message: 'Department deleted successfully.' } });
  } catch (error) {
    console.error('Delete department error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'DELETE_ERROR', message: 'Failed to delete department.' },
    });
  }
}
