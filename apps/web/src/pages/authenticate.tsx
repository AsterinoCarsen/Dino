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
            <div className="w-full max-w-sm flex flex-col gap-8">

                <div className="text-center">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-6">
                        <span className="text-lg font-semibold">D</span>
                    </div>
                    <h1 className="text-2xl font-medium">
                        {state.isLogin ? "Welcome back" : "Create your account"}
                    </h1>
                    <p className="text-gray-400 text-sm mt-2">
                        {state.isLogin
                            ? "Log in to track your climbs and see your progress."
                            : "Start logging your ascents and tracking your progress."}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <div>
                        <label className="block text-xs text-gray-400 mb-1.5">Username</label>
                        <input
                            type="text"
                            placeholder="Your climbing alias"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/30 transition"
                            autoFocus
                            value={state.username}
                            onChange={(e) => setState(prev => ({ ...prev, username: e.target.value }))}
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-400 mb-1.5">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/30 transition"
                            value={state.password}
                            onChange={(e) => setState(prev => ({ ...prev, password: e.target.value }))}
                        />
                    </div>

                    {state.error && (
                        <p className="text-red-400 text-xs text-center">{state.error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={state.isLoading}
                        className="w-full bg-white text-black font-medium py-2.5 rounded-xl text-sm hover:bg-gray-100 transition disabled:opacity-50 mt-1"
                    >
                        {state.isLoading ? (
                            <ClipLoader color="#000" size={18} />
                        ) : (
                            state.isLogin ? "Log In" : "Sign Up"
                        )}
                    </button>
                </form>

                <p className="text-gray-500 text-xs text-center">
                    {state.isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                    <button
                        className="text-gray-300 hover:text-white transition"
                        onClick={() => setState(prev => ({ ...prev, isLogin: !prev.isLogin, error: "" }))}
                    >
                        {state.isLogin ? "Sign up" : "Log in"}
                    </button>
                </p>

            </div>
        </div>
    );
}