import { useRouter } from "next/router"

export default function SideBar() {
    const router = useRouter();

    const handleGoHome = () => {
        router.push("/");
    }

    const handleGoLogBook = () => {
        router.push("logbook");
    }

    const handleGoDashboard = () => {
        router.push("/dashboard");
    }

    const handleGoProfile = () => {
        router.push("/profile");
    }
    
    const handleGoInsights = () => {
        router.push("/insights");
    }

    const handleSignOut = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("ascents");
        router.push("/authenticate");
    }

    return (
        <aside className="w-56 flex-shrink-0 border-r border-dino-border p-6 flex flex-col">
            <button onClick={handleGoHome} className="text-3xl cursor-pointer hover:text-gray-400 transition text-left font-bold mb-12">Dino</button>
            <nav className="flex flex-col space-y-6">
                <a onClick={handleGoDashboard} className="text-gray-400 cursor-pointer hover:text-white font-semibold transition">Dashboard</a>
                <a onClick={handleGoLogBook} className="text-gray-400 cursor-pointer hover:text-white font-semibold transition">Logbook</a>
                <a onClick={handleGoInsights} className="text-gray-400 cursor-pointer hover:text-white font-semibold transition">Insights</a>
                <a onClick={handleGoProfile} className="text-gray-400 cursor-pointer hover:text-white font-semibold transition">Profile</a>
                <button onClick={handleSignOut} className="text-gray-400 cursor-pointer text-left hover:text-white font-semibold transition">Sign Out</button>
            </nav>
        </aside>
    )
}