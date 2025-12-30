import React, { useMemo } from "react";
import StatCard from "./StatCard";
import { AscentItemType } from "@/lib/performance/getAscensionsType";
import { getHigherGrade } from "@/lib/performance/compareGrades";
import { calculateElo, calculateEloChange } from "@/lib/performance/calculateElo";

interface ClimbingSummaryProps {
    ascensions: AscentItemType[];
}

const getVolume = (ascensions: AscentItemType[], since: Date) =>
    ascensions
        .filter(a => new Date(a.date_climbed) >= since)
        .reduce((sum, a) => sum + (a.height_ft || 0), 0);

const getBestGrade = (ascensions: AscentItemType[], type: "boulder" | "route") => {
    const grades = ascensions
        .map(a => a.grade)
        .filter(g => {
            if (!g) return false;
            g = g.toLowerCase();
            return type === "boulder" ? (g.startsWith("v")) : g.startsWith("5");
        });

    return grades.reduce((highest, grade) => {
        if (!highest) return grade;
        return getHigherGrade(highest, grade);
    }, "");
};

const getAvgAttempts = (ascensions: AscentItemType[]) =>
    ascensions.length > 0
        ? ascensions.reduce((sum, a) => sum + (Number(a.attempts) || 1), 0) / ascensions.length
        : 0;

const getEloStats = (ascensions: AscentItemType[]) => ({
    currentELO: Math.round(calculateElo(ascensions)),
    eloChange: Math.round(calculateEloChange(ascensions)),
});

const ClimbingSummary: React.FC<ClimbingSummaryProps> = ({ ascensions }) => {
    const sevenDaysAgo = useMemo(() => {
        const date = new Date();
        date.setDate(date.getDate() - 7);
        return date;
    }, []);

    const last14Days = useMemo(
        () => ascensions.filter(a => {
            const date = new Date(a.date_climbed);
            return date >= new Date(sevenDaysAgo.getTime() - 7 * 24 * 60 * 60 * 1000);
        }),
        [ascensions, sevenDaysAgo]
    );

    const formatChange = (value: number | string) =>
        parseInt(value.toString()) >= 0 ? `+${value}` : `${value}`;

    const stats = useMemo(() => {
        if (!ascensions || ascensions.length === 0) {
            return {
                volume: 0,
                bestBoulder: "",
                bestRoute: "",
                avgAttempts: 0,
                currentELO: "N/A",
                volumeChange: 0,
                avgAttemptsChange: 0,
                eloChange: "+0 this week",
            };
        }

        const last7Days = ascensions.filter(a => new Date(a.date_climbed) >= sevenDaysAgo);
        const prevWeek = last14Days.filter(a => new Date(a.date_climbed) < sevenDaysAgo);

        const volume = getVolume(ascensions, sevenDaysAgo);
        const prevVolume = getVolume(prevWeek, new Date(0));
        const volumeChange = volume - prevVolume;

        const bestBoulder = getBestGrade(ascensions, "boulder");
        const bestRoute = getBestGrade(ascensions, "route");

        const avgAttempts = getAvgAttempts(ascensions);
        const prevAvgAttempts = getAvgAttempts(prevWeek);
        const avgAttemptsChange = avgAttempts - prevAvgAttempts;

        const { currentELO, eloChange } = getEloStats(ascensions);

        return {
            volume,
            bestBoulder,
            bestRoute,
            avgAttempts: avgAttempts.toFixed(1),
            currentELO,
            volumeChange,
            avgAttemptsChange: avgAttemptsChange.toFixed(1),
            eloChange,
        };
    }, [ascensions, sevenDaysAgo, last14Days]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
                label="Climbing Volume (Last 7 days)"
                value={stats.volume.toString() + " ft"}
                change={formatChange(stats.volumeChange) + " ft this week"}
            />
            <StatCard
                label="Best Grade"
                value={`${stats.bestBoulder || "N/A"}, ${stats.bestRoute || "N/A"}`}
                change=""
            />
            <StatCard
                label="Avg Attempts/Send"
                value={stats.avgAttempts.toString()}
                change={formatChange(stats.avgAttemptsChange) + " this week"}
            />
            <StatCard
                label="Current ELO"
                value={stats.currentELO.toString()}
                change={formatChange(stats.eloChange.toString()) + " this week"}
            />
        </div>
    );
};

export default ClimbingSummary;
