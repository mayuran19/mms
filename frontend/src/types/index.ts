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
  isActive: boolean
  createdDate: string
}

export interface AuthState {
  isAuthenticated: boolean
  user?: User
  userType?: 'platform' | 'tenant'
}