import {Accordion, Button, Modal} from "@mantine/core";
import {type JSX, useState} from "react";
import {useDisclosure} from "@mantine/hooks";
import {v4 as uuidv4} from "uuid";
import {DragDropProvider} from "@dnd-kit/react";
import {move} from "@dnd-kit/helpers";
import {SortableListItem} from "./SortableListItem.tsx";

export interface SortableItem {
    new?: boolean
    deleted?: boolean
    _id: string
    order: number
    name: string
}

interface SortableListProps {
    addLabel: string
    formComponent: JSX.ElementType
    items: SortableItem[]
    onChange: (values: SortableItem[]) => void
}

export function SortableList({addLabel, formComponent, items, onChange}: SortableListProps): JSX.Element {

    const [modalOpened, { open, close }] = useDisclosure(false)
    const [newItem, setNewItem] = useState<SortableItem>()
    const FormComponent = formComponent

    function handleAdd() {
        const item = {...newItem as SortableItem, new: true, _id: uuidv4()}
        onChange([...items, item])
        close()
        setNewItem(null)
    }

    function onItemChange(item: SortableItem, index: number) {
        const oldItems = [...items]
        oldItems[index] = {...oldItems[index], ...item}
        onChange(oldItems)
    }

    return <>
        <Accordion variant={"separated"}>
            <DragDropProvider onDragEnd={(event) => {
                // @ts-expect-error typing issue
                const changed = move(items, event)
                onChange(changed as unknown as SortableItem[])
            }}>
                {items.map((item, index) => (
                    <SortableListItem key={item._id} item={item} index={index} onItemChange={onItemChange} formComponent={FormComponent} />
                ))}
            </DragDropProvider>
        </Accordion>
        <Button variant={"default"} mt={"md"} onClick={open}>{addLabel}</Button>
        <Modal opened={modalOpened} onClose={close} title={addLabel}>
            <FormComponent item={newItem} index={0} onChange={setNewItem} />
            <Button fullWidth mt={"md"} onClick={handleAdd}>Add</Button>
        </Modal>
    </>
}