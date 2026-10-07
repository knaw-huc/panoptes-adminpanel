import {createContext} from "react";
import type {Tenant} from "../types/tenants.ts";

export const TenantContext = createContext<Tenant>({_id: "", name: "", domain: ""})