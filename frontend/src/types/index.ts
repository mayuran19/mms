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

export interface TenantUser {
  id: string
  tenantId: string
  email: string
  firstName: string
  lastName: string
  createdDate: string
  lastModifiedDate: string
}

export interface CreateTenantUserRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  isActive: boolean
}

export interface UpdateTenantUserRequest {
  firstName?: string
  lastName?: string
  isActive?: boolean
}