

import {createFileRoute, Link} from '@tanstack/react-router'
// import * as React from 'react'
import { useForm } from '@tanstack/react-form'
import {Button, Container, Group, Paper, Stack, TextInput} from "@mantine/core";



interface DatasetFormValues {
    name: string
    data_type: string
    data_configuration: {
        id_property: string
        base_url: string
    }
    metadata: Array<{ key: string; value: string }>
}

export const Route = createFileRoute('/new_dataset_tanstack_mantine')({
    component: RouteComponent,
})

function RouteComponent() {

    const form = useForm<DatasetFormValues>({
        defaultValues: {

            name:'',
            data_type:'',
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
            <Paper bd="1px solid var(--mantine-color-gray-4)" p="md" radius="xl">
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
                            <TextInput
                                label="data type"
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                            />
                        )}
                    />

                    {/*data configuration*/}

                    <form.Field
                        name="data_configuration.id_property"
                        children={(field) => (
                            <TextInput
                                label="ID property"
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
                            />
                        )}
                    />

                    <form.Field
                        name="data_configuration.base_url"
                        children={(field) => (
                            <TextInput
                                label="base URL"
                                value={field.state.value}
                                onChange={(e) => field.handleChange(e.target.value)}
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


