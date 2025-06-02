'use client';

import '@mantine/core/styles.css';

import { ChangeEvent, useState, FormEvent, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Loading from "../misc/Loading";

import { MantineProvider, Button } from "@mantine/core";

interface LoginResponse {
    message: string;
    token: string;
    error: string;
}

export default function Login() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const router = useRouter();

    const defaultInputElem = useRef<HTMLInputElement>(null);

    const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        setLoading(true);
        setError("");

        try {
            const response = await fetch("/api/account/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username: username, password }),
            });

            const data: LoginResponse = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.token);
                router.push("/home");
            } else {
                setError(data.error);
            }
        } catch (error) {
            console.error("Login error:", error);
            setError("An error occured while loggin in.");
        } finally {
            setLoading(false);
        }

    };

    useEffect(() => {
        defaultInputElem.current?.focus();
    }, []);

    const isDisabled = username.trim() === "" || password.trim() === "";

    return (
        <MantineProvider>
            <form onSubmit={handleSubmit} className="flex w-1/3 h-1/2 flex-col p-10">
                <h2 className="mb-10">Login</h2>

                <label>Username</label>
                <input className="p-2 mb-10 rounded-md border-2 border-grey-400"
                    type="text"
                    id="username"
                    name="username"
                    placeholder="Enter your username"
                    value={username}
                    onChange={handleUsernameChange}
                    ref={defaultInputElem}
                />

                <label>Password</label>
                <input className="p-2 mb-10 rounded-md border-2 border-grey-400"
                    type="password"
                    id="password"
                    name="username"
                    placeholder="Enter your password"
                    value={password}
                    onChange={handlePasswordChange}
                />

                {error && <p className="text-red-500">{error}</p>}

                <Button type="submit" disabled={isDisabled} variant="filled" size="lg">
                    {loading ? <Loading /> : "Login"}
                </Button>
            </form>
        </MantineProvider>
    )
}