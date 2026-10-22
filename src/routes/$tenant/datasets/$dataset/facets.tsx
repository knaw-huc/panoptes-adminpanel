import {createFileRoute, useBlocker, useRouter} from '@tanstack/react-router'
import {getBaseUrl, getTenantUrl} from "../../../../config.ts";
import type {Facet} from "../../../../types/facets.ts";
import {FacetData} from "../../../../components/facets/FacetData.tsx";
import {fetchAuthenticated} from "../../../../auth.ts";
import {Button, Group} from "@mantine/core";
import {useContext, useState} from "react";
import {TenantContext} from "../../../../context/TenantContext.ts";
import {notifications} from "@mantine/notifications";
import {FacetMetadataContext} from "../../../../context/FacetMetadataContext.ts";
import {SortableList} from "../../../../components/facets/sortableList/SortableList.tsx";

interface LoaderData {
    facets: Facet[]
    facetTypes: string[]
    fieldNames: string[]
}

export const Route = createFileRoute('/$tenant/datasets/$dataset/facets')({
    loader: async ({context, params}): Promise<LoaderData> => {
        const tenant = context.tenant
        const res = await fetchAuthenticated(`${getTenantUrl(tenant)}/api/datasets/${params.dataset}/facets/configuration`)

        const facettypes_res = await fetchAuthenticated(`${getBaseUrl()}/api/admin/facettypes`)
        const fieldnames_res = await fetchAuthenticated(`${getTenantUrl(tenant)}/api/datasets/${params.dataset}/available-properties`)

        return {
            facets: (await res.json())["facets"] as Facet[],
            facetTypes: (await facettypes_res.json())["facetTypes"] as string[],
            fieldNames: (await fieldnames_res.json())["available_properties"] as string[]
        }
    },
    component: RouteComponent,
})


function RouteComponent() {
    const {facets, facetTypes, fieldNames} = Route.useLoaderData()
    const {dataset} = Route.useParams()
    const router = useRouter()
    const tenant = useContext(TenantContext)

    const [facetList, setFacetsList] = useState<Facet[]>(facets)
    const [hasChanges, setHasChanges] = useState<boolean>(false)
    const [counter, setCounter] = useState(0)
    const [saveLoading, setSaveLoading] = useState(false)

    useBlocker({
        shouldBlockFn: () => {
            if (!hasChanges) return false

            const shouldLeave = confirm("You have unsaved changes. Are you sure you want to leave?")
            return !shouldLeave
        }
    })

    async function save() {
        const newFacets = facetList
            .filter((f: Facet) => f.deleted !== true)
            .map((f: Facet, i: number) => {
            return {...f, order: i, dataset_name: dataset, new: undefined}
        })

        setSaveLoading(true)

        const response = await fetchAuthenticated(`${getTenantUrl(tenant)}/api/datasets/${dataset}/facets/configuration`, {
            method: 'PUT',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({facets: newFacets})
        })

        if (response.status === 200) {
            await router.invalidate({sync: true})
            setHasChanges(false)

            // Hack needed because invalidate doesn't rerender, it only changes the state values...
            setCounter(counter + 1)
            setFacetsList(newFacets)
            notifications.show({
                title: "Saved",
                message: "Your changes to the facets have been saved.",
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

    return <div key={counter}>
        <Group justify={"space-between"}>
            <h3>Facets</h3>
            <Button loading={saveLoading} onClick={save} disabled={!hasChanges}>Save</Button>
        </Group>
        <FacetMetadataContext value={{types: facetTypes, fieldNames: fieldNames}}>
            <SortableList key={counter + "_" + facets.length} addLabel={"Add facet"} formComponent={FacetData} items={facetList} onChange={(items) => {
                setHasChanges(true)
                setFacetsList(items)
            }} />
        </FacetMetadataContext>
    </div>
}
