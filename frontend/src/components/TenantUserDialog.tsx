import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Alert,
  CircularProgress,
} from '@mui/material'
import type { TenantUser, CreateTenantUserRequest, UpdateTenantUserRequest } from '@/types'

interface TenantUserDialogProps {
  open: boolean
  onClose: () => void
  onSave: (data: CreateTenantUserRequest | UpdateTenantUserRequest) => Promise<void>
  user?: TenantUser
  mode: 'create' | 'edit'
}

export default function TenantUserDialog({
  open,
  onClose,
  onSave,
  user,
  mode,
}: TenantUserDialogProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (mode === 'edit' && user) {
      setEmail(user.email)
      setFirstName(user.firstName)
      setLastName(user.lastName)
      setIsActive(true) // Default to active, we don't have this field in response yet
      setPassword('')
    } else {
      setEmail('')
      setPassword('')
      setFirstName('')
      setLastName('')
      setIsActive(true)
    }
    setError('')
  }, [mode, user, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'create') {
        await onSave({
          email,
          password,
          firstName,
          lastName,
          isActive,
        })
      } else {
        await onSave({
          firstName,
          lastName,
          isActive,
        })
      }
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save tenant user')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {mode === 'create' ? 'Create Tenant User' : 'Edit Tenant User'}
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={mode === 'edit' || loading}
            margin="normal"
            autoFocus={mode === 'create'}
          />

          {mode === 'create' && (
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              margin="normal"
              helperText="Minimum 8 characters"
            />
          )}

          <TextField
            fullWidth
            label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            disabled={loading}
            margin="normal"
            autoFocus={mode === 'edit'}
          />

          <TextField
            fullWidth
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            disabled={loading}
            margin="normal"
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                disabled={loading}
              />
            }
            label="Active"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {mode === 'create' ? 'Create' : 'Save'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}