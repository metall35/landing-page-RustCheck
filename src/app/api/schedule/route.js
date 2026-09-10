import { NextResponse } from "next/server";
import { google } from "googleapis";
import fs from "fs";
import path from "path";
import { appendToGoogleSheet } from "@/lib/sheets";
import { sendLeadNotificationEmail } from "@/lib/mailer";
import { getTimeSlotsForDate, isSundayDate, SLOT_DURATION_MINUTES } from "@/lib/slots";
import {
  collectBusy,
  getBlockedSlots,
  isDayBlocked,
  isIntervalBusy,
  zonedWallTimeToInstant,
  addDays
} from "@/lib/calendarAvailability";
import { sendMetaConversion, buildUserData, getRequestContext, getVehicleValue } from "@/lib/meta";

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

// Helper function to extract date string (YYYY-MM-DD) and time string (HH:mm) in a target timezone
function getDateTimePartsInZone(dateObj, timeZone) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23"
  });
  const parts = formatter.formatToParts(dateObj);
  const map = {};
  parts.forEach(p => { if (p.type !== 'literal') map[p.type] = p.value; });
  return {
    dateStr: `${map.year}-${map.month}-${map.day}`,
    timeStr: `${map.hour}:${map.minute}`
  };
}

// Fetches every event in a window. Padded by a day on each side so events that
// straddle midnight in the business timezone are still seen.
async function listEvents(calendar, auth, calendarId, fromDate, toDate) {
  const timeMin = new Date(`${addDays(fromDate, -1)}T00:00:00Z`).toISOString();
  const timeMax = new Date(`${addDays(toDate, 2)}T00:00:00Z`).toISOString();

  const response = await calendar.events.list({
    auth,
    calendarId,
    timeMin,
    timeMax,
    singleEvents: true,
    orderBy: "startTime",
    maxResults: 2500
  });

  return response.data.items || [];
}

// Availability for one date: closed days, manually blocked days and any slot
// overlapped by a calendar event.
function buildDayAvailability(date, timeZone, busy) {
  const slots = getTimeSlotsForDate(date);
  const closed = isSundayDate(date);
  const dayBlocked = closed || isDayBlocked(date, busy);
  const bookedSlots = dayBlocked ? [...slots] : getBlockedSlots(date, slots, timeZone, busy);
  const availableSlots = slots.filter(s => !bookedSlots.includes(s));

  return { slots, closed, dayBlocked, bookedSlots, availableSlots };
}

// GET: availability for one date (?date=) or blocked days for a month (?month=)
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const date = url.searchParams.get("date");
    const month = url.searchParams.get("month");
    const checkEmail = url.searchParams.get("email")?.toLowerCase();
    const timeZone = process.env.TIMEZONE || "America/Toronto";

    if (!date && !month) {
      return NextResponse.json({ error: "A date or month parameter is required." }, { status: 400 });
    }

    const clientObj = await getGoogleCalendarClient();
    if (clientObj.mock) {
      if (month) {
        return NextResponse.json({ month, blockedDays: [], mock: true });
      }
      return NextResponse.json({
        date,
        bookedSlots: [],
        availableSlots: getTimeSlotsForDate(date),
        dayBlocked: isSundayDate(date),
        closed: isSundayDate(date),
        emailAlreadyBooked: false,
        mock: true
      });
    }

    const { calendar, auth, calendarId } = clientObj;

    // ---- Month mode: which days should be greyed out in the picker ----
    if (month) {
      const [year, monthNum] = month.split("-").map(Number);
      if (!year || !monthNum || monthNum < 1 || monthNum > 12) {
        return NextResponse.json({ error: "Invalid month. Expected YYYY-MM." }, { status: 400 });
      }

      const daysInMonth = new Date(Date.UTC(year, monthNum, 0)).getUTCDate();
      const firstDay = `${month}-01`;
      const lastDay = `${month}-${String(daysInMonth).padStart(2, "0")}`;

      const events = await listEvents(calendar, auth, calendarId, firstDay, lastDay);
      const busy = collectBusy(events);

      const blockedDays = [];
      for (let d = 1; d <= daysInMonth; d++) {
        const dayStr = `${month}-${String(d).padStart(2, "0")}`;
        const { dayBlocked, availableSlots } = buildDayAvailability(dayStr, timeZone, busy);
        // A day with every slot taken is just as unbookable as a closed one.
        if (dayBlocked || availableSlots.length === 0) blockedDays.push(dayStr);
      }

      return NextResponse.json({ month, blockedDays });
    }

    // ---- Single date mode ----
    const events = await listEvents(calendar, auth, calendarId, date, date);
    const busy = collectBusy(events);
    const { closed, dayBlocked, bookedSlots, availableSlots } = buildDayAvailability(date, timeZone, busy);

    let emailAlreadyBooked = false;
    if (checkEmail) {
      emailAlreadyBooked = events.some(event => {
        if (event.status === "cancelled") return false;
        const eventStartStr = event.start?.dateTime || event.start?.date;
        if (!eventStartStr) return false;

        const { dateStr } = getDateTimePartsInZone(new Date(eventStartStr), timeZone);
        if (dateStr !== date) return false;

        const isAttendee = event.attendees?.some(
          att => att.email && att.email.toLowerCase() === checkEmail
        );
        return Boolean(
          isAttendee ||
          event.description?.toLowerCase().includes(checkEmail) ||
          event.summary?.toLowerCase().includes(checkEmail)
        );
      });
    }

    return NextResponse.json({
      date,
      closed,
      dayBlocked,
      bookedSlots,
      availableSlots,
      emailAlreadyBooked
    });
  } catch (error) {
    console.error("Error fetching availability:", error);
    return NextResponse.json({ bookedSlots: [], availableSlots: [], dayBlocked: false, emailAlreadyBooked: false });
  }
}

