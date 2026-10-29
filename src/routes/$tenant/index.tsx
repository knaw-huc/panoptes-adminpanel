import { createFileRoute } from '@tanstack/react-router'
import {useContext, useEffect, useState} from "react";
import {TenantContext} from "../../context/TenantContext.ts";
import {Alert, Card, Stack} from "@mantine/core";

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
