/**
 * @file apps/server/src/modules/operations/operations.routes.ts
 * @description Express route definitions for vehicles and messages endpoints.
 * Includes admin routes with RBAC protection.
 */

import { Request, Response, Router } from 'express';
import { authenticateToken } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/rbac.js';
import {
  createMessage,
  deleteMessage,
  getAllMessages,
  getMessageById,
  getUnreadMessages,
  updateMessage,
} from '../messages/messages.service.js';
import {
  createAssignment,
  createVehicle,
  deleteVehicle,
  getAllAssignments,
  getAllVehicles,
  getAvailableVehicles,
  getVehicleById,
  updateAssignmentStatus,
  updateVehicleStatus,
} from '../vehicles/vehicles.service.js';

const router = Router();

// ==================== VEHICLES ====================

/**
 * Public route - get available vehicles
 */
router.get('/vehicles/available', async (_req: Request, res: Response) => {
  try {
    const vehicles = await getAvailableVehicles();
    res.json({ success: true, data: vehicles });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch vehicles' });
  }
});

/**
 * Admin route - get all vehicles
 */
router.get(
  '/admin/vehicles',
  authenticateToken,
  requireRole('SUPER_ADMIN', 'ADMIN'),
  async (_req: Request, res: Response) => {
    try {
      const vehiclesList = await getAllVehicles();
      res.json({ success: true, data: vehiclesList });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch vehicles' });
    }
  }
);

/**
 * Admin route - get vehicle by ID
 */
router.get(
  '/admin/vehicles/:id',
  authenticateToken,
  requireRole('SUPER_ADMIN', 'ADMIN'),
  async (req: Request, res: Response) => {
    try {
      const vehicle = await getVehicleById(req.params.id);
      if (!vehicle) {
        res.status(404).json({ success: false, error: 'Vehicle not found' });
        return;
      }
      res.json({ success: true, data: vehicle });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch vehicle' });
    }
  }
);

/**
 * Admin route - create a new vehicle
 */
router.post(
  '/admin/vehicles',
  authenticateToken,
  requireRole('SUPER_ADMIN', 'ADMIN'),
  async (req: Request, res: Response) => {
    try {
      const vehicle = await createVehicle(req.body);
      res.status(201).json({ success: true, data: vehicle });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to create vehicle' });
    }
  }
);

/**
 * Admin route - update vehicle status
 */
router.put(
  '/admin/vehicles/:id/status',
  authenticateToken,
  requireRole('SUPER_ADMIN', 'ADMIN'),
  async (req: Request, res: Response) => {
    try {
      const vehicle = await updateVehicleStatus(req.params.id, req.body.status);
      if (!vehicle) {
        res.status(404).json({ success: false, error: 'Vehicle not found' });
        return;
      }
      res.json({ success: true, data: vehicle });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to update vehicle status' });
    }
  }
);

/**
 * Admin route - delete a vehicle
 */
router.delete(
  '/admin/vehicles/:id',
  authenticateToken,
  requireRole('SUPER_ADMIN', 'ADMIN'),
  async (req: Request, res: Response) => {
    try {
      await deleteVehicle(req.params.id);
      res.json({ success: true, message: 'Vehicle deleted' });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to delete vehicle' });
    }
  }
);

// ==================== ASSIGNMENTS ====================

/**
 * Admin route - get all assignments
 */
router.get(
  '/admin/assignments',
  authenticateToken,
  requireRole('SUPER_ADMIN', 'ADMIN'),
  async (_req: Request, res: Response) => {
    try {
      const assignments = await getAllAssignments();
      res.json({ success: true, data: assignments });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch assignments' });
    }
  }
);

/**
 * Admin route - create a new assignment
 */
router.post(
  '/admin/assignments',
  authenticateToken,
  requireRole('SUPER_ADMIN', 'ADMIN'),
  async (req: Request, res: Response) => {
    try {
      const assignment = await createAssignment(req.body);
      res.status(201).json({ success: true, data: assignment });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to create assignment' });
    }
  }
);

/**
 * Admin route - update assignment status
 */
router.put(
  '/admin/assignments/:id/status',
  authenticateToken,
  requireRole('SUPER_ADMIN', 'ADMIN'),
  async (req: Request, res: Response) => {
    try {
      const assignment = await updateAssignmentStatus(req.params.id, req.body.status);
      if (!assignment) {
        res.status(404).json({ success: false, error: 'Assignment not found' });
        return;
      }
      res.json({ success: true, data: assignment });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to update assignment status' });
    }
  }
);

// ==================== MESSAGES ====================

/**
 * Public route - submit a contact message
 */
router.post('/messages', async (req: Request, res: Response) => {
  try {
    const message = await createMessage(req.body);
    res.status(201).json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to submit message' });
  }
});

/**
 * Admin route - get all messages
 */
router.get(
  '/admin/messages',
  authenticateToken,
  requireRole('SUPER_ADMIN', 'ADMIN'),
  async (_req: Request, res: Response) => {
    try {
      const messages = await getAllMessages();
      res.json({ success: true, data: messages });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch messages' });
    }
  }
);

/**
 * Admin route - get unread messages count
 */
router.get(
  '/admin/messages/unread',
  authenticateToken,
  requireRole('SUPER_ADMIN', 'ADMIN'),
  async (_req: Request, res: Response) => {
    try {
      const messages = await getUnreadMessages();
      res.json({ success: true, data: messages, count: messages.length });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch unread messages' });
    }
  }
);

/**
 * Admin route - get message by ID
 */
router.get(
  '/admin/messages/:id',
  authenticateToken,
  requireRole('SUPER_ADMIN', 'ADMIN'),
  async (req: Request, res: Response) => {
    try {
      const message = await getMessageById(req.params.id);
      if (!message) {
        res.status(404).json({ success: false, error: 'Message not found' });
        return;
      }
      res.json({ success: true, data: message });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch message' });
    }
  }
);

/**
 * Admin route - update message status and reply notes
 */
router.put(
  '/admin/messages/:id',
  authenticateToken,
  requireRole('SUPER_ADMIN', 'ADMIN'),
  async (req: Request, res: Response) => {
    try {
      const message = await updateMessage(req.params.id, req.body);
      if (!message) {
        res.status(404).json({ success: false, error: 'Message not found' });
        return;
      }
      res.json({ success: true, data: message });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to update message' });
    }
  }
);

/**
 * Admin route - delete a message
 */
router.delete(
  '/admin/messages/:id',
  authenticateToken,
  requireRole('SUPER_ADMIN', 'ADMIN'),
  async (req: Request, res: Response) => {
    try {
      await deleteMessage(req.params.id);
      res.json({ success: true, message: 'Message deleted' });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to delete message' });
    }
  }
);

export default router;
