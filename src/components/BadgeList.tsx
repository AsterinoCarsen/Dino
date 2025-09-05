import Badge from "./Badge";
import Card from "./Card";
import { useEffect, useState } from "react";

interface BadgeListProps {
    public_id: string | null;
}

interface Badge {
    id: number;
    title: string;
    description: string;
    icon_key: string;
    earned_at: string;
}

export default function BadgeList({ public_id }: BadgeListProps) {
    const [badges, setBadges] = useState<Badge[]>([]);

    useEffect(() => {
        async function fetchBadges() {
            if (!public_id) return;

            try {
                const response = await fetch(`/api/badges/getBadges?public_id=${public_id}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                const data = await response.json();
                setBadges(data.badges);
            } catch (error) {
                console.error(error);
            }
        }

        fetchBadges();
    }, [public_id]);

    const formatDate = (isoString: string): string => {
        const date = new Date(isoString);
        return date.toISOString().split("T")[0];
    }

    return (
        <Card title="Badges Earned This Week">
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