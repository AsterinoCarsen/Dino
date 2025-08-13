import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const KEY = process.env.JWT_SECRET;

if (!KEY) throw new Error("Missing JWT secret environment variable.");

interface VerifyRequestBody {
    token: string;
}

interface VerifyResponseBody {
    success: boolean;
    message: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<VerifyResponseBody>) {
    if (req.method !== "POST") {
        return res.status(405).json({ success: false, message: "Method not allowed" });
    }

    try {
        const { token } = req.body as VerifyRequestBody;

        if (!token) {
            return res.status(400).json({ success: false, message: "Missing token."});
        }

        const decoded = jwt.verify(token, KEY) as jwt.JwtPayload;

        return res.status(200).json({ success: true, message: "Token is valid." });
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
}
