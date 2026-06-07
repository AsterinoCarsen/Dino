import { useQuery } from '@tanstack/react-query';
import api from './api';
import {
    Session,
    Summary,
    UserAchievement,
    GradePyramid,
    AttemptRatio,
    Volume,
    AchievementProgress,
    SessionSpotlight
} from './types';

export function useSummary() {
    return useQuery({
        queryKey: ['summary'],
        queryFn: () => api.get<Summary>('/api/insight/summary'),
    });
}

export function useSessions() {
    return useQuery({
        queryKey: ['sessions'],
        queryFn: () => api.get<Session[]>('/api/session'),
    });
}

export function useSession(id: number) {
    return useQuery({
        queryKey: ['session', id],
        queryFn: () => api.get<Session>(`/api/session/${id}`),
        enabled: !!id,
    });
}

export function useSessionSpotlight(sessionId: number | null) {
    return useQuery({
        queryKey: ['session', sessionId, 'spotlight'],
        queryFn: () => api.get<SessionSpotlight>(`/api/session/${sessionId}/spotlight`),
        enabled: sessionId !== null,
    });
}

export function useEarnedAchievements() {
    return useQuery({
        queryKey: ['achievements', 'earned'],
        queryFn: () => api.get<UserAchievement[]>('/api/achievement/earned'),
    });
}

export function useGradePyramid(gradeSystem?: string) {
    return useQuery({
        queryKey: ['insights', 'grade-pyramid', gradeSystem ?? 'all'],
        queryFn: () =>
            api.get<GradePyramid[]>(
                `/api/insight/grade-pyramid${gradeSystem ? `?gradeSystem=${gradeSystem}` : ''}`
            ),
    });
}

export function useAttemptRatio(gradeSystem?: string) {
    return useQuery({
        queryKey: ['insights', 'attempt-ratio', gradeSystem ?? 'all'],
        queryFn: () =>
            api.get<AttemptRatio[]>(
                `/api/insight/attempt-ratio${gradeSystem ? `?gradeSystem=${gradeSystem}` : ''}`
            ),
    });
}

export function useVolume(groupBy: 'month' | 'session' = 'month') {
    return useQuery({
        queryKey: ['insights', 'volume', groupBy],
        queryFn: () => api.get<Volume>(`/api/insight/volume?groupBy=${groupBy}`),
    });
}

export function useAchievementProgress() {
    return useQuery({
        queryKey: ['achievements', 'progress'],
        queryFn: () => api.get<AchievementProgress[]>('/api/achievement/progress'),
    });
}