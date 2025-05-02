import { NextResponse } from "next/server";
import db from "../../../lib/db";

interface DeleteRequestBody {
    aid: number;
}

export async function DELETE(req: Request) {
    const res = NextResponse;

    if (req.method !== "DELETE") {
        return res.json({ error: "Method not allowed!" }, { status: 405 });
    }

    try {
        const { aid }: DeleteRequestBody = await req.json();
        console.log(aid);

        if (!aid) {
            return res.json({ error: "Missing required field." }, { status: 400 });
        }

        const { error } = await db
            .from('ascensions')
            .delete()
            .eq('aid', aid);

        if (error) {
            return res.json({ error: error.message }, { status: 500 });
        }

        return res.json({ message: "Ascension deleted successfully!" }, { status: 200 });
    } catch (error) {
        console.error("Error during DELETE operation:", error);
        return res.json({ error: "Internal server error." }, { status: 500 });
    }
}