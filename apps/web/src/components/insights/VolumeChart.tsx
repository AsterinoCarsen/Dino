import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Volume } from '../../lib/types';
import { useEffect, useState } from 'react';
import { useTypewriter } from '@/lib/hooks/useTypeWriter';

interface VolumeChartProps {
    data: Volume;
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

export default function VolumeChart({ data }: VolumeChartProps) {
    const [summary, setSummary] = useState<string>('');
    const [summaryLoading, setSummaryLoading] = useState(false);
    const displayedSummary = useTypewriter(summary);

    const chartData = data.data.map(entry => ({
        period: entry.period,
        'Height (m)': entry.totalHeight,
        'Ascents': entry.totalAscents,
    }));

    useEffect(() => {
        if (chartData.length === 0) return;
        setSummaryLoading(true);
        generateSummary(
            `You are a climbing coach giving a one-time snapshot to a climber based on their volume over time data. Write exactly 1-2 sentences directly to the climber using "you/your". Observations only — no suggestions for future sessions, no "let's", no implied follow-up. Comment on consistency and peak periods. Be encouraging. No preamble. Data: ${JSON.stringify(data)}`
        )
            .then(setSummary)
            .catch(() => setSummary(''))
            .finally(() => setSummaryLoading(false));
    }, []);

    return (
        <div className="border border-dino-border rounded-2xl p-6 flex flex-col gap-4">
            <div>
                <h2 className="font-medium">Volume Over Time</h2>
                <p className="text-sm text-gray-400 mt-0.5">Track your climbing volume by total height and ascent count</p>
            </div>

            <ResponsiveContainer width="100%" height={320}>
                <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis
                        dataKey="period"
                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                        axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                        tickLine={false}
                    />
                    <YAxis
                        yAxisId="left"
                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        yAxisId="right"
                        orientation="right"
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
                    <Bar yAxisId="left" dataKey="Height (m)" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar yAxisId="right" dataKey="Ascents" fill="#374151" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>

            <div className="bg-white/5 rounded-xl px-4 py-3 min-h-[48px] flex items-center">
                {summaryLoading ? (
                    <p className="text-sm text-gray-500 italic">Analyzing your volume...</p>
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