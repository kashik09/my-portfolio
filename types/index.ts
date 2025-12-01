// ============================================
// ENUMS
// ============================================

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
}

export enum Theme {
  LIGHT = 'LIGHT',
  DARK = 'DARK',
  SYSTEM = 'SYSTEM',
}

export enum ProjectType {
  WEB_APPLICATION = 'WEB_APPLICATION',
  MOBILE_APPLICATION = 'MOBILE_APPLICATION',
  DESKTOP_APPLICATION = 'DESKTOP_APPLICATION',
  E_COMMERCE = 'E_COMMERCE',
  LANDING_PAGE = 'LANDING_PAGE',
  PORTFOLIO = 'PORTFOLIO',
  CUSTOM_SOFTWARE = 'CUSTOM_SOFTWARE',
  API_INTEGRATION = 'API_INTEGRATION',
  CONSULTING = 'CONSULTING',
  OTHER = 'OTHER',
}

export enum BudgetRange {
  UNDER_1K = 'UNDER_1K',
  RANGE_1K_5K = 'RANGE_1K_5K',
  RANGE_5K_10K = 'RANGE_5K_10K',
  RANGE_10K_25K = 'RANGE_10K_25K',
  RANGE_25K_50K = 'RANGE_25K_50K',
  ABOVE_50K = 'ABOVE_50K',
  NOT_SURE = 'NOT_SURE',
}

export enum Timeline {
  URGENT = 'URGENT',
  SHORT = 'SHORT',
  MEDIUM = 'MEDIUM',
  LONG = 'LONG',
  FLEXIBLE = 'FLEXIBLE',
}

export enum RequestStatus {
  PENDING = 'PENDING',
  REVIEWING = 'REVIEWING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum ProjectCategory {
  WEB_DEVELOPMENT = 'WEB_DEVELOPMENT',
  MOBILE_DEVELOPMENT = 'MOBILE_DEVELOPMENT',
  UI_UX_DESIGN = 'UI_UX_DESIGN',
  FULL_STACK = 'FULL_STACK',
  BACKEND = 'BACKEND',
  FRONTEND = 'FRONTEND',
  DEVOPS = 'DEVOPS',
  DATA_SCIENCE = 'DATA_SCIENCE',
  MACHINE_LEARNING = 'MACHINE_LEARNING',
  BLOCKCHAIN = 'BLOCKCHAIN',
  GAME_DEVELOPMENT = 'GAME_DEVELOPMENT',
  OTHER = 'OTHER',
}

// ============================================
// USER & AUTHENTICATION TYPES
// ============================================

export interface User {
  id: string
  email: string
  emailVerified?: Date | null
  name?: string | null
  image?: string | null
  role: Role
  theme: Theme
  createdAt: Date
  updatedAt: Date
}

export interface Account {
  id: string
  userId: string
  type: string
  provider: string
  providerAccountId: string
  refresh_token?: string | null
  access_token?: string | null
  expires_at?: number | null
  token_type?: string | null
  scope?: string | null
  id_token?: string | null
  session_state?: string | null
}

export interface Session {
  id: string
  sessionToken: string
  userId: string
  expires: Date
}

// ============================================
// PROJECT REQUEST TYPES
// ============================================

export interface ProjectRequest {
  id: string
  userId?: string | null
  name: string
  email: string
  phone?: string | null
  company?: string | null
  projectType: ProjectType
  budget: BudgetRange
  timeline: Timeline
  description: string
  requirements?: string | null
  attachments: string[]
  status: RequestStatus
  priority: Priority
  adminNotes?: string | null
  assignedTo?: string | null
  createdAt: Date
  updatedAt: Date
  respondedAt?: Date | null
}

export interface CreateProjectRequestInput {
  name: string
  email: string
  phone?: string
  company?: string
  projectType: ProjectType
  budget: BudgetRange
  timeline: Timeline
  description: string
  requirements?: string
  attachments?: string[]
}

export interface UpdateProjectRequestInput {
  status?: RequestStatus
  priority?: Priority
  adminNotes?: string
  assignedTo?: string
  respondedAt?: Date
}

// ============================================
// PROJECT TYPES
// ============================================

export interface Project {
  id: string
  slug: string
  title: string
  description: string
  category: ProjectCategory
  tags: string[]
  techStack: string[]
  features: string[]
  images: string[]
  thumbnail?: string | null
  githubUrl?: string | null
  liveUrl?: string | null
  demoUrl?: string | null
  caseStudyUrl?: string | null
  content?: string | null
  featured: boolean
  viewCount: number
  likeCount: number
  published: boolean
  publishedAt?: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface CreateProjectInput {
  slug: string
  title: string
  description: string
  category: ProjectCategory
  tags?: string[]
  techStack: string[]
  features?: string[]
  images?: string[]
  thumbnail?: string
  githubUrl?: string
  liveUrl?: string
  demoUrl?: string
  caseStudyUrl?: string
  content?: string
  featured?: boolean
  published?: boolean
}

export interface UpdateProjectInput {
  slug?: string
  title?: string
  description?: string
  category?: ProjectCategory
  tags?: string[]
  techStack?: string[]
  features?: string[]
  images?: string[]
  thumbnail?: string
  githubUrl?: string
  liveUrl?: string
  demoUrl?: string
  caseStudyUrl?: string
  content?: string
  featured?: boolean
  published?: boolean
  publishedAt?: Date
}

// ============================================
// ANALYTICS TYPES
// ============================================

export interface Visit {
  id: string
  pagePath: string
  pageTitle?: string | null
  visitorId: string
  referrer?: string | null
  utmSource?: string | null
  utmMedium?: string | null
  utmCampaign?: string | null
  userAgent?: string | null
  device?: string | null
  browser?: string | null
  os?: string | null
  country?: string | null
  city?: string | null
  sessionId?: string | null
  duration?: number | null
  metadata?: any
  timestamp: Date
}

export interface CreateVisitInput {
  pagePath: string
  pageTitle?: string
  visitorId: string
  referrer?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  userAgent?: string
  device?: string
  browser?: string
  os?: string
  country?: string
  city?: string
  sessionId?: string
  metadata?: any
}

export interface AnalyticsStats {
  totalVisits: number
  uniqueVisitors: number
  averageDuration: number
  topPages: Array<{ path: string; count: number }>
  topReferrers: Array<{ referrer: string; count: number }>
  deviceBreakdown: Array<{ device: string; count: number }>
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    page: number
    pageSize: number
    totalPages: number
    totalCount: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// ============================================
// FORM TYPES
// ============================================

export interface ContactFormData {
  name: string
  email: string
  subject?: string
  message: string
}

export interface NewsletterFormData {
  email: string
}

// ============================================
// UTILITY TYPES
// ============================================

export type Nullable<T> = T | null
export type Optional<T> = T | undefined
export type ID = string
