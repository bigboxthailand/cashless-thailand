
import type { APIRoute } from "astro";
import { supabaseAdmin } from "../../../lib/supabase";

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();
        const { shopId, action } = body;

        if (!shopId || !action) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
        }

        let updates = {};

        if (action === "approve") updates = { status: "active" };
        else if (action === "reject") updates = { status: "rejected" }; // or rejected?
        else if (action === "suspend") updates = { status: "suspended" };
        else if (action === "restore") updates = { status: "active" };
        else if (action === "delete") {
            const { error: delError } = await supabaseAdmin.from("shops").delete().eq("id", shopId);
            if (delError) throw delError;
            return new Response(JSON.stringify({ success: true }), { status: 200 });
        } else {
            return new Response(JSON.stringify({ error: "Invalid action" }), { status: 400 });
        }

        const { error } = await supabaseAdmin
            .from("shops")
            .update(updates)
            .eq("id", shopId);

        if (error) throw error;

        return new Response(JSON.stringify({ success: true }), { status: 200 });

    } catch (error: any) {
        console.error("Admin Action Error:", error);
        return new Response(JSON.stringify({ error: error.message || "Server Error" }), { status: 500 });
    }
};
