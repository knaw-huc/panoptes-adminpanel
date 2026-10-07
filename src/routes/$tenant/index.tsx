import { createFileRoute } from '@tanstack/react-router'
import {useContext} from "react";
import {TenantContext} from "../../context/TenantContext.ts";

export const Route = createFileRoute('/$tenant/')({
    component: RouteComponent,
})

function RouteComponent() {
    const tenant = useContext(TenantContext)

    return <div>
        <h1>Tenant: {tenant.name}</h1>
        <p>Domain: {tenant.domain}</p>
    </div>
}
