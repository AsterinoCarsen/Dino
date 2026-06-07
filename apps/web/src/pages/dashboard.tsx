import ProtectedRoute from '../components/ProtectedRoute';
import TopNav from '../components/TopNav';
import StatCard from '../components/dashboard/StatCard';
import LastSessionSpotlight from '../components/dashboard/LastSessionSpotlight';
import RecentSessions from '../components/dashboard/RecentSessions';
import RecentlyEarned from '../components/dashboard/RecentlyEarned';
import { useSummary, useSessions, useEarnedAchievements, useSessionSpotlight } from '../lib/queries';

export default function Dashboard() {
    const { data: summary, isLoading: summaryLoading } = useSummary();
    const { data: sessions, isLoading: sessionsLoading } = useSessions();
    const { data: achievements, isLoading: achievementsLoading } = useEarnedAchievements();

    const lastSession = sessions?.[0] ?? null;
    const { data: spotlight } = useSessionSpotlight(lastSession?.id ?? null);

    const isLoading = summaryLoading || sessionsLoading || achievementsLoading;
    const lastAchievement = achievements?.[achievements.length - 1] ?? null;
    const highestVScale = summary?.highestGrades.find(g => g.gradeSystem === 'VScale');

    if (isLoading) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen bg-dino-dark text-dino-text flex items-center justify-center">
                    <p className="text-gray-400 text-sm">Loading...</p>
                </div>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-dino-dark text-dino-text">
                <TopNav />
                <main className="max-w-6xl mx-auto px-4 md:px-6 py-4 md:py-8 flex flex-col gap-6 md:gap-8 pb-6 md:pb-8">

                    <div>
                        <h1 className="text-2xl md:text-3xl font-medium">Dashboard</h1>
                        <p className="text-gray-400 mt-1 text-sm">Welcome back! Here's your climbing overview.</p>
                    </div>

                    {lastSession && (
                        <LastSessionSpotlight session={lastSession} spotlight={spotlight} />
                    )}

                    <div>
                        <h2 className="text-lg font-medium mb-4">All-Time Stats</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <StatCard label="Total Ascents" value={summary?.totalAscents ?? 0} />
                            <StatCard label="Total Height" value={`${summary?.totalHeight ?? 0}m`} />
                            <StatCard label="Total Sessions" value={summary?.totalSessions ?? 0} />
                            <StatCard
                                label="Hardest Send"
                                value={highestVScale?.highestGrade ?? '—'}
                            />
                        </div>
                    </div>

                    {sessions && sessions.length > 0 && (
                        <RecentSessions sessions={sessions} />
                    )}

                    {lastAchievement && (
                        <RecentlyEarned achievement={lastAchievement} />
                    )}

                </main>
            </div>
        </ProtectedRoute>
    );
}