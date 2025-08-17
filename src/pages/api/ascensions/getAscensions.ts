import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ success: false, message: "Method not allowed" });
    }

    try {
        const { public_id } = req.query;

        if (!public_id) {
            return res.status(400).json({ success: false, message: "Missing parameter" });
        }

        const { data, error } = await db
            .from("ascensions")
            .select("*, users!inner(public_id)")
            .eq("users.public_id", public_id);

        if (error) {
            return res.status(500).json({ success: false, message: "Database error" });
        }

        if (!data || data.length === 0) {
            return res.status(404).json({ success: false, message: "User not found or no ascensions found" });
        }

        return res.status(200).json({ success: true, data });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}
