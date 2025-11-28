import { createFileRoute } from '@tanstack/react-router'
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
} from '@mui/material'
import PeopleIcon from '@mui/icons-material/People'
import BusinessIcon from '@mui/icons-material/Business'
import SettingsIcon from '@mui/icons-material/Settings'

export const Route = createFileRoute('/platform/dashboard')({
  component: PlatformDashboard,
})

function PlatformDashboard() {
  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" gutterBottom>
          Platform Dashboard
        </Typography>
        <Typography color="text.secondary" paragraph>
          Welcome to the platform administration panel
        </Typography>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <BusinessIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                  <Typography variant="h5">Tenants</Typography>
                </Box>
                <Typography variant="h3" color="primary.main">
                  0
                </Typography>
                <Typography color="text.secondary">Total Tenants</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PeopleIcon sx={{ fontSize: 40, color: 'secondary.main', mr: 2 }} />
                  <Typography variant="h5">Users</Typography>
                </Box>
                <Typography variant="h3" color="secondary.main">
                  1
                </Typography>
                <Typography color="text.secondary">Platform Users</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SettingsIcon sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
                  <Typography variant="h5">System</Typography>
                </Box>
                <Typography variant="h3" color="info.main">
                  Active
                </Typography>
                <Typography color="text.secondary">System Status</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Typography color="text.secondary">
                Platform management features will be available here
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}