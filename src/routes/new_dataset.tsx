import {createFileRoute, Link} from '@tanstack/react-router'
// import * as React from 'react'
import { useForm } from '@tanstack/react-form'
import {Button, Container, Group, Paper, Select, Stack, TextInput} from "@mantine/core";


interface DatasetFormValues {
    name: string
    data_type: string
    es_index: string
    data_configuration: {
        id_property: string
        base_url: string
    }
    metadata: Array<{ key: string; value: string }>
}

export const Route = createFileRoute('/new_dataset')({
    component: RouteComponent,
})

function RouteComponent() {

    const form = useForm<DatasetFormValues>({
        defaultValues: {

            name:'',
            data_type:'',
            es_index:'',
            data_configuration:{
                id_property:'',
                base_url:'',
            },
            metadata:[{key:'', value:''}],
        },
        onSubmit: async ({value}) => {
            console.log(value)
        }
    })


    return (
        <Container size={600} my="lg">
            <Paper bd="1px solid var(--mantine-color-gray-5)" p="md" radius="xl">
            <form>

                <Stack gap="sm">
                    {/*name*/}
                    <form.Field
                        name="name"
                        children={(field) => (
                            <TextInput
                                label="name"
                                required
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                            />
                        )}
                    />

                    {/*data type*/}
                    <form.Field
                        name="data_type"
                        children={(field) => (
                            <>
                            <Select
                                label="data type"
                                required
                                placeholder="select a data type"
                                data={['elasticsearch','cmdi']}
                                value={field.state.value}
                                onChange={(value) => field.handleChange(value ?? '')}
                            />

                            {/*show data configuration only when 'cmdi' is selected*/}
                            {field.state.value === 'cmdi' && (
                                <Stack gap="sm" mt="sm">
                                    <Paper bd="1px solid var(--mantine-color-gray-2)" p="md" radius="md">
                                    <form.Field
                                        name="data_configuration.id_property"
                                        children={(sub) => (
                                          <TextInput
                                              label="id property (cmdi)"
                                              required
                                              value={sub.state.value}
                                              onChange={(e) => sub.handleChange(e.target.value)}
                                          />
                                        )}
                                    />

                                    <form.Field
                                        name="data_configuration.base_url"
                                        children={(sub) => (
                                            <TextInput
                                                label="base url (cmdi)"
                                                required
                                                value={sub.state.value}
                                                onChange={(e) => sub.handleChange(e.target.value)}
                                            />
                                        )}
                                    />
                                    </Paper>
                                </Stack>
                            )}
                            </>
                        )}
                    />

                    {/*es_index*/}
                    <form.Field
                        name="es_index"
                        children={(field) => (
                            <Select
                                label="elasticsearch index"
                                required
                                placeholder="select an elasticsearch index"
                                data={['xxx', 'yyy', 'zzz']}
                                value={field.state.value}
                                onChange={(value) => field.handleChange(value ?? '')}
                            />
                        )}
                    />

                    {/*metadata array*/}
                    <form.Field
                        name="metadata"
                        mode="array"
                        children={(field) => (
                            <Stack gap="xs">
                                <Group>
                                    <span>metadata</span>
                                    <Button
                                    variant="outline"
                                    onClick={() => field.pushValue({key:'', value:''})}>
                                        add row
                                    </Button>
                                </Group>

                                {field.state.value.map((_, index) => (
                                    <Group key={index} grow>

                                        <form.Field
                                            name={`metadata[${index}].key`}
                                            children={(sub) => (
                                                <TextInput
                                                    value={sub.state.value}
                                                    placeholder="Key"
                                                    onChange={(e) => sub.handleChange(e.target.value)}
                                                />
                                            )}
                                        />

                                        <form.Field
                                            name={`metadata[${index}].value`}
                                            children={(sub) => (
                                                <TextInput
                                                    value={sub.state.value}
                                                    placeholder="Value"
                                                    onChange={(e) => sub.handleChange(e.target.value)}
                                                />
                                            )}
                                        />

                                        <Button
                                            color="red"
                                            variant="outline"
                                            onClick={() => field.removeValue(index)}
                                        >
                                            Remove
                                        </Button>
                                    </Group>
                                ))}
                            </Stack>
                        )}
                    />

                    <Button type="submit" mt="md">
                        Save
                    </Button>

                </Stack>
            </form>
            </Paper>

            <Button component={Link} to="/" variant="subtle" size="xs">
                return home
            </Button>

        </Container>
    )
}


