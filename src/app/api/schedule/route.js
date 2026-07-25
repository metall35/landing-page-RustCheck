import { NextResponse } from "next/server";
import { google } from "googleapis";
import fs from "fs";
import path from "path";

// Helper function to get authorized Google Calendar client
async function getGoogleCalendarClient() {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  let privateKey = process.env.GOOGLE_PRIVATE_KEY;
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  let activeRefreshToken = process.env.GOOGLE_REFRESH_TOKEN;
  const calendarId = process.env.GOOGLE_CALENDAR_ID || "primary";

  // Check if refresh token was generated via Magic Link and saved to /tmp or calendar_tokens.json
  if (!activeRefreshToken) {
    try {
      const tmpPath = path.join("/tmp", "calendar_tokens.json");
      const rootPath = path.join(process.cwd(), "calendar_tokens.json");
      
      if (fs.existsSync(tmpPath)) {
        const fileData = JSON.parse(fs.readFileSync(tmpPath, "utf8"));
        activeRefreshToken = fileData.refresh_token;
      } else if (fs.existsSync(rootPath)) {
        const fileData = JSON.parse(fs.readFileSync(rootPath, "utf8"));
        activeRefreshToken = fileData.refresh_token;
      }
    } catch (err) {
      console.warn("Could not read calendar_tokens.json:", err);
    }
  }

  let auth;

  // Option 1: OAuth 2.0 User Auth (Linked via Magic Link)
  if (clientId && clientSecret && activeRefreshToken) {
    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
    oauth2Client.setCredentials({ refresh_token: activeRefreshToken });
    auth = oauth2Client;
  }
  // Option 2: Service Account Auth
  else if (clientEmail && privateKey) {
    let formattedKey = privateKey.trim();
    if (formattedKey.startsWith('"') && formattedKey.endsWith('"')) {
      formattedKey = formattedKey.slice(1, -1);
    }
    formattedKey = formattedKey.replace(/\\n/g, "\n");

    auth = new google.auth.JWT({
      email: clientEmail,
      key: formattedKey,
      scopes: [
        "https://www.googleapis.com/auth/calendar",
        "https://www.googleapis.com/auth/calendar.events"
      ]
    });

    await auth.authorize();
  } else {
    return { mock: true };
  }

  const calendar = google.calendar({ version: "v3", auth });
  return { calendar, auth, calendarId };
}

// GET: Fetch booked slots and user bookings for a specific date
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const date = url.searchParams.get("date");
    const checkEmail = url.searchParams.get("email")?.toLowerCase();

    if (!date) {
      return NextResponse.json({ error: "Date parameter is required." }, { status: 400 });
    }

    const clientObj = await getGoogleCalendarClient();
    if (clientObj.mock) {
      return NextResponse.json({ bookedSlots: [], emailAlreadyBooked: false, mock: true });
    }

    const { calendar, auth, calendarId } = clientObj;
    const timeZone = process.env.TIMEZONE || "America/Toronto";

    // Query events for the full 24-hour range of the selected date
    const timeMin = new Date(`${date}T00:00:00`).toISOString();
    const timeMax = new Date(`${date}T23:59:59`).toISOString();

    const response = await calendar.events.list({
      auth,
      calendarId,
      timeMin,
      timeMax,
      singleEvents: true,
      orderBy: "startTime"
    });

    const events = response.data.items || [];
    const bookedSlots = [];
    let emailAlreadyBooked = false;

    events.forEach(event => {
      if (event.status === "cancelled") return;

      // Check booked hours
      if (event.start && event.start.dateTime) {
        const eventDate = new Date(event.start.dateTime);
        const hours = String(eventDate.getHours()).padStart(2, "0");
        const minutes = String(eventDate.getMinutes()).padStart(2, "0");
        const slotTime = `${hours}:${minutes}`;
        if (!bookedSlots.includes(slotTime)) {
          bookedSlots.push(slotTime);
        }
      }

      // Check if this email already booked on this date
      if (checkEmail) {
        const isAttendee = event.attendees?.some(
          att => att.email && att.email.toLowerCase() === checkEmail
        );
        const isMentionedInDescription = event.description?.toLowerCase().includes(checkEmail);
        const isMentionedInSummary = event.summary?.toLowerCase().includes(checkEmail);

        if (isAttendee || isMentionedInDescription || isMentionedInSummary) {
          emailAlreadyBooked = true;
        }
      }
    });

    return NextResponse.json({
      date,
      bookedSlots,
      emailAlreadyBooked
    });
  } catch (error) {
    console.error("Error fetching availability:", error);
    return NextResponse.json({ bookedSlots: [], emailAlreadyBooked: false });
  }
}

