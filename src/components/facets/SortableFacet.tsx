import type {Facet} from "../../types/facets.ts";
import {useRef, useState} from "react";
import {useSortable} from "@dnd-kit/react/sortable";
import {Accordion, Badge, Group} from "@mantine/core";
import classes from "../../routes/$tenant/datasets/$dataset/facets.module.css";
import {FacetData} from "./FacetData.tsx";

interface SortableFacetProperties {
    facet: Facet
    index: number
    onFacetChange: (facet: Facet, index: number) => void
}

export function SortableFacet({facet, index, onFacetChange}: SortableFacetProperties) {
    const [element, setElement] = useState<Element | null>(null)
    const handleRef = useRef<HTMLButtonElement | null>(null)
    const {isDragging} = useSortable({id: facet.name, index, element, handle: handleRef})
    const [hasChanges, setHasChanges] = useState<boolean>(false)

    function onChange(facet: Facet, index: number) {
        setHasChanges(true)
        onFacetChange(facet, index)
    }

    function getBadges() {
        const badges = []

        if (facet.deleted) {
            return [<Badge color={"red"}>Deleted</Badge>]
        }

        if (facet.new) {
            // return <Badge color={"green"}>New</Badge>
            badges.push(<Badge color={"green"}>New</Badge>)
        }

        if (hasChanges) {
            // return <Badge color={"yellow"}>Has changes</Badge>
            badges.push(<Badge color={"yellow"}>Has changes</Badge>)
        }

        return badges
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
