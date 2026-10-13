import { createFileRoute } from '@tanstack/react-router'
import {fetchAuthenticated} from "../../../../auth.ts";
import {getBaseUrl, getTenantUrl} from "../../../../config.ts";

interface ResultProperty {
    name: string,
    path: string,
    order: number,
    type: string
}

interface LoaderData {
    resultProperties: ResultProperty[]
}

export const Route = createFileRoute(
    '/$tenant/datasets/$dataset/result-properties',
)({
    loader: async ({context, params}): Promise<LoaderData> => {
        const tenant = context.tenant
        console.log(context)
        const res = await fetchAuthenticated(`${getTenantUrl(tenant)}/api/datasets/${params.dataset}/result-properties`)

        return {
            resultProperties: (await res.json())["result_properties"] as ResultProperty[],
        }
    },
    component: RouteComponent,
})

function RouteComponent() {
    const {resultProperties} = Route.useLoaderData()

    return <div>
        <h3>Result Properties</h3>
        <ul>
            {resultProperties.map(prop => (
                <li key={prop.name}>{prop.name}</li>
            ))}
        </ul>
    </div>
}
