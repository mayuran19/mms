import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  CircularProgress,
} from '@mui/material'
import { useState, useEffect } from 'react'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import apiService from '@/services/api'
import { useAuthStore } from '@/store/authStore'

export const Route = createFileRoute('/platform/login')({
  component: PlatformLogin,
})

function PlatformLogin() {
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuthStore()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: '/platform/dashboard' })
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await apiService.platformLogin({ username, password })

      if (response.error) {
        setError(response.error)
      } else if (response.data) {
        // Login successful, update auth state with server response
        const loginResponse = response.data as any
        login({
          id: loginResponse.userId,
          username: loginResponse.username,
          email: loginResponse.email,
          userType: loginResponse.userType.toLowerCase() as 'platform' | 'tenant',
          tenantId: loginResponse.tenantId,
        })
        navigate({ to: '/platform/dashboard' })
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <AdminPanelSettingsIcon
              sx={{ fontSize: 40, color: 'primary.main', mr: 2 }}
            />
            <Typography variant="h4" component="h1">
              Platform Login
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
              disabled={loading}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>
          </form>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Link href="/" underline="hover">
              Back to Home
            </Link>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}