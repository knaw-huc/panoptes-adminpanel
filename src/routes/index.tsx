import {createFileRoute, Link, useParams} from '@tanstack/react-router'
import * as React from "react";



interface Tenant {
    _id: string
    name: string
}

interface TenantsResponse {
    tenants: Tenant[]
}


export const Route = createFileRoute('/')({
    loader: async (): Promise<TenantsResponse> => {
        const res = await fetch('http://admin.local:8000/api/admin/tenants')
        return res.json()
    },


  component: RouteComponent,
})

function RouteComponent() {


    const { tenants } = Route.useLoaderData()


  return (
      <div>
      <h1 className={"h1"}>Home</h1>

          <div className="list-group">
              {tenants.map((tenant) => (
                  <Link
                      key={tenant._id}
                      to="/$tenant"
                      params={{ tenant: tenant._id }}
                      className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                  >
                      <div>
                          <h5>{tenant.name}</h5>
                          <h5>ID: {tenant._id}</h5>
                      </div>
                      <span className="btn btn-primary btn-sm">Enter </span>
                  </Link>
              ))}
          </div>
  </div>)
}



