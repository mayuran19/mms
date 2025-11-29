import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Box,
  Typography,
  Dialog as ConfirmDialog,
  DialogContentText,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import CloseIcon from '@mui/icons-material/Close'
import apiService from '@/services/api'
import type { Tenant, TenantUser, CreateTenantUserRequest, UpdateTenantUserRequest } from '@/types'
import TenantUserDialog from './TenantUserDialog'

interface TenantUsersDialogProps {
  open: boolean
  onClose: () => void
  tenant: Tenant | null
}

export default function TenantUsersDialog({ open, onClose, tenant }: TenantUsersDialogProps) {
  const [users, setUsers] = useState<TenantUser[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [userDialogOpen, setUserDialogOpen] = useState(false)
  const [userDialogMode, setUserDialogMode] = useState<'create' | 'edit'>('create')
  const [selectedUser, setSelectedUser] = useState<TenantUser | undefined>()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<TenantUser | null>(null)

  const fetchUsers = async () => {
    if (!tenant) return

    setLoading(true)
    setError('')
    try {
      const response = await apiService.getTenantUsers(tenant.id)
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
    if (open && tenant) {
      fetchUsers()
    }
  }, [open, tenant])

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
    if (!tenant) return

    if (userDialogMode === 'create') {
      const response = await apiService.createTenantUser(tenant.id, data as CreateTenantUserRequest)
      if (response.error) {
        throw new Error(response.error)
      }
    } else if (selectedUser) {
      const response = await apiService.updateTenantUser(
        tenant.id,
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
    if (!tenant || !userToDelete) return

    try {
      const response = await apiService.deleteTenantUser(tenant.id, userToDelete.id)
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
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              Users for {tenant?.name}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateClick}
                size="small"
              >
                Add User
              </Button>
              <IconButton onClick={onClose} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

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
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick(user)}
                          color="error"
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
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>

      <TenantUserDialog
        open={userDialogOpen}
        onClose={handleUserDialogClose}
        onSave={handleSaveUser}
        user={selectedUser}
        mode={userDialogMode}
      />

      <ConfirmDialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
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
      </ConfirmDialog>
    </>
  )
}