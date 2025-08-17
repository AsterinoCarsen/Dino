import { useState } from "react";

import { Card, GradeProgressionChart } from "@/components";
import { AscentItemType } from "@/lib/performance/getAscensionsType";

interface PerformanceSnapshotProps {
    ascensions: AscentItemType[];
}

export default function PerformanceSnapshot({ ascensions }: PerformanceSnapshotProps) {
    const [showBoulder, setShowBoulder] = useState(true);

    const handleToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        setShowBoulder((prev) => !prev);
    };

    return (
        <Card title="Performance Snapshot">
            {/* Type Badge */}
            <div className="flex items-center mb-2">
                <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        showBoulder
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-sky-100 text-sky-800"
                    }`}
                >
                    {showBoulder ? "Boulder Grades" : "Route Grades"}
                </span>
            </div>

            {/* Chart */}
            <div className="w-full h-64">
                <GradeProgressionChart
                    showBoulder={showBoulder}
                    ascensions={ascensions}
                />
            </div>

            {/* Toggle Link */}
            <a
                href="#"
                className="inline-block mt-4 text-emerald-400 hover:underline"
                onClick={handleToggle}
            >
                {showBoulder ? "View Route Grades →" : "View Boulder Grades →"}
            </a>
        </Card>
    );
}
