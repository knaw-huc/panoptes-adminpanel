import {createFileRoute, useNavigate} from '@tanstack/react-router'
import {useState} from "react";
import {getBaseUrl} from "../config.ts";

export const Route = createFileRoute('/login')({
    component: RouteComponent,
})

function RouteComponent() {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [remember, setRemember] = useState(false)
    const message = localStorage.getItem("login_message")
    const navigate = useNavigate();

    async function handleSubmit(e: { preventDefault: () => void; }) {
        e.preventDefault()

        const data = new FormData();
        data.append("username", username)
        data.append("password", password)

        const response = await fetch(`${getBaseUrl()}/api/auth/token`, {
            method: 'POST',
            body: data
        })

        const json = await response.json()

        if (response.status === 401) {
            // document.getElementById("response").setHTML(json.detail)
            return false;
        }

        if (remember) {
            localStorage.setItem("remembered_user", username)
        } else {
            localStorage.removeItem("remembered_user")
        }

        localStorage.setItem("token", json.access_token)
        localStorage.setItem("refresh", json.refresh_token)

        const redirect = localStorage.getItem("login_redirect")

        localStorage.removeItem("login_message")
        if (redirect) {
            localStorage.removeItem("login_redirect")
            // window.location.replace(redirect)
            navigate({
                to: redirect
            })
            return false;
        }
        navigate({
            to: "/"
        })
    }

    return <div className={"container"}>
        <div className={"row justify-content-around vh-100"}>
            <div className={"col-12 md:col-6 lg:col-5 xl:col-4 align-self-center"}>
                <div className={"card"}>
                    <div className={"card-body"}>
                        <h4 className={"card-title"}>Panoptes Admin</h4>
                        <p className={"card-subtitle"}>{message}</p>
                        <form onSubmit={handleSubmit}>
                            <div className={"form-group mb-3"}>
                                <label htmlFor="username">Username</label>
                                <input type="text" id="username" className={"form-control"} value={username} onChange={(e) => setUsername(e.target.value)} />
                            </div>
                            <div className={"form-group mb-3"}>
                                <label htmlFor="password">Password</label>
                                <input type="password" id="password" className={"form-control"} value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                            <div className={"d-grid gap-2"}>
                                <button type="submit" className={"btn-solid theme-primary"}>Login</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
}
