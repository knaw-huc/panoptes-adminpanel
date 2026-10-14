import {
    createFileRoute,
    Link,
    Outlet,
    useMatches
} from '@tanstack/react-router'
import {useContext} from "react";
import {TenantContext} from "../../../../context/TenantContext.ts";
import {Tabs} from "@mantine/core";

export const Route = createFileRoute('/$tenant/datasets/$dataset')({
    component: RouteComponent,
})

function RouteComponent() {
    const tenant = useContext(TenantContext)
    const {dataset} = Route.useParams()

    const tabs = [
        {
            name: "Settings",
            to: "/$tenant/datasets/$dataset/",
            params: {tenant: tenant.name, dataset: dataset}
        },
        {
            name: "Facets",
            to: "/$tenant/datasets/$dataset/facets",
            params: {tenant: tenant.name, dataset: dataset}
        },
        {
            name: "Result properties",
            to: "/$tenant/datasets/$dataset/result-properties",
            params: {tenant: tenant.name, dataset: dataset}
        },
        {
            name: "Detail properties",
            to: "/$tenant/datasets/$dataset/detail-properties",
            params: {tenant: tenant.name, dataset: dataset}
        },
    ]

    const matches = useMatches()
    const currentMatch = matches[matches.length - 1].routeId

    return <div>
        <h2>Dataset: {dataset}</h2>

        <Tabs value={currentMatch}>
            <Tabs.List>
                {tabs.map((tab) => (
                    <Tabs.Tab key={tab.name} value={tab.to} renderRoot={(props) => (
                        <Link to={tab.to} params={tab.params} {...props} />
                    )}>{tab.name}</Tabs.Tab>
                ))}
            </Tabs.List>
        </Tabs>
        <Outlet />
    </div>
}
