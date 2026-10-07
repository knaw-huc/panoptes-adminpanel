import {createFileRoute, Link} from '@tanstack/react-router'
import {getBaseUrl} from "../config.ts";
import type {TenantsResponse} from "../types/tenants.ts";

export const Route = createFileRoute('/')({
    loader: async (): Promise<TenantsResponse> => {
        const res = await fetch(`${getBaseUrl()}/api/admin/tenants`)
        return res.json()
    },

  component: RouteComponent,
})

function RouteComponent() {


    const { tenants } = Route.useLoaderData()


  return (
      <div>
      <h1 className={"h1"}>Home</h1>
          <h2>datasets:</h2>


          <div className="list-group">
              {tenants.map((tenant) => (
                  <Link
                      key={tenant._id}
                      to="/$tenant"
                      params={{ tenant: tenant.name }}
                      className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                  >
                      <div>
                          <h5>{tenant.name}</h5>
                          <h5>ID: {tenant._id}</h5>
                      </div>
                      <span className="btn btn-primary btn-sm">view </span>
                  </Link>
              ))}
          </div>

          <h2>add new dataset:</h2>
          <div>
              <Link to="/new_dataset">
                  <span className="btn btn-primary btn-sm">add new dataset </span>

              </Link>
          </div>
  </div>)
}



