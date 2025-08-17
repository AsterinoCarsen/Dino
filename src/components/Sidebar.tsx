import { useRouter } from "next/router"

export default function SideBar() {
    const router = useRouter();

    const handleGoHome = () => {
        router.push("/");
    }

    const handleSignOut = () => {
        localStorage.removeItem("token");
        router.push("/authenticate");
    }

    return (
        <aside className="w-56 flex-shrink-0 border-r border-dino-border p-6 flex flex-col">
            <button onClick={handleGoHome} className="text-3xl cursor-pointer hover:text-gray-400 transition text-left font-bold mb-12">Dino</button>
            <nav className="flex flex-col space-y-6">
                <a href="#" className="text-gray-400 hover:text-white font-semibold transition">Dashboard</a>
                <a href="#" className="text-gray-400 hover:text-white font-semibold transition">Logbook</a>
                <a href="#" className="text-gray-400 hover:text-white font-semibold transition">Insights</a>
                <a href="#" className="text-gray-400 hover:text-white font-semibold transition">Profile</a>
                <button onClick={handleSignOut} className="text-gray-400 text-left hover:text-white font-semibold transition">Sign Out</button>
            </nav>
        </aside>
    )
}