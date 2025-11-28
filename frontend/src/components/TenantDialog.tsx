import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material'
import { Tenant, CreateTenantRequest, UpdateTenantRequest } from '@/types'

interface TenantDialogProps {
  open: boolean
  onClose: () => void
  onSave: (data: CreateTenantRequest | UpdateTenantRequest) => Promise<void>
  tenant?: Tenant
  mode: 'create' | 'edit'
}

export default function TenantDialog({ open, onClose, onSave, tenant, mode }: TenantDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE' | 'SUSPENDED',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (tenant && mode === 'edit') {
      setFormData({
        name: tenant.name,
        slug: tenant.slug,
        status: tenant.status,
      })
    } else {
      setFormData({
        name: '',
        slug: '',
        status: 'ACTIVE',
      })
    }
    setError('')
  }, [tenant, mode, open])

  const handleChange = (field: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Auto-generate slug from name if creating
    if (field === 'name' && mode === 'create') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
      setFormData((prev) => ({
        ...prev,
        slug,
      }))
    }
  }

  const handleSubmit = async () => {
    setError('')
    setLoading(true)

    try {
      if (mode === 'create') {
        await onSave(formData as CreateTenantRequest)
      } else {
        const updateData: UpdateTenantRequest = {
          name: formData.name,
          status: formData.status,
        }
        await onSave(updateData)
      }
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save tenant')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {mode === 'create' ? 'Create New Tenant' : 'Edit Tenant'}
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          fullWidth
          label="Tenant Name"
          value={formData.name}
          onChange={handleChange('name')}
          margin="normal"
          required
          disabled={loading}
          helperText="The display name of the tenant"
        />

        <TextField
          fullWidth
          label="Slug"
          value={formData.slug}
          onChange={handleChange('slug')}
          margin="normal"
          required
          disabled={loading || mode === 'edit'}
          helperText={
            mode === 'edit'
              ? 'Slug cannot be changed after creation'
              : 'URL-friendly identifier (auto-generated from name)'
          }
        />

        <TextField
          fullWidth
          select
          label="Status"
          value={formData.status}
          onChange={handleChange('status')}
          margin="normal"
          required
          disabled={loading}
        >
          <MenuItem value="ACTIVE">Active</MenuItem>
          <MenuItem value="INACTIVE">Inactive</MenuItem>
          <MenuItem value="SUSPENDED">Suspended</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !formData.name || !formData.slug}
        >
          {loading ? <CircularProgress size={24} /> : mode === 'create' ? 'Create' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}