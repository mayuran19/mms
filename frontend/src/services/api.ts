// API service for making HTTP requests to the backend

const API_BASE_URL = '/api'

interface LoginRequest {
  username: string
  password: string
}

interface TenantLoginRequest extends LoginRequest {
  tenantSlug: string
}

interface ApiResponse<T> {
  data?: T
  error?: string
  status?: number
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        credentials: 'include', // Include cookies for session management
      })

      // For 401, return status without throwing error
      if (response.status === 401) {
        return { status: 401, error: 'Unauthorized' }
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return { data, status: response.status }
    } catch (error) {
      console.error('API request failed:', error)
      return { error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  // Platform authentication
  async platformLogin(credentials: LoginRequest) {
    return this.request('/auth/platform/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  }

  async platformLogout() {
    return this.request('/auth/platform/logout', {
      method: 'POST',
    })
  }

  // Check authentication status
  async getCurrentUser() {
    return this.request('/auth/me', {
      method: 'GET',
    })
  }

  // Tenant authentication
  async tenantLogin(credentials: TenantLoginRequest) {
    return this.request('/auth/tenant/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  }

  async tenantLogout() {
    return this.request('/auth/tenant/logout', {
      method: 'POST',
    })
  }

  // Platform API endpoints
  async getPlatformUsers() {
    return this.request('/platform/users', {
      method: 'GET',
    })
  }

  // Tenant Management
  async getTenants(status?: string) {
    const params = status ? `?status=${status}` : ''
    return this.request(`/platform/tenants${params}`, {
      method: 'GET',
    })
  }

  async getTenantById(id: string) {
    return this.request(`/platform/tenants/${id}`, {
      method: 'GET',
    })
  }

  async getTenantBySlug(slug: string) {
    return this.request(`/platform/tenants/slug/${slug}`, {
      method: 'GET',
    })
  }

  async createTenant(data: { name: string; slug: string; status: string }) {
    return this.request('/platform/tenants', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateTenant(id: string, data: { name?: string; status?: string }) {
    return this.request(`/platform/tenants/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteTenant(id: string) {
    return this.request(`/platform/tenants/${id}`, {
      method: 'DELETE',
    })
  }

  // Tenant API endpoints
  async getTenantMembers() {
    return this.request('/tenant/members', {
      method: 'GET',
    })
  }

  // Tenant User Management (Platform)
  async getTenantUsers(tenantId: string) {
    return this.request(`/platform/tenants/${tenantId}/users`, {
      method: 'GET',
    })
  }

  async getTenantUserById(tenantId: string, userId: string) {
    return this.request(`/platform/tenants/${tenantId}/users/${userId}`, {
      method: 'GET',
    })
  }

  async createTenantUser(tenantId: string, data: { email: string; password: string; firstName: string; lastName: string; isActive: boolean }) {
    return this.request(`/platform/tenants/${tenantId}/users`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateTenantUser(tenantId: string, userId: string, data: { firstName?: string; lastName?: string; isActive?: boolean }) {
    return this.request(`/platform/tenants/${tenantId}/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteTenantUser(tenantId: string, userId: string) {
    return this.request(`/platform/tenants/${tenantId}/users/${userId}`, {
      method: 'DELETE',
    })
  }

  async getTenantUserCount(tenantId: string) {
    return this.request(`/platform/tenants/${tenantId}/users/count`, {
      method: 'GET',
    })
  }
}

export const apiService = new ApiService()
export default apiService