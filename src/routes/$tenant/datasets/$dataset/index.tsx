import {createFileRoute, Link, useParams} from '@tanstack/react-router'
// import {DatasetFormValues} from "../../new_dataset.tsx";
import {useForm} from "@tanstack/react-form";
import {useEffect} from "react";
import { SettingsForm} from "../../../../components/SettingsForm.tsx";

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

            // metadata: [{key: '', value: ''}],
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
                console.log('logging the value...', value)

                const response = await fetch(`http://bypass.local:8000/api/datasets/${encodeURIComponent(dataset)}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    // body: JSON.stringify(value)
                    body: JSON.stringify(payload)
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
                form.setFieldValue('tenant_name', data.tenant_name)
                form.setFieldValue('data_type', data.data_type)
                form.setFieldValue('detail_id', data.detail_id)
                form.setFieldValue('data_configuration', data.data_configuration)
                form.setFieldValue('es_index', data.es_index)


                form.setFieldValue('metadata', data.metadata)


            } catch (error) {
                console.error('Error loading dataset:', error)
            }
        }
        getDataset()
    }, [dataset, form])

    return (
        <SettingsForm
        form={form}/>
    )
}
