import { google } from "googleapis";

const SPREADSHEET_ID = "1GzXdZDx6jdn2X6FDHVpkvn_QDkLOig6OEQ4NmTpRleE";

async function getGoogleAuthClient() {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  let privateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (clientEmail && privateKey) {
    let formattedKey = privateKey.trim();
    if (formattedKey.startsWith('"') && formattedKey.endsWith('"')) {
      formattedKey = formattedKey.slice(1, -1);
    }
    formattedKey = formattedKey.replace(/\\n/g, "\n");

    const auth = new google.auth.JWT({
      email: clientEmail,
      key: formattedKey,
      scopes: [
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/drive"
      ]
    });
    await auth.authorize();
    return auth;
  }

  return null;
}

export async function appendToGoogleSheet({ name, email, phone, date = null, time = null, formData, type = "Lead", status = "Pending", trafficSource = "Direct" }) {
  try {
    const auth = await getGoogleAuthClient();
    if (!auth) {
      console.warn("Google Sheets Service Account credentials not configured.");
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
      formData?.timeframe || type,
      status || "Pending",
      trafficSource || "Direct"
    ];

    const sheets = google.sheets({ version: "v4", auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: "A1:P1",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [rowValues]
      }
    });

    console.log(`Successfully recorded ${type} for ${email} in Google Sheets.`);
    return { success: true };
  } catch (error) {
    console.error("Error writing to Google Sheets:", error);
    return { success: false, error: error.message };
  }
}
