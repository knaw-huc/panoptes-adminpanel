import {createFileRoute} from '@tanstack/react-router'
import {getBaseUrl, getTenantUrl} from "../../../../config.ts";
import {FacetTypesContext} from "../../../../context/FacetTypesContext.ts";
import type {Facet} from "../../../../types/facets.ts";
import {FacetData} from "../../../../components/FacetData.tsx";
import {fetchAuthenticated} from "../../../../auth.ts";
import {Accordion} from "@mantine/core";
import {DragDropProvider} from "@dnd-kit/react";
import {useRef, useState} from "react";
import {useSortable} from "@dnd-kit/react/sortable";
import {move} from "@dnd-kit/helpers";
import classes from './facets.module.css'

interface LoaderData {
    facets: Facet[]
    facetTypes: string[]
}

export const Route = createFileRoute('/$tenant/datasets/$dataset/facets')({
    loader: async ({context, params}): Promise<LoaderData> => {
        const tenant = context.tenant
        console.log(context)
        const res = await fetchAuthenticated(`${getTenantUrl(tenant)}/api/datasets/${params.dataset}/facets/configuration`)

        const facettypes_res = await fetchAuthenticated(`${getBaseUrl()}/api/admin/facettypes`)

        return {
            facets: (await res.json())["facets"] as Facet[],
            facetTypes: (await facettypes_res.json())["facetTypes"] as string[]
        }
    },
    component: RouteComponent,
})

function SortableFacet({facet, index}: {facet: Facet, index: number}) {
    const [element, setElement] = useState<Element | null>(null)
    const handleRef = useRef<HTMLButtonElement | null>(null)
    const {isDragging} = useSortable({id: facet.name, index, element, handle: handleRef})

    return (
        <Accordion.Item ref={setElement} data-shadow={isDragging || undefined} value={facet.property} key={index}>
            <Accordion.Control icon={<div className={classes.handle} ref={handleRef} />}>{facet.name}</Accordion.Control>
            <Accordion.Panel>
                <FacetData facet={facet} />
            </Accordion.Panel>
        </Accordion.Item>
    )
}

function RouteComponent() {
    const {facets, facetTypes} = Route.useLoaderData()

    const [facetList, setFacetsList] = useState<Facet[]>(facets)

    return <div>
        <h3>Facets</h3>
        <Accordion variant={"separated"}>
            <DragDropProvider onDragEnd={(event) => {
                setFacetsList((items) => move(items, event))
            }}>
                <FacetTypesContext value={facetTypes}>
                    {facets.map((facet, index) => (
                        <SortableFacet key={index} index={index} facet={facet} />
                    ))}
                </FacetTypesContext>
            </DragDropProvider>
        </Accordion>
    </div>
}
