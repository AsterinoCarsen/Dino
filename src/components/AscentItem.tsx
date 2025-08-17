interface AscentItemProps {
    name: string;
    grade: string;
    type: string;
    date: string;
    attempts: number;
    style: string;
}

export default function AscentItem({
    name,
    grade,
    type,
    date,
    attempts,
    style
}: AscentItemProps) {
    return (
        <div className="bg-white/5 rounded-lg p-4 border border-dino-border shadow-inner">
            <p className="font-semibold">
                {name} ({grade}) — {type}
            </p>
            <p className="text-gray-400 text-sm">
                {date} | Attempts: {attempts} | Style: {style}
            </p>
        </div>
    );
}
