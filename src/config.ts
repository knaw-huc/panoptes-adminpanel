import type {Tenant} from "./types/tenants.ts";

export const PROTOCOL = "http"
export const BASE_DOMAIN = "admin.panoptes.local"

export const PORT = 8000

export function getBaseUrl() {
    if (PORT != undefined) {
        return `${PROTOCOL}://${BASE_DOMAIN}:${PORT}`
    }
    return `${PROTOCOL}://${BASE_DOMAIN}`
}

export function getTenantUrl(tenant: Tenant) {
    if (PORT != undefined) {
        return `${PROTOCOL}://${tenant.domain}:${PORT}`
    }
    return `${PROTOCOL}://${tenant.domain}`
}