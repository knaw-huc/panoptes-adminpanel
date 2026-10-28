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

    // errorComponent: () => (
    //     <div style={{ padding: 40, textAlign: "center" }}>
    //         <h2>Network connection error. Check whether the domain is configured. </h2>
    //     </div>
    // )
})

function RootComponent() {
  return (
    <React.Fragment>
      <Outlet />
    </React.Fragment>
  )
}
