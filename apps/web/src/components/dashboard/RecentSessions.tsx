import { useRouter } from 'next/router';
import { MapPin } from 'lucide-react';
import { Session } from '../../lib/types';

interface RecentSessionsProps {
    sessions: Session[];
}

export default function RecentSessions({ sessions }: RecentSessionsProps) {
    const router = useRouter();

    return (
        <div>
            <h2 className="text-lg font-medium mb-4">Recent Sessions</h2>
            <div className="border border-dino-border rounded-xl overflow-hidden">
                {sessions.slice(0, 4).map((session, index) => {
                    const date = new Date(session.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                    });

                    return (
                        <div
                            key={session.id}
                            onClick={() => router.push(`/logbook?session=${session.id}`)}
                            className={`flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-white/5 transition ${
                                index !== sessions.slice(0, 4).length - 1
                                    ? 'border-b border-dino-border'
                                    : ''
                            }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                    <MapPin size={14} className="text-gray-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">{session.location}</p>
                                    <p className="text-xs text-gray-400">{date}</p>
                                </div>
                            </div>
                            <span className="text-xs text-gray-400 border border-dino-border px-3 py-1 rounded-full">
                                {session.ascents.length} ascents
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}