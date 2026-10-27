import {createFileRoute, useRouter} from '@tanstack/react-router'
import type {DetailProperty, ResultProperty} from "../../../../types/properties.ts";
import {fetchAuthenticated} from "../../../../auth.ts";
import {getTenantUrl} from "../../../../config.ts";
import {type SortableItem, SortableList} from "../../../../components/sortableList/SortableList.tsx";
import {DetailPropertyData} from "../../../../components/detail-properties/DetailPropertyData.tsx";
import {useContext, useState} from "react";
import {Button, Group} from "@mantine/core";
import {TenantContext} from "../../../../context/TenantContext.ts";
import {saveResponseNotification} from "../../../../notifications.ts";

interface LoaderData {
    detailProperties: DetailProperty[]
}

export const Route = createFileRoute(
    '/$tenant/datasets/$dataset/detail-properties',
)({
    loader: async ({context, params}): Promise<LoaderData> => {
        const tenant = context.tenant
        console.log(context)
        const res = await fetchAuthenticated(`${getTenantUrl(tenant)}/api/datasets/${params.dataset}/detail-properties`)

        return {
            detailProperties: (await res.json())["detail_properties"] as DetailProperty[],
        }
    },
    component: RouteComponent,
})

function RouteComponent() {
    const {detailProperties} = Route.useLoaderData()
    const [properties, setProperties] = useState<DetailProperty[]>(detailProperties)
    const [hasChanges, setHasChanges] = useState<boolean>(false)
    const [saveLoading, setSaveLoading] = useState(false)

    const {dataset} = Route.useParams()
    const tenant = useContext(TenantContext)
    const router = useRouter()

    function onChange(newProperties: SortableItem[]) {
        setProperties(newProperties as DetailProperty[])
        setHasChanges(true)
    }

    async  function save() {
        setSaveLoading(true)

        const newProperties = properties
            .filter((f: DetailProperty) => f.deleted !== true)
            .map((f: DetailProperty, i: number) => {
                return {...f, config: JSON.parse(f.config), order: i, dataset_name: dataset, new: undefined}
            })

        const response = await fetchAuthenticated(`${getTenantUrl(tenant)}/api/datasets/${dataset}/detail-properties`, {
            method: 'PUT',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({detailProperties: newProperties})
        })

        saveResponseNotification(response, "Your changes to the detail properties have been saved.")

        if (response.status === 200) {
            await router.invalidate({sync: true})
            setHasChanges(false)

            // Needed because invalidate doesn't rerender, it only changes the state values...
            // setCounter(counter + 1)
            setProperties(newProperties)
        }

        setSaveLoading(false)
    }

    return <div>
        <Group justify={"space-between"}>
            <h3>Detail Properties</h3>
            <Button loading={saveLoading} onClick={save} disabled={!hasChanges}>Save</Button>
        </Group>

        <SortableList addLabel={"Add property"} formComponent={DetailPropertyData} items={properties} onChange={onChange} />
    </div>
}
