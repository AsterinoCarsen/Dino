import { useEffect, useState } from "react";

import SideBar from "@/components/Sidebar";
import { Card, StatCard } from "@/components";
import { Badge } from "@/components";
import BadgeList from "@/components/BadgeList";
import { getPublicId } from "@/lib/decodeToken";
import { Icon } from "@iconify/react/dist/iconify.js";
import { AscentItemType } from "@/lib/performance/getAscensionsType";
import { getHigherGrade } from "@/lib/performance/compareGrades";
import { calculateElo } from "@/lib/performance/calculateElo";
import { fetchAscensions } from "@/lib/getAscents";

interface Badge {
    id: number;
    title: string;
    description: string;
    icon_key: string;
    earned_at: string;
}

export default function Profile() {
    const [badges, setBadges] = useState<Badge[]>([]);
    const [ascensions, setAscensions] = useState<AscentItemType[]>();
    const [profileCreatedAt, setProfileCreatedAt] = useState<string>("N/A");
    const [primaryDiscipline, setPrimaryDiscipline] = useState<string>("N/A");
    const [preferredStyle, setPreferredStyle] = useState<string>("N/A");

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const public_id = token ? getPublicId(token) : null;

    useEffect(() => {
        async function fetchBadges() {
            if (!public_id) return;
    
            try {
                const response = await fetch(`/api/badges/getBadges?public_id=${public_id}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });
    
                const data = await response.json();
                setBadges(data.badges);
            } catch (error) {
                console.error(error);
            }
        }

        async function fetchProfileInformation() {
            if (!public_id) return;

            try {
                const response = await fetch(`/api/auth/getUser?uuid=${public_id}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                const data = await response.json();
                if (data.success) {
                    const createdAt = new Date(data.data.created_at);
                    setProfileCreatedAt(createdAt.getFullYear().toString());
                }
            } catch (error) {
                console.error(error);
            }
        }

        fetchBadges();
        fetchProfileInformation();
    }, [public_id]);

    useEffect(() => {
        const loadAscents = async () => {
            const ascents = await fetchAscensions();

            const sortedAscensions = ascents.sort((a: AscentItemType, b: AscentItemType) => {
                return new Date(b.date_climbed).getTime() - new Date(a.date_climbed).getTime();
            });

            const typeCounts = sortedAscensions.reduce((acc: Record<string, number>, ascent: AscentItemType) => {
                const type = String(ascent.ascension_type || "N/A");
                acc[type] = (acc[type] || 0) + 1;
                return acc;
            }, {});

            const styleCounts = sortedAscensions.reduce((acc: Record<string, number>, ascent: AscentItemType) => {
                const style = String(ascent.style || "Unknown");
                acc[style] = (acc[style] || 0) + 1;
                return acc;
            }, {});

            const mostCommonType = Object.keys(typeCounts).reduce((a, b) => typeCounts[a] > typeCounts[b] ? a : b);
            const mostCommonStyle = Object.keys(styleCounts).reduce((a, b) => styleCounts[a] > styleCounts[b] ? a : b);

            setPreferredStyle(mostCommonStyle);
            setPrimaryDiscipline(mostCommonType);
            setAscensions(sortedAscensions);

        };
    
        loadAscents();
    }, []);

    const getBestGrade = (ascensions: AscentItemType[], type: "boulder" | "route") => {
        const grades = ascensions
            .map(a => a.grade)
            .filter(g => {
                if (!g) return false;
                return type === "boulder" ? (g.startsWith("V") || g.toUpperCase() === "VB") : g.startsWith("5");
            });
    
        return grades.reduce((highest, grade) => {
            if (!highest) return grade;
            return getHigherGrade(highest, grade);
        }, "");
    };

    return (
        <div className="min-h-screen bg-dino-dark text-dino-text flex">
            <SideBar />

            {/* Main content */}
            <main className="flex-1 p-8 ml-12 mr-12 overflow-y-auto">

                {/* Profile Header */}
                <Card>
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        <Icon icon="ic:baseline-account-circle" className="text-gray-400 text-6xl" />
                        <div>
                            <h2 className="text-3xl font-semibold">Carsen</h2>
                            <p className="text-gray-400">Climber since {profileCreatedAt} | {primaryDiscipline} Specialist</p>
                            <div className="flex gap-6 mt-4">
                                <StatCard label="ELO Rating"
                                    value={Math.round(calculateElo(ascensions || [])).toString()}
                                />
                                <StatCard
                                    label="Best Grade"
                                    value={`${getBestGrade(ascensions || [], "boulder") || "N/A"}, ${getBestGrade(ascensions || [], "route") || "N/A"}`}
                                />
                                <StatCard 
                                    label="Total Climbs"
                                    value={ascensions?.length.toString() || "0"}
                                />
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Bio & Preferences */}
                <Card title="Profile Summary">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <InfoItem label="Primary Discipline" value={primaryDiscipline} />
                        <InfoItem label="Preferred Style" value={preferredStyle} />
                        <InfoItem label="Climbing Since" value={profileCreatedAt} />
                    </div>
                </Card>

                {/* Lifetime Stats */}
                <Card title="Lifetime Stats">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <StatCard
                            label="Lifetime Volume"
                            value={
                                ascensions
                                    ? `${ascensions.reduce((sum, a) => sum + (a.height_ft || 0), 0)} ft`
                                    : "0 ft"
                            }
                        />
                        <StatCard
                            label="Average Attempts/Send"
                            value={
                                ascensions && ascensions.length > 0
                                    ? (ascensions.reduce((sum, a) => sum + (a.attempts || 0), 0) / ascensions.length).toFixed(1)
                                    : "0"
                            }
                        />
                        <StatCard
                            label="Total Boulder Problems"
                            value={
                                ascensions
                                    ? ascensions.filter(a => a.ascension_type === "Boulder").length.toString()
                                    : "0"
                            }
                        />
                        <StatCard
                            label="Total Routes"
                            value={
                                ascensions
                                    ? ascensions.filter(a => a.ascension_type !== "Boulder").length.toString()
                                    : "0"
                            }
                        />
                    </div>
                </Card>

                {/* Badges */}
                <BadgeList badges={badges} />
            </main>
        </div>
    );
}

function InfoItem({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-gray-400 text-sm">{label}</p>
            <p className="text-lg font-semibold">{value}</p>
        </div>
    );
}
