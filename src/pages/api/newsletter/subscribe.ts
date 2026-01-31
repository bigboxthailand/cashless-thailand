
import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";

export const POST: APIRoute = async ({ request, clientAddress }) => {
    try {
        const { email, honeypot } = await request.json();

        // 1. Bot Protection: Honeypot & Basic Validation
        if (honeypot) {
            // Silent success for bots
            return new Response(JSON.stringify({ success: true, message: "Subscribed!" }), { status: 200 });
        }

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return new Response(JSON.stringify({ success: false, message: "Invalid email address" }), { status: 400 });
        }

        // 2. Simple Rate Limit (check if IP has subscribed recently - optional, skipping for simplicity unless requested, user asked for anti-bot so honeypot is step 1)

        // 3. Insert into DB
        const { error } = await supabase
            .from("newsletter_subscribers")
            .insert({
                email,
                ip_address: clientAddress,
                user_agent: request.headers.get("user-agent"),
                status: "active",
            });

        if (error) {
            if (error.code === '23505') { // Unique constraint violation
                return new Response(JSON.stringify({ success: true, message: "You are already subscribed!" }), { status: 200 });
            }
            throw error;
        }

        return new Response(JSON.stringify({ success: true, message: "Successfully subscribed!" }), { status: 200 });

    } catch (error) {
        console.error("Newsletter Error:", error);
        return new Response(JSON.stringify({ success: false, message: "Internal Server Error" }), { status: 500 });
    }
};
