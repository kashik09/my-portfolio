// User types
export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
  createdAt: Date
  updatedAt: Date
}

// Project types
export interface Project {
  id: string
  title: string
  description: string
  imageUrl?: string
  technologies: string[]
  githubUrl?: string
  liveUrl?: string
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

// Service types
export interface Service {
  id: string
  name: string
  description: string
  icon?: string
  price?: number
  features: string[]
  createdAt: Date
  updatedAt: Date
}

// Service Request types
export interface ServiceRequest {
  id: string
  name: string
  email: string
  serviceType: string
  budget?: number
  description: string
  status: 'pending' | 'in_progress' | 'completed' | 'rejected'
  createdAt: Date
  updatedAt: Date
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
