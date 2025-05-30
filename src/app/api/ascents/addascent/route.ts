import { NextResponse } from "next/server";
import db from "../../../lib/db";

export async function POST(req: Request) {
    const res = NextResponse;

    if (req.method !== "POST") {
        return res.json({ error: "Method not allowed!" }, { status: 405 });
    }

    try {
        const { uid, ascentName = null, grade, attempts, ascentType = null } = await req.json();

        if (!uid || !grade || !attempts) {
            return res.json({ error: "Missing required fields." }, { status: 400 });
        }

        const { error } = await db
            .from("ascensions")
            .insert([
                {
                    uid,
                    ascent_name: ascentName,
                    grade,
                    attempts,
                    ascension_type: ascentType
                }
            ]);

        if (error) {
            console.error("Failed to insert ascent into db.", error);
            return res.json({ error: "Internal server error." }, { status: 500 });
        }

        return res.json({ message: "Ascent added successful!" }, { status: 201 });
    } catch (error) {
        console.error("Registration error: ", error);
        return res.json({ error: "Internal server error." }, { status: 500 });
    }
}