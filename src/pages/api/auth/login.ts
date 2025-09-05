import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../../../lib/db";

const KEY = process.env.JWT_SECRET;

if (!KEY) throw new Error("Missing JWT secret environment variable.");

const JWT_SECRET: string = KEY;

interface LoginRequestBody {
    username: string;
    password: string;
}

interface LoginResponse {
    success: boolean;
    message: string;
    token?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<LoginResponse>) {
    if (req.method !== "POST") {
        return res.status(405).json({ success: false, message: "Method not allowed" });
    }

    try {
        const { username, password } = req.body as LoginRequestBody;

        if (!username || !password) {
            return res
                .status(400)
                .json({ success: false, message: "Username and password are required." });
        }

        const { data: user, error: dbError } = await db
            .from("users")
            .select("public_id, username, password_hash")
            .eq("username", username)
            .single();

        if (dbError || !user) {
            return res.status(401).json({ success: false, message: "Invalid credentials." });
        }

        const passwordMatch = await bcrypt.compare(password, user.password_hash);

        if (!passwordMatch) {
            return res.status(401).json({ success: false, message: "Invalid credentials." });
        }

        const token = jwt.sign(
            { uid: user.public_id, username: user.username },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        return res.status(200).json({
            success: true,
            message: "Login successful!",
            token,
        });
    } catch (error) {
        console.error("Login error", error);
        return res
            .status(500)
            .json({ success: false, message: "Internal server error." });
    }
}
