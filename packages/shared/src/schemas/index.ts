/**
 * @file packages/shared/src/schemas/index.ts
 * @description Central Zod validation schemas for all domain entities in TARCMS.
 * These schemas provide runtime input validation on the server and type inference
 * for forms and API requests on the client.
 */

import { z } from 'zod';
import {
  EventType,
  GalleryCategory,
  MessageStatus,
  NewsCategory,
  ProjectStatus,
  PublicationType,
  ResearchProgramStatus,
  UserRole,
  VehicleAssignmentStatus,
  VehicleStatus,
  VehicleType,
} from '../constants/index.js';

// ============================================================================
// 1. AUTHENTICATION & USER SCHEMAS
// ============================================================================

/**
 * Validates user credentials during login.
 */
export const LoginSchema = z.object({
  email: z.string().email('Please enter a valid institutional or personal email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});
export type LoginInput = z.infer<typeof LoginSchema>;

/**
 * Validates user self-service profile updates.
 */
export const UpdateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional().nullable(),
  avatarUrl: z.string().url('Must be a valid image URL').optional().nullable(),
});
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;

// ============================================================================
// 2. ORGANIZATIONAL SCHEMAS (DEPARTMENTS & STAFF)
// ============================================================================

/**
 * Validates department creation and modification.
 */
export const DepartmentSchema = z.object({
  name: z.string().min(2, 'Department name is required'),
  code: z.string().min(2, 'Unique code is required (e.g., DEPT-SPICE)').toUpperCase(),
  description: z.string().optional().nullable(),
  headId: z.string().uuid('Head of department must be a valid staff UUID').optional().nullable(),
  establishedYear: z.number().int().min(1950).max(2050).optional().nullable(),
  sortOrder: z.number().int().default(0),
});
export type DepartmentInput = z.infer<typeof DepartmentSchema>;

/**
 * Validates staff directory personnel records.
 */
export const StaffSchema = z.object({
  departmentId: z.string().uuid('Valid department ID is required'),
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  position: z.string().min(2, 'Job title/position is required'),
  email: z.string().email('Valid institutional email is required'),
  phone: z.string().optional().nullable(),
  areasOfExpertise: z.array(z.string()).default([]), // E.g., ["Coffee Pathology", "Soil Microbiology"]
  bio: z.string().optional().nullable(),
  photoUrl: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
});
export type StaffInput = z.infer<typeof StaffSchema>;

// ============================================================================
// 3. RESEARCH DOMAIN SCHEMAS (PROGRAMS, PROJECTS, PUBLICATIONS)
// ============================================================================

/**
 * Validates high-level research programs.
 */
export const ResearchProgramSchema = z.object({
  departmentId: z.string().uuid('Valid parent department ID is required'),
  leadStaffId: z.string().uuid().optional().nullable(),
  title: z.string().min(3, 'Program title is required'),
  code: z.string().min(2, 'Program code is required (e.g., PROG-CARDAMOM)').toUpperCase(),
  description: z.string().min(10, 'Program description must be at least 10 characters'),
  objectives: z.array(z.string()).default([]),
  status: z
    .enum([
      ResearchProgramStatus.PLANNED,
      ResearchProgramStatus.ACTIVE,
      ResearchProgramStatus.COMPLETED,
      ResearchProgramStatus.SUSPENDED,
    ])
    .default(ResearchProgramStatus.ACTIVE),
  sortOrder: z.number().int().default(0),
});
export type ResearchProgramInput = z.infer<typeof ResearchProgramSchema>;

/**
 * Validates individual research projects/trials.
 */
export const ResearchProjectSchema = z.object({
  programId: z.string().uuid('Valid parent research program ID is required'),
  departmentId: z.string().uuid('Valid department ID is required'),
  leadResearcherId: z.string().uuid().optional().nullable(),
  title: z.string().min(3, 'Project title is required'),
  code: z.string().min(2, 'Project code is required (e.g., PRJ-COR-2026-01)').toUpperCase(),
  summary: z.string().min(10, 'Project summary must be at least 10 characters'),
  objectives: z.array(z.string()).default([]),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  status: z
    .enum([
      ProjectStatus.PROPOSED,
      ProjectStatus.ONGOING,
      ProjectStatus.COMPLETED,
      ProjectStatus.ON_HOLD,
    ])
    .default(ProjectStatus.ONGOING),
  fundingSource: z.string().optional().nullable(),
  budget: z.number().optional().nullable(),
});
export type ResearchProjectInput = z.infer<typeof ResearchProjectSchema>;

/**
 * Validates publication author entries (both internal staff and external collaborators).
 */
export const PublicationAuthorInputSchema = z.object({
  staffId: z.string().uuid('Internal staff UUID').optional().nullable(),
  externalAuthorName: z.string().optional().nullable(),
  externalAffiliation: z.string().optional().nullable(),
  authorOrder: z.number().int().min(1).default(1),
  isCorresponding: z.boolean().default(false),
});

/**
 * Validates scientific publication records.
 */
export const PublicationSchema = z.object({
  projectId: z.string().uuid().optional().nullable(),
  title: z.string().min(3, 'Publication title is required'),
  abstract: z.string().min(10, 'Abstract must be at least 10 characters'),
  publicationType: z
    .enum([
      PublicationType.JOURNAL_ARTICLE,
      PublicationType.CONFERENCE_PAPER,
      PublicationType.TECHNICAL_MANUAL,
      PublicationType.VARIETY_RELEASE,
      PublicationType.POLICY_BRIEF,
    ])
    .default(PublicationType.JOURNAL_ARTICLE),
  publisherOrJournal: z.string().optional().nullable(),
  publicationYear: z.number().int().min(1960).max(2050),
  doiUrl: z.string().optional().nullable(),
  fileUrl: z.string().optional().nullable(), // Path to uploaded PDF
  peerReviewed: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  authors: z.array(PublicationAuthorInputSchema).min(1, 'At least one author must be specified'),
});
export type PublicationInput = z.infer<typeof PublicationSchema>;

// ============================================================================
// 4. EDITORIAL & MEDIA SCHEMAS (NEWS, EVENTS, GALLERY)
// ============================================================================

/**
 * Validates news articles and institutional announcements.
 */
export const NewsSchema = z.object({
  title: z.string().min(3, 'News title is required'),
  summary: z.string().min(10, 'Summary must be at least 10 characters'),
  content: z.string().min(20, 'Article content must be at least 20 characters'),
  category: z
    .enum([
      NewsCategory.RESEARCH_NEWS,
      NewsCategory.INSTITUTIONAL,
      NewsCategory.FARMER_ADVISORY,
      NewsCategory.EVENTS,
    ])
    .default(NewsCategory.INSTITUTIONAL),
  coverImageUrl: z.string().optional().nullable(),
  isPublished: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
});
export type NewsInput = z.infer<typeof NewsSchema>;

/**
 * Validates institutional events, workshops, and field days.
 */
export const EventSchema = z.object({
  title: z.string().min(3, 'Event title is required'),
  eventType: z
    .enum([
      EventType.FIELD_DAY,
      EventType.WORKSHOP,
      EventType.CONFERENCE,
      EventType.TRAINING_SESSION,
      EventType.SEMINAR,
    ])
    .default(EventType.WORKSHOP),
  description: z.string().min(10, 'Event description is required'),
  location: z.string().min(2, 'Venue location is required'),
  startTime: z.string().datetime('Start time must be a valid ISO datetime string'),
  endTime: z.string().datetime('End time must be a valid ISO datetime string'),
  isAllDay: z.boolean().default(false),
  bannerUrl: z.string().optional().nullable(),
  isPublished: z.boolean().default(true),
});
export type EventInput = z.infer<typeof EventSchema>;

// ============================================================================
// 5. OPERATIONAL & FLEET SCHEMAS (VEHICLES & REQUISITIONS)
// ============================================================================

/**
 * Validates vehicle fleet inventory records.
 */
export const VehicleSchema = z.object({
  registrationPlate: z.string().min(2, 'Registration plate is required'),
  make: z.string().min(2, 'Vehicle make is required (e.g., Toyota)'),
  model: z.string().min(1, 'Vehicle model is required (e.g., Hilux)'),
  year: z.number().int().min(1980).max(2050),
  vehicleType: z
    .enum([
      VehicleType.SUV,
      VehicleType.PICKUP_4WD,
      VehicleType.TRUCK,
      VehicleType.VAN,
      VehicleType.MOTORCYCLE,
    ])
    .default(VehicleType.PICKUP_4WD),
  departmentId: z.string().uuid().optional().nullable(),
  assignedDriver: z.string().optional().nullable(),
  status: z
    .enum([
      VehicleStatus.AVAILABLE,
      VehicleStatus.IN_USE,
      VehicleStatus.UNDER_MAINTENANCE,
      VehicleStatus.DECOMMISSIONED,
    ])
    .default(VehicleStatus.AVAILABLE),
  fuelType: z.enum(['DIESEL', 'PETROL']).default('DIESEL'),
  mileageKm: z.number().int().min(0).default(0),
  notes: z.string().optional().nullable(),
});
export type VehicleInput = z.infer<typeof VehicleSchema>;

/**
 * Validates staff vehicle dispatch requisition requests.
 */
export const VehicleRequisitionSchema = z.object({
  vehicleId: z.string().uuid('Valid vehicle ID required'),
  destination: z.string().min(2, 'Destination location is required'),
  purpose: z.string().min(5, 'Requisition purpose must be detailed (min 5 characters)'),
  startTime: z.string().datetime('Valid start time required'),
  endTime: z.string().datetime('Valid end time required'),
});
export type VehicleRequisitionInput = z.infer<typeof VehicleRequisitionSchema>;

// ============================================================================
// 6. COMMUNICATION & SETTINGS SCHEMAS
// ============================================================================

/**
 * Validates public visitor contact inquiries.
 */
export const ContactFormSchema = z.object({
  senderName: z.string().min(2, 'Your name must be at least 2 characters'),
  senderEmail: z.string().email('Please enter a valid email address'),
  senderPhone: z.string().optional().nullable(),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message body must be at least 10 characters long'),
});
export type ContactFormInput = z.infer<typeof ContactFormSchema>;

/**
 * Validates institutional system settings.
 */
export const SystemSettingsSchema = z.object({
  institutionName: z.string().min(2, 'Institution name is required'),
  tagline: z.string().min(2, 'Tagline is required'),
  aboutText: z.string().optional().nullable(),
  missionText: z.string().optional().nullable(),
  visionText: z.string().optional().nullable(),
  directorName: z.string().optional().nullable(),
  directorTitle: z.string().optional().nullable(),
  directorMessage: z.string().optional().nullable(),
  directorPhotoUrl: z.string().optional().nullable(),
  officialEmail: z.string().email('Valid official center email required'),
  officialPhone: z.string().min(5, 'Valid official telephone required'),
  physicalAddress: z.string().min(3, 'Physical address required'),
  gpsCoordinates: z.string().optional().nullable(),
  socialLinks: z.record(z.string()).optional().nullable(),
});
export type SystemSettingsInput = z.infer<typeof SystemSettingsSchema>;
