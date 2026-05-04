import { FormEvent, useState } from "react";
import { ClipLoader } from "react-spinners";
import { useRouter } from "next/router";
import zxcvbn from "zxcvbn";

interface AuthenticationFormPageState {
    isLogin: boolean;
    isLoading: boolean;
    error: string;
    username: string;
    password: string;
}

interface LoginResponse {
    success: boolean;
    message: string;
    token: string;
}

export default function AuthPage() {
    const [state, setState] = useState<AuthenticationFormPageState>({
        isLogin: true,
        isLoading: false,
        error: "",
        username: "",
        password: ""
    });

    const router = useRouter();
    
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const { isLogin, username, password } = state;

        setState(prev => ({ ...prev, isLoading: true, error: "" }));

        try {
            if (!isLogin) {
                const validationError = validateRegistration(username, password);
                if (validationError) {
                    return setState(prev => ({ ...prev, error: validationError, isLoading: false }));
                }
            }

            const endpoint = isLogin ? "/api/auth/login" : "api/auth/register";
            const data = await sendAuthRequest(endpoint, { username, password });
            handleAuthResponse(data);

        } catch (error) {
            setState(prev => ({ ...prev, error: "Server error.", isLoading: false}));
        }
    }

    const isStrongPassword = (password: string): boolean => {
        const { score } = zxcvbn(password);
        return score >= 3;
    }

    const validateRegistration = (username: string, password: string): string | null => {
        if (!username || !password) return "All fields are required.";
        if (username.length < 5) return "Username must be at least 5 characters.";
        if (!isStrongPassword(password)) {
            return "Password is not strong enough.";
        }

        return null;
    }

    const sendAuthRequest = async (url: string, body: object): Promise<LoginResponse> => {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify(body),
        });

        return response.json();
    }

    const handleAuthResponse = (data: LoginResponse) => {
        if (!data.success) {
            setState(prev => ({ ...prev, error: data.message, isLoading: false }));
            return;
        }

        if (data.token) {
            localStorage.setItem("token", data.token);
            router.push("/dashboard");
        }
    }

    return (
        <div className="min-h-screen bg-dino-dark text-dino-text flex items-center justify-center px-4">
            <div className="bg-dino-card border border-dino-border rounded-2xl shadow-lg w-full max-w-md p-8">
                {/* Header */}
                <h1 className="text-3xl font-bold text-center mb-6">
                    {state.isLogin ? "Welcome Back" : "Join Dino"}
                </h1>
                <p className="text-gray-400 text-center mb-8">
                    {state.isLogin
                        ? "Log in to track your climbs and see your progress."
                        : "Create an account to start logging your ascents."}
                </p>

                {/* Auth Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Username</label>
                        <input
                            type="text"
                            placeholder="Your climbing alias"
                            className="w-full bg-white/5 border border-dino-border rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-400"
                            autoFocus
                            onChange={(e) =>
                                setState((prev) => ({
                                    ...prev,
                                    username: e.target.value,
                                }))
                            }
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full bg-white/5 border border-dino-border rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-400"
                            onChange={(e) =>
                                setState((prev) => ({
                                    ...prev,
                                    password: e.target.value,
                                }))
                            }
                        />
                    </div>

                    {state.error && (
                        <p className="text-gray-400 text-center mb-8">{state.error}</p>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 rounded-lg transition"
                    >
                        {!state.isLoading ? (
                            state.isLogin ? "Log In" : "Sign Up"
                        ): (
                            <ClipLoader color="#34d399" size={24} />
                        )}
                    </button>
                </form>

                {/* Toggle Login/Signup */}
                <div className="text-center mt-6">
                    <p className="text-gray-400 text-sm">
                        {state.isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                        <button
                            className="text-emerald-400 hover:underline"
                            onClick={() => setState(prev => ({
                                ...prev,
                                isLogin: !prev.isLogin
                            }))}
                        >
                            {state.isLogin ? "Sign Up" : "Log In"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
