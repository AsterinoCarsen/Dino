import { useEffect, useState } from "react";
import { Sidebar, Card, StatCard, Badge, AscentItem, PerformanceSnapshot } from "@/components";
import { AscentItemType, NewAscension } from "@/lib/performance/getAscensionsType";
import ClimbingSummary from "@/components/ClimbingSummary";
import NewAscentModal from "@/components/NewAscentModal";
import { getPublicId } from "@/lib/decodeToken";

export default function Dashboard() {
    const [ascensions, setAscensions] = useState<AscentItemType[]>([]);
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    const handleAddAscension = (newAscension: NewAscension) => {
        setAscensions((prev) => {
            const updated = [...prev, newAscension as AscentItemType];
            return updated.sort((a, b) => 
                new Date(b.date_climbed).getTime() - new Date(a.date_climbed).getTime()
            );
        });
    };


    useEffect(() => {
        const fetchAscensions = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                const public_id = getPublicId(token);
                const response = await fetch(`/api/ascensions/getAscensions?public_id=${public_id}`);
                const data = await response.json();
                const sortedAscensions = data.data.sort((a: AscentItemType, b: AscentItemType) => {
                    return new Date(b.date_climbed).getTime() - new Date(a.date_climbed).getTime();
                });
                setAscensions(sortedAscensions);
            } catch (error) {
                console.log(error);
            }
        };

        fetchAscensions();
    }, []);

    return (
        <div className="min-h-screen bg-dino-dark text-dino-text flex">
            <NewAscentModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSuccess={handleAddAscension} />

            <Sidebar />
            <main className="flex-1 p-8 ml-12 mr-12 overflow-y-auto">
                {/* Welcome + Quick Stats */}
                <Card>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div>
                            <h2 className="text-2xl font-semibold">Welcome back, Carsen!</h2>
                            <p className="text-gray-400 pb-4">Here’s your climbing summary.</p>
                        </div>
                        <button onClick={() => setModalOpen(true)} className="mt-4 md:mt-0 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-full font-semibold shadow transition">
                            + Log New Ascent
                        </button>
                    </div>

                    <ClimbingSummary ascensions={ascensions} />
                </Card>

                {/* Performance Snapshot */}
                <PerformanceSnapshot ascensions={ascensions} />

                {/* Training Goals */}
                <Card title="Focus Areas">
                    <ul className="space-y-2">
                        <li className="bg-white/5 p-3 rounded-lg border border-dino-border">
                            Overhang endurance <span className="text-red-400">(42% success rate)</span>
                        </li>
                        <li className="bg-white/5 p-3 rounded-lg border border-dino-border">
                            Crimps strength <span className="text-red-400">(3 misses at V5+ last week)</span>
                        </li>
                    </ul>
                    <a href="#" className="inline-block mt-4 text-emerald-400 hover:underline">
                        View Full Insights →
                    </a>
                </Card>

                {/* Recent Ascents */}
                <Card title="Recent Ascents">
                    <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
                        {ascensions?.slice(0, 3).map((item) => (
                            <AscentItem
                                key={item.aid}
                                name={item.ascent_name}
                                grade={item.grade}
                                type={item.ascension_type}
                                date={item.date_climbed}
                                attempts={item.attempts}
                                style={item.style}
                            />
                        ))}
                    </div>
                    <a href="#" className="inline-block mt-4 text-emerald-400 hover:underline">
                        See All in Logbook →
                    </a>
                </Card>

                {/* Badges */}
                <Card title="Badges Earned This Week">
                    <div className="flex flex-wrap gap-3">
                        <Badge icon="🥇" label="Grade Crusher V6" />
                        <Badge icon="🔥" label="7-Day Send Streak" />
                    </div>
                </Card>
            </main>
        </div>
    );
}