import {createFormHook} from "@tanstack/react-form";
import {fieldContext, formContext} from "../context/FormContexts.ts";
import {
    AutocompleteField,
    TextField,
    SelectField,
    SwitchField,
    NumberField,
    JsonField
} from "../components/FormComponents.tsx";

export const {useAppForm} = createFormHook({
    fieldContext,
    formContext,
    fieldComponents: {
        AutocompleteField,
        TextField,
        SelectField,
        SwitchField,
        NumberField,
        JsonField,
    },
    formComponents: {}
})