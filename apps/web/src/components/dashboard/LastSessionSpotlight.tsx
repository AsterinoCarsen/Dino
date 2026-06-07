import { Session, SessionSpotlight } from '../../lib/types';

interface LastSessionSpotlightProps {
    session: Session;
    spotlight?: SessionSpotlight;
}

export default function LastSessionSpotlight({ session, spotlight }: LastSessionSpotlightProps) {
    const date = new Date(session.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });

    const ascents = session.ascents;
    const totalHeight = ascents.reduce((sum, a) => sum + a.height, 0);
    const flashes = ascents.filter(a => a.attempts === 1).length;
    const flashRate = ascents.length > 0 ? Math.round((flashes / ascents.length) * 100) : 0;
    const topAscent = ascents.length > 0 ? ascents[0] : null;

    const showPercentile = spotlight && spotlight.totalSessions >= 2;

    return (
        <div className="border border-dino-border rounded-2xl p-6 flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
                <div className="border-l-2 border-emerald-500 pl-5 py-1">
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Last Session Spotlight</p>
                    <p className="text-lg font-medium">{session.location}</p>
                    <p className="text-sm text-gray-400">{date}</p>
                </div>
                {showPercentile && (
                    <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-xl self-start">
                        <span className="text-sm font-medium">
                            Top {spotlight.percentile}% of your sessions
                        </span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/5 rounded-xl px-4 py-3">
                    <p className="text-xs text-gray-500 mb-1">Ascents</p>
                    <p className="text-2xl font-medium">{ascents.length}</p>
                </div>
                <div className="bg-white/5 rounded-xl px-4 py-3">
                    <p className="text-xs text-gray-500 mb-1">Height Climbed</p>
                    <p className="text-2xl font-medium">{totalHeight}m</p>
                </div>
                <div className="bg-white/5 rounded-xl px-4 py-3">
                    <p className="text-xs text-gray-500 mb-1">Flashes</p>
                    <p className="text-2xl font-medium">{flashes}
                        <span className="text-sm text-gray-400 font-normal ml-1">{flashRate}%</span>
                    </p>
                </div>
                <div className="bg-white/5 rounded-xl px-4 py-3">
                    <p className="text-xs text-gray-500 mb-1">Top Grade</p>
                    <p className="text-2xl font-medium">{topAscent?.grade ?? '—'}</p>
                    {topAscent && (
                        <p className="text-xs text-gray-500 mt-0.5">{topAscent.gradeSystem}</p>
                    )}
                </div>
            </div>

            {ascents.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-2">No ascents logged this session yet.</p>
            )}
        </div>
    );
}