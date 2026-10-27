// import {createFileRoute, Link, useParams} from '@tanstack/react-router'
// import {useForm} from "@tanstack/react-form";
// import {JSX, useEffect} from "react";
import {Button, Container, Group, Paper, Select, Stack, Switch, TextInput} from "@mantine/core";
import type { ReactFormApi } from "@tanstack/react-form";

type SettingsFormProps = {
    form: ReactFormApi<any, any>;
};

export function SettingsForm(
    {form}: SettingsFormProps) {
    return (

        <Container size={600} my="lg">
            <Paper bd="1px solid var(--mantine-color-gray-5)" p="md" radius="xl">
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
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

                        <form.Field
                            name="tenant_name"
                            children={(field) => (
                                <TextInput
                                    label="tenant_name"
                                    // required
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                />
                            )}
                        />

                        <form.Field
                            name="detail_id"
                            children={(field) => (
                                <TextInput
                                    label="detail_id"
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

                                                <form.Field
                                                    name="authentication_option"
                                                    children={(field) => (
                                                        <Stack gap="sm" mt="md">
                                                            <Switch
                                                                label="auth"
                                                                checked={field.state.value}
                                                                onChange={(e) => field.handleChange(e.currentTarget.checked)}
                                                            />

                                                            {field.state.value && (
                                                                <Stack gap="sm" mt="md">
                                                                    <form.Field
                                                                        name="data_configuration.auth.username"
                                                                        children={(sub) => (
                                                                            <TextInput
                                                                                label="auth username"
                                                                                value={sub.state.value}
                                                                                onChange={(e) => sub.handleChange(e.target.value)}

                                                                            />
                                                                        )}
                                                                    />

                                                                    <form.Field
                                                                        name="data_configuration.auth.password"
                                                                        children={(sub) => (
                                                                            <TextInput
                                                                                label="auth password"
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
                        {/*<form.Field*/}
                        {/*    name="es_index"*/}
                        {/*    children={(field) => (*/}
                        {/*        <Select*/}
                        {/*            label="elasticsearch index"*/}
                        {/*            required*/}
                        {/*            placeholder="select an elasticsearch index"*/}
                        {/*            data={['xxx', 'yyy', 'zzz']}*/}
                        {/*            value={field.state.value}*/}
                        {/*            onChange={(value) => field.handleChange(value ?? '')}*/}
                        {/*        />*/}
                        {/*    )}*/}
                        {/*/>*/}

                        <form.Field
                            name="es_index"
                            children={(field) => (
                                <TextInput
                                    label="es_index"
                                    required
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                />
                            )}
                        />


                        {/*metadata array*/}
                        <form.Field
                            name="metadata"
                            // mode="array"
                            children={(field) => {

                                // const metadataValues = Array.isArray(field.state.value) ? field.state.value : [];
                                const entries = Object.entries(field.state.value);

                                return (
                                    <Stack gap="xs">
                                        <Group>
                                            <span>metadata</span>
                                            <Button
                                                variant="outline"
                                                // onClick={() => field.pushValue({key: '', value: ''})}>
                                                onClick={() => {
                                                    const current = field.state.value;
                                                    const newKey = `key_${Object.keys(current).length + 1}`;
                                                    field.handleChange({...current, [newKey]: ''})
                                                }}
                                            >
                                                add row
                                            </Button>
                                        </Group>


                                        {
                                            entries.map(([key, val], index) => (
                                                <Group key={index} grow>

                                                    <TextInput
                                                        value={key}
                                                        placeholder="key"
                                                        onChange={(e) => {
                                                            const newKey = e.target.value;
                                                            const current = {...field.state.value};
                                                            const valueHolder = current[key];
                                                            delete current[key]
                                                            current[newKey] = valueHolder;
                                                            field.handleChange(current);
                                                        }}
                                                    />

                                                    <TextInput
                                                        value={val}
                                                        placeholder="value"
                                                        onChange={(e) => {
                                                            const newValue = e.target.value;
                                                            field.handleChange({
                                                                ...field.state.value,
                                                                [key]: newValue
                                                            });
                                                        }}
                                                    />


                                                    {/*<form.Field*/}
                                                    {/*    name={`metadata[${index}].key`}*/}
                                                    {/*    children={(sub) => (*/}
                                                    {/*        <TextInput*/}
                                                    {/*            value={sub.state.value}*/}
                                                    {/*            placeholder="Key"*/}
                                                    {/*            onChange={(e) => sub.handleChange(e.target.value)}*/}
                                                    {/*        />*/}
                                                    {/*    )}*/}
                                                    {/*/>*/}

                                                    {/*<form.Field*/}
                                                    {/*    name={`metadata[${index}].value`}*/}
                                                    {/*    children={(sub) => (*/}
                                                    {/*        <TextInput*/}
                                                    {/*            value={sub.state.value}*/}
                                                    {/*            placeholder="Value"*/}
                                                    {/*            onChange={(e) => sub.handleChange(e.target.value)}*/}
                                                    {/*        />*/}
                                                    {/*    )}*/}
                                                    {/*/>*/}

                                                    <Button
                                                        color="red"
                                                        variant="outline"
                                                        // onClick={() => field.removeValue(index)}
                                                        onClick={() => {
                                                            const current = {...field.state.value};
                                                            delete current[key];
                                                            field.handleChange(current);
                                                        }}
                                                    >
                                                        Remove
                                                    </Button>
                                                </Group>
                                            ))
                                        }
                                    </Stack>
                                );
                            }}
                        />

                        <Button type="submit" mt="md">
                            Save
                        </Button>

                    </Stack>
                </form>
            </Paper>

            {/*<Button component={Link} to="/" variant="subtle" size="xs">*/}
            {/*    return home*/}
            {/*</Button>*/}

        </Container>


    )
}