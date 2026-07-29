import { NextResponse } from "next/server";
import { appendToGoogleSheet } from "@/lib/sheets";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, phone, formData } = body;

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
      type: "Call Back Request"
    });

    return NextResponse.json({
      success: true,
      mock: Boolean(result.mock),
      message: "Lead successfully recorded in Google Sheets!"
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
