import type { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/db";

interface BadgeToAdd {
    title: string;
    icon_key: string;
    description?: string;
    earned_at: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ success: false, message: "Method not allowed" });
    }

    try {
        const { public_id, badges } = req.body;

        if (!public_id || !badges) {
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

        const uid = user.uid;

        const inserts = badges.map((badge: BadgeToAdd) => ({
            uid,
            title: badge.title,
            icon_key: badge.icon_key,
            description: badge.description,
            earned_at: badge.earned_at
        }));

        const { error: insertError } = await db
            .from("badges")
            .insert(inserts);

        if (insertError) {
            return res.status(500).json({ success: false, message: "Database error" });
        }

        return res.status(200).json({ success: true, added: inserts });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}