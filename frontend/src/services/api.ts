// API service for making HTTP requests to the backend

const API_BASE_URL = '/api'

interface LoginRequest {
  username: string
  password: string
}

interface TenantLoginRequest extends LoginRequest {
  tenantId: string
}

interface ApiResponse<T> {
  data?: T
  error?: string
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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return { data }
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

  async getTenants() {
    return this.request('/platform/tenants', {
      method: 'GET',
    })
  }

  // Tenant API endpoints
  async getTenantMembers() {
    return this.request('/tenant/members', {
      method: 'GET',
    })
  }
}

export const apiService = new ApiService()
export default apiService