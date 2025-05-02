import { NextResponse } from "next/server";

import bcrypt from "bcrypt";
import db from "../../../lib/db";

interface RegisterRequestBody {
    username: string;
    password: string;
    captchaToken: string;
}

interface CaptchaResponse {
    success: boolean;
    challenge_ts?: string;
    hostname?: string;
    "error-codes"?: string[];
}

export async function POST(req: Request) {
    const res = NextResponse;

    if (req.method !== "POST") {
        return res.json({ error: "Method not allowed!" }, { status: 405 });
    }

    try {
        const { username, password, captchaToken }: RegisterRequestBody = await req.json();

        if (!username || !password) {
            return res.json({ error: "Username and password are required." }, { status: 400 });
        }

        if (username.length < 4) {
            return res.json({ error: "Usernames must be at least 4 characters." }, { status: 400 });
        }

        if (password.length < 6) {
            return res.json({ error: "Passwords must be at least 6 characters." }, { status: 400 });
        }

        const secretKey = process.env.CAPTCHA_SECRET;
        const verifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaToken}`

        const captchaVerifyResponse = await fetch(verifyURL, { method: "POST"});
        const captchaResult: CaptchaResponse = await captchaVerifyResponse.json();

        if (!captchaResult.success) {
            return NextResponse.json({ error: "CAPTCHA verification failed." }, { status: 400 });
        }

        const { data: existingUser } = await db
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

        return res.json({ message: "Registration successful!" }, { status: 201 });
    } catch (error) {
        console.error("Registration error: ", error);
        return res.json({ error: "Internal server error." }, { status: 500 });
    }
}