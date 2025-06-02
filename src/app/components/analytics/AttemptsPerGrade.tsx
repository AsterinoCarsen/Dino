import { useMemo } from "react";
import { GRADE_MAP } from "../../lib/grades";
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

interface Ascension {
    aid: number;
    ascent_name: string;
    grade: string;
    attempts: number;
    created_at: string;
    ascension_type: string;
}

interface AttemptsPerGradeProps {
    ascensions: Ascension[];
}

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function AttemptsPerGrade({ ascensions }: AttemptsPerGradeProps) {
    
    const averageAttemptsPerGrade = (ascents: Ascension[]) => {
        const attemptsByGrade: Record<string, { totalAttempts: number; count: number }> = {};

        ascents.forEach(({ grade, attempts }) => {
            if (!attemptsByGrade[grade]) {
                attemptsByGrade[grade] = { totalAttempts: 0, count: 0 };
            }

            attemptsByGrade[grade].totalAttempts += attempts;
            attemptsByGrade[grade].count += 1;
        });

        const averageAttempts: Record<string, number> = {};

        for (const grade in attemptsByGrade) {
            averageAttempts[grade] = attemptsByGrade[grade].totalAttempts / attemptsByGrade[grade].count;
        }

        const sortedEntries: [string, number][] = Object.entries(averageAttempts).sort(
            ([gradeA], [gradeB]) => (GRADE_MAP[gradeA] ?? 0) - (GRADE_MAP[gradeB] ?? 0)
        );

        return Object.fromEntries(sortedEntries);
    };

    const avgAttempts = useMemo(() => averageAttemptsPerGrade(ascensions), [ascensions]);
    
    const options = {
        responsive: false,
        plugins: {
            legend: {
                position: 'top' as const
            },
            title: {
                display: true,
                text: 'Average Attempts by Grade'
            }
        }
    };

    const chartData = {
        labels: Object.keys(avgAttempts),
        datasets: [
            {
                label: 'Average Attempts per Grade',
                data: Object.values(avgAttempts),
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            }
        ]
    };

    return (
        <div className='flex flex-col items-center'>
            {Object.keys(avgAttempts).length > 0 ? (
                <Bar width={600} height={400} options={options} data={chartData} />
            ) : (
                <p>No data available to display chart.</p>
            )}
        </div>
    )
}