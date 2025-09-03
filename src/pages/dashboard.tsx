import { useEffect, useState } from "react";
import { Sidebar, Card, Badge, AscentItem, PerformanceSnapshot } from "@/components";
import { AscentItemType, NewAscension } from "@/lib/performance/getAscensionsType";
import ClimbingSummary from "@/components/ClimbingSummary";
import NewAscentModal from "@/components/NewAscentModal";
import { getPublicId } from "@/lib/decodeToken";
import FocusAreas from "@/components/FocusAreas";

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

    const handleDeleteAscension = async (aid: number) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const public_id = getPublicId(token);

            const response = await fetch("/api/ascensions/removeAscension", {
                method: "DELETE",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify({ public_id, aid }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setAscensions((prev) => prev.filter((asc) => asc.aid !== aid));
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error(error);
        }
    }

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
                <FocusAreas ascensions={ascensions} />

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
                                onDelete={() => handleDeleteAscension(item.aid)}
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
                        <Badge icon="🥇" label="Grade Crusher V6" achievedAt="September 3rd, 2025" />
                        <Badge icon="🔥" label="7-Day Send Streak" achievedAt="September 1st, 2025" />
                    </div>
                </Card>
            </main>
        </div>
    );
}