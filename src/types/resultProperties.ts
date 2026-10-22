import type {SortableItem} from "../components/sortableList/SortableList.tsx";

export interface ResultProperty extends SortableItem {
    name: string,
    path: string,
    type: string
}
