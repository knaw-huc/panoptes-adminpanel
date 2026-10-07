import * as React from 'react'
import {Outlet, createRootRouteWithContext} from '@tanstack/react-router'
import type {QueryClient} from "@tanstack/react-query";
import type {Tenant} from "../types/tenants.ts";

interface RouterContext {
    queryClient: QueryClient,
    tenant: Tenant
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
})

function RootComponent() {
  return (
    <React.Fragment>
      <Outlet />
    </React.Fragment>
  )
}
