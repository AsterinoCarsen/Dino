import { useEffect, useState } from "react";

import SideBar from "@/components/Sidebar";
import { Card, StatCard } from "@/components";
import { Badge } from "@/components";
import BadgeList from "@/components/BadgeList";
import { getPublicId } from "@/lib/decodeToken";
import { Icon } from "@iconify/react/dist/iconify.js";

interface Badge {
    id: number;
    title: string;
    description: string;
    icon_key: string;
    earned_at: string;
}

export default function Profile() {
    const [badges, setBadges] = useState<Badge[]>([]);

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
    
        fetchBadges();
    }, [public_id]);

    
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
                            <p className="text-gray-400">Climber since 2021 | Boulder & Lead Specialist</p>
                            <div className="flex gap-6 mt-4">
                                <StatCard label="ELO Rating" value="1420" change="+15 this week" />
                                <StatCard label="Best Grade" value="V6" change="No change" />
                                <StatCard label="Total Climbs" value="278" change="+12 this month" />
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Bio & Preferences */}
                <Card title="Bio & Preferences">
                    <p className="text-gray-300 mb-4">
                        Lorem ipsum dolor sit amet consectetur adipiscing elit. Dolor sit amet consectetur adipiscing elit quisque faucibus.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <InfoItem label="Primary Discipline" value="Bouldering" />
                        <InfoItem label="Preferred Style" value="Overhang" />
                        <InfoItem label="Training Focus" value="Crimp Strength" />
                        <InfoItem label="Climbing Since" value="2021" />
                        <InfoItem label="Home Gym" value="Vertical World" />
                    </div>
                </Card>

                {/* Lifetime Stats */}
                <Card title="Lifetime Stats">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <StatCard label="Lifetime Volume" value="12,430 ft" change="+350 ft this week" />
                        <StatCard label="Average Attempts/Send" value="3.2" change="-0.2 attempts" />
                        <StatCard label="Total Boulder Problems" value="198" change="+8 this month" />
                        <StatCard label="Total Routes" value="80" change="+4 this month" />
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
