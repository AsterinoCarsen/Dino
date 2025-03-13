'use client';

import { ChangeEvent, useState, FormEvent } from "react";

interface RegisterResponse {
    message?: string;
    error?: string;
}

export default function Register() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<string>("");

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
        setSuccess("");

        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            const data: RegisterResponse = await response.json();

            if (response.ok) {
                setSuccess(data.message || "Registration successful!");
            } else {
                setError(data.error || "An error occurred.");
            }
        } catch (error) {
            console.error("Registration error:", error);
            setError("An error occurred while registering.");
        } finally {
            setLoading(false);
        }
    };

    const isDisabled = username.trim() === "" || password.trim() === "";

    return (
        <div className="flex w-screen h-screen items-center justify-center">
            <form onSubmit={handleSubmit} className="flex flex-col p-10 w-lg h-2/3">
                <h2 className="mb-10">Register</h2>

                <label>Username</label>
                <input className="p-2 mb-10 rounded-md border-2 border-grey-400"
                    type="text"
                    name="username"
                    placeholder="Enter your username"
                    value={username}
                    onChange={handleUsernameChange}
                />

                <label>Password</label>
                <input className="p-2 mb-10 rounded-md border-2 border-grey-400"
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={handlePasswordChange}
                />

                {error && <p className="text-red-500">{error}</p>}
                {success && <p className="text-green-500">{success}</p>}

                <button type="submit" disabled={isDisabled} className="text-white py-2 rounded-md mt-4">
                    {loading ? "Registering..." : "Register"}
                </button>
            </form>
        </div>
    );
}
