import {useFieldContext} from "../context/FormContexts.ts";
import {Autocomplete, NumberInput, Select, Switch, TextInput} from "@mantine/core";

interface fieldArgs {
    label: string,
    description?: string,
    first?: boolean
}

interface selectFieldArgs extends fieldArgs {
    data: string[]
}

interface numberFieldArgs extends fieldArgs {
    min?: number
    max?: number
}

export function TextField({label, description, first}: fieldArgs) {
    const field = useFieldContext<string>()
    const isFirst = first === true

    return (
        <TextInput mt={isFirst ? undefined : "md"} description={description} label={label} value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
    )
}

export function NumberField({label, description, first, min, max}: numberFieldArgs) {
    const field = useFieldContext<number>()
    const isFirst = first === true

    return (
        <NumberInput mt={isFirst ? undefined : "md"} min={min} max={max} description={description} label={label} value={field.state.value} onChange={(value) => field.handleChange(value)} />
    )
}

export function SelectField({label, description, data, first}: selectFieldArgs) {
    const field = useFieldContext<string>()
    const isFirst = first === true

    return (
        <Select mt={isFirst ? undefined : "md"} description={description} onChange={(value) => field.handleChange(value as string)} data={data} label={label} value={field.state.value} />
    )
}

export function AutocompleteField({label, description, data, first}: selectFieldArgs) {
    const field = useFieldContext<string>()
    const isFirst = first === true

    return (
        <Autocomplete mt={isFirst ? undefined : "md"} description={description} onChange={(value) => field.handleChange(value as string)} data={data} label={label} value={field.state.value} />
    )
}

export function SwitchField({label, description, first}: fieldArgs) {
    const field = useFieldContext<boolean>()
    const isFirst = first === true

    return (
        <Switch mt={isFirst ? undefined : "md"} label={label} description={description} checked={field.state.value} onChange={(e) => field.handleChange(e.target.checked)} />
    )
}