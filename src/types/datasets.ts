export interface Dataconfiguration {
    id_property: string
    base_url: string
}

export interface Metadata {
    [key: string]: unknown
}

export interface Dataset {
    name: string
    data_type: string
    data_configuration: Dataconfiguration
    metadata: Metadata[]
}

export interface DatasetFormValues {
    name: string
    tenant_name: string
    data_type: string
    detail_id: string
    es_index: string
    s3: boolean
    authentication_option: boolean
    data_configuration: {
        id_property: string
        base_url: string
        s3_endpoint: string
        s3_key_id: string
        s3_secret: string
        auth: {
            username: string
            password: string
        }
    }
    metadata: Record<string, string>
}
