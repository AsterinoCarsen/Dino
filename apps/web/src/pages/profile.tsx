import { LogOut, User } from 'lucide-react';
import ProtectedRoute from '../components/ProtectedRoute';
import TopNav from '../components/TopNav';
import { useAuth } from '../lib/hooks/useAuth';
import { useSummary } from '../lib/queries';

export default function Profile() {
    const { user, logout } = useAuth();
    const { data: summary } = useSummary();

    const joinDate = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
          })
        : null;

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-dino-dark text-dino-text">
                <TopNav />
                <main className="max-w-2xl mx-auto px-6 py-8 flex flex-col gap-6">

                    <h1 className="text-3xl font-medium">Profile</h1>

                    <div className="border border-dino-border rounded-2xl p-6 flex flex-col gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-2xl font-medium">
                                {user?.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="text-xl font-medium">{user?.username}</p>
                                {joinDate && (
                                    <p className="text-sm text-gray-400 mt-0.5">Member since {joinDate}</p>
                                )}
                            </div>
                        </div>

                        {summary && (
                            <div className="grid grid-cols-3 gap-3 border-t border-dino-border pt-6">
                                <div className="bg-white/5 rounded-xl px-4 py-3">
                                    <p className="text-xs text-gray-500 mb-1">Total Ascents</p>
                                    <p className="text-xl font-medium">{summary.totalAscents}</p>
                                </div>
                                <div className="bg-white/5 rounded-xl px-4 py-3">
                                    <p className="text-xs text-gray-500 mb-1">Total Sessions</p>
                                    <p className="text-xl font-medium">{summary.totalSessions}</p>
                                </div>
                                <div className="bg-white/5 rounded-xl px-4 py-3">
                                    <p className="text-xs text-gray-500 mb-1">Height Climbed</p>
                                    <p className="text-xl font-medium">{summary.totalHeight}m</p>
                                </div>
                            </div>
                        )}

                        {summary && summary.highestGrades.length > 0 && (
                            <div className="border-t border-dino-border pt-6">
                                <p className="text-xs text-gray-500 mb-3">Hardest Sends</p>
                                <div className="flex gap-3">
                                    {summary.highestGrades.map(g => (
                                        <div key={g.gradeSystem} className="bg-white/5 rounded-xl px-4 py-3">
                                            <p className="text-xs text-gray-500 mb-1">{g.gradeSystem}</p>
                                            <p className="text-xl font-medium">{g.highestGrade}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="border border-dino-border rounded-2xl p-6">
                        <p className="text-sm font-medium mb-4">Account</p>
                        <button
                            onClick={logout}
                            className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition"
                        >
                            <LogOut size={15} />
                            Sign out
                        </button>
                    </div>

                </main>
            </div>
        </ProtectedRoute>
    );
}