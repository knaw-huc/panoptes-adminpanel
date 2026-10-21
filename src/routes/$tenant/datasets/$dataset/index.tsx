import {createFileRoute, Link, useParams} from '@tanstack/react-router'
// import {DatasetFormValues} from "../../new_dataset.tsx";
import {useForm} from "@tanstack/react-form";
import {useEffect} from "react";
import {Button, Container, Group, Paper, Select, Stack, Switch, TextInput} from "@mantine/core";

export interface DatasetFormValues {
    name: string
    data_type: string
    es_index: string
    s3: boolean
    authentication_option: boolean
    data_configuration: {
        id_property: string
        base_url: string
        s3_endpoint: string
        s3_key_id: string
        s3_secret: string
    }
    authentication: {
        username: string
        password: string
    }
    metadata: Array<{ key: string; value: string }>
}

export const Route = createFileRoute('/$tenant/datasets/$dataset/')({
    component: RouteComponent,
})

function RouteComponent() {
    const params = useParams({from: '/$tenant/datasets/$dataset'})
    const dataset = params.dataset

    console.log('logging ... dataset:', dataset)

    const form = useForm<DatasetFormValues>({
        defaultValues: {
            name: '',
            data_type: '',
            es_index: '',
            s3: false,
            authentication_option: false,
            data_configuration: {
                id_property: '',
                base_url: '',
                s3_endpoint: '',
                s3_key_id: '',
                s3_secret: '',
            },
            authentication: {
                username: '',
                password: '',
            },
            metadata: [{key: '', value: ''}],
        },
        onSubmit: async ({value}) => {

            console.log('sending payload to backend..', JSON.stringify(value, null, 2))

            try {
                console.log('logging the value...', value)

                const response = await fetch(`http://bypass.local:8000/api/datasets/${encodeURIComponent(dataset)}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(value)
                })

                if (!response.ok) {
                    throw new Error('failed to save dataset')
                }

                const result = await response.json()
                console.log('success', result)
            } catch (error) {
                console.log('error', error)
            }

        }
    })

    useEffect(() => {

        if (!dataset) return console.log('no dataset')

        async function getDataset() {

            try {
                const response = await fetch(`http://bypass.local:8000/api/datasets/${encodeURIComponent(dataset)}`)
                if (!response.ok) throw new Error('dataset not found')

                const data: DatasetFormValues = await response.json()

                form.setFieldValue('name', data.name)
                form.setFieldValue('data_type', data.data_type)
                form.setFieldValue('data_configuration', data.data_configuration)
                // form.setFieldValue('metadata', data.metadata)

            } catch (error) {
                console.error('Error loading dataset:', error)
            }
        }

        getDataset()
    }, [dataset, form])


    return (

        <Container size={600} my="lg">
            <Paper bd="1px solid var(--mantine-color-gray-5)" p="md" radius="xl">
                <form
                    onSubmit={(e) => {
                        // e.preventDefault()
                        e.stopPropagation()
                        form.handleSubmit()
                    }}
                >

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
                                        data={['elasticsearch', 'cmdi']}
                                        value={field.state.value}
                                        onChange={(value) => field.handleChange(value ?? '')}
                                    />

                                    {/*show data configuration only when 'cmdi' is selected*/}

                                    {field.state.value === 'cmdi' && (
                                        <Stack gap="sm" mt="sm">
                                            <Paper bd="1px solid var(--mantine-color-gray-2)" p="md" radius="md">
                                                <h5>data configuration (only for cmdi)</h5>
                                                <form.Field
                                                    name="data_configuration.id_property"
                                                    children={(sub) => (
                                                        <TextInput
                                                            label="id property"
                                                            value={sub.state.value}
                                                            onChange={(e) => sub.handleChange(e.target.value)}
                                                        />
                                                    )}
                                                />

                                                <form.Field
                                                    name="data_configuration.base_url"
                                                    children={(sub) => (
                                                        <TextInput
                                                            label="base url"
                                                            value={sub.state.value}
                                                            onChange={(e) => sub.handleChange(e.target.value)}
                                                        />
                                                    )}
                                                />

                                                <form.Field
                                                    name="s3"
                                                    children={(field) => (
                                                        <Stack gap="sm" mt="md">
                                                            <Switch
                                                                label="s3"
                                                                checked={field.state.value}
                                                                onChange={(e) => field.handleChange(e.currentTarget.checked)}
                                                            />

                                                            {field.state.value && (
                                                                <Stack gap="sm" mt="md">
                                                                    <form.Field
                                                                        name="data_configuration.s3_key_id"
                                                                        children={(sub) => (
                                                                            <TextInput
                                                                                label="s3 key id"
                                                                                value={sub.state.value}
                                                                                onChange={(e) => sub.handleChange(e.target.value)}

                                                                            />
                                                                        )}
                                                                    />

                                                                    <form.Field
                                                                        name="data_configuration.s3_endpoint"
                                                                        children={(sub) => (
                                                                            <TextInput
                                                                                label="s3 endpoint"
                                                                                value={sub.state.value}
                                                                                onChange={(e) => sub.handleChange(e.target.value)}

                                                                            />
                                                                        )}
                                                                    />

                                                                    <form.Field
                                                                        name="data_configuration.s3_secret"
                                                                        children={(sub) => (
                                                                            <TextInput
                                                                                label="s3 secret"
                                                                                value={sub.state.value}
                                                                                onChange={(e) => sub.handleChange(e.target.value)}

                                                                            />
                                                                        )}
                                                                    />


                                                                </Stack>
                                                            )}
                                                        </Stack>

                                                    )}


                                                />
                                            </Paper>

                                            {/*authentication option also only when cmdi is selected, but seperate from data configuration*/}
                                            <Paper bd="1px solid var(--mantine-color-gray-2)" p="md" radius="md">
                                                <form.Field
                                                    name="authentication_option"
                                                    children={(field) => (
                                                        <Stack gap="xl">
                                                            <Switch
                                                                label="authentication option (cmdi only) "
                                                                checked={field.state.value}
                                                                onChange={(e) => field.handleChange(e.currentTarget.checked)}
                                                            />

                                                            {field.state.value && (
                                                                <Stack gap="sm">
                                                                    <form.Field
                                                                        name="authentication.username"
                                                                        children={(sub) => (
                                                                            <TextInput
                                                                                label="username"
                                                                                value={sub.state.value}
                                                                                onChange={(e) => sub.handleChange(e.target.value)}

                                                                            />
                                                                        )}
                                                                    />

                                                                    <form.Field
                                                                        name="authentication.password"
                                                                        children={(sub) => (
                                                                            <TextInput
                                                                                label="password"
                                                                                value={sub.state.value}
                                                                                onChange={(e) => sub.handleChange(e.target.value)}

                                                                            />
                                                                        )}
                                                                    />


                                                                </Stack>
                                                            )}
                                                        </Stack>
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
                                            onClick={() => field.pushValue({key: '', value: ''})}>
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
