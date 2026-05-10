import { Trophy } from 'lucide-react';
import { UserAchievement } from '../../lib/types';

interface RecentlyEarnedProps {
    achievement: UserAchievement;
}

export default function RecentlyEarned({ achievement }: RecentlyEarnedProps) {
    const date = new Date(achievement.earnedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

    return (
        <div className="border-l-2 border-purple-500 pl-5 py-1">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">Recently Earned</p>
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                    <Trophy size={20} className="text-purple-400" />
                </div>
                <div>
                    <p className="text-sm font-medium">{achievement.title}</p>
                    <p className="text-xs text-gray-400">{achievement.description}</p>
                    <p className="text-xs text-gray-400 mt-1">Earned on {date}</p>
                </div>
            </div>
        </div>
    );
}