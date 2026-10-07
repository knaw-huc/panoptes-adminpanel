import {createFileRoute, Link, Outlet} from '@tanstack/react-router'
import {useContext} from "react";
import {TenantContext} from "../../../../context/TenantContext.ts";

export const Route = createFileRoute('/$tenant/datasets/$dataset')({
    component: RouteComponent,
})

function RouteComponent() {
    const tenant = useContext(TenantContext)
    const {dataset} = Route.useParams()

    return <div>
        <h2>Dataset: {dataset}</h2>
        <ul className={"nav nav-tabs"}>
            <li className="nav-item">
                <Link className={"nav-link"} activeOptions={{exact: true}} to={"/$tenant/datasets/$dataset"} params={{tenant: tenant.name, dataset}}>Settings</Link>
            </li>
            <li className="nav-item">
                <Link className={"nav-link"} to={"/$tenant/datasets/$dataset/facets"} params={{tenant: tenant.name, dataset}}>Facets</Link>
            </li>
            <li className="nav-item">
                <Link className={"nav-link"} to={"/$tenant/datasets/$dataset/result-properties"} params={{tenant: tenant.name, dataset}}>Result properties</Link>
            </li>
            <li className="nav-item">
                <Link className={"nav-link"} to={"/$tenant/datasets/$dataset/detail-properties"} params={{tenant: tenant.name, dataset}}>Detail properties</Link>
            </li>
        </ul>
        <Outlet />
    </div>
}
