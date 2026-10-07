import {createFileRoute, Link,} from '@tanstack/react-router'
import {getTenantUrl} from "../../../config.ts";
import type {Tenant} from "../../../types/tenants.ts";


interface Dataconfiguration {
    id_property: string
    base_url: string
}

interface Metadata {
    [key: string]: unknown
}

interface Dataset {
    name: string
    data_type: string
    data_configuration: Dataconfiguration
    metadata: Metadata[]
}

interface LoaderData {
    datasets: Dataset[]
    tenant: Tenant
}

export const Route = createFileRoute('/$tenant/datasets/')({
    loader: async ({context}): Promise<LoaderData> => {
        const tenant = context.tenant
        console.log(context)
        const res = await fetch(`${getTenantUrl(tenant)}/api/datasets`)
        return {datasets: await res.json() as Dataset[], tenant: tenant}
    },
    component: RouteComponent,
})

function RouteComponent() {

    const {datasets, tenant}  = Route.useLoaderData()

    return (
        <div>

            <ul className="list-group">
                {datasets?.map((dataset) => (
                    <li
                        key={dataset.name} className="list-group-item">


                        <Link to={"/$tenant/datasets/$dataset"} params={{tenant: tenant.name, dataset: dataset.name}}>
                            <h5>name: {dataset.name}</h5>
                            <h5>type: {dataset.data_type}</h5>
                            <h5>data configuration 'id_property': {dataset.data_configuration.id_property}</h5>
                            <h5>data configuration 'base_url': {dataset.data_configuration.base_url}</h5>


                        </Link>



                    </li>

                ))}
            </ul>
        </div>)
}
