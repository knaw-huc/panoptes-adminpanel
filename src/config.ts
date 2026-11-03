import type {Tenant} from "./types/tenants.ts";


export const PROTOCOL = getVar("$VITE_PROTOCOL", "http")
export const BASE_DOMAIN = getVar("$VITE_BASE_DOMAIN", "admin.local")

export const PORT = getVar("$VITE_PORT", 8000)


function getVar(envVariable: string, defaultValue: string | number)
{
    const val = envVariable.startsWith('$VITE_')
        ? (envVariable.slice(1) in import.meta.env ? import.meta.env[envVariable.slice(1)] : undefined)
        : envVariable

    if (!val) return defaultValue
    return val
}


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