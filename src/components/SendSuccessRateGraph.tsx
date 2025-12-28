import { AscentItemType } from "@/lib/performance/getAscensionsType";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

interface GradeSuccessChartProps {
    showBoulder: boolean;
    ascensions: AscentItemType[];
}

interface GradeSuccessDatum {
    grade: string;
    successRate: number;
    total: number;
}

export default function SendSuccessRateGraph({
    showBoulder,
    ascensions
}: GradeSuccessChartProps) {
    const data = computeSuccessRates(ascensions, showBoulder);
    const barColor = showBoulder ? "#82ca9d" : "#0369A1";

    function computeSuccessRates(
        ascension: AscentItemType[],
        showBoulder: boolean
    ): GradeSuccessDatum[] {
        const gradeMap: Record<
            string,
            { total: number; successes: number }
        > = {};

        for (const a of ascensions) {
            const isBoulder = a.grade.startsWith("v");
            const isRoute = a.grade.startsWith("5.");

            if (showBoulder && !isBoulder) continue;
            if (!showBoulder && !isRoute) continue;

            if (!gradeMap[a.grade]) {
                gradeMap[a.grade] = { total: 0, successes: 0 };
            }

            gradeMap[a.grade].total += 1;
            if (a.attempts === 1) {
                gradeMap[a.grade].successes += 1;
            }
        }

            return Object.entries(gradeMap)
            .map(([grade, { total, successes }]) => ({
                grade,
                successRate: total ? Math.round((successes / total) * 100) : 0,
                total
            }))
            .sort((a, b) => {
                const parse = (g: string) =>
                    g.startsWith("v")
                        ? parseInt(g.substring(1))
                        : parseFloat(g.substring(2));
            
                return parse(a.grade) - parse(b.grade);
            });
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={data}
                margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis
                    dataKey="grade"
                    stroke="#ccc"
                />
                <YAxis
                    stroke="#ccc"
                    domain={[0, 100]}
                    tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                    formatter={(value: number) => [`${value}%`, "Success rate"]}
                    labelFormatter={(label) => `Grade ${label}`}
                />
                <Bar
                    dataKey="successRate"
                    fill={barColor}
                    radius={[6, 6, 0, 0]}
                />
            </BarChart>
        </ResponsiveContainer>
    )
}