import type {AnyFormApi} from "@tanstack/react-form";

export class HttpError extends Error {
    status: number;
    body: string;

    constructor(status: number, body: string) {
        super(`HTTP ${status}`);
        this.status = status;
        this.body = body;
    }
}

export const errorToMessage = (e: unknown) => e as string;

export const applyServerErrors = (formApi: AnyFormApi,
                                                                    source: string,
                                                                    error: HttpError)=> {
    let msg: string = 'An unspecified error has occurred.';

    switch (error.status) {
        case 409:
            msg = 'Tenant name or domain already exists';
            break;
        case 422:
            msg = 'Tenant data validation failed';
            break;
    }

    formApi.setErrorMap({
        [source]: msg
    });
}

export const applyGenericError = (formApi: AnyFormApi, source: string)=> {
    formApi.setErrorMap({
        [source]: 'An unexpected error occurred, please try again.'
    });
}