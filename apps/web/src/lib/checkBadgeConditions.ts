import badgeData from "./badges.json";
import { getPublicId } from "./decodeToken";
import { NewAscension } from "./performance/getAscensionsType";

interface EarnedBadge {
    title: string;
    icon_key: string;
    earned_at: string;
    description: string;
}

export async function checkBadgeCondition(ascensions: NewAscension[]) {
    const totalSends = ascensions.length;
    const newBadges: EarnedBadge[] = [];

    const token = localStorage.getItem("token");
    if (!token) return;
    const public_id = getPublicId(token);

    const response = await fetch(`/api/badges/getBadges?public_id=${public_id}`);
    const data = await response.json();

    const alreadyEarned: EarnedBadge[] = data.success ? data.badges : [];

    for (const badge of badgeData) {
        const already = alreadyEarned.find((b) => b.title === badge.title);
        if (already) continue;

        const condition = badge.condition;
        if (condition.total_sends && totalSends >= condition.total_sends) {
            newBadges.push({
                title: badge.title,
                icon_key: badge.icon_key,
                earned_at: new Date().toISOString(),
                description: badge.description
            });
        }
    }

    return newBadges;
}