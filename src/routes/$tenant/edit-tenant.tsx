import {createFileRoute, Link, useParams} from '@tanstack/react-router'
import {useForm} from "@tanstack/react-form";
import {fetchAuthenticated} from "../../auth.ts";
import {useEffect} from "react";
import {Button, Card, Container, Paper, Stack, TextInput, Title} from "@mantine/core";

export const Route = createFileRoute('/$tenant/edit-tenant')({
  component: RouteComponent,


})

export interface TenantValues {
    name: string
    domain: string
}

function RouteComponent() {

    const params = useParams({from: '/$tenant/edit-tenant'})
    const tenant = params.tenant

    console.log('logging tenant........', tenant)

    const form = useForm<TenantValues>({
        defaultValues: {
            name: '',
            domain: '',
        },
        onSubmit: async ({value}) => {
            console.log('sending payload to backend..', JSON.stringify(value, null, 2))

            const payload = {
                name: value.name,
                domain: value.domain
            }

            try {
                console.log('loggimg the valiue...', value)

                const response = await fetchAuthenticated(`http://admin.local:8000/api/admin/tenants?name=${tenant}`, {
                    method:'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload)
                })
                if(!response.ok) {
                    throw new Error('failed to save tenant')
                }

                const result = await response.json()
                console.log('result', result)
            } catch (error) {
                console.log('error', error)
            }
        }

    })

    useEffect(() => {
        if (!tenant) return console.log('no tenant')

        async function getTenant() {

            try {
                const response = await fetchAuthenticated(`http://admin.local:8000/api/admin/tenants`)
                if (!response.ok) throw new Error('tenants not found')

                // const data: TenantValues = await response.json()

                const json = await response.json()
                console.log('API response', json)

                const tenantsList = json.tenants

                const currentTenant = tenantsList.find((t) => t.name === tenant)

                if (!currentTenant) throw new Error('tenant not found')

                form.setFieldValue('name', currentTenant.name)
                form.setFieldValue('domain', currentTenant.domain)
            }
            catch(error) {
                console.error('error loading tenant', error)
            }
        }
        getTenant()

    }, [tenant, form])

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
                          edit tenant:
                      </Title>

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


                      <form.Field
                          name="domain"
                          validators={{
                              onChange: ({value}) =>
                                  !/^[a-z.]*$/.test(value)
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
