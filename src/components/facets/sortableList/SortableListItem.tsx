import {type JSX, useRef, useState} from "react";
import {useSortable} from "@dnd-kit/react/sortable";
import {Accordion, Badge, Button, Group} from "@mantine/core";
import classes from "../../../routes/$tenant/datasets/$dataset/facets.module.css";
import type {SortableItem} from "./SortableList.tsx";

interface SortableListItemProperties {
    item: SortableItem
    index: number
    onItemChange: (item: SortableItem, index: number) => void
    formComponent: JSX.ElementType
}

export function SortableListItem({item, index, onItemChange, formComponent}: SortableListItemProperties) {
    const [element, setElement] = useState<Element | null>(null)
    const handleRef = useRef<HTMLButtonElement | null>(null)
    const {isDragging} = useSortable({id: item._id, index, element, handle: handleRef})
    const [hasChanges, setHasChanges] = useState<boolean>(false)
    const FormComponent = formComponent

    function onChange(item: SortableItem, index: number) {
        setHasChanges(true)
        onItemChange(item, index)
    }

    function onDelete() {
        const deletedItem = {...item, deleted: true}
        onItemChange(deletedItem, index)
    }

    function getBadges() {
        const badges = []

        if (item.deleted) {
            return [<Badge color={"red"}>Deleted</Badge>]
        }

        if (item.new) {
            badges.push(<Badge color={"green"}>New</Badge>)
        }

        if (hasChanges) {
            badges.push(<Badge color={"yellow"}>Has changes</Badge>)
        }

        return badges
    }

    return (
        <Accordion.Item ref={setElement} data-shadow={isDragging || undefined} value={item._id}>
            <Accordion.Control icon={<div className={classes.handle} ref={handleRef} />}><Group>{item.name}{getBadges()}</Group></Accordion.Control>
            <Accordion.Panel>
                <FormComponent onChange={onChange} index={index} item={item} />
                <Button variant={"outline"} color={"red"} onClick={onDelete} type={"button"} mt={"md"}>Delete</Button>
            </Accordion.Panel>
        </Accordion.Item>
    )
}
