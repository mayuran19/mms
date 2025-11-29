import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
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
  Breadcrumbs,
  Link,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import apiService from '@/services/api'
import type { Tenant, TenantUser, CreateTenantUserRequest, UpdateTenantUserRequest } from '@/types'
import TenantUserDialog from '@/components/TenantUserDialog'

export const Route = createFileRoute('/platform/_authenticated/tenants/$tenantId/users')({
  component: TenantUsersPage,
})

function TenantUsersPage() {
  const { tenantId } = Route.useParams()
  const navigate = useNavigate()
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [users, setUsers] = useState<TenantUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [userDialogOpen, setUserDialogOpen] = useState(false)
  const [userDialogMode, setUserDialogMode] = useState<'create' | 'edit'>('create')
  const [selectedUser, setSelectedUser] = useState<TenantUser | undefined>()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<TenantUser | null>(null)

  const fetchTenant = async () => {
    try {
      const response = await apiService.getTenantById(tenantId)
      if (response.error) {
        setError(response.error)
      } else if (response.data) {
        setTenant(response.data as Tenant)
      }
    } catch (err) {
      setError('Failed to fetch tenant details')
    }
  }

  const fetchUsers = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await apiService.getTenantUsers(tenantId)
      if (response.error) {
        setError(response.error)
      } else if (response.data) {
        setUsers(response.data as TenantUser[])
      }
    } catch (err) {
      setError('Failed to fetch tenant users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTenant()
    fetchUsers()
  }, [tenantId])

  const handleCreateClick = () => {
    setUserDialogMode('create')
    setSelectedUser(undefined)
    setUserDialogOpen(true)
  }

  const handleEditClick = (user: TenantUser) => {
    setUserDialogMode('edit')
    setSelectedUser(user)
    setUserDialogOpen(true)
  }

  const handleDeleteClick = (user: TenantUser) => {
    setUserToDelete(user)
    setDeleteDialogOpen(true)
  }

  const handleUserDialogClose = () => {
    setUserDialogOpen(false)
    setSelectedUser(undefined)
  }

  const handleSaveUser = async (data: CreateTenantUserRequest | UpdateTenantUserRequest) => {
    if (userDialogMode === 'create') {
      const response = await apiService.createTenantUser(tenantId, data as CreateTenantUserRequest)
      if (response.error) {
        throw new Error(response.error)
      }
    } else if (selectedUser) {
      const response = await apiService.updateTenantUser(
        tenantId,
        selectedUser.id,
        data as UpdateTenantUserRequest
      )
      if (response.error) {
        throw new Error(response.error)
      }
    }
    await fetchUsers()
  }

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return

    try {
      const response = await apiService.deleteTenantUser(tenantId, userToDelete.id)
      if (response.error) {
        setError(response.error)
      } else {
        await fetchUsers()
      }
    } catch (err) {
      setError('Failed to delete user')
    } finally {
      setDeleteDialogOpen(false)
      setUserToDelete(null)
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
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link
          component="button"
          variant="body1"
          onClick={() => navigate({ to: '/platform/tenants' })}
          underline="hover"
          color="inherit"
        >
          Tenants
        </Link>
        <Typography color="text.primary">{tenant?.name || 'Loading...'}</Typography>
        <Typography color="text.primary">Users</Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate({ to: '/platform/tenants' })} color="primary">
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h4" component="h1">
              Tenant Users
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage users for {tenant?.name}
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateClick}
        >
          Add User
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
          ) : users.length === 0 ? (
            <Box sx={{ textAlign: 'center', p: 4 }}>
              <Typography color="text.secondary">
                No users found for this tenant. Add the first user to get started.
              </Typography>
            </Box>
          ) : (
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Email</TableCell>
                    <TableCell>First Name</TableCell>
                    <TableCell>Last Name</TableCell>
                    <TableCell>Created Date</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>
                        <Typography variant="body2">{user.email}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{user.firstName}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{user.lastName}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(user.createdDate)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => handleEditClick(user)}
                          color="primary"
                          title="Edit User"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick(user)}
                          color="error"
                          title="Delete User"
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

      <TenantUserDialog
        open={userDialogOpen}
        onClose={handleUserDialogClose}
        onSave={handleSaveUser}
        user={selectedUser}
        mode={userDialogMode}
      />

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete user "{userToDelete?.email}"? This action cannot be
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