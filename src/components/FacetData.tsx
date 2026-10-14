import type {Facet} from "../types/facets.ts";
import {useContext, useState} from "react";
import {FacetTypesContext} from "../context/FacetTypesContext.ts";
import {NumberInput, Select, Switch, TextInput} from "@mantine/core";

interface FacetParams {
    facet: Facet
}

export function FacetData({facet}: FacetParams) {
    const [editing, setEditing] = useState<boolean>(false)
    const [name, setName] = useState<string>(facet.name);
    const [property, setProperty] = useState<string>(facet.property)
    const [startOpen, setStartOpen] = useState<boolean>(facet.start_open)
    const [type, setType] = useState<string>(facet.type)
    const [treeSeparator, setTreeSeparator] = useState<string>(facet.tree_separator as string)
    const [treeExpandLevel, setTreeExpandLevel] = useState<number>(facet.tree_expand_level as number)

    const facettypes = useContext(FacetTypesContext);

    function renderTreeFields() {
        return <>
            <Select mt={"md"} label={"Separator"} description={"A tree facet is a hierarchical facet indexed in ES using the \"path_hierarchy\" tokenizer. When using Procrustus for indexing, these are split by either '/' or '|'."} value={treeSeparator} onChange={setTreeSeparator} data={["/", "|"]} />

            <NumberInput min={0} mt={"md"} label={"Expand level"} description={"How many levels of the hierarchy to open on start."} value={treeExpandLevel} onChange={setTreeExpandLevel} />
        </>
    }

    function renderForm() {
        return <>
            <TextInput label={"Name"} value={name} onChange={(e) => setName(e.target.value)} />

            <TextInput mt={"md"} label={"Property"} value={property} onChange={(e) => setProperty(e.target.value)} />

            <Switch mt={"md"} checked={startOpen} onChange={(e) => setStartOpen(e.target.checked)} label={"Start open"} />

            <Select value={type} onChange={setType} label={"Type"} placeholder={"Pick value"} data={facettypes} mt={"md"} />

            {type == "tree" ? renderTreeFields() : null}
        </>
    }

    return <>
        {renderForm()}
    </>
}