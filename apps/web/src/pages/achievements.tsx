import { useState } from 'react';
import { Trophy, Lock, Mountain, Zap } from 'lucide-react';
import ProtectedRoute from '../components/ProtectedRoute';
import TopNav from '../components/TopNav';
import { useAchievementProgress } from '../lib/queries';
import { AchievementProgress } from '../lib/types';

type Filter = 'All' | 'Earned' | 'Locked';

function getIcon(condition: string, earned: boolean) {
    const cls = `w-6 h-6 ${earned ? 'text-gray-800' : 'text-gray-400'}`;
    switch (condition) {
        case 'TotalAscents': return <Mountain className={cls} />;
        case 'TotalSessions': return <Mountain className={cls} />;
        case 'HighestGrade': return <Zap className={cls} />;
        case 'TotalHeight': return <Mountain className={cls} />;
        default: return <Trophy className={cls} />;
    }
}

function AchievementCard({ achievement }: { achievement: AchievementProgress }) {
    const { title, description, earned, earnedAt, currentProgress, threshold, condition } = achievement;
    const progress = Math.min(currentProgress / threshold, 1);
    const isGradeCondition = condition === 'HighestGrade';

    const formatProgress = () => {
        if (isGradeCondition) return `${currentProgress}/${threshold}`;
        switch (condition) {
            case 'TotalAscents': return `${currentProgress}/${threshold} ascents`;
            case 'TotalSessions': return `${currentProgress}/${threshold} sessions`;
            case 'TotalHeight': return `${currentProgress}/${threshold}m`;
            default: return `${currentProgress}/${threshold}`;
        }
    };

    const earnedDate = earnedAt
        ? new Date(earnedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : null;

    return (
        <div className={`border rounded-2xl p-5 flex flex-col gap-4 transition ${
            earned
                ? 'border-dino-border bg-white/5'
                : 'border-dino-border opacity-70'
        }`}>
            <div className="flex justify-between items-start">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    earned ? 'bg-white/10' : 'bg-white/5'
                }`}>
                    {earned
                        ? getIcon(condition, true)
                        : <Lock className="w-5 h-5 text-gray-500" />
                    }
                </div>
                {earned && (
                    <span className="text-xs text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                        Unlocked
                    </span>
                )}
            </div>

            <div>
                <p className="font-medium text-sm">{title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{description}</p>
                {earned && earnedDate && (
                    <p className="text-xs text-gray-500 mt-1">Earned on {earnedDate}</p>
                )}
            </div>

            {!earned && (
                <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                        <p className="text-xs text-gray-500">Progress</p>
                        <p className="text-xs text-gray-500">{formatProgress()}</p>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-emerald-500 rounded-full transition-all"
                            style={{ width: `${progress * 100}%` }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default function Achievements() {
    const [filter, setFilter] = useState<Filter>('All');
    const { data: achievements, isLoading } = useAchievementProgress();

    const earned = achievements?.filter(a => a.earned) ?? [];
    const locked = achievements?.filter(a => !a.earned) ?? [];

    const filtered = filter === 'All'
        ? [...(achievements ?? [])].sort((a, b) => {
            if (a.earned && !b.earned) return -1;
            if (!a.earned && b.earned) return 1;
            return 0;
        })
        : filter === 'Earned'
            ? earned
            : locked;

    const filters: { label: Filter; count: number }[] = [
        { label: 'All', count: achievements?.length ?? 0 },
        { label: 'Earned', count: earned.length },
        { label: 'Locked', count: locked.length },
    ];

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-dino-dark text-dino-text">
                <TopNav />
                <main className="max-w-5xl mx-auto px-4 md:px-6 py-4 md:py-8 pb-6 md:pb-8 flex flex-col gap-6">

                    <div>
                        <h1 className="text-2xl md:text-3xl font-medium">Achievements</h1>
                        {achievements && (
                            <p className="text-gray-400 mt-1 text-sm">
                                {earned.length} of {achievements.length} achievements unlocked
                                ({Math.round((earned.length / achievements.length) * 100)}%)
                            </p>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {filters.map(({ label, count }) => (
                            <button
                                key={label}
                                onClick={() => setFilter(label)}
                                className={`text-sm px-4 py-1.5 rounded-lg border transition ${
                                    filter === label
                                        ? 'border-white/30 text-white bg-white/10'
                                        : 'border-dino-border text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                {label} ({count})
                            </button>
                        ))}
                    </div>

                    {isLoading ? (
                        <p className="text-gray-400 text-sm">Loading achievements...</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {filtered.map(achievement => (
                                <AchievementCard key={achievement.id} achievement={achievement} />
                            ))}
                        </div>
                    )}

                </main>
            </div>
        </ProtectedRoute>
    );
}