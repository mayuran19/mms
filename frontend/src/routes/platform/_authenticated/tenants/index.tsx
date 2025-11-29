import {createFileRoute, useNavigate} from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import PeopleIcon from '@mui/icons-material/People'
import apiService from '@/services/api'
import { Tenant, CreateTenantRequest, UpdateTenantRequest } from '@/types'
import TenantDialog from '@/components/TenantDialog'

export const Route = createFileRoute('/platform/_authenticated/tenants/')({
  component: TenantsPage,
})

function TenantsPage() {
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create')
  const [selectedTenant, setSelectedTenant] = useState<Tenant | undefined>()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [tenantToDelete, setTenantToDelete] = useState<Tenant | null>(null)
  const navigate = useNavigate()

  const fetchTenants = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await apiService.getTenants()
      if (response.error) {
        setError(response.error)
      } else if (response.data) {
        setTenants(response.data as Tenant[])
      }
    } catch (err) {
      setError('Failed to fetch tenants')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTenants()
  }, [])

  const handleCreateClick = () => {
    setDialogMode('create')
    setSelectedTenant(undefined)
    setDialogOpen(true)
  }

  const handleEditClick = (tenant: Tenant) => {
    setDialogMode('edit')
    setSelectedTenant(tenant)
    setDialogOpen(true)
  }

  const handleDeleteClick = (tenant: Tenant) => {
    setTenantToDelete(tenant)
    setDeleteDialogOpen(true)
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
    setSelectedTenant(undefined)
  }

  const handleSave = async (data: CreateTenantRequest | UpdateTenantRequest) => {
    if (dialogMode === 'create') {
      const response = await apiService.createTenant(data as CreateTenantRequest)
      if (response.error) {
        throw new Error(response.error)
      }
    } else if (selectedTenant) {
      const response = await apiService.updateTenant(selectedTenant.id, data)
      if (response.error) {
        throw new Error(response.error)
      }
    }
    await fetchTenants()
  }

  const handleDeleteConfirm = async () => {
    if (!tenantToDelete) return

    try {
      const response = await apiService.deleteTenant(tenantToDelete.id)
      if (response.error) {
        setError(response.error)
      } else {
        await fetchTenants()
      }
    } catch (err) {
      setError('Failed to delete tenant')
    } finally {
      setDeleteDialogOpen(false)
      setTenantToDelete(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'success'
      case 'INACTIVE':
        return 'default'
      case 'SUSPENDED':
        return 'error'
      default:
        return 'default'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Tenant Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateClick}
        >
          Create Tenant
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Card>
        <CardContent>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : tenants.length === 0 ? (
            <Box sx={{ textAlign: 'center', p: 4 }}>
              <Typography color="text.secondary">
                No tenants found. Create your first tenant to get started.
              </Typography>
            </Box>
          ) : (
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Slug</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Created Date</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tenants.map((tenant) => (
                    <TableRow key={tenant.id} hover>
                      <TableCell>
                        <Typography variant="body1" fontWeight={500}>
                          {tenant.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {tenant.slug}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={tenant.status}
                          color={getStatusColor(tenant.status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(tenant.createdDate)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => navigate({ to: `/platform/tenants/${tenant.id}/users` })}
                          color="info"
                          title="Manage Users"
                        >
                          <PeopleIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleEditClick(tenant)}
                          color="primary"
                          title="Edit Tenant"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick(tenant)}
                          color="error"
                          title="Delete Tenant"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      <TenantDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onSave={handleSave}
        tenant={selectedTenant}
        mode={dialogMode}
      />

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete tenant "{tenantToDelete?.name}"? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}