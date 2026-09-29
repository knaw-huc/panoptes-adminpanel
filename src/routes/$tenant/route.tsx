import * as React from 'react'
import {Outlet, Link, createFileRoute} from '@tanstack/react-router'

export const Route = createFileRoute('/$tenant')({
    component: RootComponent,
})

function RootComponent() {

    const {tenant} = Route.useParams()

    return (
        <React.Fragment>
            <div id={"page-container"} className={"d-flex flex-nowrap"}>
                <div className={"d-flex flex-column flex-shrink-0 p-3 text-bg-dark"} style={{width: "280px"}}>
                    <span className={"fs-4"}>Panoptes Admin</span>
                    <hr />
                    <div className={"dropdown"}>
                        <a className={"text-white text-decoration-none dropdown-toggle"} data-bs-toggle={"dropdown"}>{tenant}</a>
                        <ul className={"dropdown-menu dropdown-menu-dark text-small shadow"}>
                            <li>
                                <button className={"dropdown-item"}>{tenant}</button>
                            </li>
                        </ul>
                    </div>
                    <hr />
                    <ul className={"nav nav-pills flex-column mb-auto"}>
                        <li className={"nav-item"}>
                            <Link
                                className={"nav-link text-white"}
                                to={"/$tenant"}
                                params={{tenant: tenant}}
                                activeOptions={{exact: true}}
                            >Home</Link>
                        </li>
                        <li className={"nav-item"}>
                            <Link className={"nav-link text-white"} to={"/$tenant/datasets"} params={{tenant: tenant}}>Datasets</Link>
                        </li>
                        <li className={"nav-item"}>
                            <Link className={"nav-link text-white"} to={"/$tenant/facets"} params={{tenant: tenant}}>Facets</Link>
                        </li>
                    </ul>
                    <hr />
                    <div className={"dropdown"}>
                        <a className={"text-white text-decoration-none dropdown-toggle"} data-bs-toggle={"dropdown"}>Username</a>
                        <ul className={"dropdown-menu dropdown-menu-dark text-small shadow"}>
                            <li>
                                <button className={"dropdown-item"}>Logout</button>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className={"container p-4"}>
                    <Outlet />
                </div>
            </div>
        </React.Fragment>
    )
}
