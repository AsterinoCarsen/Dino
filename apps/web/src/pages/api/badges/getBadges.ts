import type { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ success: false, message: "Method not allowed" });
    }

    try {
        const { public_id } = req.query;

        if (!public_id) {
            return res.status(400).json({ success: false, message: "Missing required fields"});
        }

        const { data: user, error: userError } = await db
            .from("users")
            .select("uid")
            .eq("public_id", public_id)
            .single();

        if (userError || !user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const uid = user.uid;

        const { data: badges, error: badgeError } = await db
            .from("badges")
            .select("earned_at, icon_key, title, description");

        if (badgeError) {
            return res.status(500).json({ success: false, message: "Database error" });
        }

        return res.status(200).json({ success: true, badges });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}