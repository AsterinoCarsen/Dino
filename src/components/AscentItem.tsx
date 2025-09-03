interface AscentItemProps {
  name: string;
  grade: string;
  type: string;
  date: string;
  attempts: number;
  style: string;
  onDelete?: () => void;
}

export default function AscentItem({
  name,
  grade,
  type,
  date,
  attempts,
  style,
  onDelete,
}: AscentItemProps) {
  return (
    <div className="flex items-center justify-between bg-white/5 rounded-lg p-4 border border-dino-border shadow-inner">
        <div>
            <p className="font-semibold">
            {name} ({grade}) — {type}
            </p>
            <p className="text-gray-400 text-sm">
            {date} | Attempts: {attempts} | Style: {style}
            </p>
        </div>

        <button
            onClick={onDelete}
            className="ml-4 text-red-400 hover:underline transition"
            aria-label="Delete ascent"
        >
            Delete
        </button>
    </div>
  );
}
