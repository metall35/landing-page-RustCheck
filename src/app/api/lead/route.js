import { NextResponse } from "next/server";
import { appendToGoogleSheet } from "@/lib/sheets";
import { sendLeadNotificationEmail } from "@/lib/mailer";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, phone, formData, trafficSource = "Direct" } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required." },
        { status: 400 }
      );
    }

    const result = await appendToGoogleSheet({
      name,
      email,
      phone,
      date: null,
      time: null,
      formData,
      type: "Call Back Request",
      status: "Pending",
      trafficSource
    });

    // Send email notification to process.env.GOOGLE_CALENDAR_ID / NOTIFICATION_EMAIL
    await sendLeadNotificationEmail({
      name,
      email,
      phone,
      formData,
      type: "Call Back Request",
      trafficSource
    });

    return NextResponse.json({
      success: true,
      mock: Boolean(result.mock),
      message: "Lead successfully recorded and notified!"
    });
  } catch (error) {
    console.error("Error writing lead to Google Sheets:", error);
    const errorDetails = error.response?.data?.error?.message || error.message || error.toString();
    return NextResponse.json(
      {
        error: "Failed to record lead in Google Sheets",
        details: errorDetails
      },
      { status: 500 }
    );
  }
}
