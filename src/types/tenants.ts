export interface Tenant {
    _id: string
    name: string
    domain: string
}

export interface TenantsResponse {
    tenants: Tenant[]
}
