import { AscentItemType } from "@/lib/performance/getAscensionsType";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer
} from "recharts";

interface GradeProgressionChartProps {
    showBoulder: boolean;
    ascensions: AscentItemType[];
}

const boulderLabel = (num: number) => `V${num}`;
const routeLabel = (num: number) => `5.${num}`;

function smoothData<T extends { date: string; boulderGrade: number | null; routeGrade: number | null }>(
    data: T[],
    key: "boulderGrade" | "routeGrade",
    windowSize: number
) {
    const smoothed: T[] = [];
    for (let i = 0; i < data.length; i += windowSize) {
        const window = data.slice(i, i + windowSize);
        const avg =
            window.reduce((sum, d) => sum + (d[key] ?? 0), 0) /
            window.filter((d) => d[key] != null).length;

        smoothed.push({
            date: window[Math.floor(window.length / 2)].date,
            boulderGrade: key === "boulderGrade" ? avg : null,
            routeGrade: key === "routeGrade" ? avg : null
        } as T);
    }
    return smoothed;
}

export default function GradeProgressionChart({ showBoulder, ascensions }: GradeProgressionChartProps) {
    const dataKey = showBoulder ? "boulderGrade" : "routeGrade";
    const lineColor = showBoulder ? "#82ca9d" : "#0369A1";

    const parsedData = ascensions
        .map((a) => ({
            date: a.date_climbed,
            boulderGrade: a.grade.startsWith("v") ? parseInt(a.grade.substring(1)) : null,
            routeGrade: a.grade.startsWith("5.") ? parseFloat(a.grade.substring(2)) : null
        }))
        .filter((d) => showBoulder ? d.boulderGrade !== null : d.routeGrade !== null)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());


    // Apply smoothing only if dataset is large
    const displayData =
        parsedData.length > 50
            ? smoothData(parsedData, dataKey, 5)
            : parsedData;

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={displayData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis 
                    dataKey="date"
                    stroke="#ccc"
                    interval={5}
                />
                <YAxis
                    stroke="#ccc"
                    domain={["dataMin - 1", "dataMax + 1"]}
                    tickFormatter={(value) => showBoulder ? boulderLabel(value) : routeLabel(value)}
                    allowDecimals={false}
                />
                <Line
                    type="monotone"
                    dataKey={dataKey}
                    stroke={lineColor}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    connectNulls={true}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}
