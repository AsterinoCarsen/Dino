import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AttemptRatio } from '../../lib/types';
import { useEffect, useState } from 'react';

interface AttemptRatioChartProps {
    data: AttemptRatio[];
}

async function generateSummary(prompt: string): Promise<string> {
    const response = await fetch('/api/insights/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
    });
    const data = await response.json();
    return data.text;
}

function getZones(data: AttemptRatio[]) {
    const entries = data[0]?.data ?? [];
    if (entries.length === 0) return null;

    const sorted = [...entries].sort((a, b) => a.averageAttempts - b.averageAttempts);
    const third = Math.floor(sorted.length / 3);

    const efficient = sorted.slice(0, third);
    const working = sorted.slice(third, third * 2);
    const project = sorted.slice(third * 2);

    const avgAttempts = (arr: typeof entries) =>
        arr.length > 0 ? (arr.reduce((sum, e) => sum + e.averageAttempts, 0) / arr.length).toFixed(1) : '—';

    const gradeRange = (arr: typeof entries) =>
        arr.length === 0 ? '—' : arr.length === 1 ? arr[0].grade : `${arr[0].grade}-${arr[arr.length - 1].grade}`;

    return {
        efficient: { range: gradeRange(efficient), avg: avgAttempts(efficient) },
        working: { range: gradeRange(working), avg: avgAttempts(working) },
        project: { range: project.length > 0 ? `${project[0].grade}+` : '—', avg: avgAttempts(project) },
    };
}

export default function AttemptRatioChart({ data }: AttemptRatioChartProps) {
    const [summary, setSummary] = useState<string>('');
    const [summaryLoading, setSummaryLoading] = useState(false);
    const [activeSystem, setActiveSystem] = useState(data[0]?.gradeSystem ?? 'VScale');

    const activeData = data.find(d => d.gradeSystem === activeSystem);
    const zones = getZones(data.filter(d => d.gradeSystem === activeSystem));

    const chartData = activeData?.data.map(entry => ({
        grade: entry.grade,
        'Avg Attempts': parseFloat(entry.averageAttempts.toFixed(1)),
    })) ?? [];

    useEffect(() => {
        if (!activeData || chartData.length === 0) return;
        setSummaryLoading(true);
        generateSummary(
            `You are analyzing a climber's attempt ratio data. Identify their most efficient grade range, working range, and project zone. Give a 1-2 sentence insight. Data: ${JSON.stringify(activeData)}. Respond with only the insight text, no preamble.`
        )
            .then(setSummary)
            .catch(() => setSummary(''))
            .finally(() => setSummaryLoading(false));
    }, [activeSystem]);

    return (
        <div className="border border-dino-border rounded-2xl p-6 flex flex-col gap-4">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="font-medium">Average Attempts by Grade</h2>
                    <p className="text-sm text-gray-400 mt-0.5">How many attempts on average it takes you to send each grade</p>
                </div>
                {data.length > 1 && (
                    <div className="flex gap-2">
                        {data.map(d => (
                            <button
                                key={d.gradeSystem}
                                onClick={() => setActiveSystem(d.gradeSystem)}
                                className={`text-xs px-3 py-1.5 rounded-lg border transition ${
                                    activeSystem === d.gradeSystem
                                        ? 'border-white/30 text-white bg-white/10'
                                        : 'border-dino-border text-gray-400 hover:text-white'
                                }`}
                            >
                                {d.gradeSystem}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <ResponsiveContainer width="100%" height={320}>
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis
                        dataKey="grade"
                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                        axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                        tickLine={false}
                    />
                    <YAxis
                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip
                        contentStyle={{
                            background: '#1a1a1a',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '10px',
                            color: '#fff',
                            fontSize: 13,
                        }}
                    />
                    <Legend
                        wrapperStyle={{ fontSize: 13, color: '#9ca3af', paddingTop: 12 }}
                    />
                    <Bar dataKey="Avg Attempts" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>

            {zones && (
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white/5 rounded-xl px-4 py-3">
                        <p className="text-xs text-gray-500 mb-1">Most Efficient</p>
                        <p className="text-lg font-medium">{zones.efficient.range}</p>
                        <p className="text-xs text-gray-400 mt-0.5">~{zones.efficient.avg} attempts</p>
                    </div>
                    <div className="bg-white/5 rounded-xl px-4 py-3">
                        <p className="text-xs text-gray-500 mb-1">Working Range</p>
                        <p className="text-lg font-medium">{zones.working.range}</p>
                        <p className="text-xs text-gray-400 mt-0.5">~{zones.working.avg} attempts</p>
                    </div>
                    <div className="bg-white/5 rounded-xl px-4 py-3">
                        <p className="text-xs text-gray-500 mb-1">Project Zone</p>
                        <p className="text-lg font-medium">{zones.project.range}</p>
                        <p className="text-xs text-gray-400 mt-0.5">~{zones.project.avg} attempts</p>
                    </div>
                </div>
            )}

            <div className="bg-white/5 rounded-xl px-4 py-3 min-h-[48px] flex items-center">
                {summaryLoading ? (
                    <p className="text-sm text-gray-500 italic">Analyzing your attempts...</p>
                ) : summary ? (
                    <p className="text-sm text-gray-300">{summary}</p>
                ) : null}
            </div>
        </div>
    );
}