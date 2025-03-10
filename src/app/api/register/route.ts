import { NextResponse } from "next/server";

import bcrypt from "bcrypt";
import db from "../../lib/db";

interface RegisterRequestBody {
    username: string;
    password: string;
}

export async function POST(req: Request) {
    const res = NextResponse;

    if (req.method !== "POST") {
        return res.json({ error: "Method not allowed!" }, { status: 405 });
    }

    try {
        const { username, password }: RegisterRequestBody = await req.json();

        if (!username || !password) {
            return res.json({ error: "Username and password are required." }, { status: 400 });
        }

        const { data: existingUser, error: userCheckError } = await db
            .from("users")
            .select("username")
            .eq("username", username)
            .single();

        if (existingUser) {
            return res.json({ error: "Username is already taken." }, { status: 409 });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const { error: insertError } = await db
            .from("users")
            .insert([{ username, password_hash: passwordHash}]);

        if (insertError) {
            return res.json({ error: "Failed to register user." }, { status: 500 });
        }

        return res.json({ error: "Registration successful!" }, { status: 201 });
    } catch (error) {
        console.error("Registration error: ", error);
        return res.json({ error: "Internal server error." }, { status: 500 });
    }
}