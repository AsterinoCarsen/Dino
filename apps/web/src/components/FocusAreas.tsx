import Card from "./Card"
import { AscentItemType } from "@/lib/performance/getAscensionsType";
import { useMemo } from "react";

interface FocusAreasProps {
    ascensions: AscentItemType[];
}

export default function FocusAreas({ ascensions }: FocusAreasProps) {
    const lowestSuccess = useMemo(() => {
        if (ascensions.length === 0) return null;

        const stats: Record<string, { total: number; count: number }> = {};

        for (const asc of ascensions) {
            if (!asc.style) continue;

            if (!stats[asc.style]) {
                stats[asc.style] = { total: 0, count: 0 };
            }

            const successRate = asc.attempts > 0 ? 1 / asc.attempts : 0;
            stats[asc.style].total += successRate;
            stats[asc.style].count += 1;
        }

        const averages = Object.entries(stats).map(([style, { total, count }]) => ({
            style,
            rate: total / count,
        }));

        return averages.reduce((min, curr) => (curr.rate < min.rate ? curr : min));
    }, [ascensions]);

    const lowestClimbedThisMonth = useMemo(() => {
        if (ascensions.length === 0) return null;

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const thisMonthAsc = ascensions.filter(asc => {
            const date = new Date(asc.date_climbed);
            return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        });

        if (thisMonthAsc.length === 0) return null;

        const styleCounts: Record<string, number> = {};
        for (const asc of thisMonthAsc) {
            if (!asc.style) continue;
            styleCounts[asc.style] = (styleCounts[asc.style] || 0) + 1;
        }

        const total = thisMonthAsc.length;
        const percentages = Object.entries(styleCounts).map(([style, count]) => ({
            style,
            percent: (count / total) * 100,
        }));

        return percentages.reduce((min, curr) => (curr.percent < min.percent ? curr : min));
    }, [ascensions])

    return (
        <Card title="Focus Areas">
            <ul className="space-y-2">
                {lowestSuccess && (
                    <li className="bg-white/5 p-3 rounded-lg border border-dino-border">
                        {lowestSuccess.style} {" endurance "} 
                        <span className="text-red-400">
                            ({(lowestSuccess.rate * 100).toFixed(1)}% success rate)
                        </span>
                    </li>
                )}
                {lowestClimbedThisMonth && (
                    <li className="bg-white/5 p-3 rounded-lg border border-dino-border">
                        {lowestClimbedThisMonth.style} under exposure
                        <span className="text-red-400">
                            {" "}(Only {lowestClimbedThisMonth.percent.toFixed(1)}%{" "}climbs this month)
                        </span>
                    </li>
                )}
            </ul>
            <a href="#" className="inline-block mt-4 text-emerald-400 hover:underline">
                View Full Insights →
            </a>
        </Card>
    );
}
