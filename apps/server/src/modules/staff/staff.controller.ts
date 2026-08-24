/**
 * @file apps/server/src/modules/staff/staff.controller.ts
 * @description HTTP request handlers for staff personnel endpoints.
 * Routes requests to appropriate service methods and formats responses.
 */

import { Request, Response } from 'express';
import {
  createStaff,
  deleteStaff,
  getAllStaff,
  getPublicStaff,
  getStaffById,
  updateStaff,
} from './staff.service.js';

/**
 * GET /api/v1/public/staff
 * Returns active staff for public directory display.
 */
export async function handleGetPublicStaff(_req: Request, res: Response) {
  try {
    const staffMembers = await getPublicStaff();
    res.json({ success: true, data: staffMembers });
  } catch (error) {
    console.error('Fetch public staff error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'FETCH_ERROR', message: 'Failed to fetch staff.' },
    });
  }
}

/**
 * GET /api/v1/admin/staff
 * Returns all staff for admin management.
 */
export async function handleGetAdminStaff(_req: Request, res: Response) {
  try {
    const staffMembers = await getAllStaff();
    res.json({ success: true, data: staffMembers });
  } catch (error) {
    console.error('Fetch admin staff error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'FETCH_ERROR', message: 'Failed to fetch staff.' },
    });
  }
}

/**
 * GET /api/v1/admin/staff/:id
 * Returns a single staff member by ID.
 */
export async function handleGetStaffById(req: Request, res: Response) {
  try {
    const member = await getStaffById(req.params.id);
    if (!member) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Staff member not found.' },
      });
    }
    res.json({ success: true, data: member });
  } catch (error) {
    console.error('Fetch staff error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'FETCH_ERROR', message: 'Failed to fetch staff member.' },
    });
  }
}

/**
 * POST /api/v1/admin/staff
 * Creates a new staff member.
 */
export async function handleCreateStaff(req: Request, res: Response) {
  try {
    const {
      departmentId,
      firstName,
      lastName,
      position,
      email,
      phone,
      areasOfExpertise,
      bio,
      photoUrl,
      isActive,
      isFeatured,
      sortOrder,
    } = req.body;
    if (!departmentId || !firstName || !lastName || !position || !email) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Department, name, position, and email are required.',
        },
      });
    }
    const member = await createStaff({
      departmentId,
      firstName,
      lastName,
      position,
      email,
      phone,
      areasOfExpertise,
      bio,
      photoUrl,
      isActive,
      isFeatured,
      sortOrder,
    });
    res.status(201).json({ success: true, data: member });
  } catch (error) {
    console.error('Create staff error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'CREATE_ERROR', message: 'Failed to create staff member.' },
    });
  }
}

/**
 * PUT /api/v1/admin/staff/:id
 * Updates an existing staff member.
 */
export async function handleUpdateStaff(req: Request, res: Response) {
  try {
    const member = await updateStaff(req.params.id, req.body);
    if (!member) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Staff member not found.' },
      });
    }
    res.json({ success: true, data: member });
  } catch (error) {
    console.error('Update staff error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'UPDATE_ERROR', message: 'Failed to update staff member.' },
    });
  }
}

/**
 * DELETE /api/v1/admin/staff/:id
 * Deletes a staff member by ID.
 */
export async function handleDeleteStaff(req: Request, res: Response) {
  try {
    const deleted = await deleteStaff(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Staff member not found.' },
      });
    }
    res.json({ success: true, data: { message: 'Staff member deleted successfully.' } });
  } catch (error) {
    console.error('Delete staff error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'DELETE_ERROR', message: 'Failed to delete staff member.' },
    });
  }
}
