import {createFormHook} from "@tanstack/react-form";
import {fieldContext, formContext} from "../context/FormContexts.ts";
import {TextField, SelectField, SwitchField, NumberField} from "../components/FormComponents.tsx";

export const {useAppForm} = createFormHook({
    fieldContext,
    formContext,
    fieldComponents: {
        TextField,
        SelectField,
        SwitchField,
        NumberField,
    },
    formComponents: {}
})