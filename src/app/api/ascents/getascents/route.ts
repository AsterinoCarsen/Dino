import { NextResponse } from "next/server";
import { calculateClimbingElo } from "../../../lib/EloFormula";
import db from "../../../lib/db";

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

        const elo = calculateClimbingElo(data);

        return res.json({ data, elo }, { status: 200 });
    } catch (error) {
        console.error("Login error: ", error);
        return res.json({ error: "Internal server error." }, { status: 500 });
    }
}