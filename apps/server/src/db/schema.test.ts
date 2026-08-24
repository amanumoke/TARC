/**
 * @file apps/server/src/db/schema.test.ts
 * @description Unit tests verifying Drizzle ORM schema table exports, column definitions, and integrity.
 */

import { describe, expect, it } from 'vitest';
import {
  events,
  contactMessages,
  departments,
  galleryMedia,
  news,
  publicationAuthors,
  publications,
  researchPrograms,
  researchProjects,
  staff,
  systemSettings,
  users,
  vehicleAssignments,
  vehicles,
} from './schema/index.js';

describe('Drizzle Database Schema Definitions', () => {
  it('defines all core institutional domain tables', () => {
    expect(users).toBeDefined();
    expect(departments).toBeDefined();
    expect(staff).toBeDefined();
    expect(researchPrograms).toBeDefined();
    expect(researchProjects).toBeDefined();
    expect(publications).toBeDefined();
    expect(publicationAuthors).toBeDefined();
    expect(news).toBeDefined();
    expect(events).toBeDefined();
    expect(galleryMedia).toBeDefined();
    expect(vehicles).toBeDefined();
    expect(vehicleAssignments).toBeDefined();
    expect(contactMessages).toBeDefined();
    expect(systemSettings).toBeDefined();
  });

  it('verifies users table contains expected columns', () => {
    expect(users.id).toBeDefined();
    expect(users.email).toBeDefined();
    expect(users.passwordHash).toBeDefined();
    expect(users.role).toBeDefined();
  });

  it('verifies publications and author junction table definitions', () => {
    expect(publications.id).toBeDefined();
    expect(publications.title).toBeDefined();
    expect(publications.publicationType).toBeDefined();
    expect(publicationAuthors.publicationId).toBeDefined();
    expect(publicationAuthors.authorOrder).toBeDefined();
  });

  it('verifies vehicles table contains fleet status and plate columns', () => {
    expect(vehicles.registrationPlate).toBeDefined();
    expect(vehicles.status).toBeDefined();
    expect(vehicles.fuelType).toBeDefined();
  });

  it('verifies departments and staff directory table definitions', () => {
    expect(departments.id).toBeDefined();
    expect(departments.code).toBeDefined();
    expect(departments.name).toBeDefined();
    expect(staff.id).toBeDefined();
    expect(staff.departmentId).toBeDefined();
    expect(staff.position).toBeDefined();
    expect(staff.email).toBeDefined();
  });

  it('verifies research programs and trials table definitions', () => {
    expect(researchPrograms.id).toBeDefined();
    expect(researchPrograms.slug).toBeDefined();
    expect(researchPrograms.code).toBeDefined();
    expect(researchPrograms.status).toBeDefined();
    expect(researchProjects.id).toBeDefined();
    expect(researchProjects.programId).toBeDefined();
    expect(researchProjects.slug).toBeDefined();
    expect(researchProjects.status).toBeDefined();
  });

  it('verifies communication and institutional settings table definitions', () => {
    expect(news.id).toBeDefined();
    expect(news.slug).toBeDefined();
    expect(news.category).toBeDefined();
    expect(events.id).toBeDefined();
    expect(events.eventType).toBeDefined();
    expect(galleryMedia.id).toBeDefined();
    expect(galleryMedia.imageUrl).toBeDefined();
    expect(contactMessages.id).toBeDefined();
    expect(contactMessages.senderEmail).toBeDefined();
    expect(systemSettings.id).toBeDefined();
    expect(systemSettings.institutionName).toBeDefined();
  });
});
