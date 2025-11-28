import { createFileRoute } from '@tanstack/react-router'
import { Box, Typography, Paper } from '@mui/material'

export const Route = createFileRoute('/platform/_authenticated/users')({
  component: UsersPage,
})

function UsersPage() {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Platform Users
      </Typography>
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography color="text.secondary">
          User management features coming soon...
        </Typography>
      </Paper>
    </Box>
  )
}