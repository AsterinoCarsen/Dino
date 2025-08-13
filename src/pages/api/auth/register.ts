import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../../../lib/db";

const KEY = process.env.JWT_SECRET;

if (!KEY) throw new Error("Missing JWT secret environment variable.");

interface RegisterRequestBody {
    username: string;
    password: string;
}

interface RegisterResponse {
    success: boolean;
    message: string;
    token?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<RegisterResponse>) {
    if (req.method !== "POST") {
        return res.status(405).json({ success: false, message: "Method not allowed" });
    }

    try {
        const { username, password } = req.body as RegisterRequestBody;

        if (!username || !password) {
            return res.status(400).json({ success: false, message: "Username and password are required" });
        }

        const { data: existingUser, error: checkError } = await db
            .from("users")
            .select("*")
            .eq("username", username)
            .limit(1);

        // The error "no rows found" is PGRST116
        if (checkError && checkError.code !== "PGRST116") {
            return res.status(500).json({ success: false, message: "Error checking user" });
        }

        if (existingUser && existingUser.length > 0) {
            return res.status(409).json({ success: false, message: "Username is already taken" });
        }

        const password_hash = await bcrypt.hash(password, 10);

        const { data: newUser, error: insertError } = await db
            .from("users")
            .insert([{ username, password_hash }])
            .select()
            .single();

        if (insertError) {
            return res.status(500).json({ success: false, message: "Database error while creating user" });
        }

        const token = jwt.sign(
            { uid: newUser.uid, username: newUser.username },
            KEY,
            { expiresIn: "1h" }
        );

        return res.status(201).json({ success: true, message: "User registered successfully", token });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}
