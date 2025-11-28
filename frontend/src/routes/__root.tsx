import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { Box } from '@mui/material'

export const Route = createRootRoute({
  component: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Outlet />
      <TanStackRouterDevtools />
    </Box>
  ),
})