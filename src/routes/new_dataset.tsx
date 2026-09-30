import {createFileRoute, Link} from '@tanstack/react-router'
import * as React from 'react'


interface DatasetFormValues {
    name: string
    data_type: string
    data_configuration: {
        id_property: string
        base_url: string
    }
    metadata: Array<{ key: string; value: string }>
}

export const Route = createFileRoute('/new_dataset')({
  component: RouteComponent,
})

function RouteComponent() {

    const [formData, setFormData] = React.useState<DatasetFormValues>({
        name: '',
        data_type: '',
        data_configuration: {
            id_property: '',
            base_url: '',
        },
        metadata: [{ key: '', value: '' }],
    })

    // handle change for name and data type
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target
        setFormData((prev) =>
            ({ ...prev,
                [name]: value }))
    }

    // handle change for data configuration
    const handleConfigChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            data_configuration: {
                ...prev.data_configuration,
                [name]: value,
            },
        }))
    }

    // metadata handle change
    const handleMetadataChange = (
        index: number,
        field: 'key' | 'value',
        value: string
    ) => {
        const updatedMetadata = [...formData.metadata]
        updatedMetadata[index][field] = value
        // functional state update
        setFormData((prev) => ({
            ...prev,
            metadata: updatedMetadata }))
    }

    // add metadata row
    const addMetadataRow = () => {
        setFormData((prev) => ({
            ...prev,
            metadata: [...prev.metadata, { key: '', value: '' }],
        }))
    }


    // remove metadata row
    const removeMetadataRow = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            metadata: prev.metadata.filter((_, i) => i !== index),
        }))
    }


    return (
        <div className="container py-4" style={{ maxWidth: '1000px' }}>
            <div className="card shadow-sm border-0">
                <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                    <h4 className="card-title mb-0 fs-5">Create Dataset</h4>
                </div>

                <div className="card-body">
                    <form >
                        {/* Name */}
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label fw-bold">
                                Name
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Data Type */}
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label fw-bold">
                                Data Type
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="data_type"
                                name="data_type"
                                value={formData.data_type}
                                onChange={handleChange}

                            />
                        </div>



                        {/* data configuration */}
                        <h5 className="mb-3 text-secondary">Data Configuration</h5>

                        <div className="row g-3 mb-3">
                            <div className="mb-3">
                                <label htmlFor="id_property" className="form-label fw-bold">
                                    ID Property
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="id_property"
                                    name="id_property"
                                    value={formData.data_configuration.id_property}
                                    onChange={handleConfigChange}

                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="base_url" className="form-label fw-bold">
                                    Base URL
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="base_url"
                                    name="base_url"
                                    value={formData.data_configuration.base_url}
                                    onChange={handleConfigChange}

                                />
                            </div>
                        </div>



                        {/* metadata */}
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="mb-0 text-secondary">Metadata</h5>
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-primary"
                                onClick={addMetadataRow}
                            >
                                + Add Key-Value
                            </button>
                        </div>

                        {formData.metadata.map((pair, index) => (
                            <div className="row g-2 mb-2 align-items-center" key={index}>
                                <div className="col-md-5">
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        placeholder="Key"
                                        value={pair.key}
                                        onChange={(e) =>
                                            handleMetadataChange(index, 'key', e.target.value)
                                        }
                                    />
                                </div>
                                <div className="col-md-5">
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        placeholder="Value"
                                        value={pair.value}
                                        onChange={(e) =>
                                            handleMetadataChange(index, 'value', e.target.value)
                                        }
                                    />
                                </div>
                                <div className="col-md-2">
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-danger w-100"
                                        onClick={() => removeMetadataRow(index)}
                                        disabled={formData.metadata.length === 1}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}


                        <div className="mt-4 d-flex justify-content-end gap-2">
                            <button
                                type="submit"
                                className="btn btn-success px-4"
                            >
                                Save Dataset
                            </button>
                        </div>
                    </form>

                </div>
            </div>
            <Link to="/" className="btn btn-primary btn-sm"> return home</Link>
        </div>
    )
}

