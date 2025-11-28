import { createFileRoute } from '@tanstack/react-router'
import { Box, Typography, Paper } from '@mui/material'

export const Route = createFileRoute('/tenant/_authenticated/dashboard')({
  component: TenantDashboard,
})

function TenantDashboard() {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Tenant Dashboard
      </Typography>
      <Typography color="text.secondary" paragraph>
        Welcome to your tenant dashboard
      </Typography>
      <Paper sx={{ p: 3, mt: 2 }}>
        <Typography color="text.secondary">
          Tenant dashboard features coming soon...
        </Typography>
      </Paper>
    </Box>
  )
}