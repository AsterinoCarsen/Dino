import Link from 'next/link';
import { useRouter } from 'next/router';
import { LayoutDashboard, BookOpen, BarChart2, Trophy, LogOut } from 'lucide-react';
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

    const handleLogout = () => {
        clearAuth();
        router.push('/');
    };

    return (
        <nav className="flex items-center justify-between px-6 py-3 border-b border-dino-border">
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
                {user && (
                    <span className="text-sm text-gray-400">{user.username}</span>
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
    );
}