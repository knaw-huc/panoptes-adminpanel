import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$tenant/facets')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/$tenant/facets"!</div>
}
