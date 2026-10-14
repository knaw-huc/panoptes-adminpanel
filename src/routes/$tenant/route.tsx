import * as React from 'react'
import {Outlet, Link, createFileRoute} from '@tanstack/react-router'
import {getBaseUrl, getTenantUrl} from "../../config.ts";
import type {Tenant} from "../../types/tenants.ts";
import {TenantContext} from "../../context/TenantContext.ts";
import {fetchAuthenticated, getUsername, logout} from "../../auth.ts";
import classes from "./route.module.css";
import {AppShell, Button, Code, Group, Menu, ScrollArea, Text} from "@mantine/core";
import type {Dataset} from "../../types/datasets.ts";
import {IconChartDots3, IconSettings, IconSettingsPlus, IconUsers} from "@tabler/icons-react";
import {LinksGroup} from "../../components/NavbarLinksGroup.tsx";

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

        const datasetsResponse = await fetchAuthenticated(`${getTenantUrl(tenantObj)}/api/datasets`)
        const datasets = await datasetsResponse.json() as Dataset[]

        return {tenant: tenantObj, tenants, datasets}
    },
    loader: async ({ context }) => {
        console.log(context.tenant)
        const username = await getUsername()

        return {
            tenants: context.tenants,
            tenant: context.tenant,
            datasets: context.datasets,
            username: username
        }
    },
    component: RootComponent,
})

export function RootComponent() {

    const {tenants, tenant, username, datasets} = Route.useLoaderData()

    const navigationData = [
        {label: "General", link: "/$tenant", params: {tenant: tenant.name}, icon: IconSettings},
        {
            label: "Datasets",
            icon: IconChartDots3,
            initiallyOpened: true,
            link: "/$tenant/datasets",
            params: {tenant: tenant.name},
            links: datasets.map(dataset => ({
                label: dataset.name,
                link: "/$tenant/datasets/$dataset",
                params: {tenant: tenant.name, dataset: dataset.name}
            }))
        },
        {label: "Users", link: "/$tenant/users", params: {tenant: tenant.name}, icon: IconUsers}
    ]

    const links = navigationData.map((item) => <LinksGroup {...item} key={item.label} />)

    return (
        // <React.Fragment>
        //     <div id={"page-container"} className={"d-flex flex-nowrap"}>
        //         <div className={"navigation-bar d-flex bg-body fg-body flex-column flex-shrink-0 p-3"} data-bs-theme={"dark"} style={{width: "280px"}}>
        //             <span className={"fs-2xl"}>Panoptes Admin</span>
        //             <hr />
        //             {/*<div className={"dropdown"}>*/}
        //                 <a className={"btn-solid theme-primary"} data-bs-toggle={"menu"}>{tenant.name}</a>
        //                 <div className={"menu"}>
        //                     <span className={"menu-text"}>Pick tenant</span>
        //                     {tenants.map(t => <Link to={"/$tenant"} params={{tenant: t.name}} className={"menu-item"}>{t.name}</Link>
        //                     )}
        //                     <hr className={"menu-divider"} />
        //                     <Link to={"/create-tenant"} type={"button"} className={"menu-item theme-primary"}>Create tenant</Link>
        //                 </div>
        //             {/*</div>*/}
        //             <hr />
        //             <nav className={"nav flex-column mb-auto"}>
        //                 <Link
        //                     className={"nav-link text-white justify-content-start"}
        //                     to={"/$tenant"}
        //                     params={{tenant: tenant.name}}
        //                     activeOptions={{exact: true}}
        //                 >General</Link>
        //                 <Link className={"nav-link text-white justify-content-start "} to={"/$tenant/datasets"} params={{tenant: tenant.name}}>Datasets</Link>
        //                 <Link className={"nav-link text-white justify-content-start"} to={"/$tenant/users"} params={{tenant: tenant.name}}>Users</Link>
        //             </nav>
        //             <hr />
        //             {/*<div className={"dropdown"}>*/}
        //                 <a className={"btn-text"} data-bs-toggle={"menu"}>{username}</a>
        //                 <div className={"menu"}>
        //                     <button type={"button"} onClick={logout} className={"menu-item"}>Logout</button>
        //                 </div>
        //             {/*</div>*/}
        //         </div>
        //         <div id={"page-content"} className={"container p-4"}>
        //             <TenantContext value={tenant}>
        //                 <Outlet />
        //             </TenantContext>
        //         </div>
        //     </div>
        // </React.Fragment>
        <AppShell padding={"md"} navbar={{width: 300, breakpoint: 'sm'}}>
            <AppShell.Navbar>
            <nav className={classes.navbar}>
                <div className={classes.header}>
                    <Group justify={"space-between"}>
                        <Text>Panoptes Admin</Text>
                        <Code fw={700}>v0.0.1</Code>
                    </Group>
                </div>

                <Menu shadow={"md"} width={200}>
                    <Menu.Target>
                        <Button mt={"lg"}>Tenant: {tenant.name}</Button>
                    </Menu.Target>
                    <Menu.Dropdown>
                        <Menu.Label>Select tenant</Menu.Label>
                        {tenants.map(t => <Link key={t.name} to={"/$tenant"} params={{tenant: t.name}} className={classes.linkUnstyled}><Menu.Item>{t.name}</Menu.Item></Link>)}
                        <Menu.Divider />
                        <Link to={"/create-tenant"} type={"button"} className={classes.linkUnstyled}><Menu.Item leftSection={<IconSettingsPlus />} color={"blue"}>Create tenant</Menu.Item></Link>
                    </Menu.Dropdown>
                </Menu>


                <ScrollArea className={classes.links}>
                    <div className={classes.linksInner}>{links}</div>
                </ScrollArea>

            </nav>
            </AppShell.Navbar>
            <AppShell.Main>
                <TenantContext value={tenant}>
                    <Outlet />
                </TenantContext>
            </AppShell.Main>
        </AppShell>
    )
}
