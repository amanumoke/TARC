/**
 * @file apps/server/src/modules/operations/operations.test.ts
 * @description Unit tests for operations services (vehicles, messages).
 */

import { describe, expect, it, vi } from 'vitest';

vi.mock('../../db/client.js', () => ({
  db: {},
}));

vi.mock('../../db/schema/index.js', () => ({
  vehicles: {},
  vehicleAssignments: {},
  contactMessages: {},
}));

describe('Vehicles Service', () => {
  it('exports getAllVehicles function', async () => {
    const mod = await import('../vehicles/vehicles.service.js');
    expect(typeof mod.getAllVehicles).toBe('function');
  });

  it('exports getAvailableVehicles function', async () => {
    const mod = await import('../vehicles/vehicles.service.js');
    expect(typeof mod.getAvailableVehicles).toBe('function');
  });

  it('exports getVehicleById function', async () => {
    const mod = await import('../vehicles/vehicles.service.js');
    expect(typeof mod.getVehicleById).toBe('function');
  });

  it('exports createVehicle function', async () => {
    const mod = await import('../vehicles/vehicles.service.js');
    expect(typeof mod.createVehicle).toBe('function');
  });

  it('exports updateVehicleStatus function', async () => {
    const mod = await import('../vehicles/vehicles.service.js');
    expect(typeof mod.updateVehicleStatus).toBe('function');
  });

  it('exports deleteVehicle function', async () => {
    const mod = await import('../vehicles/vehicles.service.js');
    expect(typeof mod.deleteVehicle).toBe('function');
  });

  it('exports getAllAssignments function', async () => {
    const mod = await import('../vehicles/vehicles.service.js');
    expect(typeof mod.getAllAssignments).toBe('function');
  });

  it('exports createAssignment function', async () => {
    const mod = await import('../vehicles/vehicles.service.js');
    expect(typeof mod.createAssignment).toBe('function');
  });

  it('exports updateAssignmentStatus function', async () => {
    const mod = await import('../vehicles/vehicles.service.js');
    expect(typeof mod.updateAssignmentStatus).toBe('function');
  });
});

describe('Messages Service', () => {
  it('exports getAllMessages function', async () => {
    const mod = await import('../messages/messages.service.js');
    expect(typeof mod.getAllMessages).toBe('function');
  });

  it('exports getUnreadMessages function', async () => {
    const mod = await import('../messages/messages.service.js');
    expect(typeof mod.getUnreadMessages).toBe('function');
  });

  it('exports getMessageById function', async () => {
    const mod = await import('../messages/messages.service.js');
    expect(typeof mod.getMessageById).toBe('function');
  });

  it('exports createMessage function', async () => {
    const mod = await import('../messages/messages.service.js');
    expect(typeof mod.createMessage).toBe('function');
  });

  it('exports updateMessage function', async () => {
    const mod = await import('../messages/messages.service.js');
    expect(typeof mod.updateMessage).toBe('function');
  });

  it('exports deleteMessage function', async () => {
    const mod = await import('../messages/messages.service.js');
    expect(typeof mod.deleteMessage).toBe('function');
  });
});