// POST: Create appointment with conflict & duplicate prevention
export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, phone, date, time, formData } = body;

    if (!name || !email || !date || !time) {
      return NextResponse.json(
        { error: "Missing required booking fields (name, email, date, time)." },
        { status: 400 }
      );
    }

    const clientObj = await getGoogleCalendarClient();
    const userEmailLower = email.trim().toLowerCase();

    // Fallback Mock Mode if credentials not set
    if (clientObj.mock) {
      console.warn("Google Calendar credentials not set. Returning mock success.");
      return NextResponse.json({
        success: true,
        mock: true,
        message: "Appointment received! (Demo Mode: Configure Google Calendar API credentials in .env.local to sync directly with Google Calendar API)",
        bookingDetails: { name, email, phone, date, time, vehicle: `${formData?.make || ''} ${formData?.model || ''}` }
      });
    }

    const { calendar, auth, calendarId } = clientObj;
    const timeZone = process.env.TIMEZONE || "America/Toronto";

    // -------------------------------------------------------------
    // 1. AVAILABILITY & DUPLICATE CHECK BEFORE BOOKING
    // -------------------------------------------------------------
    const timeMin = new Date(`${date}T00:00:00`).toISOString();
    const timeMax = new Date(`${date}T23:59:59`).toISOString();

    const existingEventsResponse = await calendar.events.list({
      auth,
      calendarId,
      timeMin,
      timeMax,
      singleEvents: true
    });

    const existingEvents = existingEventsResponse.data.items || [];

    for (const event of existingEvents) {
      if (event.status === "cancelled") continue;

      // Check A: Duplicate Booking for same Email on same Date
      const isAttendee = event.attendees?.some(
        att => att.email && att.email.toLowerCase() === userEmailLower
      );
      const isMentionedInDesc = event.description?.toLowerCase().includes(userEmailLower);

      if (isAttendee || isMentionedInDesc) {
        return NextResponse.json(
          {
            error: "Ya tienes una cita agendada para este día.",
            details: `El correo ${email} ya cuenta con una inspección reservada para la fecha ${date}. Si necesitas modificar tu cita, por favor ponte en contacto con nosotros.`
          },
          { status: 400 }
        );
      }

      // Check B: Time Slot Conflict (Double-Booking Prevention)
      if (event.start && event.start.dateTime) {
        const eventStart = new Date(event.start.dateTime);
        const eventHours = String(eventStart.getHours()).padStart(2, "0");
        const eventMinutes = String(eventStart.getMinutes()).padStart(2, "0");
        const existingSlot = `${eventHours}:${eventMinutes}`;

        if (existingSlot === time) {
          return NextResponse.json(
            {
              error: "Horario no disponible.",
              details: `El horario de las ${time} para la fecha ${date} ya ha sido reservado por otro usuario. Por favor selecciona otro horario disponible.`
            },
            { status: 400 }
          );
        }
      }
    }

    // -------------------------------------------------------------
    // 2. CREATE GOOGLE CALENDAR EVENT
    // -------------------------------------------------------------
    const startDateTime = `${date}T${time}:00`;
    const [hours, minutes] = time.split(":").map(Number);
    const endHours = String((hours + 1) % 24).padStart(2, "0");
    const endDateTime = `${date}T${endHours}:${String(minutes).padStart(2, "0")}:00`;

    const summary = `Rust Check Appointment - ${name} (${formData?.make || "Vehicle"} ${formData?.model || ""})`;
    const description = `
🚗 RUST CHECK APPOINTMENT DETAILS 🚗
----------------------------------------
Name: ${name}
Email: ${email}
Phone: ${phone || "N/A"}

VEHICLE & FORM DETAILS:
• Vehicle Type: ${formData?.vehicleType || "N/A"}
• Make & Model: ${formData?.make || "N/A"} ${formData?.model || ""}
• Retention Plan: ${formData?.duration || "N/A"}
• Rust Condition: ${formData?.rustCondition || "N/A"}
• Previous Protection: ${formData?.previousProtection || "N/A"}
• Timeframe Urgency: ${formData?.timeframe || "N/A"}
----------------------------------------
Scheduled via Rust Check Online Form.
`.trim();

    const attendees = [{ email: email }];

    const event = {
      summary,
      description,
      start: {
        dateTime: startDateTime,
        timeZone,
      },
      end: {
        dateTime: endDateTime,
        timeZone,
      },
      attendees,
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 },
          { method: "popup", minutes: 60 },
        ],
      },
    };

    const response = await calendar.events.insert({
      auth: auth,
      calendarId: calendarId,
      requestBody: event,
      sendUpdates: "all",
    });

    return NextResponse.json({
      success: true,
      eventId: response.data.id,
      htmlLink: response.data.htmlLink,
      message: "Appointment successfully scheduled on Google Calendar!"
    });
  } catch (error) {
    const errorDetails = error.response?.data?.error?.message || error.message || error.toString();
    console.error("Error creating Google Calendar event:", errorDetails, error.response?.data);
    return NextResponse.json(
      { 
        error: "Failed to create Google Calendar event", 
        details: errorDetails 
      },
      { status: 500 }
    );
  }
}
