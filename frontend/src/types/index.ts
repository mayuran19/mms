// Common type definitions for the application

export interface User {
  id: string
  username: string
  email: string
  firstName?: string
  lastName?: string
  isActive: boolean
  isEmailVerified: boolean
}

export interface PlatformUser extends User {
  // Platform-specific user properties
}

export interface TenantUser extends User {
  tenantId: string
  // Tenant-specific user properties
}

export interface Tenant {
  id: string
  name: string
  slug: string
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
  createdBy: string
  createdDate: string
  lastModifiedBy: string
  lastModifiedDate: string
}

export interface CreateTenantRequest {
  name: string
  slug: string
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
}

export interface UpdateTenantRequest {
  name?: string
  status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
}

export interface AuthState {
  isAuthenticated: boolean
  user?: User
  userType?: 'platform' | 'tenant'
}

export interface LoginResponse {
  userId: string
  username: string
  email: string
  userType: string
  tenantId?: string
  message: string
}