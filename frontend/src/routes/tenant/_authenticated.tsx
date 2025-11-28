import { createFileRoute } from '@tanstack/react-router'
import TenantLayout from '@/components/TenantLayout'

export const Route = createFileRoute('/tenant/_authenticated')({
  component: TenantLayout,
})