import { Session } from '../../lib/types';

interface LastSessionSpotlightProps {
    session: Session;
}

export default function LastSessionSpotlight({ session }: LastSessionSpotlightProps) {
    const date = new Date(session.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });

    const topGrade = session.ascents.length > 0
        ? session.ascents[session.ascents.length - 1].grade
        : null;

    return (
        <div className="border-l-2 border-emerald-500 pl-5 py-1">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Last Session Spotlight</p>
            <p className="text-lg font-medium">{session.location}</p>
            <p className="text-sm text-gray-400 mb-4">{date}</p>
            <p className="text-4xl font-medium mb-1">{session.ascents.length} ascents logged</p>
            {topGrade && (
                <p className="text-sm text-gray-400">Top grade: {topGrade}</p>
            )}
        </div>
    );
}