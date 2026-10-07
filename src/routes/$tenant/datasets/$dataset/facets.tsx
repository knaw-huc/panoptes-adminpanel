import {createFileRoute} from '@tanstack/react-router'
import {getTenantUrl} from "../../../../config.ts";

interface Facet {
    property: string
    name: string
    type: string
    startOpen: boolean
}

interface LoaderData {
    facets: Facet[]
}

export const Route = createFileRoute('/$tenant/datasets/$dataset/facets')({
    loader: async ({context, params}): Promise<LoaderData> => {
        const tenant = context.tenant
        console.log(context)
        const res = await fetch(`${getTenantUrl(tenant)}/api/datasets/${params.dataset}/facets`)
        return {facets: await res.json() as Facet[]}
    },
    component: RouteComponent,
})

function RouteComponent() {
    const {facets} = Route.useLoaderData()

    return <div>
        <h3>Facets</h3>
        <div className={"accordion"} id={"facet-accordion"}>
            {facets.map((facet, index) => (
                <div key={facet.property} className={"accordion-item"}>
                    <h2 className={"accordion-header"}>
                        <button className={"accordion-button" + (index == 0 ? "" : " collapsed")} type={"button"} data-bs-toggle={"collapse"} data-bs-target={"#collapse-" + facet.property}>{facet.name}</button>
                    </h2>
                    <div id={'collapse-' + facet.property} className={"accordion-collapse collapse" + (index == 0 ? " show" : "")} data-bs-parent={"#facet-accordion"}>
                        <div className="accordion-body">
                            <dl>
                                <dt>Property</dt>
                                <dd>{facet.property}</dd>

                                <dt>Type</dt>
                                <dd>{facet.type}</dd>
                            </dl>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
}
