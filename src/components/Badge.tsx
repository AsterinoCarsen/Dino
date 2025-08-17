interface BadgeProps {
  icon: string;
  label: string;
}

export default function Badge({ icon, label }: BadgeProps) {
    return (
        <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-dino-border">
            <span>{icon}</span>
            <span className="text-sm">{label}</span>
        </div>
    );
}
