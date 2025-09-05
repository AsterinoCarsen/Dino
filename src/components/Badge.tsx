import { Icon } from "@iconify/react";

interface BadgeProps {
  icon: string;
  label: string;
  description?: string;
  achievedAt: string;
}

export default function Badge({ icon, label, description, achievedAt }: BadgeProps) {
  return (
    <div className="flex flex-col gap-2 bg-white/5 px-4 py-3 rounded-xl border border-dino-border shadow-sm hover:shadow-md transition">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Icon className="w-7 h-7 text-emerald-400" icon={icon} />
        <span className="text-sm font-semibold">{label}</span>
      </div>

      {/* Description */}
      {description && (
        <p className="text-xs text-gray-300 leading-snug">
          {description}
        </p>
      )}

      {/* Date */}
      {achievedAt && (
        <span className="text-[11px] text-gray-400 italic">
          Achieved {achievedAt}
        </span>
      )}
    </div>
  );
}
