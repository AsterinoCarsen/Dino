import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FormEvent } from "react";
import Link from "next/link";
import { BarChart2, BookOpen, Trophy, Zap, Mountain } from "lucide-react";
import useAuthStore from "../lib/store/authStore";

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
    return (
        <div className="border border-white/10 rounded-2xl p-6 flex flex-col gap-3 hover:bg-white/5 transition">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                {icon}
            </div>
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
        </div>
    );
}

export default function Home() {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleGetStarted = (e: FormEvent) => {
        e.preventDefault();
        if (mounted && isAuthenticated()) {
            router.push("/dashboard");
        } else {
            router.push("/authenticate");
        }
    };

    return (
        <div className="min-h-screen bg-dino-dark text-dino-text flex flex-col">

            <header className="flex justify-between items-center px-8 py-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
                        <Mountain size={14} className="text-white" />
                    </div>
                    <span className="font-medium">Dino</span>
                </div>
                <nav className="flex items-center gap-6">
                    <a href="#features" className="text-sm text-gray-400 hover:text-white transition">Features</a>
                    <a href="#preview" className="text-sm text-gray-400 hover:text-white transition">Preview</a>
                    <button
                        onClick={handleGetStarted}
                        className="text-sm bg-white text-black px-4 py-1.5 rounded-lg font-medium hover:bg-gray-100 transition"
                    >
                        Sign in
                    </button>
                </nav>
            </header>

            <section className="flex flex-col items-center justify-center text-center px-6 py-32 gap-6">
                <div className="inline-flex items-center gap-2 text-xs text-gray-400 border border-white/10 px-3 py-1.5 rounded-full">
                    <Zap size={11} />
                    AI-powered climbing insights
                </div>
                <h1 className="text-5xl font-medium max-w-2xl leading-tight">
                    Track your climbing.<br />Understand your progress.
                </h1>
                <p className="text-gray-400 max-w-md text-base leading-relaxed">
                    Dino helps climbers log sessions, visualize grade progression across V-Scale, YDS, and French systems, and earn achievements along the way.
                </p>
                <div className="flex gap-3 mt-2">
                    <button
                        onClick={handleGetStarted}
                        className="bg-white text-black px-6 py-2.5 rounded-xl font-medium text-sm hover:bg-gray-100 transition"
                    >
                        Get started free
                    </button>
                    <a
                        href="#preview"
                        className="border border-white/10 px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-white/5 transition"
                    >
                        See preview
                    </a>
                </div>
            </section>

            <section id="features" className="px-8 py-20 border-t border-white/10">
                <div className="max-w-5xl mx-auto">
                    <p className="text-xs text-gray-500 uppercase tracking-widest text-center mb-12">Features</p>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <FeatureCard
                            icon={<BookOpen size={18} className="text-gray-300" />}
                            title="Session Logbook"
                            description="Log sessions and ascents with grades, attempts, style, and height. Master-detail layout keeps everything organized."
                        />
                        <FeatureCard
                            icon={<BarChart2 size={18} className="text-gray-300" />}
                            title="AI Insights"
                            description="Grade pyramid, attempt ratio, and volume charts with AI-generated summaries that analyze your performance."
                        />
                        <FeatureCard
                            icon={<Trophy size={18} className="text-gray-300" />}
                            title="Achievements"
                            description="23 achievements across total ascents, sessions, height climbed, and hardest grades per grading system."
                        />
                        <FeatureCard
                            icon={<Zap size={18} className="text-gray-300" />}
                            title="Grade Normalization"
                            description="Track grades across V-Scale, YDS, and French systems with a rank-based normalization engine."
                        />
                    </div>
                </div>
            </section>

            <section id="preview" className="px-8 py-20 border-t border-white/10">
                <div className="max-w-5xl mx-auto flex flex-col gap-12">
                    <p className="text-xs text-gray-500 uppercase tracking-widest text-center">Preview</p>

                    <div className="flex flex-col gap-4">
                        <p className="text-xs text-gray-500 uppercase tracking-widest">Dashboard</p>
                        <div className="border border-white/10 rounded-2xl overflow-hidden">
                            <img src="/Dashboard.gif" alt="Dashboard preview" className="w-full" />
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <p className="text-xs text-gray-500 uppercase tracking-widest">Logbook</p>
                        <div className="border border-white/10 rounded-2xl overflow-hidden">
                            <img src="/Logbook.gif" alt="Logbook preview" className="w-full" />
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <p className="text-xs text-gray-500 uppercase tracking-widest">Insights</p>
                        <div className="border border-white/10 rounded-2xl overflow-hidden">
                            <img src="/Insights.gif" alt="Insights preview" className="w-full" />
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <p className="text-xs text-gray-500 uppercase tracking-widest">Achievements</p>
                        <div className="border border-white/10 rounded-2xl overflow-hidden">
                            <img src="/Achievements.gif" alt="Achievements preview" className="w-full" />
                        </div>
                    </div>
                </div>
            </section>

            <footer className="px-8 py-16 border-t border-white/10 flex flex-col items-center gap-6">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
                        <Mountain size={14} className="text-white" />
                    </div>
                    <span className="font-medium">Dino</span>
                </div>
                <p className="text-sm text-gray-400 max-w-sm text-center">
                    A full-stack climbing analytics platform. Log, track, and understand your climbing performance.
                </p>
                <button
                    onClick={handleGetStarted}
                    className="bg-white text-black px-6 py-2.5 rounded-xl font-medium text-sm hover:bg-gray-100 transition"
                >
                    Start climbing smarter
                </button>
                <p className="text-xs text-gray-600 mt-4">
                    Built by <a href="https://asterino.dev" className="text-gray-400 hover:text-white transition">Carsen Asterino</a>
                </p>
            </footer>

        </div>
    );
}