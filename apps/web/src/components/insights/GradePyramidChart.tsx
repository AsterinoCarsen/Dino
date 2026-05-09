import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { GradePyramid } from '../../lib/types';
import { useEffect, useState } from 'react';
import { useTypewriter } from '@/lib/hooks/useTypeWriter';


interface GradePyramidChartProps {
    data: GradePyramid[];
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

export default function GradePyramidChart({ data }: GradePyramidChartProps) {
    const [summary, setSummary] = useState<string>('');
    const [summaryLoading, setSummaryLoading] = useState(false);
    const [activeSystem, setActiveSystem] = useState(data[0]?.gradeSystem ?? 'VScale');
    const displayedSummary = useTypewriter(summary);

    const activeData = data.find(d => d.gradeSystem === activeSystem);

    const chartData = activeData?.data.map(entry => ({
        grade: entry.grade,
        Flashes: entry.flashes,
        'Non-Flashes': entry.nonFlashes,
    })) ?? [];

    useEffect(() => {
        if (!activeData || chartData.length === 0) return;
        setSummaryLoading(true);
        generateSummary(
            `You are a climbing coach giving a one-time snapshot to a climber based on their grade pyramid data. Write exactly 1-2 sentences directly to the climber using "you/your". Observations only — no suggestions for future sessions, no "let's", no implied follow-up. Be specific with grade names and encouraging. No preamble. Data: ${JSON.stringify(activeData)}`
        )
            .then(setSummary)
            .catch(() => setSummary(''))
            .finally(() => setSummaryLoading(false));
    }, [activeSystem]);

    return (
        <div className="border border-dino-border rounded-2xl p-6 flex flex-col gap-4">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="font-medium">Grade Pyramid</h2>
                    <p className="text-sm text-gray-400 mt-0.5">Distribution of your ascents by grade, showing flashes vs non-flashes</p>
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
                    <Bar dataKey="Flashes" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="Non-Flashes" stackId="a" fill="#374151" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>

            <div className="bg-white/5 rounded-xl px-4 py-3 min-h-[48px] flex items-center">
                {summaryLoading ? (
                    <p className="text-sm text-gray-500 italic">Analyzing your pyramid...</p>
                ) : summary ? (
                    <p className="text-sm text-gray-300">
                        {displayedSummary}
                        {displayedSummary.length < summary.length && (
                            <span className="inline-block w-0.5 h-3.5 bg-gray-400 ml-0.5 animate-pulse" />
                        )}
                    </p>
                ) : null}
            </div>
        </div>
    );
}