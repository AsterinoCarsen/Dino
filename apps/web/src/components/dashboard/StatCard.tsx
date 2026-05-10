interface StatCardProps {
    label: string;
    value: string | number;
}

export default function StatCard({ label, value }: StatCardProps) {
    return (
        <div className="border border-dino-border rounded-xl p-6">
            <p className="text-sm text-gray-400 mb-3">{label}</p>
            <p className="text-4xl font-medium">{value}</p>
        </div>
    );
}