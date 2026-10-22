import type {ResultProperty} from "../../types/resultProperties.ts";
import {useAppForm} from "../../hooks/appForm.ts";

interface ResultPropertyParams {
    item: ResultProperty
    index: number
    onChange: (item: ResultProperty, index: number) => void
}

const recommendedNames = [
    "id",
    "title",
    "description",
    "tags",
    "iiifManifest"
]

export function ResultPropertyData({item, index, onChange}: ResultPropertyParams) {
    const form = useAppForm({
        defaultValues: item,
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
                onChange(info as ResultProperty, index)
            })
        }
    })

    return (
        <>
            <form.AppField name={"name"} children={(field) => <field.AutocompleteField data={recommendedNames} first={true} label={"Name"} />} />
            <form.AppField name={"path"} children={(field) => <field.TextField label={"Path"} />} />
            <form.AppField name={"type"} children={(field) => <field.TextField label={"Type"} />} />
        </>
    )
}