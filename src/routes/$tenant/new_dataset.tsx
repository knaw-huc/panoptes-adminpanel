import {createFileRoute} from '@tanstack/react-router'
import {useForm} from '@tanstack/react-form'
import {SettingsForm} from "../../components/SettingsForm.tsx";
import type {DatasetFormValues} from "../../types/datasets.ts";
export const Route = createFileRoute('/$tenant/new_dataset')({
    component: RouteComponent,
})

function RouteComponent() {

    const form = useForm<DatasetFormValues, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined>({
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
        } satisfies DatasetFormValues,
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
