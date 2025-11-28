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
import BusinessIcon from '@mui/icons-material/Business'
import apiService from '@/services/api'
import { useAuthStore } from '@/store/authStore'

export const Route = createFileRoute('/tenant/login')({
  component: TenantLogin,
})

function TenantLogin() {
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuthStore()
  const [tenantId, setTenantId] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: '/tenant/dashboard' })
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await apiService.tenantLogin({ tenantId, username, password })

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
        navigate({ to: '/tenant/dashboard' })
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
            <BusinessIcon
              sx={{ fontSize: 40, color: 'secondary.main', mr: 2 }}
            />
            <Typography variant="h4" component="h1">
              Tenant Login
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
              label="Tenant ID"
              margin="normal"
              value={tenantId}
              onChange={(e) => setTenantId(e.target.value)}
              required
              autoFocus
              helperText="Enter your organization's tenant ID"
              disabled={loading}
            />
            <TextField
              fullWidth
              label="Username"
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
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
              color="secondary"
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