import type {SortableItem} from "../components/sortableList/SortableList.tsx";

export interface ResultProperty extends SortableItem {
    name: string,
    path: string,
    type: string
}

export interface DetailProperty extends SortableItem {
    name: string,
    path: string,
    type: string
    config: object
}