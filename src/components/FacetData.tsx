import type {Facet} from "../types/facets.ts";
import {useContext} from "react";
import {FacetTypesContext} from "../context/FacetTypesContext.ts";
import {useAppForm} from "../hooks/appForm.ts";

interface FacetParams {
    facet: Facet
    index: number
    onChange: (facet: Facet, index: number) => void
}

export function FacetData({facet, index, onChange}: FacetParams) {
    const facetTypes = useContext(FacetTypesContext);

    const form = useAppForm({
        defaultValues: facet,
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
                onChange(info as Facet, index)
            })
        }
    })

    return (
        <>
            <form.AppField
                name={"name"}
                children={(field) => <field.TextField first={true} label={"Name"} />}
            />
            <form.AppField
                name={"property"}
                children={(field) => <field.TextField label={"Property"} />}
            />
            <form.AppField
                name={"start_open"}
                children={(field) => <field.SwitchField label={"Start open"} />}
            />
            <form.AppField
                name={"type"}
                children={(field) => <field.SelectField label={"Type"} data={facetTypes} />}
            />
            <form.Subscribe
                selector={(state) => state.values.type}
                children={(type) => {
                    if (type == "tree") {
                        return <>
                            <form.AppField
                                name={"tree_separator"}
                                children={(field) => <field.SelectField label={"Separator"} description={"A tree facet is a hierarchical facet indexed in ES using the \"path_hierarchy\" tokenizer. When using Procrustus for indexing, these are split by either '/' or '|'."} data={["/", "|"]} />}
                            />
                            <form.AppField
                                name={"tree_expand_level"}
                                children={(field) => <field.NumberField label={"Expand level"} min={0} description={"How many levels of the hierarchy to open on start."} />}
                            />
                        </>
                    }
                }}
            />
        </>
    )
}