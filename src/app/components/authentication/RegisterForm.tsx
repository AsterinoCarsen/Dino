'use client';

import { ChangeEvent, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import ReCAPTCHA from "react-google-recaptcha";
import Loading from "../misc/Loading";

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
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);

    const router = useRouter();

    const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleCaptchaChange = (token: string | null) => {
        setCaptchaToken(token);
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!captchaToken) {
            setError("Please complete the CAPTCHA verification.");
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const response = await fetch("/api/account/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password, captchaToken }),
            });

            const data: RegisterResponse = await response.json();

            if (response.ok) {
                setSuccess(data.message || "Registration successful!");
                router.push("/login");
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

                <ReCAPTCHA 
                    sitekey={process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY!}
                    onChange={handleCaptchaChange}
                />

                <button type="submit" disabled={isDisabled} className="btn-black py-2 rounded-md mt-4">
                    {loading ? <Loading /> : "Register"}
                </button>
            </form>
        </div>
    );
}
