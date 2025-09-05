import boulderGrades from "./boulderGrades.json";
import ropeGrades from "./ropeGrades.json";

const boulderGradesMap: Record<string, number> = boulderGrades;
const ropeGradesMap: Record<string, number> = ropeGrades;

interface Ascension {
    grade: string;
    attempts: number;
    date_climbed: string;
    height_ft: number;
}

function daysSince(date: string): number {
    const dateClimbed = new Date(date);

    const today = new Date();

    const diffMs = today.getTime() - dateClimbed.getTime();

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    return diffDays;
}

export function calculateElo(ascensions: Ascension[]): number {
    const DECAY_RATE = 0.025;
    const RECENCY_RATE = 0.0005;
    let elo = 0;
    let totalScore = 0;

    for (const asc of ascensions) {
        let gradeValue: number | undefined;

        if (asc.grade.startsWith("5")) {
            gradeValue = ropeGradesMap[asc.grade];
        } else {
            gradeValue = boulderGradesMap[asc.grade];
        }

        if (gradeValue === undefined) continue;

        let earnedScoreBeforeTime = gradeValue * Math.exp(-DECAY_RATE * (asc.attempts - 1));

        let daysAgo = daysSince(asc.date_climbed);

        let finalContribution = earnedScoreBeforeTime * Math.exp(-RECENCY_RATE * daysAgo);
        totalScore += finalContribution;
    }

    elo = totalScore / ascensions.length;

    return elo;
}

export function calculateEloChange(ascensions: Ascension[]): number {
    const allTime = calculateElo(ascensions);
    const nonRecentAscensions = ascensions.filter(asc => daysSince(asc.date_climbed) > 7);

    if (nonRecentAscensions.length === 0) return 0;

    const olderElo = calculateElo(nonRecentAscensions);

    return allTime - olderElo;
}