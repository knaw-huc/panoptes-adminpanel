import {createFileRoute, Link} from '@tanstack/react-router'
import {fetchAuthenticated} from "../auth.ts";
import {useQuery} from "@tanstack/react-query";
import {Button, Card, List, Loader, Stack, Text} from "@mantine/core";

export const Route = createFileRoute('/existing-users')({
  component: RouteComponent,
})

function RouteComponent() {
  const {data: users, isLoading, error} = useQuery({
      queryKey: ['users'],
      queryFn: async () => {
          const response = await fetchAuthenticated(`http://admin.local:8000/api/auth/users`)
          if (!response.ok) throw new Error('failed to fetch users.')
          return response.json()
      }
  })

    if (isLoading) return <Loader size="xl" />
    if (error) return <Text c="red"> error loading users </Text>

    return (
        <div>
            <Text fw={700} size="xl">Existing users</Text>
            <List>
                {users?.map((username) => (
                    <List.Item key={username}>{username}</List.Item>
                ))}
            </List>

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

        </div>
    )
}
