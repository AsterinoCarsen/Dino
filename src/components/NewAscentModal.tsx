import { useEffect, useState } from "react";
import { NewAscension } from "@/lib/performance/getAscensionsType";
import { getPublicId } from "@/lib/decodeToken";
import { checkBadgeCondition } from "@/lib/checkBadgeConditions";

import boulderGrades from "../lib/performance/boulderGrades.json";
import routeGrades from "../lib/performance/ropeGrades.json";

const boulderGradeMaps: Record<string, number> = boulderGrades;
const routeGradeMaps: Record<string, number> = routeGrades;

interface NewAscentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (ascension: NewAscension) => void;
}

export default function NewAscentModal({ isOpen, onClose, onSuccess }: NewAscentModalProps) {
    const initialForm = {
        ascent_name: "",
        grade: "",
        attempts: 0,
        height_ft: 0,
        ascension_type: "",
        style: "",
        date_climbed: "",
    }

    const [formData, setFormData] = useState<Omit<NewAscension, "uid">>(initialForm);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: "error" | "success" | null; message: string }>({
        type: null,
        message: "",
    });

    useEffect(() => {
        if (isOpen) {
            setFormData(initialForm);
            setStatus({ type: null, message: "" });
        }
    }, [isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "attempts" || name === "height_ft" ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: null, message: "" });

        try {
            const token = localStorage.getItem("token");
            if (!token) return;
            const public_id = getPublicId(token);

            const res = await fetch("/api/ascensions/addAscension", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, public_id }),
            });

            const result = await res.json();
            if (result.success) {
                setStatus({ type: "success", message: "Ascension logged successfully!" });
                onSuccess(result.data);

                const response = await fetch(`/api/ascensions/getAscensions?public_id=${public_id}`);
                const data = await response.json();
                const earnedBadges = await checkBadgeCondition(data.data);

                const addBadgeResponse = await fetch("/api/badges/addBadge", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ public_id, badges: earnedBadges })
                });
                
                setTimeout(() => {
                    onClose();
                }, 1000);
            } else {
                setStatus({ type: "error", message: result.message || "Failed to add ascension" });
            }
        } catch (err) {
            setStatus({ type: "error", message: "Something went wrong" });
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-dino-dark border border-dino-border rounded-2xl shadow-xl p-6 w-full max-w-md text-dino-text">
                <h2 className="text-2xl font-semibold mb-6">Log New Ascent</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <label className="text-gray-400 text-sm">Name</label>
                    <input
                        type="text"
                        name="ascent_name"
                        placeholder="Ascent Name"
                        value={formData.ascent_name}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-dino-border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                    />

                    <label className="text-gray-400 text-sm">Ascension Type</label>
                    <select
                        name="ascension_type"
                        value={formData.ascension_type}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-dino-border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                    >
                        <option className="bg-dino-dark" value="" disabled>
                            Select Ascension Type
                        </option>
                        <option className="bg-dino-dark" value="Lead">Lead</option>
                        <option className="bg-dino-dark" value="Toprope">Top Rope</option>
                        <option className="bg-dino-dark" value="Boulder">Boulder</option>
                        <option className="bg-dino-dark" value="Auto-Belay">Auto-Belay</option>
                    </select>

                    <label className="text-gray-400 text-sm">Grade</label>
                    {formData.ascension_type === "" ? (
                        <select
                            disabled
                            className="w-full bg-white/5 border border-dino-border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            style={{ color: "#9ca3af" }}
                        >
                            <option>Select Ascension Type First</option>
                        </select>
                    ) : (
                        <select
                            name="grade"
                            value={formData.grade}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-dino-border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            required
                        >
                            <option className="bg-dino-dark" value="" disabled>
                                Select Grade
                            </option>

                            {formData.ascension_type === "Boulder"
                            ? Object.keys(boulderGradeMaps).map((g) => (
                                <option key={g} className="bg-dino-dark" value={g}>
                                    {g}
                                </option>
                                ))
                            : Object.keys(routeGradeMaps).map((g) => (
                                <option key={g} className="bg-dino-dark" value={g}>
                                    {g}
                                </option>
                                ))}
                        </select>
                    )}


                    <label className="text-gray-400 text-sm">Attempts</label>
                    <input
                        type="number"
                        name="attempts"
                        placeholder="Attempts"
                        value={formData.attempts}
                        onChange={handleChange}
                        min={1}
                        className="w-full bg-white/5 border border-dino-border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />

                    <label className="text-gray-400 text-sm">Height (ft)</label>
                    <input
                        type="number"
                        name="height_ft"
                        placeholder="Height (ft)"
                        value={formData.height_ft}
                        onChange={handleChange}
                        defaultValue={5}
                        min={5}
                        className="w-full bg-white/5 border border-dino-border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />

                    <label className="text-gray-400 text-sm">Style</label>
                    <select
                        name="style"
                        value={formData.style}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-dino-border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                    >
                        <option className="bg-dino-dark" value="" disabled> Select Style</option>
                        <option className="bg-dino-dark" value="Slab" >Slab</option>
                        <option className="bg-dino-dark" value="Crimpy" >Crimpy</option>
                        <option className="bg-dino-dark" value="Overhang" >Overhang</option>
                        <option className="bg-dino-dark" value="Pinchy" >Pinchy</option>
                        <option className="bg-dino-dark" value="Technical" >Technical</option>
                        <option className="bg-dino-dark" value="Dynamic" >Dynamic</option>
                        <option className="bg-dino-dark" value="Pocketed" >Pocketed</option>
                    </select>

                    <label className="text-gray-400 text-sm">Date</label>
                    <input
                        type="date"
                        name="date_climbed"
                        value={formData.date_climbed}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-dino-border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        required
                    />

                    {status.message && (
                        <div
                            className={`text-sm px-3 py-2 rounded-lg ${
                                status.type === "error"
                                    ? "bg-red-500/20 text-red-400 border border-red-500/40"
                                    : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                            }`}
                        >
                            {status.message}
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2 rounded-full bg-white/10 border border-dino-border text-gray-300 hover:bg-white/20 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow transition disabled:opacity-50"
                        >
                            {loading ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
