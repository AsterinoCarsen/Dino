'use client';

import { ChangeEvent, useState, FormEvent } from "react";

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
            const response = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username: username, password }),
            });

            const data: LoginResponse = await response.json();

            if (response.ok) {
                setError("Success!");
                localStorage.setItem("token", data.token);
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

    return (
        <div className="flex w-screen h-screen items-center justify-center">
            <form onSubmit={handleSubmit} className="flex flex-col p-10 w-lg h-2/3 bg-slate-500 rounded-lg">
                <h2 className="mb-10">Login</h2>

                <label>Username</label>
                <input className="p-2 mb-10 rounded-md border-2 border-slate-200"
                    type="text"
                    id="username"
                    name="username"
                    placeholder="Enter your username"
                    value={username}
                    onChange={handleUsernameChange}
                />

                <label>Password</label>
                <input className="p-2 mb-10 rounded-md border-2 border-slate-200"
                    type="password"
                    id="password"
                    name="username"
                    placeholder="Enter your password"
                    value={password}
                    onChange={handlePasswordChange}
                />

                <p>{error}</p>

                <button type="submit" className="bg-blue-600 text-white py-2 rounded-md mt-4 hover:bg-blue-700">
                    Log In
                </button>
            </form>
        </div>
    )
}