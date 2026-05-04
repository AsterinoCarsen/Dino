import { useRouter } from "next/router";
import { FormEvent } from "react";
import Image from "next/image";

interface VerifyResponseBody {
    success: boolean;
    message: string;
}

export default function Home() {
    const router = useRouter();

    const handleRedirectAuthPage = async (e: FormEvent) => {
        e.preventDefault();
        
        const token = localStorage.getItem("token");

        if (token) {
            const response = await fetch("/api/auth/verify", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token })
            });

            const data: VerifyResponseBody = await response.json();

            if (data.success) {
                router.push("/dashboard");
            } else {
                router.push("/authenticate");
            }
        } else {
            router.push("/authenticate");
        }
    }

    return (
        <div className="min-h-screen bg-dino-dark text-dino-text flex flex-col">
            {/* Navigation */}
            <header className="flex justify-between items-center px-35 py-6 border-b border-dino-border">
                <h1 className="text-3xl font-bold">Dino</h1>
                <nav className="flex gap-8 items-center">
                    <a href="#" className="text-gray-400 hover:text-white transition">Features</a>
                    <a href="#" className="text-gray-400 hover:text-white transition">Screenshots</a>
                    <a href="#" className="text-gray-400 hover:text-white transition">About</a>
                    <button onClick={handleRedirectAuthPage} className="bg-emerald-500 cursor-pointer hover:bg-emerald-600 px-6 py-2 rounded-full font-semibold transition">Sign In</button>
                </nav>
            </header>

            {/* Hero Section */}
            <section className="flex flex-col md:flex-row items-center justify-between px-35 py-20">
                <div className="max-w-xl">
                    <h2 className="text-5xl font-bold mb-6">Track Your Climbing, Crush Your Goals</h2>
                    <p className="text-gray-400 text-lg mb-8">
                        Dino helps climbers log ascents, monitor progress, and unlock new achievements with
                        beautiful insights and detailed stats.
                    </p>
                    <div className="flex gap-4">
                        <button onClick={handleRedirectAuthPage} className="bg-emerald-500 hover:bg-emerald-600 px-8 py-3 rounded-full font-semibold transition">
                            Get Started
                        </button>
                        <a href="#features" className="bg-white/5 hover:bg-white/10 border border-dino-border px-8 py-3 rounded-full font-semibold transition">
                            Learn More
                        </a>
                    </div>
                </div>
                <div className="mt-12 md:mt-0 md:ml-12">
                    <div className="relative w-[500px] h-[330px] rounded-xl overflow-hidden border border-dino-border shadow-lg">
                        <Image
                            src="/hero.png"
                            alt="Dino App Hero Preview"
                            fill
                            className="object-contain object-center"
                            priority
                        />
                    </div>
                </div>
            </section>

            {/* Features */}
            <section id="features" className="px-35 py-16 border-t border-dino-border">
                <h3 className="text-3xl font-semibold mb-12 text-center">Why Climbers Love Dino</h3>
                <div className="grid md:grid-cols-3 gap-8">
                    <FeatureCard title="Detailed Logbook" description="Track every climb with grades, attempts, style, and notes to analyze your performance over time." />
                    <FeatureCard title="Insightful Analytics" description="Visualize your grade progression, volume, and strengths/weaknesses with interactive charts." />
                    <FeatureCard title="Earn Achievements" description="Push yourself with milestone badges and share your climbing journey with friends." />
                </div>
            </section>

            {/* Screenshot Preview */}
            <section id="screenshots" className="px-35 py-16 border-t border-dino-border">
                <h3 className="text-3xl font-semibold mb-12 text-center">Take a Peek Inside</h3>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="relative w-full aspect-[1546/531] bg-white/5 border border-dino-border rounded-xl flex items-center justify-center text-gray-500">
                        <Image
                            src="/index1.png"
                            alt="Dino App Hero Preview"
                            fill
                            className="object-contain object-center"
                            priority
                        />
                    </div>
                    <div className="relative w-full aspect-[1550/664] bg-white/5 border border-dino-border rounded-xl flex items-center justify-center text-gray-500">
                        <Image
                            src="/index2.png"
                            alt="Dino App Hero Preview"
                            fill
                            className="object-contain object-center"
                            priority
                        />
                    </div>
                    <div className="relative w-full aspect-[1541/765] bg-white/5 border border-dino-border rounded-xl flex items-center justify-center text-gray-500">
                        <Image
                            src="/index3.png"
                            alt="Dino App Hero Preview"
                            fill
                            className="object-contain object-center"
                            priority
                        />
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <footer className="px-12 py-16 border-t border-dino-border text-center">
                <h3 className="text-3xl font-semibold mb-4">Ready to Climb Smarter?</h3>
                <p className="text-gray-400 mb-8">Join now and take your climbing to the next level.</p>
                <button onClick={handleRedirectAuthPage} className="bg-emerald-500 hover:bg-emerald-600 px-8 py-3 rounded-full font-semibold transition">
                    Sign Up for Free
                </button>
            </footer>
        </div>
    );
}

/* Components */
function FeatureCard({ title, description }: { title: string; description: string }) {
    return (
        <div className="bg-white/5 p-6 rounded-xl border border-dino-border hover:bg-white/10 transition shadow-lg hover:shadow-xl">
            <h4 className="text-xl font-semibold mb-2">{title}</h4>
            <p className="text-gray-400">{description}</p>
        </div>
    );
}
