import { FormEvent, useState } from "react";
import { ClipLoader } from "react-spinners";
import { useAuth } from "../lib/hooks/useAuth";

interface AuthPageState {
    isLogin: boolean;
    username: string;
    password: string;
    error: string;
    isLoading: boolean;
}

export default function AuthPage() {
    const [state, setState] = useState<AuthPageState>({
        isLogin: true,
        username: "",
        password: "",
        error: "",
        isLoading: false
    });

    const { login, register } = useAuth();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setState(prev => ({ ...prev, error: "", isLoading: true }));

        try {
            if (state.isLogin) {
                await login({ username: state.username, password: state.password });
            } else {
                await register({ username: state.username, password: state.password });
            }
        } catch (err) {
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: err instanceof Error ? err.message : "Something went wrong."
            }));
        }
    };

    return (
        <div className="min-h-screen bg-dino-dark text-dino-text flex items-center justify-center px-4">
            <div className="bg-dino-card border border-dino-border rounded-2xl shadow-lg w-full max-w-md p-8">
                <h1 className="text-3xl font-bold text-center mb-6">
                    {state.isLogin ? "Welcome Back" : "Join Dino"}
                </h1>
                <p className="text-gray-400 text-center mb-8">
                    {state.isLogin
                        ? "Log in to track your climbs and see your progress."
                        : "Create an account to start logging your ascents."}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Username</label>
                        <input
                            type="text"
                            placeholder="Your climbing alias"
                            className="w-full bg-white/5 border border-dino-border rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-400"
                            autoFocus
                            value={state.username}
                            onChange={(e) => setState(prev => ({ ...prev, username: e.target.value }))}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full bg-white/5 border border-dino-border rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-400"
                            value={state.password}
                            onChange={(e) => setState(prev => ({ ...prev, password: e.target.value }))}
                        />
                    </div>

                    {state.error && (
                        <p className="text-red-400 text-sm text-center">{state.error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={state.isLoading}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
                    >
                        {state.isLoading ? (
                            <ClipLoader color="#34d399" size={24} />
                        ) : (
                            state.isLogin ? "Log In" : "Sign Up"
                        )}
                    </button>
                </form>

                <div className="text-center mt-6">
                    <p className="text-gray-400 text-sm">
                        {state.isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                        <button
                            className="text-emerald-400 hover:underline"
                            onClick={() => setState(prev => ({ ...prev, isLogin: !prev.isLogin, error: "" }))}
                        >
                            {state.isLogin ? "Sign Up" : "Log In"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}