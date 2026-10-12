
export interface Facet {
    property: string
    name: string
    type: string
    start_open: boolean
    tree_expand_level?: number
    tree_separator?: string
}

export interface TreeFacet extends Facet {
    type: "tree"
    tree_expand_level: number
    tree_separator: string
}