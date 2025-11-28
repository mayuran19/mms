import { createFileRoute } from '@tanstack/react-router'
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
} from '@mui/material'
import { useNavigate } from '@tanstack/react-router'
import PeopleIcon from '@mui/icons-material/People'
import BusinessIcon from '@mui/icons-material/Business'
import SettingsIcon from '@mui/icons-material/Settings'

export const Route = createFileRoute('/platform/_authenticated/dashboard')({
  component: PlatformDashboard,
})

function PlatformDashboard() {
  const navigate = useNavigate()

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Platform Dashboard
      </Typography>
      <Typography color="text.secondary" paragraph>
        Welcome to the platform administration panel
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardActionArea onClick={() => navigate({ to: '/platform/tenants' })}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <BusinessIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                  <Typography variant="h5">Tenants</Typography>
                </Box>
                <Typography variant="h3" color="primary.main">
                  -
                </Typography>
                <Typography color="text.secondary">Manage Tenants</Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardActionArea onClick={() => navigate({ to: '/platform/users' })}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PeopleIcon sx={{ fontSize: 40, color: 'secondary.main', mr: 2 }} />
                  <Typography variant="h5">Users</Typography>
                </Box>
                <Typography variant="h3" color="secondary.main">
                  -
                </Typography>
                <Typography color="text.secondary">Manage Platform Users</Typography>
              </CardContent>
            </CardActionArea>
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
      </Grid>
    </Box>
  )
}