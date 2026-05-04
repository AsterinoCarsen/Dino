import { useEffect, useState } from "react";
import { fetchAscensions } from "@/lib/getAscents";
import { AscentItemType } from "@/lib/performance/getAscensionsType";

import { Card } from "@/components";
import SideBar from "@/components/Sidebar";
import { GradeProgressionChart } from "@/components";
import SendSuccessRateGraph from "@/components/SendSuccessRateGraph";

export default function Insights() {
    const [ascensions, setAscensions] = useState<AscentItemType[]>([]);
    const [showBoulder, setShowBoulder] = useState(true);

    const handleToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        setShowBoulder((prev) => !prev);
    };

    useEffect(() => {
            async function loadAscents() {
                const ascents = await fetchAscensions();
                setAscensions(ascents);
            }
    
            loadAscents();
        }, []);

    return (
        <div className="min-h-screen bg-dino-dark text-dino-text flex">
            {/* Sidebar / Navigation */}
            <SideBar />

            {/* Main content */}
            <main className="flex-1 p-8 ml-12 mr-12 overflow-y-auto">
                
                {/* Header */}
                <Card>
                    <h2 className="text-2xl font-semibold">Climbing Insights</h2>
                    <p className="text-gray-400">Your performance trends and climbing analytics.</p>
                </Card>
                
                <div className="my-6 flex">
                    <button
                        onClick={handleToggle}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-full font-semibold shadow transition"
                    >
                        {showBoulder ? "View Route Grades →" : "View Boulder Grades →"}
                    </button>
                </div>

                {/* Grade Progression */}
                <Card title="Grade Progression Over Time">
                    <div className="w-full h-64">
                        <GradeProgressionChart ascensions={ascensions} showBoulder={showBoulder} />
                    </div>
                </Card>

                {/* Success Rate by Grade */}
                <Card title="Flash % Rate by Grade">
                    <div className="w-full h-64">
                        <SendSuccessRateGraph ascensions={ascensions} showBoulder={showBoulder} />
                    </div>
                </Card>
            </main>
        </div>
    );
}
