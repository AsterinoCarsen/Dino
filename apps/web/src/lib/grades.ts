// src/lib/grades.ts
export const GRADE_SYSTEMS = ['VScale', 'YDS', 'French'] as const;
export type GradeSystemType = typeof GRADE_SYSTEMS[number];

export const GRADES: Record<GradeSystemType, string[]> = {
    VScale: [
        'VB', 'V0', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6',
        'V7', 'V8', 'V9', 'V10', 'V11', 'V12', 'V13', 'V14', 'V15', 'V16', 'V17'
    ],
    YDS: [
        '5.6', '5.7', '5.8', '5.9',
        '5.10a', '5.10b', '5.10c', '5.10d',
        '5.11a', '5.11b', '5.11c', '5.11d',
        '5.12a', '5.12b', '5.12c', '5.12d',
        '5.13a', '5.13b', '5.13c', '5.13d',
        '5.14a', '5.14b', '5.14c', '5.14d'
    ],
    French: [
        '3', '4', '4a', '4b', '4c',
        '5a', '5b', '5c',
        '6a', '6a+', '6b', '6b+', '6c', '6c+',
        '7a', '7a+', '7b', '7b+', '7c', '7c+',
        '8a', '8a+', '8b', '8b+', '8c', '8c+',
        '9a', '9a+', '9b', '9b+', '9c'
    ],
};

export const CLIMB_STYLES = ['AutoBelay', 'Boulder', 'TopRope', 'Lead'] as const;
export type ClimbStyleType = typeof CLIMB_STYLES[number];