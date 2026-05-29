import Link from 'next/link';
import { useRouter } from 'next/router';
import { LayoutDashboard, BookOpen, BarChart2, Trophy, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import useAuthStore from '../lib/store/authStore';

const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Logbook', href: '/logbook', icon: BookOpen },
    { label: 'Insights', href: '/insights', icon: BarChart2 },
    { label: 'Achievements', href: '/achievements', icon: Trophy },
];

export default function TopNav() {
    const router = useRouter();
    const { clearAuth, user } = useAuthStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleLogout = () => {
        clearAuth();
        router.push('/');
    };

    return (
        <>
            {/* Desktop top nav */}
            <nav className="hidden md:flex items-center justify-between px-6 py-3 border-b border-dino-border">
                <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold">Dino</span>
                </div>

                <div className="flex items-center gap-1">
                    {navItems.map((item) => {
                        const isActive = router.pathname === item.href;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                                    isActive
                                        ? 'bg-white text-black'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <Icon size={15} />
                                {item.label}
                            </Link>
                        );
                    })}
                </div>

                <div className="flex items-center gap-3">
                    {mounted && user && (
                        <Link
                            href="/profile"
                            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition"
                        >
                            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs font-medium text-white">
                                {user.username.charAt(0).toUpperCase()}
                            </div>
                            {user.username}
                        </Link>
                    )}
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition"
                    >
                        <LogOut size={15} />
                        Sign out
                    </button>
                </div>
            </nav>

            {/* Mobile top bar */}
            <nav className="md:hidden flex items-center justify-between px-4 py-3 border-b border-dino-border">
                <span className="text-lg font-semibold">Dino</span>
                <div className="flex items-center gap-3">
                    {mounted && user && (
                        <Link
                            href="/profile"
                            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition"
                        >
                            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs font-medium text-white">
                                {user.username.charAt(0).toUpperCase()}
                            </div>
                        </Link>
                    )}
                    <button
                        onClick={handleLogout}
                        className="text-gray-400 hover:text-white transition"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </nav>

            {/* Mobile bottom nav */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-dino-dark border-t border-dino-border flex items-center justify-around px-2 py-2">
                {navItems.map((item) => {
                    const isActive = router.pathname === item.href;
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition ${
                                isActive ? 'text-white' : 'text-gray-500'
                            }`}
                        >
                            <Icon size={20} />
                            <span className="text-xs font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </>
    );
}