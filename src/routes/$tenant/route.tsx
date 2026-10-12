import * as React from 'react'
import {Outlet, Link, createFileRoute} from '@tanstack/react-router'
import {getBaseUrl} from "../../config.ts";
import type {Tenant} from "../../types/tenants.ts";
import {TenantContext} from "../../context/TenantContext.ts";
import {fetchAuthenticated, getUsername} from "../../auth.ts";

export const Route = createFileRoute('/$tenant')({
    beforeLoad: async ({params: {tenant}}) => {
        const res = await fetchAuthenticated(`${getBaseUrl()}/api/admin/tenants`)
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
        const username = await getUsername()

        return {tenants: context.tenants, tenant: context.tenant, username: username}
    },
    component: RootComponent,
})

export function RootComponent() {

    const {tenants, tenant, username} = Route.useLoaderData()

    return (
        <React.Fragment>
            <div id={"page-container"} className={"d-flex flex-nowrap"}>
                <div className={"navigation-bar d-flex bg-body fg-body flex-column flex-shrink-0 p-3"} data-bs-theme={"dark"} style={{width: "280px"}}>
                    <span className={"fs-2xl"}>Panoptes Admin</span>
                    <hr />
                    {/*<div className={"dropdown"}>*/}
                        <a className={"btn-solid theme-primary"} data-bs-toggle={"menu"}>{tenant.name}</a>
                        <div className={"menu"}>
                            <span className={"menu-text"}>Pick tenant</span>
                            {tenants.map(t => <Link to={"/$tenant"} params={{tenant: t.name}} className={"menu-item"}>{t.name}</Link>
                            )}
                            <hr className={"menu-divider"} />
                            <Link to={"/create-tenant"} type={"button"} className={"menu-item theme-primary"}>Create tenant</Link>
                        </div>
                    {/*</div>*/}
                    <hr />
                    <nav className={"nav flex-column mb-auto"}>
                        <Link
                            className={"nav-link text-white justify-content-start"}
                            to={"/$tenant"}
                            params={{tenant: tenant.name}}
                            activeOptions={{exact: true}}
                        >General</Link>
                        <Link className={"nav-link text-white justify-content-start "} to={"/$tenant/datasets"} params={{tenant: tenant.name}}>Datasets</Link>
                        <Link className={"nav-link text-white justify-content-start"} to={"/$tenant/users"} params={{tenant: tenant.name}}>Users</Link>
                    </nav>
                    <hr />
                    {/*<div className={"dropdown"}>*/}
                        <a className={"btn-text"} data-bs-toggle={"menu"}>{username}</a>
                        <div className={"menu"}>
                            <button className={"menu-item"}>Logout</button>
                        </div>
                    {/*</div>*/}
                </div>
                <div id={"page-content"} className={"container p-4"}>
                    <TenantContext value={tenant}>
                        <Outlet />
                    </TenantContext>
                </div>
            </div>
        </React.Fragment>
    )
}
