interface StatCardProps {
  label: string;
  value: string;
  change?: string;
}

export default function StatCard({ label, value, change }: StatCardProps) {
    const isPositive = change?.startsWith('+');
    const changeColor = isPositive ? 'text-emerald-400' : 'text-red-400';

    return (
        <div className="bg-white/5 rounded-lg p-4 border border-dino-border shadow-inner">
            <p className="text-gray-400 text-sm">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
            {change && <p className={`${changeColor} text-sm`}>{change}</p>}
        </div>
    );
}
