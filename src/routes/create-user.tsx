import {createFileRoute, Link} from '@tanstack/react-router'
import {useForm} from "@tanstack/react-form";
import {Button, Card, Container, Paper, Stack, TextInput, Title} from "@mantine/core";
import {fetchAuthenticated} from "../auth.ts";

export interface UserValues {
    username: string
    password_hash: string

}

export const Route = createFileRoute('/create-user')({
    component: RouteComponent,
})

function RouteComponent() {
    const form = useForm<UserValues>({
            defaultValues: {
                username: '',
                password_hash: '',
            },
            onSubmit: async ({value}) => {
                console.log('sending to backend....', JSON.stringify(value, null, 2))

                const payload = {
                    username: value.username,
                    password_hash: value.password_hash
                }

                try {
                    const response = await fetchAuthenticated(`http://admin.local:8000/api/auth/users`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(payload),
                    })

                    if (!response.ok) {
                        throw new Error('......failed to save user......')
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
                            Create a new user:
                        </Title>

                        <form.Field
                            name="username"
                            children={(field) => (
                                <TextInput
                                    label="username"
                                    required
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    />
                                )}
                        />


                        <form.Field
                            name="password_hash"
                            children={(field) => (
                                <TextInput
                                    label="password"
                                    required
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
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
