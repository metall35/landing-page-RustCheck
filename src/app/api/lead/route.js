import { NextResponse } from "next/server";
import { google } from "googleapis";
import fs from "fs";
import path from "path";

const SPREADSHEET_ID = "1GzXdZDx6jdn2X6FDHVpkvn_QDkLOig6OEQ4NmTpRleE";

async function getGoogleAuthClient() {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  let privateKey = process.env.GOOGLE_PRIVATE_KEY;
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  let activeRefreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  if (!activeRefreshToken) {
    try {
      const tmpPath = path.join("/tmp", "calendar_tokens.json");
      const rootPath = path.join(process.cwd(), "calendar_tokens.json");
      if (fs.existsSync(tmpPath)) {
        activeRefreshToken = JSON.parse(fs.readFileSync(tmpPath, "utf8")).refresh_token;
      } else if (fs.existsSync(rootPath)) {
        activeRefreshToken = JSON.parse(fs.readFileSync(rootPath, "utf8")).refresh_token;
      }
    } catch (err) {
      console.warn("Could not read tokens:", err);
    }
  }

  let auth;
  if (clientId && clientSecret && activeRefreshToken) {
    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
    oauth2Client.setCredentials({ refresh_token: activeRefreshToken });
    auth = oauth2Client;
  } else if (clientEmail && privateKey) {
    let formattedKey = privateKey.trim();
    if (formattedKey.startsWith('"') && formattedKey.endsWith('"')) {
      formattedKey = formattedKey.slice(1, -1);
    }
    formattedKey = formattedKey.replace(/\\n/g, "\n");

    auth = new google.auth.JWT({
      email: clientEmail,
      key: formattedKey,
      scopes: [
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/drive"
      ]
    });
    await auth.authorize();
  } else {
    return null;
  }

  return auth;
}

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

    const timestamp = new Date().toLocaleString("en-US", { timeZone: process.env.TIMEZONE || "America/Toronto" });
    const rowValues = [
      timestamp,
      name,
      email,
      phone || "N/A",
      formData?.vehicleType || "N/A",
      formData?.make || "N/A",
      formData?.model || "N/A",
      formData?.duration || "N/A",
      formData?.rustCondition || "N/A",
      formData?.previousProtection || "N/A",
      formData?.timeframe || "Just Looking"
    ];

    const auth = await getGoogleAuthClient();

    if (!auth) {
      console.warn("Google credentials not configured for Sheets. Returning mock lead success.");
      return NextResponse.json({
        success: true,
        mock: true,
        message: "Lead recorded in demo mode!"
      });
    }

    const sheets = google.sheets({ version: "v4", auth });

    // Append row to Google Sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: "A1:K1",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [rowValues]
      }
    });

    return NextResponse.json({
      success: true,
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
