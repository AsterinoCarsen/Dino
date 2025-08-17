import React, { useMemo } from "react";
import StatCard from "./StatCard";
import { AscentItemType } from "@/lib/performance/getAscensionsType";
import { getHigherGrade } from "@/lib/performance/compareGrades";

interface ClimbingSummaryProps {
    ascensions: AscentItemType[];
}

const ClimbingSummary: React.FC<ClimbingSummaryProps> = ({ ascensions }) => {
    const sevenDaysAgo = useMemo(() => {
        const date = new Date();
        date.setDate(date.getDate() - 7);
        return date;
    }, []);

    const last14Days = ascensions.filter(a => {
        const date = new Date(a.date_climbed);
        return date >= new Date(sevenDaysAgo.getTime() - 7 * 24 * 60 * 60 * 1000);
    });

    const formatChange = (value: number | string) => (parseInt(value.toString()) >= 0 ? `+${value}` : `-${value}`);

    const stats = useMemo(() => {
        if (!ascensions || ascensions.length === 0) {
            return {
                volume: 0,
                bestRouteGrade: "",
                bestBoulderGrade: "",
                avgAttempts: 0,
                currentELO: 1420, // placeholder
                volumeChange: 0,
                bestGradeChange: "",
                avgAttemptsChange: 0,
                eloChange: "+0 this week",
            };
        }

        const last7Days = ascensions.filter(a => new Date(a.date_climbed) >= sevenDaysAgo);

        const volume = last7Days.reduce((sum, a) => sum + (a.height_ft || 0), 0);

        const boulderGrades = ascensions.map(a => a.grade)
            .filter(g => g && (g.startsWith("V") || g.toUpperCase() === "VB"));

        const routeGrades = ascensions.map(a => a.grade)
            .filter(g => g && g.startsWith("5"));

        const bestBoulder = boulderGrades.reduce((highest, grade) => {
            if (!highest) return grade;
            return getHigherGrade(highest, grade);
        }, "");

        const bestRoute = routeGrades.reduce((highest, grade) => {
            if (!highest) return grade;
            return getHigherGrade(highest, grade);
        }, "");

        const avgAttempts = ascensions.length > 0
            ? ascensions.reduce((sum, a) => sum + (Number(a.attempts) || 1), 0) / ascensions.length
            : 0;

        const currentELO = 1420;

        const prevWeek = last14Days.filter(a => new Date(a.date_climbed) < sevenDaysAgo);

        const prevVolume = prevWeek.length;
        const volumeChange = volume - prevVolume;

        const prevAvgAttempts = prevWeek.length > 0
            ? prevWeek.reduce((sum, a) => sum + (Number(a.attempts) || 1), 0) / prevWeek.length
            : 0;
        const avgAttemptsChange = (avgAttempts - prevAvgAttempts).toFixed(1);

        const eloChange = `+${Math.floor(Math.random() * 20)} this week`; // placeholder

        return {
            volume,
            bestBoulder,
            bestRoute,
            avgAttempts: avgAttempts.toFixed(1),
            currentELO,
            volumeChange,
            avgAttemptsChange,
            eloChange,
        };
    }, [ascensions, sevenDaysAgo]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
                label="Climbing Volume (Last 7 days)"
                value={stats.volume.toString() + " ft"}
                change={formatChange(stats.volumeChange) + " ft"}
            />
            <StatCard
                label="Best Grade"
                value={`${stats.bestBoulder || "N/A"}, ${stats.bestRoute || "N/A"}`}
                change=""
            />
            <StatCard
                label="Avg Attempts/Send"
                value={stats.avgAttempts.toString()}
                change={formatChange(stats.avgAttemptsChange)}
            />
            <StatCard
                label="Current ELO"
                value={stats.currentELO.toString()}
                change={stats.eloChange}
            />
        </div>
    );
};

export default ClimbingSummary;
