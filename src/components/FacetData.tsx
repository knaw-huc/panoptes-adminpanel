import type {Facet} from "../types/facets.ts";
import {useContext, useState} from "react";
import {FacetTypesContext} from "../context/FacetTypesContext.ts";

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
            <div className={"mb-3"}>
                <label htmlFor={"treeSeparator"} className={"form-label"}>Separator</label>
                <select name={"treeSeparator"} className={"form-select"} value={treeSeparator} onChange={(e) => setTreeSeparator(e.target.value)} aria-describedby={"treeSeparator-description"}>
                    <option>/</option>
                    <option>|</option>
                </select>
                <div className={"form-text"} id={"treeSeparator-descrption"}>
                    A tree facet is a hierarchical facet indexed in ES using the "path_hierarchy" tokenizer. When using Procrustus for indexing, these are split by either '/' or '|'.
                </div>
            </div>
            <div className={"mb-3"}>
                <label htmlFor={"treeExpandLevel"} className={"form-label"}>Expand level</label>
                <input type={"number"} min={0} id={"treeExpandLevel"} name={"treeExpandLevel"} value={treeExpandLevel} className={"form-control"}
                       onChange={e => setTreeExpandLevel(e.target.value)} aria-describedby="treeExpandLevel-description" />
                <div className={"form-text"} id={"treeExpandLevel-description"}>
                    How many levels of the hierarchy to open on start.
                </div>
            </div>
        </>
    }

    function renderForm() {
        return <>
            <div className={"form-field mb-3"}>
                <label htmlFor={"name"} className={"form-label"}>Name</label>
                <input type={"text"} id={"name"} name={"name"} value={name} className={"form-control"}
                       onChange={e => setName(e.target.value)}/>
            </div>

            <div className={"form-field mb-3"}>
                <label htmlFor={"property"} className={"form-label"}>Property</label>
                <input type={"text"} id={"property"} name={"property"} value={property} className={"form-control"}
                       onChange={e => setProperty(e.target.value)}/>
            </div>

            <div className={"form-field mb-3"}>
                <div className={"switch"}>
                    <input type={"checkbox"} role={"switch"} checked={startOpen} onChange={e => {
                        console.log(e)
                        setStartOpen(e.target.checked)
                    }} id={"startOpen"} name={"startOpen"} />
                </div>
                <label className={"form-check-label"} htmlFor={"startOpen"}>Start open</label>
            </div>

            <div className={"form-field mb-3"}>
                <label htmlFor={"type"} className={"form-label"}>Type</label>
                <select className={"form-control"} value={type} onChange={e => setType(e.target.value)}>
                    {facettypes.map(facettype => <option value={facettype}>{facettype}</option>)}
                </select>
            </div>

            {type == "tree" ? renderTreeFields() : null}
        </>
    }

    if (editing) {
        return <>
            {renderForm()}

            <button type={"button"} className={"btn-solid theme-secondary"} onClick={() => {
                setEditing(false)
            }}>Cancel
            </button>
            <button type={"button"} className={"btn-solid theme-primary"}>
                Save
            </button>
        </>
    }

    return <>
        <fieldset disabled>
            {renderForm()}
        </fieldset>
        <button type={"button"} className={"btn-solid theme-primary"} onClick={() => {
            setEditing(true)
        }}>Edit
        </button>
    </>
}