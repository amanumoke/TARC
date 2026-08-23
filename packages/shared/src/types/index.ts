import {
  EventTypeValue,
  GalleryCategoryValue,
  MessageStatusValue,
  NewsCategoryValue,
  ProjectStatusValue,
  PublicationTypeValue,
  ResearchProgramStatusValue,
  UserRoleType,
  VehicleAssignmentStatusValue,
  VehicleStatusValue,
  VehicleTypeValue,
} from '../constants/index.js';

export interface UserDTO {
  id: string;
  name: string;
  email: string;
  role: UserRoleType;
  avatarUrl?: string | null;
  phone?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentDTO {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  headId?: string | null;
  headName?: string | null;
  establishedYear?: number | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface StaffDTO {
  id: string;
  userId?: string | null;
  departmentId: string;
  departmentName?: string;
  firstName: string;
  lastName: string;
  position: string;
  email: string;
  phone?: string | null;
  areasOfExpertise?: string[] | null;
  bio?: string | null;
  photoUrl?: string | null;
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ResearchProgramDTO {
  id: string;
  departmentId: string;
  departmentName?: string;
  leadStaffId?: string | null;
  leadStaffName?: string | null;
  title: string;
  slug: string;
  code: string;
  description: string;
  objectives?: string[] | null;
  status: ResearchProgramStatusValue;
  sortOrder: number;
  projectsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ResearchProjectDTO {
  id: string;
  programId: string;
  programTitle?: string;
  departmentId: string;
  departmentName?: string;
  leadResearcherId?: string | null;
  leadResearcherName?: string | null;
  title: string;
  slug: string;
  code: string;
  summary: string;
  objectives?: string[] | null;
  startDate?: string | null;
  endDate?: string | null;
  status: ProjectStatusValue;
  fundingSource?: string | null;
  budget?: number | null;
  publicationsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface PublicationAuthorDTO {
  id?: string;
  publicationId?: string;
  staffId?: string | null;
  staffName?: string | null;
  externalAuthorName?: string | null;
  externalAffiliation?: string | null;
  authorOrder: number;
  isCorresponding: boolean;
}

export interface PublicationDTO {
  id: string;
  projectId?: string | null;
  projectTitle?: string | null;
  title: string;
  slug: string;
  abstract: string;
  publicationType: PublicationTypeValue;
  publisherOrJournal?: string | null;
  publicationYear: number;
  doiUrl?: string | null;
  fileUrl?: string | null;
  fileSizeBytes?: number | null;
  peerReviewed: boolean;
  isFeatured: boolean;
  authors: PublicationAuthorDTO[];
  createdAt: string;
  updatedAt: string;
}

export interface NewsDTO {
  id: string;
  authorId?: string | null;
  authorName?: string | null;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: NewsCategoryValue;
  coverImageUrl?: string | null;
  isPublished: boolean;
  isFeatured: boolean;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface EventDTO {
  id: string;
  title: string;
  slug: string;
  eventType: EventTypeValue;
  description: string;
  location: string;
  startTime: string;
  endTime: string;
  isAllDay: boolean;
  bannerUrl?: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryMediaDTO {
  id: string;
  uploadedBy?: string | null;
  title: string;
  caption?: string | null;
  category: GalleryCategoryValue;
  imageUrl: string;
  thumbnailUrl?: string | null;
  fileSizeBytes?: number | null;
  width?: number | null;
  height?: number | null;
  takenAt?: string | null;
  createdAt: string;
}

export interface VehicleDTO {
  id: string;
  registrationPlate: string;
  make: string;
  model: string;
  year: number;
  vehicleType: VehicleTypeValue;
  departmentId?: string | null;
  departmentName?: string | null;
  assignedDriver?: string | null;
  status: VehicleStatusValue;
  fuelType: 'DIESEL' | 'PETROL';
  mileageKm: number;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleAssignmentDTO {
  id: string;
  vehicleId: string;
  vehiclePlate?: string;
  requestedById: string;
  requestedByName?: string;
  destination: string;
  purpose: string;
  startTime: string;
  endTime: string;
  status: VehicleAssignmentStatusValue;
  createdAt: string;
}

export interface ContactMessageDTO {
  id: string;
  senderName: string;
  senderEmail: string;
  senderPhone?: string | null;
  subject: string;
  message: string;
  status: MessageStatusValue;
  assignedTo?: string | null;
  replyNotes?: string | null;
  repliedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SystemSettingsDTO {
  id: string;
  institutionName: string;
  tagline: string;
  aboutText?: string | null;
  missionText?: string | null;
  visionText?: string | null;
  directorName?: string | null;
  directorTitle?: string | null;
  directorMessage?: string | null;
  directorPhotoUrl?: string | null;
  officialEmail: string;
  officialPhone: string;
  physicalAddress: string;
  gpsCoordinates?: string | null;
  socialLinks?: Record<string, string> | null;
  updatedAt: string;
}

export interface DashboardMetricsDTO {
  totalProjects: number;
  activeProjects: number;
  totalPublications: number;
  totalStaff: number;
  availableVehicles: number;
  totalVehicles: number;
  unreadMessages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Array<{ field: string; message: string }>;
  };
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
