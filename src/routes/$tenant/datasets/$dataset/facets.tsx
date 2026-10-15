import {createFileRoute} from '@tanstack/react-router'
import {getBaseUrl, getTenantUrl} from "../../../../config.ts";
import {FacetTypesContext} from "../../../../context/FacetTypesContext.ts";
import type {Facet} from "../../../../types/facets.ts";
import {FacetData} from "../../../../components/FacetData.tsx";
import {fetchAuthenticated} from "../../../../auth.ts";
import {Accordion, Badge, Button, Group} from "@mantine/core";
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

interface SortableFacetProperties {
    facet: Facet
    index: number
    onFacetChange: (facet: Facet, index: number) => void
}

function SortableFacet({facet, index, onFacetChange}: SortableFacetProperties) {
    const [element, setElement] = useState<Element | null>(null)
    const handleRef = useRef<HTMLButtonElement | null>(null)
    const {isDragging} = useSortable({id: facet.name, index, element, handle: handleRef})
    const [hasChanges, setHasChanges] = useState<boolean>(false)

    function onChange(facet: Facet, index: number) {
        setHasChanges(true)
        onFacetChange(facet, index)
    }

    return (
        <Accordion.Item ref={setElement} data-shadow={isDragging || undefined} value={facet.property} key={index}>
            <Accordion.Control icon={<div className={classes.handle} ref={handleRef} />}><Group>{facet.name}{hasChanges ? <Badge color={"yellow"}>Has changes</Badge> : null}</Group></Accordion.Control>
            <Accordion.Panel>
                <FacetData onChange={onChange} index={index} facet={facet} />
            </Accordion.Panel>
        </Accordion.Item>
    )
}

function RouteComponent() {
    const {facets, facetTypes} = Route.useLoaderData()

    const [facetList, setFacetsList] = useState<Facet[]>(facets)
    const [hasChanges, setHasChanges] = useState<boolean>(false)

    function onFacetChange(facet: Facet, index: number) {
        console.log("Facet changed: ", index, facet)
        if (!hasChanges) {
            setHasChanges(true)
        }
        const newFacets = facetList.map((f: Facet, i: number) => {
            if (i === index) {
                return {
                    ...f,
                    ...facet
                }
            }
            return f
        })
        setFacetsList(newFacets)
    }

    return <div>
        <Group justify={"space-between"}>
            <h3>Facets</h3>
            <Button disabled={!hasChanges}>Save</Button>
        </Group>
        <Accordion variant={"separated"}>
            <DragDropProvider onDragEnd={(event) => {
                setHasChanges(true)
                setFacetsList((items) => move(items, event))
            }}>
                <FacetTypesContext value={facetTypes}>
                    {facetList.map((facet, index) => (
                        <SortableFacet key={facet.name} onFacetChange={onFacetChange} index={index} facet={facet} />
                    ))}
                </FacetTypesContext>
            </DragDropProvider>
        </Accordion>
    </div>
}
