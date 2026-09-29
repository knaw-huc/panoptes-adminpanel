import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$tenant/datasets')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/$tenant/datasets"!</div>
}
