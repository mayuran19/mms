import { create } from 'zustand'
import apiService from '@/services/api'
import type { LoginResponse } from '@/types'

interface User {
  id: string
  username: string
  email: string
  userType: 'platform' | 'tenant'
  tenantId?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (user: User) => void
  logout: () => void
  checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: (user) => set({ user, isAuthenticated: true }),

  logout: () => set({ user: null, isAuthenticated: false }),

  checkAuth: async () => {
    set({ isLoading: true })
    try {
      const response = await apiService.getCurrentUser()

      if (response.status === 401 || response.error) {
        // Not authenticated
        set({ user: null, isAuthenticated: false, isLoading: false })
      } else if (response.data) {
        // Authenticated - map LoginResponse to User
        const loginResponse = response.data as LoginResponse
        const user: User = {
          id: loginResponse.userId,
          username: loginResponse.username,
          email: loginResponse.email,
          userType: loginResponse.userType.toLowerCase() as 'platform' | 'tenant',
          tenantId: loginResponse.tenantId,
        }
        set({ user, isAuthenticated: true, isLoading: false })
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      set({ user: null, isAuthenticated: false, isLoading: false })
    }
  },
}))