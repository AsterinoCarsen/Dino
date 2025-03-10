import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../../lib/db";

const KEY = process.env.JWT_SECRET;

if (!KEY) {
    throw new Error("Missing JWT_SECRET environment variable!");
}

interface LoginRequestBody {
    username: string;
    password: string;
}

export async function POST(req: Request) {
    const res = NextResponse;

    if (req.method !== "POST") {
        return res.json({ error: "Method not allowed!" }, { status: 405 });
    }

    try {
        const { username, password }: LoginRequestBody = await req.json();

        if (!username || !password) {
            return res.json({ error: "Username and password are required." }, { status: 400 });
        }

        const { data: user, error } = await db
            .from("users")
            .select("uid, username, password_hash")
            .eq("username", username)
            .single();

        if (error || !user) {
            return res.json({ error: "Invalid credentials." }, { status: 401 });
        }

        const passwordMatch = await bcrypt.compare(password, user.password_hash);

        if (!passwordMatch) {
            return res.json({ error: "Invalid credentials." }, { status: 401 });
        }

        const token = jwt.sign(
            { username: user.username },
            KEY as string,
            { expiresIn: "1h" }
        );

        return res.json({ message: "Login successful!", token }, { status: 200 });
    } catch (error) {
        console.error("Login error: ", error);
        return res.json({ error: "Internal server error." }, { status: 500 });
    }
}
