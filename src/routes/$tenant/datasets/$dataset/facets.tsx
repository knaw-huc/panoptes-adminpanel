import {createFileRoute, useBlocker, useRouter} from '@tanstack/react-router'
import {getBaseUrl, getTenantUrl} from "../../../../config.ts";
import type {Facet} from "../../../../types/facets.ts";
import {FacetData} from "../../../../components/FacetData.tsx";
import {fetchAuthenticated} from "../../../../auth.ts";
import {Accordion, Badge, Button, Group, Modal} from "@mantine/core";
import {DragDropProvider} from "@dnd-kit/react";
import {useContext, useRef, useState} from "react";
import {useSortable} from "@dnd-kit/react/sortable";
import {move} from "@dnd-kit/helpers";
import classes from './facets.module.css'
import {TenantContext} from "../../../../context/TenantContext.ts";
import {notifications} from "@mantine/notifications";
import {useDisclosure} from "@mantine/hooks";
import {FacetMetadataContext} from "../../../../context/FacetMetadataContext.ts";

interface LoaderData {
    facets: Facet[]
    facetTypes: string[]
    fieldNames: string[]
}

export const Route = createFileRoute('/$tenant/datasets/$dataset/facets')({
    loader: async ({context, params}): Promise<LoaderData> => {
        const tenant = context.tenant
        console.log(context)
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

    function getBadges() {
        if (facet.new) {
            return <Badge color={"green"}>New</Badge>
        }

        if (hasChanges) {
            return <Badge color={"yellow"}>Has changes</Badge>
        }
    }

    return (
        <Accordion.Item ref={setElement} data-shadow={isDragging || undefined} value={facet._id}>
            <Accordion.Control icon={<div className={classes.handle} ref={handleRef} />}><Group>{facet.name}{getBadges()}</Group></Accordion.Control>
            <Accordion.Panel>
                <FacetData onChange={onChange} index={index} facet={facet} />
            </Accordion.Panel>
        </Accordion.Item>
    )
}

function RouteComponent() {
    const {facets, facetTypes, fieldNames} = Route.useLoaderData()
    const {dataset} = Route.useParams()
    console.log(facets)
    const router = useRouter()
    const tenant = useContext(TenantContext)

    const [facetList, setFacetsList] = useState<Facet[]>(facets)
    const [hasChanges, setHasChanges] = useState<boolean>(false)
    const [counter, setCounter] = useState(0)
    const [saveLoading, setSaveLoading] = useState(false)

    const [modalOpened, { open, close }] = useDisclosure(false)
    const [newFacet, setNewFacet] = useState<Facet>(null)

    useBlocker({
        shouldBlockFn: () => {
            if (!hasChanges) return false

            const shouldLeave = confirm("You have unsaved changes. Are you sure you want to leave?")
            return !shouldLeave
        }
    })

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

    async function save() {
        const newFacets = facetList.map((f: Facet, i: number) => {
            return {...f, order: i, dataset_name: dataset, id: undefined}
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

    function addNewFacet() {
        const facet = {...newFacet, new: true}
        setFacetsList([...facetList, facet])
        close()
        setNewFacet(null)
    }

    return <div key={counter}>
        <Group justify={"space-between"}>
            <h3>Facets</h3>
            <Button loading={saveLoading} onClick={save} disabled={!hasChanges}>Save</Button>
        </Group>
        <FacetMetadataContext value={{types: facetTypes, fieldNames: fieldNames}}>
            <Accordion variant={"separated"}>
                <DragDropProvider onDragEnd={(event) => {
                    setHasChanges(true)
                    setFacetsList((items) => move(items, event))
                }}>
                    {facetList.map((facet, index) => (
                        <SortableFacet key={facet._id} onFacetChange={onFacetChange} index={index} facet={facet} />
                    ))}
                </DragDropProvider>
            </Accordion>
            <Group mt={"xl"}>
                <Button variant={"default"} onClick={open}>Add facet</Button>
            </Group>
            <Modal opened={modalOpened} onClose={close} title={"Add facet"}>
                <FacetData index={0} facet={newFacet} onChange={setNewFacet} />
                <Button fullWidth mt={"md"} onClick={addNewFacet}>Add facet</Button>
            </Modal>
        </FacetMetadataContext>
    </div>
}
