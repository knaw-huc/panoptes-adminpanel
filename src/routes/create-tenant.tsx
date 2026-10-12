import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/create-tenant')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/create-tenant"!</div>
}
