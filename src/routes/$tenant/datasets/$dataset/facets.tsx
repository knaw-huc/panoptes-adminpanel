import {createFileRoute} from '@tanstack/react-router'
import {getBaseUrl, getTenantUrl} from "../../../../config.ts";
import {FacetTypesContext} from "../../../../context/FacetTypesContext.ts";
import type {Facet} from "../../../../types/facets.ts";
import {FacetData} from "../../../../components/FacetData.tsx";
import {fetchAuthenticated} from "../../../../auth.ts";
import {Accordion} from "@mantine/core";

interface LoaderData {
    facets: Facet[]
    facetTypes: string[]
}

export const Route = createFileRoute('/$tenant/datasets/$dataset/facets')({
    loader: async ({context, params}): Promise<LoaderData> => {
        const tenant = context.tenant
        console.log(context)
        const res = await fetchAuthenticated(`${getTenantUrl(tenant)}/api/datasets/${params.dataset}/facets/configuration`)

        const facettypes_res = await fetchAuthenticated(`${getBaseUrl()}/api/admin/facettypes`)

        return {
            facets: (await res.json())["facets"] as Facet[],
            facetTypes: (await facettypes_res.json())["facetTypes"] as string[]
        }
    },
    component: RouteComponent,
})

function RouteComponent() {
    const {facets, facetTypes} = Route.useLoaderData()

    return <div>
        <h3>Facets</h3>
        <Accordion variant={"separated"}>
            <FacetTypesContext value={facetTypes}>
                {facets.map((facet, index) => (
                    // <details key={facet.property} name={"facet-accordion"} className={"accordion-item"} open={index == 0}>
                    //     <summary className={"accordion-header"}>
                    //         {facet.name}
                    //         <svg className="accordion-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"
                    //              fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
                    //             <path d="m2 5 6 6 6-6"/>
                    //         </svg>
                    //     </summary>
                    //     <div className="accordion-body">
                    //         <FacetData facet={facet} />
                    //     </div>
                    // </details>
                    <Accordion.Item value={facet.property} key={index}>
                        <Accordion.Control>{facet.name}</Accordion.Control>
                        <Accordion.Panel>
                            <FacetData facet={facet} />
                        </Accordion.Panel>
                    </Accordion.Item>
                ))}
            </FacetTypesContext>
        </Accordion>
    </div>
}
