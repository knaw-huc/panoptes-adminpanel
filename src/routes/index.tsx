import {createFileRoute, Link} from '@tanstack/react-router'
import {getBaseUrl} from "../config.ts";
import type {TenantsResponse} from "../types/tenants.ts";
import {fetchAuthenticated} from "../auth.ts";
import {Button, Card, Group, Stack, Title, Text} from "@mantine/core";

export const Route = createFileRoute('/')({
    loader: async (): Promise<TenantsResponse> => {
        const res = await fetchAuthenticated(`${getBaseUrl()}/api/admin/tenants`)
        return res.json()
    },
    component: RouteComponent,
})

function RouteComponent() {

    const { tenants } = Route.useLoaderData()

    return (
        <Stack gap="md">
            <Title order={1}>Home</Title>
            <Title order={2} c="dimmed">
                Datasets
            </Title>

            <Stack gap="xs">
                {tenants.map((tenant) => (
                    <Card
                    key={tenant._id}
                    withBorder
                    padding="md"
                    radius="md"
                    component={Link}
                    to="/$tenant"
                    params={{ tenant: tenant.name}}
                    >
                        <Group justify="space-between" align="center">
                            <div>
                                <Text fw={600} size="xl">
                                    {tenant.name}
                                </Text>
                                <Text size="sm" c="dimmed">
                                    ID: {tenant._id}
                                </Text>
                            </div>

                            <Button size="md">View</Button>
                        </Group>

                    </Card>
                ))}
            </Stack>
        </Stack>

    )
}



