import * as React from 'react'
import {Outlet, Link, createFileRoute} from '@tanstack/react-router'
import {getBaseUrl, getTenantUrl} from "../../config.ts";
import type {Tenant} from "../../types/tenants.ts";
import {TenantContext} from "../../context/TenantContext.ts";
import {fetchAuthenticated, getUsername, logout} from "../../auth.ts";
import classes from "./route.module.css";
import {AppShell, Box, Button, Code, Container, Group, Menu, ScrollArea, Text} from "@mantine/core";
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
    component: RouteComponent,
})

function RouteComponent() {

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
        {label: "Users", link: "/$tenant/users", params: {tenant: tenant.name}, icon: IconUsers},
        {label: "Add new dataset", link: "/$tenant/new_dataset", params: {tenant: tenant.name}, icon: IconSettingsPlus},
    ]

    const links = navigationData.map((item) => <LinksGroup {...item} key={item.label} />)

    return (
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
                    <Container strategy={"grid"} size={1000}>
                        <Box>
                            <Outlet />
                        </Box>
                    </Container>
                </TenantContext>
            </AppShell.Main>
        </AppShell>
    )
}
