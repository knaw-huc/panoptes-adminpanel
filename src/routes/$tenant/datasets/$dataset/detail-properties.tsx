import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/$tenant/datasets/$dataset/detail-properties',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/$tenant/datasets/$dataset/detail-properties"!</div>
}
