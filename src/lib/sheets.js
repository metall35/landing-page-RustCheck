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
      console.warn("Could not read tokens for Sheets:", err);
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

export async function appendToGoogleSheet({ name, email, phone, date = null, time = null, formData, type = "Lead" }) {
  try {
    const auth = await getGoogleAuthClient();
    if (!auth) {
      console.warn("Google Sheets credentials not configured.");
      return { success: false, mock: true };
    }

    const timestamp = new Date().toLocaleString("en-US", { timeZone: process.env.TIMEZONE || "America/Toronto" });

    const rowValues = [
      timestamp,
      type,
      name,
      email,
      phone || "N/A",
      date || null,
      time || null,
      formData?.vehicleType || "N/A",
      formData?.make || "N/A",
      formData?.model || "N/A",
      formData?.duration || "N/A",
      formData?.rustCondition || "N/A",
      formData?.previousProtection || "N/A",
      formData?.timeframe || type
    ];

    const sheets = google.sheets({ version: "v4", auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: "A1:N1",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [rowValues]
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Error writing to Google Sheets:", error);
    return { success: false, error: error.message };
  }
}
