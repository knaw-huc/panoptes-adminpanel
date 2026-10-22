import {getRouteApi} from "@tanstack/react-router";
import {getBaseUrl} from "./config.ts";


const routeApi = getRouteApi('/');

export async function getToken(): Promise<string | null> {
    let token: string | null = null;

    await navigator.locks.request("token", async () => {
        token = localStorage.getItem("token");
        if (!token) {
            return null
        }
        const body = JSON.parse(atob(token.split(".")[1]))
        const expDate = body.exp * 1000

        const valid = expDate > Date.now()

        if (!valid) {
            console.log("Token expired.. refreshing")
            token = await refreshToken()
        }
    })

    return token
}

export async function getUsername() {
    const token = await getToken();
    if (!token) {
        return null
    }
    const body = JSON.parse(atob(token.split(".")[1]))
    return body.sub
}

async function refreshToken(): Promise<string | null> {
    const refresh = localStorage.getItem("refresh");

    const response = await fetch(getBaseUrl() + "/api/auth/refresh", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            refresh_token: refresh
        })
    })

    if (response.status !== 200) {
        goToLogin("Your session has expired.")
        return null;
    }
    const json = await response.json()

    localStorage.setItem("token", json.access_token)
    localStorage.setItem("refresh", json.refresh_token)

    return json.access_token
}

export function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    goToLogin("You are logged out.")
}

function goToLogin(message: string) {
    localStorage.setItem("login_message", message)
    localStorage.setItem("login_redirect", window.location.pathname)

    throw routeApi.redirect({
        to: "/login",
    })
}

export async function fetchAuthenticated(input: RequestInfo | URL, init: RequestInit = {}) {
    const token = await getToken()

    if (token) {
        if (!init.headers) {
            init.headers = {"Authorization": "Bearer " + token}
        } else {
            // @ts-ignore
            init.headers.Authorization = "Bearer " + token
        }
    }

    const response = await fetch(input, init)

    if (response.status === 401) {
        goToLogin("You need to log in to view this page")
    }

    return response
}

