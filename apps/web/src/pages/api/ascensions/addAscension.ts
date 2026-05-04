import type { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/db";
import { NewAscension } from "@/lib/performance/getAscensionsType";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ success: false, message: "Method not allowed" });
    }

    try {
        const { public_id, ...ascension } = req.body as NewAscension & { public_id: string };

        if (
            !public_id || !ascension.ascent_name ||
            !ascension.grade || !ascension.ascension_type ||
            !ascension.date_climbed
        ) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const { data: user, error: userError } = await db
            .from("users")
            .select("uid")
            .eq("public_id", public_id)
            .single();

        if (userError || !user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const { data, error } = await db
            .from("ascensions")
            .insert([{
                ...ascension,
                uid: user.uid
            }])
            .select("*")
            .single();

        if (error) {
            return res.status(500).json({ success: false, message: "Database error" });
        }

        return res.status(200).json({ success: true, data });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}
