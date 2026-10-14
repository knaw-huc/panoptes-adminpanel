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
