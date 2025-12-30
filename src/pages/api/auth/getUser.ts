import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ success: false, message: "Method not allowed" });
    }

    try {
        const { uuid } = req.query;

        if (!uuid || typeof uuid !== "string") {
            return res.status(400).json({ success: false, message: "Missing or invalid UUID."});
        }

        const { data, error } = await db
            .from("users")
            .select("username, created_at")
            .eq("public_id", uuid)
            .single();

        if (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: "Database error."});
        }

        if (!data) {
            return res.status(404).json({ success: false, message: "User not found."});
        }

        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.error("Login error", error);
        return res
            .status(500)
            .json({ success: false, message: "Internal server error." });
    }
}
