import {createFileRoute, Link} from '@tanstack/react-router'
// import * as React from 'react'
import {useForm} from '@tanstack/react-form'
import {Button, Container, Group, Paper, Select, Stack, Switch, TextInput} from "@mantine/core";
import {SettingsForm} from "../../components/SettingsForm.tsx";


export interface DatasetFormValues {
    name: string
    tenant_name: string
    data_type: string
    detail_id: string
    es_index: string
    s3: boolean
    authentication_option: boolean
    data_configuration: {
        id_property: string
        base_url: string
        s3_endpoint: string
        s3_key_id: string
        s3_secret: string
        auth: {
            username: string
            password: string
        }
    }

    metadata: Record<string, string>
}
export const Route = createFileRoute('/$tenant/new_dataset')({
    component: RouteComponent,
})

function RouteComponent() {

    const form = useForm<DatasetFormValues>({
        defaultValues: {
            name: '',
            tenant_name: '',
            data_type: '',
            detail_id: '',
            es_index: '',
            s3: false,
            authentication_option: false,
            data_configuration: {
                id_property: '',
                base_url: '',
                s3_endpoint: '',
                s3_key_id: '',
                s3_secret: '',
                auth: {
                    username: '',
                    password: '',
                },
            },
            metadata: {}
        },
        onSubmit: async ({value}) => {

            console.log('sending payload to backend..', JSON.stringify(value, null, 2))

            const payload = {
                name: value.name,
                tenant_name: value.tenant_name,
                data_type: value.data_type,
                detail_id: value.detail_id,
                data_configuration: value.data_configuration,
                es_index: value.es_index,
                metadata: value.metadata,
            }

            try {
                console.log('logging the value', value)

                const response = await fetch('http://bypass.local:8000/api/datasets',{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    // body: JSON.stringify(value)
                    body: JSON.stringify(payload),
                })

                if (!response.ok) {
                    throw new Error('failed to save dataset')
                }

                const result = await response.json()
                console.log('Success', result)

            }

            catch (error) {
                console.log('error:', error)

            }
        }
    })

    return (

        <SettingsForm
        form={form}/>
    )
}


