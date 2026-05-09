export interface User {
    userId: string;
    username: string;
    createdAt: string;
}

export interface Ascent {
    id: number;
    title: string;
    gradeSystem: string;
    grade: string;
    style: string;
    height: number;
    attempts: number;
    sessionId: number;
    createdAt: string;
}

export interface Session {
    id: number;
    location: string;
    notes: string;
    createdAt: string;
    ascents: Ascent[];
}

export interface GradeSystemHigh {
    gradeSystem: string;
    highestGrade: string;
}

export interface Summary {
    totalAscents: number;
    totalSessions: number;
    totalHeight: number;
    highestGrades: GradeSystemHigh[];
}

export interface UserAchievement {
    title: string;
    description: string;
    earnedAt: string;
}

export interface GradePyramidEntry {
    grade: string;
    flashes: number;
    nonFlashes: number;
}

export interface GradePyramid {
    gradeSystem: string;
    data: GradePyramidEntry[];
}

export interface AttemptRatioEntry {
    grade: string;
    totalAscents: number;
    averageAttempts: number;
    minAttempts: number;
    maxAttempts: number;
}

export interface AttemptRatio {
    gradeSystem: string;
    data: AttemptRatioEntry[];
}

export interface VolumeEntry {
    period: string;
    totalHeight: number;
    totalAscents: number;
}

export interface Volume {
    groupBy: string;
    data: VolumeEntry[];
}

export interface AchievementProgress {
    id: number;
    title: string;
    description: string;
    condition: string;
    threshold: number;
    gradeSystem: string | null;
    earned: boolean;
    earnedAt: string | null;
    currentProgress: number;
}