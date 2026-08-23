/**
 * @file packages/shared/src/schemas/index.test.ts
 * @description Unit tests for @tarcms/shared Zod validation schemas.
 * Verifies that valid payloads parse cleanly and invalid payloads fail with descriptive messages.
 */

import { describe, expect, it } from 'vitest';
import {
  ContactFormSchema,
  DepartmentSchema,
  LoginSchema,
  PublicationSchema,
  ResearchProgramSchema,
  StaffSchema,
  VehicleSchema,
} from './index.js';

describe('TARCMS Shared Validation Schemas', () => {
  // 1. Authentication Schema Tests
  describe('LoginSchema', () => {
    it('successfully validates valid login credentials', () => {
      const validPayload = {
        email: 'admin@tarc.gov.et',
        password: 'securePassword123',
      };
      const result = LoginSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it('fails when email format is invalid', () => {
      const invalidPayload = {
        email: 'invalid-email-string',
        password: 'pass',
      };
      const result = LoginSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });
  });

  // 2. Department Schema Tests
  describe('DepartmentSchema', () => {
    it('validates and auto-uppercases department code', () => {
      const payload = {
        name: 'Spices and Essential Oils Research Department',
        code: 'dept-spice',
        description: 'Pioneering breeding and pathology for cardamom and korarima',
        sortOrder: 1,
      };
      const result = DepartmentSchema.safeParse(payload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.code).toBe('DEPT-SPICE');
      }
    });
  });

  // 3. Staff Schema Tests
  describe('StaffSchema', () => {
    it('validates a complete staff personnel record', () => {
      const payload = {
        departmentId: '123e4567-e89b-12d3-a456-426614174000',
        firstName: 'Bekele',
        lastName: 'Tadesse',
        position: 'Lead Cardamom Researcher',
        email: 'bekele.tadesse@tarc.gov.et',
        areasOfExpertise: ['Spices Pathology', 'Korarima Agronomy'],
        isActive: true,
        isFeatured: true,
        sortOrder: 1,
      };
      const result = StaffSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });
  });

  // 4. Research Program & Publication Tests
  describe('Research & Publications Schemas', () => {
    it('validates a publication with multiple author associations', () => {
      const payload = {
        title:
          'Yield Response of Improved Cardamom (Elettaria cardamomum) in Tepi Forest Ecosystem',
        abstract:
          'Field trials conducted over four consecutive harvest cycles demonstrated significant yield advantages...',
        publicationType: 'JOURNAL_ARTICLE',
        publisherOrJournal: 'Ethiopian Journal of Agricultural Sciences',
        publicationYear: 2025,
        doiUrl: 'https://doi.org/10.1000/182',
        peerReviewed: true,
        isFeatured: true,
        authors: [
          {
            staffId: '123e4567-e89b-12d3-a456-426614174000',
            authorOrder: 1,
            isCorresponding: true,
          },
          {
            externalAuthorName: 'Dr. Sarah Jenkins',
            externalAffiliation: 'International Spice Institute',
            authorOrder: 2,
            isCorresponding: false,
          },
        ],
      };
      const result = PublicationSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it('rejects publication when author list is empty', () => {
      const payload = {
        title: 'Title without author',
        abstract: 'Abstract content over 10 chars',
        publicationYear: 2025,
        authors: [],
      };
      const result = PublicationSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });
  });

  // 5. Contact Form Tests
  describe('ContactFormSchema', () => {
    it('validates a valid public contact inquiry submission', () => {
      const payload = {
        senderName: 'Almaz Wolde',
        senderEmail: 'almaz.w@farmer-coop.org',
        senderPhone: '+251911223344',
        subject: 'Inquiry regarding improved coffee seedlings distribution',
        message:
          'We are a cooperative of 200 farmers in Tepi seeking advice on disease-resistant seedlings.',
      };
      const result = ContactFormSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });
  });
});
