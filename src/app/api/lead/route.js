import { NextResponse } from "next/server";
import { appendToGoogleSheet } from "@/lib/sheets";
import { sendLeadNotificationEmail } from "@/lib/mailer";
import { sendMetaConversion, buildUserData, getRequestContext, getVehicleValue } from "@/lib/meta";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, phone, formData, trafficSource = "Direct", eventId } = body;

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

    // Meta Conversions API. This branch used to fire no pixel event at all, so
    // every call-back request was invisible to Meta despite being a real lead.
    const ctx = getRequestContext(req);
    const metaResult = await sendMetaConversion({
      eventName: "Lead",
      eventId: eventId ? `${eventId}-lead` : undefined,
      eventSourceUrl: req.headers.get("referer") || process.env.NEXT_PUBLIC_SITE_URL,
      userData: buildUserData({ name, email, phone, ...ctx }),
      customData: {
        currency: "CAD",
        value: getVehicleValue(formData?.vehicleType),
        content_name: `${formData?.vehicleType || "Vehicle"} Rust Protection`,
        content_category: "Auto Services",
        content_type: "product",
        content_ids: [formData?.vehicleType || "vehicle"],
        lead_type: "call_back_request",
        traffic_source: trafficSource
      }
    });

    return NextResponse.json({
      success: true,
      mock: Boolean(result.mock),
      metaCapi: metaResult.sent ? "sent" : metaResult.skipped ? "skipped" : "failed",
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
