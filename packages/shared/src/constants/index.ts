export const UserRole = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  RESEARCHER: 'RESEARCHER',
  STAFF: 'STAFF',
} as const;

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];

export const PublicationType = {
  JOURNAL_ARTICLE: 'JOURNAL_ARTICLE',
  CONFERENCE_PAPER: 'CONFERENCE_PAPER',
  TECHNICAL_MANUAL: 'TECHNICAL_MANUAL',
  VARIETY_RELEASE: 'VARIETY_RELEASE',
  POLICY_BRIEF: 'POLICY_BRIEF',
} as const;

export type PublicationTypeValue = (typeof PublicationType)[keyof typeof PublicationType];

export const ResearchProgramStatus = {
  PLANNED: 'PLANNED',
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
  SUSPENDED: 'SUSPENDED',
} as const;

export type ResearchProgramStatusValue =
  (typeof ResearchProgramStatus)[keyof typeof ResearchProgramStatus];

export const ProjectStatus = {
  PROPOSED: 'PROPOSED',
  ONGOING: 'ONGOING',
  COMPLETED: 'COMPLETED',
  ON_HOLD: 'ON_HOLD',
} as const;

export type ProjectStatusValue = (typeof ProjectStatus)[keyof typeof ProjectStatus];

export const VehicleType = {
  SUV: 'SUV',
  PICKUP_4WD: 'PICKUP_4WD',
  TRUCK: 'TRUCK',
  VAN: 'VAN',
  MOTORCYCLE: 'MOTORCYCLE',
} as const;

export type VehicleTypeValue = (typeof VehicleType)[keyof typeof VehicleType];

export const VehicleStatus = {
  AVAILABLE: 'AVAILABLE',
  IN_USE: 'IN_USE',
  UNDER_MAINTENANCE: 'UNDER_MAINTENANCE',
  DECOMMISSIONED: 'DECOMMISSIONED',
} as const;

export type VehicleStatusValue = (typeof VehicleStatus)[keyof typeof VehicleStatus];

export const VehicleAssignmentStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export type VehicleAssignmentStatusValue =
  (typeof VehicleAssignmentStatus)[keyof typeof VehicleAssignmentStatus];

export const MessageStatus = {
  UNREAD: 'UNREAD',
  READ: 'READ',
  IN_PROGRESS: 'IN_PROGRESS',
  REPLIED: 'REPLIED',
  ARCHIVED: 'ARCHIVED',
} as const;

export type MessageStatusValue = (typeof MessageStatus)[keyof typeof MessageStatus];

export const NewsCategory = {
  RESEARCH_NEWS: 'RESEARCH_NEWS',
  INSTITUTIONAL: 'INSTITUTIONAL',
  FARMER_ADVISORY: 'FARMER_ADVISORY',
  EVENTS: 'EVENTS',
} as const;

export type NewsCategoryValue = (typeof NewsCategory)[keyof typeof NewsCategory];

export const EventType = {
  FIELD_DAY: 'FIELD_DAY',
  WORKSHOP: 'WORKSHOP',
  CONFERENCE: 'CONFERENCE',
  TRAINING_SESSION: 'TRAINING_SESSION',
  SEMINAR: 'SEMINAR',
} as const;

export type EventTypeValue = (typeof EventType)[keyof typeof EventType];

export const GalleryCategory = {
  FIELD_TRIALS: 'FIELD_TRIALS',
  LABORATORY: 'LABORATORY',
  SPICE_VARIETIES: 'SPICE_VARIETIES',
  COFFEE_RESEARCH: 'COFFEE_RESEARCH',
  COMMUNITY_OUTREACH: 'COMMUNITY_OUTREACH',
  FACILITIES: 'FACILITIES',
} as const;

export type GalleryCategoryValue = (typeof GalleryCategory)[keyof typeof GalleryCategory];
