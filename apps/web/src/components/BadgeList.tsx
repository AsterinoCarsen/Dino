import Badge from "./Badge";
import Card from "./Card";

interface BadgeListProps {
    badges: Badge[];
}

interface Badge {
    id: number;
    title: string;
    description: string;
    icon_key: string;
    earned_at: string;
}

export default function BadgeList({ badges }: BadgeListProps) {
    const formatDate = (isoString: string): string => {
        const date = new Date(isoString);
        return date.toISOString().split("T")[0];
    }

    return (
        <Card title="Badges">
            <div className="flex flex-wrap gap-3">
                {badges.map((badge) => (
                    <Badge
                        key={badge.id}
                        icon={badge.icon_key}
                        label={badge.title}
                        achievedAt={formatDate(badge.earned_at)}
                        description={badge.description}
                    />
                ))}
            </div>
        </Card>
    )
}