import * as React from 'react'
import {Outlet, Link, createFileRoute} from '@tanstack/react-router'
import {getBaseUrl} from "../../config.ts";
import type {Tenant} from "../../types/tenants.ts";
import {TenantContext} from "../../context/TenantContext.ts";

export const Route = createFileRoute('/$tenant')({
    beforeLoad: async ({params: {tenant}}) => {
        const res = await fetch(`${getBaseUrl()}/api/admin/tenants`)
        const tenants = (await res.json()).tenants as Tenant[]

        let tenantObj: Tenant | undefined
        for (const t of tenants) {
            if (t.name === tenant) {
                tenantObj = t
                break
            }
        }

        if (!tenantObj) {
            throw new Error('Tenant not found')
        }
        return {tenant: tenantObj, tenants}
    },
    loader: async ({ context }) => {
        console.log(context.tenant)

        return {tenants: context.tenants, tenant: context.tenant}
    },
    component: RootComponent,
})

export function RootComponent() {

    const {tenants, tenant} = Route.useLoaderData()

    return (
        <React.Fragment>
            <div id={"page-container"} className={"d-flex flex-nowrap"}>
                <div className={"d-flex flex-column flex-shrink-0 p-3 text-bg-dark"} style={{width: "280px"}}>
                    <span className={"fs-4"}>Panoptes Admin</span>
                    <hr />
                    <div className={"dropdown"}>
                        <a className={"text-white text-decoration-none dropdown-toggle"} data-bs-toggle={"dropdown"}>{tenant.name}</a>
                        <ul className={"dropdown-menu dropdown-menu-dark text-small shadow"}>
                            {tenants.map(t => <li key={t._id}>
                                <Link to={"/$tenant"} params={{tenant: t.name}} className={"dropdown-item"}>{t.name}</Link>
                            </li>
                            )}
                        </ul>
                    </div>
                    <hr />
                    <ul className={"nav nav-pills flex-column mb-auto"}>
                        <li className={"nav-item"}>
                            <Link
                                className={"nav-link text-white"}
                                to={"/$tenant"}
                                params={{tenant: tenant.name}}
                                activeOptions={{exact: true}}
                            >General</Link>
                        </li>
                        <li className={"nav-item"}>
                            <Link className={"nav-link text-white"} to={"/$tenant/datasets"} params={{tenant: tenant.name}}>Datasets</Link>
                        </li>
                        <li className={"nav-item"}>
                            <Link className={"nav-link text-white"} to={"/$tenant/users"} params={{tenant: tenant.name}}>Users</Link>
                        </li>
                    </ul>
                    <hr />
                    <div className={"dropdown"}>
                        <a className={"text-white text-decoration-none dropdown-toggle"} data-bs-toggle={"dropdown"}>Username</a>
                        <ul className={"dropdown-menu dropdown-menu-dark text-small shadow"}>
                            <li>
                                <button className={"dropdown-item"}>Logout</button>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className={"container p-4"}>
                    <TenantContext value={tenant}>
                        <Outlet />
                    </TenantContext>
                </div>
            </div>
        </React.Fragment>
    )
}
