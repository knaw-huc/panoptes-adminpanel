import {createFileRoute, useRouter} from '@tanstack/react-router'
import {fetchAuthenticated} from "../../../../auth.ts";
import {getTenantUrl} from "../../../../config.ts";
import {type SortableItem, SortableList} from "../../../../components/sortableList/SortableList.tsx";
import {useContext, useState} from "react";
import type {ResultProperty} from "../../../../types/resultProperties.ts";
import {ResultPropertyData} from "../../../../components/result-properties/ResultPropertyData.tsx";
import {JsonViewer} from "@mantine/code-highlight";
import {Button, Group} from "@mantine/core";
import {TenantContext} from "../../../../context/TenantContext.ts";
import {notifications} from "@mantine/notifications";

interface LoaderData {
    resultProperties: ResultProperty[]
    example: object[]
}

export const Route = createFileRoute(
    '/$tenant/datasets/$dataset/result-properties',
)({
    loader: async ({context, params}): Promise<LoaderData> => {
        const tenant = context.tenant
        console.log(context)
        const res = await fetchAuthenticated(`${getTenantUrl(tenant)}/api/datasets/${params.dataset}/result-properties`)

        const example_res = await fetchAuthenticated(`${getTenantUrl(tenant)}/api/datasets/${params.dataset}/search`, {
            method: 'POST',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                facets: {},
                offset: 0,
                limit: 1,
                query: ""
            }),
        })

        return {
            resultProperties: (await res.json())["result_properties"] as ResultProperty[],
            example: (await example_res.json())["items"] as ResultProperty[],
        }
    },
    component: RouteComponent,
})

function RouteComponent() {
    const {dataset} = Route.useParams()
    const {resultProperties, example} = Route.useLoaderData()
    const [properties, setProperties] = useState<ResultProperty[]>(resultProperties)
    const [saveLoading, setSaveLoading] = useState(false)
    const [hasChanges, setHasChanges] = useState<boolean>(false)

    const router = useRouter()
    const tenant = useContext(TenantContext)

    async function save() {
        setSaveLoading(true)

        const newProperties = properties
            .filter((f: ResultProperty) => f.deleted !== true)
            .map((f: ResultProperty, i: number) => {
                return {...f, order: i, dataset_name: dataset, new: undefined}
            })

        const response = await fetchAuthenticated(`${getTenantUrl(tenant)}/api/datasets/${dataset}/result-properties`, {
            method: 'PUT',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({facets: newProperties})
        })

        console.log(response)

        if (response.status === 200) {
            await router.invalidate({sync: true})
            setHasChanges(false)

            // Needed because invalidate doesn't rerender, it only changes the state values...
            // setCounter(counter + 1)
            setProperties(newProperties)
            notifications.show({
                title: "Saved",
                message: "Your changes to the result properties have been saved.",
                color: "green",
                position: "top-right"
            })
            setSaveLoading(false)
        } else {
            notifications.show({
                title: "Error",
                message: "Something went wrong",
                color: "red",
                position: "top-right"
            })
            setSaveLoading(false)
        }
    }

    function onChange(newProperties: SortableItem[]) {
        setProperties(newProperties as ResultProperty[])
        setHasChanges(true)
    }

    return <div>
        <Group justify={"space-between"}>
            <h3>Result Properties</h3>
            <Button loading={saveLoading} onClick={save} disabled={!hasChanges}>Save</Button>
        </Group>
        <SortableList addLabel={"Add property"} formComponent={ResultPropertyData} items={properties} onChange={onChange} />

        <h3>Example</h3>
        <JsonViewer value={example} defaultExpandDepth={3} />
    </div>
}
