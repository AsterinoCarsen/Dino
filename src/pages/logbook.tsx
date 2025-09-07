import { Card } from "@/components";
import { AscentItem } from "@/components";
import { AscentItemType, NewAscension } from "@/lib/performance/getAscensionsType";
import { Sidebar } from "@/components";
import NewAscentModal from "@/components/NewAscentModal";
import { getPublicId } from "@/lib/decodeToken";

import { useState, useEffect } from "react";

import boulderGrades from "../lib/performance/boulderGrades.json";
import ropeGrades from "../lib/performance/ropeGrades.json";

const boulderGradeMaps: Record<string, number> = boulderGrades;
const routeGradeMaps: Record<string, number> = ropeGrades;

export default function Logbook() {
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [ascensions, setAscensions] = useState<AscentItemType[]>([]);
    const [reverseOrder, setReverseOrder] = useState(false);

    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("All");
    const [routeGradeFilter, setRouteGradeFilter] = useState("All");
    const [boulderGradeFilter, setBoulderGradeFilter] = useState("All");
    const [sortBy, setSortBy] = useState("Date");

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const public_id = token ? getPublicId(token) : null;

    const handleAddAscension = (newAscension: NewAscension) => {
        setAscensions((prev) => {
            const updated = [...prev, newAscension as AscentItemType];
            return updated.sort(
                (a, b) =>
                    new Date(b.date_climbed).getTime() -
                    new Date(a.date_climbed).getTime()
            );
        });
    };

    const handleDeleteAscension = async (aid: number) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const response = await fetch("/api/ascensions/removeAscension", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
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
    };

    useEffect(() => {
        const fetchAscensions = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                const public_id = getPublicId(token);
                const response = await fetch(
                    `/api/ascensions/getAscensions?public_id=${public_id}`
                );
                const data = await response.json();
                const sortedAscensions = data.data.sort(
                    (a: AscentItemType, b: AscentItemType) => {
                        return (
                            new Date(b.created_at).getTime() -
                            new Date(a.created_at).getTime()
                        );
                    }
                );
                setAscensions(sortedAscensions);
            } catch (error) {
                console.log(error);
            }
        };

        fetchAscensions();
    }, []);

    const filteredAscensions = ascensions
        .filter((asc) =>
            asc.ascent_name.toLowerCase().includes(search.toLowerCase())
        )
        .filter((asc) =>
            typeFilter === "All" ? true : asc.ascension_type === typeFilter
        )
        .filter((asc) =>
            routeGradeFilter === "All" ? true : asc.grade === routeGradeFilter
        )
        .filter((asc) =>
            boulderGradeFilter === "All" ? true : asc.grade === boulderGradeFilter
        )
        .sort((a, b) => {
            if (sortBy === "Date") {
                return (
                    new Date(b.date_climbed).getTime() -
                    new Date(a.date_climbed).getTime()
                );
            }
            if (sortBy === "Grade") {
                const gradeA =
                    routeGradeMaps[a.grade] ?? boulderGradeMaps[a.grade] ?? 0;
                const gradeB =
                    routeGradeMaps[b.grade] ?? boulderGradeMaps[b.grade] ?? 0;
                return gradeB - gradeA;
            }
            if (sortBy === "Attempts") {
                return a.attempts - b.attempts;
            }
            return 0;
        });

        if (reverseOrder) {
            filteredAscensions.reverse();
        }

    return (
        <div className="min-h-screen bg-dino-dark text-dino-text flex">
            <NewAscentModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSuccess={handleAddAscension}
            />

            <Sidebar />

            <main className="flex-1 p-8 ml-12 mr-12 overflow-y-auto">
                <Card>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div>
                            <h2 className="text-2xl font-semibold">Your Logbook</h2>
                            <p className="text-gray-400">
                                View and manage your climbing history.
                            </p>
                        </div>
                        <button
                            onClick={() => setModalOpen(true)}
                            className="mt-4 md:mt-0 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-full font-semibold shadow transition"
                        >
                            + Log New Ascent
                        </button>
                    </div>
                </Card>

                <Card title="Filters & Search">
                    <div className="flex flex-wrap gap-4">
                        <input
                            type="text"
                            placeholder="Search by route name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-white/5 border border-dino-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="bg-white/5 border border-dino-border rounded-lg px-4 py-2 focus:outline-none"
                        >
                            <option className="bg-dino-dark">All</option>
                            <option className="bg-dino-dark">Boulder</option>
                            <option className="bg-dino-dark">Top Rope</option>
                            <option className="bg-dino-dark">Lead</option>
                            <option className="bg-dino-dark">Auto Belay</option>
                        </select>
                        <select
                            value={routeGradeFilter}
                            onChange={(e) => setRouteGradeFilter(e.target.value)}
                            className="bg-white/5 border border-dino-border rounded-lg px-4 py-2 focus:outline-none"
                        >
                            <option>All Route Grades</option>
                            {Object.keys(routeGradeMaps).map((g) => (
                                <option key={g} value={g} className="bg-dino-dark">
                                    {g}
                                </option>
                            ))}
                        </select>
                        <select
                            value={boulderGradeFilter}
                            onChange={(e) => setBoulderGradeFilter(e.target.value)}
                            className="bg-white/5 border border-dino-border rounded-lg px-4 py-2 focus:outline-none"
                        >
                            <option>All Boulder Grades</option>
                            {Object.keys(boulderGradeMaps).map((g) => (
                                <option key={g} value={g} className="bg-dino-dark">
                                    {g}
                                </option>
                            ))}
                        </select>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-white/5 border border-dino-border rounded-lg px-4 py-2 focus:outline-none"
                        >
                            <option className="bg-dino-dark" value="Date">Sort by Date</option>
                            <option className="bg-dino-dark" value="Grade">Sort by Grade</option>
                            <option className="bg-dino-dark" value="Attempts">Sort by Attempts</option>
                        </select>

                        <button
                            className="bg-white/5 border border-dino-border rounded-lg px-4 py-2 hover:bg-emerald-600 transition"
                            onClick={() => setReverseOrder((prev) => !prev)}
                        >
                            {reverseOrder ? "Normal Order" : "Reverse Order"}
                        </button>
                    </div>
                </Card>

                <Card title="All Ascents">
                    <div className="flex flex-col gap-4">
                        {filteredAscensions.map((item) => (
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
                </Card>
            </main>
        </div>
    );
}
