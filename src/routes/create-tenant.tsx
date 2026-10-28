import {createFileRoute, Link} from '@tanstack/react-router'
import {useForm} from "@tanstack/react-form";
import {Button, Card, Container, Paper, Stack, TextInput, Title} from "@mantine/core";
import {fetchAuthenticated} from "../auth.ts";

export interface TenantValues {
    name: string
    domain: string

}

export const Route = createFileRoute('/create-tenant')({
    component: RouteComponent,
})

function RouteComponent() {
    const form = useForm<TenantValues>({
            tenantValues: {
                name: '',
                domain: '',
            },
            onSubmit: async ({value}) => {
                console.log('sending to backend....', JSON.stringify(value, null, 2))

                const payload = {
                    name: value.name,
                    domain: value.domain
                }

                try {
                    console.log('logging the payload....', payload)

                    const response = await fetchAuthenticated(`http://admin.local:8000/api/admin/tenants`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(payload),
                    })

                    if (!response.ok) {
                        throw new Error('......failed to save tenant......')
                    }

                    const result = await response.json()
                    console.log('succes', result)
                } catch (error) {
                    console.log('error:....', error)
                }
            }
        }
    )
    return (
        <Container size={600} my="lg">
            <Paper bd="1px solid var(--mantine-color-gray-5)" p="md" radius="xl">
                <form onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation()
                    form.handleSubmit()
                }}
                >
                    <Stack gap="sm">
                        <Title order={1} size="xl">
                            Create a new tenant:
                        </Title>
                        {/*tenant name*/}
                        {/*<form.Field*/}
                        {/*    name="name"*/}
                        {/*    children={(field) => (*/}
                        {/*        <TextInput*/}
                        {/*            label="tenant name"*/}
                        {/*            required*/}
                        {/*            value={field.state.value}*/}
                        {/*            onChange={(e) => field.handleChange(e.target.value)}*/}
                        {/*        />*/}
                        {/*    )}*/}
                        {/*/>*/}

                        <form.Field
                            name="name"
                            validators={{
                                onChange: ({value}) =>
                                    !/^[a-z_-]*$/.test(value)
                                        ? 'only lowercase, underscores and hyphens allowed'
                                        : undefined
                            }}
                            children={(field) => (
                                <TextInput
                                    label="tenant name (only lowercase, underscores and hyphens allowed)"
                                    required
                                    value={field.state.value ?? ''}
                                    error={field.state.meta.errors.join(',')}
                                    onChange={(e) => {
                                        const newValue = e.target.value;

                                        if (/^[a-z_-]*$/.test(newValue)) {
                                        field.handleChange(newValue)}}}
                                />
                            )}
                        />

                        {/*<form.Field*/}
                        {/*    name="domain"*/}
                        {/*    children={(field) => (*/}
                        {/*        <TextInput*/}
                        {/*            label="tenant domain"*/}
                        {/*            required*/}
                        {/*            value={field.state.value}*/}
                        {/*            onChange={(e) => field.handleChange(e.target.value)}*/}
                        {/*        />*/}
                        {/*    )}/>*/}

                        <form.Field
                            name="domain"
                            validators={{
                                onChange: ({value}) =>
                                    !/^[a-z_-]*$/.test(value)
                                        // ? 'only lowercase and dots allowed'
                                        // : undefined
                            }}
                            children={(field) => (
                                <TextInput
                                    label="tenant domain (only lowercase and dots allowed)"
                                    required
                                    value={field.state.value ?? ''}
                                    error={field.state.meta.errors.join(',')}
                                    onChange={(e) => {
                                        const newValue = e.target.value;

                                        if (/^[a-z.]*$/.test(newValue)) {
                                            field.handleChange(newValue)}}}
                                />
                            )}
                        />


                                <Button type="submit" mt="md">
                                    Save

                                </Button>




                    </Stack>


                </form>

            </Paper>

            <Stack gap="sm">
                <Card
                    // withBorder
                    // padding="sm"
                    // radius="xs"
                    component={Link}
                    to="/"
                >

                    <Button size="xs" mt="md">
                        return home

                    </Button>


                </Card>


            </Stack>

        </Container>

    )
}
