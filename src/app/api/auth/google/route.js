import { NextResponse } from "next/server";
import { google } from "googleapis";

export async function GET(req) {
  try {
    const host = req.headers.get("host");
    const protocol = req.headers.get("x-forwarded-proto") || "http";
    const redirectUri = `${protocol}://${host}/api/auth/callback`;

    const clientId = process.env.GOOGLE_CLIENT_ID || "1039666854022-rrrtiol4qcvtp0lksuna48e23hp17cq7.apps.googleusercontent.com";
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!clientSecret) {
      return new NextResponse(
        "Missing GOOGLE_CLIENT_SECRET. Please add GOOGLE_CLIENT_SECRET to .env.local",
        { status: 400 }
      );
    }

    const oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUri
    );

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: [
        "https://www.googleapis.com/auth/calendar",
        "https://www.googleapis.com/auth/calendar.events"
      ],
      prompt: "consent"
    });

    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error("Auth redirect error:", error);
    return new NextResponse(`Error initiating OAuth: ${error.message}`, { status: 500 });
  }
}
