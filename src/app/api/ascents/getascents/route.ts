import { NextResponse } from "next/server";
import { GRADE_MAP } from "../../../lib/grades";
import db from "../../../lib/db";

const DECAY_RATE = 0.02; // Controls how much weighting old climbs have over elo

export async function GET(req: Request) {
    const res = NextResponse;

    if (req.method !== "GET") {
        return res.json({ error: "Method not allowed!" }, { status: 405 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const uid = searchParams.get("uid");

        if (!uid) {
            return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
        }

        const { data, error } = await db
            .from("ascensions")
            .select("*")
            .eq("uid", uid);

        if (error || !data) {
            return res.json({ error: "Invalid credentials." }, { status: 401 });
        }

        // Calculate ELO
        const now = new Date();

        let weightedSum = 0;
        let weightTotal = 0;

        for (const ascent of data) {
            const gradeValue = GRADE_MAP[ascent.grade] || 800;
            const attempts = ascent.attempts;
            const ascentDate = new Date(ascent.created_at);
            const daysSince = (now.getTime() - ascentDate.getTime()) / (1000 * 60 * 60 * 24);
            const timeDecay = Math.exp(-DECAY_RATE * daysSince);
            const attemptMultiplier = 1 - Math.log2(attempts) / 5;

            const weight = attemptMultiplier * timeDecay;
            weightedSum += gradeValue * weight;
            weightTotal += weight;
        }

        const elo = weightTotal > 0 ? weightedSum / weightTotal : 800;

        return res.json({ data, elo }, { status: 200 });
    } catch (error) {
        console.error("Login error: ", error);
        return res.json({ error: "Internal server error." }, { status: 500 });
    }
}