import {createContext} from "react";

export interface FacetMetadata {
    types: string[]
    fieldNames: string[]
}

export const FacetMetadataContext = createContext<FacetMetadata>(null);