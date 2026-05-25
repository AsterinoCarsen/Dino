import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Volume } from '../../lib/types';

interface VolumeChartProps {
    data: Volume;
}

export default function VolumeChart({ data }: VolumeChartProps) {
    const chartData = data.data.map(entry => ({
        period: entry.period,
        'Height (m)': entry.totalHeight,
        'Ascents': entry.totalAscents,
    }));

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

            {data.aiSummary && (
                <div className="bg-white/5 rounded-xl px-4 py-3 min-h-[48px] flex items-center">
                    <p className="text-sm text-gray-300">{data.aiSummary}</p>
                </div>
            )}
        </div>
    );
}