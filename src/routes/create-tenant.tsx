import {createFileRoute, Link} from '@tanstack/react-router'
import {useForm} from "@tanstack/react-form";
import {Alert, Button, Card, Container, Paper, Stack, TextInput, Title} from "@mantine/core";
import {useMutation} from "@tanstack/react-query";
import {fetchAuthenticated} from "../auth.ts";
import {getBaseUrl} from "../config.ts";
import {applyGenericError, applyServerErrors, errorToMessage, HttpError} from "../error/errorHandling.ts";

// Regular expressions for
const DOMAIN_RE = /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+(?:[a-z]{2,63}|xn--[a-z0-9-]{1,59})$/i;
const NAME_RE = /^[a-z_-]*$/;

export interface TenantValues {
    name: string
    domain: string
}

async function createTenant(payload: TenantValues) {
    const response = await fetchAuthenticated(`${getBaseUrl()}/api/admin/tenants`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new HttpError(response.status, await response.text());
    }

    return response.json();
}

// eslint-disable-next-line react-refresh/only-export-components
const CreateTenantComponent = () => {
    const mutation = useMutation({ mutationFn: createTenant });
    const form = useForm({
            defaultValues: {
                name: 'tenant-test',
                domain: '',
            } satisfies TenantValues,

            onSubmit: async ({value, formApi}) => {
                // Clear the error map, and especially the onServer bound errors
                formApi.setErrorMap({ onServer: undefined });

                // Do the mutation attempt
                try {
                   await mutation.mutateAsync(value);
                } catch (error) {
                    console.error(error);
                    // Handle error cases
                    if (error instanceof HttpError) {
                        applyServerErrors(formApi, 'onServer', error);
                    } else {
                        applyGenericError(formApi, 'onServer');
                    }
                }
            }
        }
    )

    return (
        <Container size={600} my="lg">
            <Paper bd="1px solid var(--mantine-color-gray-5)" p="md" radius="xl">
                <form onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                }}>
                    <Stack gap="sm">
                        <Title order={1} size="xl">
                            Create a new tenant:
                        </Title>

                        {/*
                          In general, Tanstack Forms handles errors pretty strangely.
                          The authors of Tanstack even admit to this:
                          -  https://github.com/TanStack/form/discussions/2107

                          They want to backport a V2 solution to V1, but the status is unclear yet.
                          - https://github.com/TanStack/form/issues/2188

                          So...one way forward would be to lift out more related to error handling. This might make
                          future refactorings in other components easier too.
                        */}
                        <form.Subscribe selector={(s) => s.errors}>
                            {(errors) => errors.length > 0 &&
                                <Alert color='red' title='Could not create tenant'>
                                {errors.map(errorToMessage).join(',')}
                            </Alert>}
                        </form.Subscribe>

                        {/* Perhaps we might use errors.length here too? I'm not sure currently */}
                        {mutation.isSuccess && <Alert color='green' title='Tenant created successfully'/>}

                        <form.Field
                            name="name"
                            validators={{
                                onChange: ({value}) =>
                                    !NAME_RE.test(value) ? 'Only lowercase, underscores and hyphens allowed' : undefined
                            }}
                            children={(field) => (
                                <TextInput
                                    label="Tenant name (only lowercase, underscores and hyphens allowed)"
                                    required
                                    value={field.state.value ?? ''}
                                    error={field.state.meta.errors.join(',')}
                                    onChange={(e) => {
                                        field.handleChange(e.target.value);
                                    }}
                                />
                            )}
                        />
                        <form.Field
                            name="domain"
                            validators={{
                                onChange: ({value}) =>
                                    !DOMAIN_RE.test(value) ? 'Invalid domain name' : undefined
                            }}
                            children={(field) => (
                                <TextInput
                                    label="Tenant domain name"
                                    required
                                    value={field.state.value ?? ''}
                                    error={field.state.meta.errors.join(',')}
                                    onChange={(e) => {
                                        field.handleChange(e.target.value);
                                    }}
                                />
                            )}
                        />

                        {/* We disable or enable the button based on whether the form state thinks we can submit */}
                        <form.Subscribe selector={(s) => s.canSubmit}>
                            {(canSubmit) =>
                                (<Button type="submit" mt="md" disabled={!canSubmit}>Save</Button>)}
                        </form.Subscribe>
                    </Stack>
                </form>
            </Paper>

            <Stack gap="sm">
                <Card component={Link} to="/">
                    <Button size="xs" mt="md">
                        Home
                    </Button>
                </Card>
            </Stack>
        </Container>

    )
}

export const Route = createFileRoute('/create-tenant')({
    component: CreateTenantComponent
});