import {createFileRoute, Link} from '@tanstack/react-router'
// import * as React from 'react'
import { useForm } from '@tanstack/react-form'


interface DatasetFormValues {
    name: string
    data_type: string
    data_configuration: {
        id_property: string
        base_url: string
    }
    metadata: Array<{ key: string; value: string }>
}

export const Route = createFileRoute('/new_dataset_tanstack_form')({
    component: RouteComponent,
})

function RouteComponent() {

    const form = useForm<DatasetFormValues>({
        defaultValues: {

            name:'',
            data_type:'',
            data_configuration:{
                id_property:'',
                base_url:'',
            },
            metadata:[{key:'', value:''}],
        },
        onSubmit: async ({value}) => {
            console.log(value)
        }

    })



    return (
        <div className="container py-4" style={{ maxWidth: '1000px' }}>
            <div className="card shadow-sm border-0">
                <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                    <h4 className="card-title mb-0 fs-5">Create Dataset</h4>
                </div>

                <div className="card-body">
                    <form >
                        {/* 'Field' represents a single form input element. Fields are created using the form.Field component
                         provided by the Form instance. The component accepts a name prop, which should match a key in the
                         form's default values.*/}
                        <form.Field
                            name="name"
                             // component also accepts a 'children' prop, render prop function that takes a 'field' object as its argument
                            // ('field' is a variable)
                            children={(field) => (
                                <div className="mb-3">
                                    <label htmlFor={field.name} className="form-label fw-bold">
                                        Name
                                    </label>
                                    <input
                                    type="text"
                                    className="form-control"
                                    id={field.name}
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    required
                                    />
                                </div>
                            )}
                        />
                        {/* Data Type */}
                        <form.Field
                            name="data_type"
                            children={(field) => (
                                <div className="mb-3">
                                    <label htmlFor={field.name} className="form-label fw-bold">
                                        Data Type
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id={field.name}
                                        value={field.state.value}
                                        // onChange={(e) => field.handleChange(e.target.value)}
                                        onChange={(e) => console.log('logging.....',e)}
                                    />
                                </div>
                            )}

                        />



                        {/* data configuration */}
                        <h5 className="mb-3 text-secondary">Data Configuration</h5>

                        <form.Field
                            name="data_configuration.id_property"
                            children={(field) => (
                                <div className="mb-3">
                                    <label htmlFor={field.name} className="form-label fw-bold">
                                        ID property
                                    </label>
                                    <input
                                    type="text"
                                    className="form-control"
                                    id={field.name}
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    />
                                </div>

                            )}
                        />

                        <form.Field
                            name="data_configuration.base_url"
                            children={(field) => (
                                    <div className="mb-3">
                                        <label htmlFor={field.name} className="form-label fw-bold">
                                            base URL
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id={field.name}
                                            value={field.state.value}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                        />
                                    </div>


                            )}
                        />

                        {/* metadata */}
                        <form.Field
                            name="metadata"
                            // array fields allow to manage a list of values within a form.
                            mode="array"
                            children={(field) => (
                                // fragment, to group elements without wrapper node
                                <>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="mb-0">Metadata</h5>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outlier-primary"
                                        onClick={() => field.pushValue({key:'', value:''})}
                                        >
                                        add key-value metadata pair
                                    </button>
                                </div>

                                    {/*adding the key-value pair and the remove button:*/}

                                    {/*'field.state.value' = current array stored in state */}
                                    {field.state.value.map((_, index) => (

                                            <div className="row g-2 mb-2 align-items-center" key={index}>

                                                {/*key field*/}
                                                <div className="col-md-5">
                                                    <form.Field
                                                        name={`metadata[${index}].key`}
                                                        children={(subField) => (
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="key"
                                                                value={subField.state.value}
                                                                onChange={(e) => subField.handleChange(e.target.value)}
                                                            />
                                                        )}
                                                    />
                                                </div>

                                                {/*value field*/}
                                                <div className="col-md-5">
                                                    <form.Field
                                                        name={`metadata[${index}].value`}
                                                        children={(subField) => (
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="value"
                                                                value={subField.state.value}
                                                                onChange={(e) => subField.handleChange(e.target.value)}
                                                            />
                                                        )}
                                                    />
                                                </div>

                                                {/*remove pair button*/}
                                                <div className="col-md-2">
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outlier-primary"
                                                        onClick={() => field.removeValue(index)}
                                                        >
                                                        Remove metadata pair
                                                    </button>
                                                </div>

                                            </div>
                                        ))}
                                </>
                            )}
                        />


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

