import { NextResponse } from "next/server";

export async function GET() {
    try {
        // Fetch the YouTube live endpoint with a browser User-Agent
        const response = await fetch("https://www.youtube.com/@dirtsheetradio/live", {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.5",
            },
            next: { revalidate: 60 } // Cache status for 60 seconds to stay super fast and avoid YouTube rate limiting
        });

        if (!response.ok) {
            return NextResponse.json({ isLive: false, streamUrl: null });
        }

        const html = await response.text();

        // Detect active live signals, explicitly excluding scheduled/upcoming streams
        const isUpcoming = html.includes('"isUpcoming":true') || 
                           html.includes('upcomingEventData') || 
                           html.includes('"status":"UPCOMING"');

        const hasLiveSignals = html.includes('"isLiveNow":true') || 
                               html.includes('"status":"LIVE"') ||
                               (html.includes('watch?v=') && html.includes('{"label":"LIVE"}'));

        const isLive = hasLiveSignals && !isUpcoming;

        let streamUrl = null;
        let videoId = null;

        if (isLive) {
            // Extract the active live video ID from standard watch canonical links
            const canonicalMatch = html.match(/"canonical":"https:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)"/);
            if (canonicalMatch && canonicalMatch[1]) {
                videoId = canonicalMatch[1];
            } else {
                // Secondary fallback match
                const videoIdMatch = html.match(/"videoId":"([a-zA-Z0-9_-]+)"/);
                if (videoIdMatch && videoIdMatch[1]) {
                    videoId = videoIdMatch[1];
                }
            }
        }

        if (videoId) {
            streamUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`;
        }

        return NextResponse.json({ 
            isLive, 
            streamUrl,
            channelUrl: "https://www.youtube.com/@dirtsheetradio/live"
        });
    } catch (error) {
        console.error("DSR Live Check Failure:", error);
        // Fail silently so the UI just shows offline instead of breaking
        return NextResponse.json({ isLive: false, streamUrl: null });
    }
}
