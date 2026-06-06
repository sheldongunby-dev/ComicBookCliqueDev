import { NextResponse } from "next/server";
import { z } from "zod";
import fs from "fs";
import path from "path";

const newsletterSchema = z.object({
    email: z.string().email("Please provide a valid email address."),
});

const SUBSCRIPTIONS_FILE = path.join(process.cwd(), "src/content/generated/newsletter-subscriptions.json");

export async function POST(req: Request) {
    try {
        const body = await req.json();
        
        // Validate request body
        const result = newsletterSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { success: false, error: result.error.errors[0].message },
                { status: 400 }
            );
        }

        const { email } = result.data;

        // Ensure the directory exists
        const dir = path.dirname(SUBSCRIPTIONS_FILE);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        // Read current subscriptions
        let subscriptions: Array<{ email: string; timestamp: string }> = [];
        if (fs.existsSync(SUBSCRIPTIONS_FILE)) {
            try {
                const data = fs.readFileSync(SUBSCRIPTIONS_FILE, "utf-8");
                subscriptions = JSON.parse(data);
            } catch (e) {
                console.error("Failed to read subscription file, resetting:", e);
            }
        }

        // Check if already subscribed
        const normalizedEmail = email.toLowerCase().trim();
        const exists = subscriptions.some(sub => sub.email.toLowerCase().trim() === normalizedEmail);

        if (exists) {
            return NextResponse.json(
                { success: true, message: "You're already subscribed! Thank you!" },
                { status: 200 }
            );
        }

        // Add new subscription
        subscriptions.push({
            email: normalizedEmail,
            timestamp: new Date().toISOString()
        });

        // Write back to file
        fs.writeFileSync(SUBSCRIPTIONS_FILE, JSON.stringify(subscriptions, null, 2), "utf-8");

        return NextResponse.json(
            { success: true, message: "Successfully subscribed to the Clique newsletter!" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Newsletter Subscription Failure:", error);
        return NextResponse.json(
            { success: false, error: "An unexpected error occurred. Please try again later." },
            { status: 500 }
        );
    }
}
