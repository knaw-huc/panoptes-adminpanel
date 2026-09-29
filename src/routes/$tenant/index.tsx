import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$tenant/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/$tenant/"!</div>
}
