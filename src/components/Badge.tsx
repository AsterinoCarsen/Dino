interface BadgeProps {
  icon: string;
  label: string;
  achievedAt: string;
}

export default function Badge({ icon, label, achievedAt }: BadgeProps) {
  return (
    <div className="flex flex-col gap-1 bg-white/5 px-3 py-2 rounded-xl border border-dino-border">
      <div className="flex items-center gap-2">
        <span>{icon}</span>
        <span className="text-sm font-medium">{label}</span>
      </div>
      {achievedAt && (
        <span className="text-xs text-gray-400 italic">
          Achieved {achievedAt}
        </span>
      )}
    </div>
  );
}
