import {createFileRoute, useNavigate} from '@tanstack/react-router'
import {useState} from "react";
import {getBaseUrl} from "../config.ts";
import {Button, Container, Paper, PasswordInput, Text, TextInput, Title} from "@mantine/core";

import classes from './login.module.css'

export const Route = createFileRoute('/login')({
    component: RouteComponent,
})

function RouteComponent() {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [remember, setRemember] = useState(false)
    const [error, setError] = useState('')
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
            setError("Invalid username or password")
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
            navigate({
                to: redirect
            })
            return false;
        }
        navigate({
            to: "/"
        })
    }
    return <Container size={420} my={40}>
        <Title ta={"center"} className={classes.title}>
            Panoptes Admin
        </Title>
        <Text className={classes.subtitle}>
            {message}
        </Text>

        <Paper withBorder shadow={"sm"} p={22} mt={30} radius={"md"}>
            <form onSubmit={handleSubmit}>
                <TextInput value={username} onChange={e => setUsername(e.target.value)} label={"Username"} placeholder={"jan_janssen"} required radius={"md"} />
                <PasswordInput value={password} onChange={e => setPassword(e.target.value)} label={"Password"} placeholder={"Your Password"} required mt={"md"} radius={"md"} />

                <Text>{error}</Text>
                <Button type={"submit"} fullWidth mt={"xl"} radius={"md"}>Sign in</Button>
            </form>
        </Paper>
    </Container>
}
