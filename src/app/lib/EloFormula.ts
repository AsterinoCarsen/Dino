import { GRADE_MAP } from "./grades";

const ATTEMPT_FACTOR = 20; // Elo adjustment per attempt difference

interface Ascent {
    grade: string;
    attempts: number;
}

export function calculateClimbingElo(data: Ascent[]): number {
    if (!data || data.length === 0) return 800;

    // Compute average attempts per grade
    const gradeTotals: Record<string, number> = {};
    const gradeCounts: Record<string, number> = {};

    data.forEach(ascent => {
        const grade = ascent.grade;
        if (!gradeTotals[grade]) {
            gradeTotals[grade] = 0;
            gradeCounts[grade] = 0;
        }
        gradeTotals[grade] += ascent.attempts;
        gradeCounts[grade] += 1;
    });

    const gradeAverages: Record<string, number> = {};
    for (const grade in gradeTotals) {
        gradeAverages[grade] = gradeTotals[grade] / gradeCounts[grade];
    }

    // Compute the climbing Elo
    let totalPerformance = 0;
    let count = 0;

    data.forEach(ascent => {
        const grade = ascent.grade;
        const baseRating = GRADE_MAP[grade] || 800;
        const avgAttempts = gradeAverages[grade] || ascent.attempts; // Default to this climb if no history
        const attemptDiff = avgAttempts - ascent.attempts;
        const adjustment = ATTEMPT_FACTOR * attemptDiff;
        const performanceScore = baseRating + adjustment;
        totalPerformance += performanceScore;
        count++;
    });

    return count > 0 ? totalPerformance / count : 800;
}
