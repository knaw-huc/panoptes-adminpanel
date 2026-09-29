import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
      <h1 className={"h1"}>Home</h1>
      <hr />
  </div>
}