// POST: Create appointment with conflict & duplicate prevention
export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, phone, date, time, formData, trafficSource = "Direct", eventId } = body;

    if (!name || !email || !date || !time) {
      return NextResponse.json(
        { error: "Missing required booking fields (name, email, date, time)." },
        { status: 400 }
      );
    }

    // The client hides closed days and invalid times, but nothing stopped a
    // direct POST from booking a Sunday or an off-schedule hour.
    const validSlots = getTimeSlotsForDate(date);
    if (isSundayDate(date) || validSlots.length === 0) {
      return NextResponse.json(
        { error: "We are closed on that date.", details: "Please choose a day from Monday to Saturday." },
        { status: 400 }
      );
    }
    if (!validSlots.includes(time)) {
      return NextResponse.json(
        { error: "Invalid time slot.", details: `${time} is not an available appointment time for ${date}.` },
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
    const existingEvents = await listEvents(calendar, auth, calendarId, date, date);
    const busy = collectBusy(existingEvents);

    if (isDayBlocked(date, busy)) {
      return NextResponse.json(
        {
          error: "This day is not available.",
          details: `${date} is blocked in our calendar. Please choose another day.`
        },
        { status: 400 }
      );
    }

    // Duplicate booking for the same email on the same date
    const duplicate = existingEvents.some(event => {
      if (event.status === "cancelled") return false;
      const eventStartStr = event.start?.dateTime || event.start?.date;
      if (!eventStartStr) return false;

      const { dateStr } = getDateTimePartsInZone(new Date(eventStartStr), timeZone);
      if (dateStr !== date) return false;

      const isAttendee = event.attendees?.some(
        att => att.email && att.email.toLowerCase() === userEmailLower
      );
      return Boolean(isAttendee || event.description?.toLowerCase().includes(userEmailLower));
    });

    if (duplicate) {
      return NextResponse.json(
        {
          error: "You already have an appointment scheduled for this date.",
          details: `The email address ${email} already has an inspection reserved for ${date}. If you need to modify your appointment, please contact us.`
        },
        { status: 400 }
      );
    }

    // Slot conflict by interval overlap - a block that merely covers the slot
    // (rather than starting exactly on it) now counts.
    const slotStartDate = zonedWallTimeToInstant(date, time, timeZone);
    if (!slotStartDate) {
      return NextResponse.json({ error: "Invalid date or time." }, { status: 400 });
    }
    const slotStart = slotStartDate.getTime();
    const slotEnd = slotStart + SLOT_DURATION_MINUTES * 60 * 1000;

    if (isIntervalBusy(slotStart, slotEnd, busy.timed)) {
      return NextResponse.json(
        {
          error: "Time slot unavailable.",
          details: `The ${time} time slot for ${date} has already been reserved. Please select another available time slot.`
        },
        { status: 400 }
      );
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
          { method: "popup", minutes: 3 * 60 },
        ],
      },
    };

    const response = await calendar.events.insert({
      auth: auth,
      calendarId: calendarId,
      requestBody: event,
      sendUpdates: "all",
    });

    // Record booking in Google Sheets
    await appendToGoogleSheet({
      name,
      email,
      phone,
      date,
      time,
      formData,
      type: "Appointment Booking",
      status: "Pending",
      trafficSource
    });

    // Send internal notification email to administrator email
    await sendLeadNotificationEmail({
      name,
      email,
      phone,
      formData,
      type: "Appointment Booking",
      trafficSource
    });

    // -------------------------------------------------------------
    // 3. META CONVERSIONS API (server-side, deduplicated with the pixel)
    // -------------------------------------------------------------
    const ctx = getRequestContext(req);
    const value = getVehicleValue(formData?.vehicleType);
    const userData = buildUserData({ name, email, phone, ...ctx });
    const customData = {
      currency: "CAD",
      value,
      content_name: `${formData?.vehicleType || "Vehicle"} Rust Protection Appointment`,
      content_category: "Auto Services",
      content_type: "product",
      content_ids: [formData?.vehicleType || "vehicle"],
      lead_type: "appointment_booking",
      traffic_source: trafficSource
    };
    const eventSourceUrl = req.headers.get("referer") || process.env.NEXT_PUBLIC_SITE_URL;

    // A booking is both a Lead (what the ad campaigns optimise for) and a
    // Schedule. Both carry the browser's event_id so the pixel copy dedupes.
    const [leadResult] = await Promise.all([
      sendMetaConversion({
        eventName: "Lead",
        eventId: eventId ? `${eventId}-lead` : undefined,
        eventSourceUrl,
        userData,
        customData
      }),
      sendMetaConversion({
        eventName: "Schedule",
        eventId: eventId ? `${eventId}-schedule` : undefined,
        eventSourceUrl,
        userData,
        customData
      })
    ]);

    return NextResponse.json({
      success: true,
      eventId: response.data.id,
      htmlLink: response.data.htmlLink,
      metaCapi: leadResult.sent ? "sent" : leadResult.skipped ? "skipped" : "failed",
      message: "Appointment successfully scheduled on Google Calendar and recorded in Google Sheets!"
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
