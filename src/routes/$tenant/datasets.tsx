import {createFileRoute, } from '@tanstack/react-router'
import * as React from "react";


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


export const Route = createFileRoute('/$tenant/datasets')({
  loader: async (): Promise<Dataset[]> => {
    const res = await fetch('http://bypass.local:8000/api/datasets')
    return res.json()
  },
  component: RouteComponent,
})

function RouteComponent() {

  const datasets  = Route.useLoaderData()

  return (
      <div>

        <ul className="list-group">
          {datasets?.map((dataset) => (
              <li
                  key={dataset.name} className="list-group-item">


                <div>
                  <h5>name: {dataset.name}</h5>
                  <h5>type: {dataset.data_type}</h5>
                  <h5>data configuration 'id_property': {dataset.data_configuration.id_property}</h5>
                  <h5>data configuration 'base_url': {dataset.data_configuration.base_url}</h5>


                </div>
              </li>

          ))}
        </ul>
      </div>)
}
