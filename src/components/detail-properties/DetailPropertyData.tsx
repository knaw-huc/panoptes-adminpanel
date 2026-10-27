import type {DetailProperty} from "../../types/properties.ts";
import {useAppForm} from "../../hooks/appForm.ts";

interface DetailPropertyParams {
    item: DetailProperty
    index: number
    onChange: (item: DetailProperty, index: number) => void
}

export function DetailPropertyData({ item, index, onChange }: DetailPropertyParams) {
    const form = useAppForm({
        defaultValues: {...item, config: item.config != undefined ? JSON.stringify(item.config, null, 2) : ""},
        onSubmit: async ({value}) => {
            console.log(value)
        },
        listeners: {
            onChange: (({formApi}) => {
                const info = {}
                Object.entries(formApi.fieldInfo).map(([key, value]) => {
                    // @ts-expect-error instance is defined as possibly null but that's incorrect
                    info[key] = value.instance.getValue()
                })
                onChange(info as DetailProperty, index)
            })
        }
    })

    return (
        <>
            <form.AppField name={"name"} children={(field) => <field.TextField first={true} label={"Name"} />} />
            <form.AppField name={"path"} children={(field) => <field.TextField label={"Path"} />} />
            <form.AppField name={"type"} children={(field) => <field.TextField label={"Type"} />} />
            <form.AppField name={"config"} children={(field) => <field.JsonField label={"Config"} />} />
        </>
    )
}