import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/$tenant/datasets/$dataset/result-properties',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/$tenant/datasets/$dataset/result-properties"!</div>
}
