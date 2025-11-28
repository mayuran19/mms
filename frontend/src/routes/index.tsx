import { createFileRoute } from '@tanstack/react-router'
import { Box, Container, Typography, Button, Paper, Grid } from '@mui/material'
import { useNavigate } from '@tanstack/react-router'
import LoginIcon from '@mui/icons-material/Login'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import BusinessIcon from '@mui/icons-material/Business'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Container maxWidth="lg">
        <Paper
          elevation={3}
          sx={{
            p: 6,
            textAlign: 'center',
            borderRadius: 4,
          }}
        >
          <Typography variant="h2" component="h1" gutterBottom fontWeight={700}>
            Member Management System
          </Typography>
          <Typography variant="h5" color="text.secondary" paragraph>
            Streamline your organization's member and tenant management
          </Typography>

          <Grid container spacing={3} sx={{ mt: 4 }}>
            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  p: 4,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  borderRadius: 2,
                  border: '2px solid',
                  borderColor: 'primary.main',
                }}
              >
                <AdminPanelSettingsIcon
                  sx={{ fontSize: 64, color: 'primary.main', mb: 2 }}
                />
                <Typography variant="h5" gutterBottom>
                  Platform Admin
                </Typography>
                <Typography color="text.secondary" paragraph>
                  Manage tenants, platform users, and system-wide settings
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<LoginIcon />}
                  onClick={() => navigate({ to: '/platform/login' })}
                  sx={{ mt: 'auto' }}
                >
                  Platform Login
                </Button>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  p: 4,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  borderRadius: 2,
                  border: '2px solid',
                  borderColor: 'secondary.main',
                }}
              >
                <BusinessIcon
                  sx={{ fontSize: 64, color: 'secondary.main', mb: 2 }}
                />
                <Typography variant="h5" gutterBottom>
                  Tenant Access
                </Typography>
                <Typography color="text.secondary" paragraph>
                  Access your tenant portal and manage members
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  startIcon={<LoginIcon />}
                  onClick={() => navigate({ to: '/tenant/login' })}
                  sx={{ mt: 'auto' }}
                >
                  Tenant Login
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  )
}