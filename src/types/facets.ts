import type {SortableItem} from "../components/sortableList/SortableList.tsx";

export interface Facet extends SortableItem {
    _id: string;
    property: string
    name: string
    type: string
    start_open: boolean
    tree_expand_level?: number
    tree_separator?: string

    new?: boolean
    deleted?: boolean
}

export interface TreeFacet extends Facet {
    type: "tree"
    tree_expand_level: number
    tree_separator: string
}