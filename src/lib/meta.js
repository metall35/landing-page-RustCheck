// Meta Conversions API (server-side events).
//
// Browser-only pixel events are dropped for a large share of traffic (ad
// blockers, Safari/iOS ITP, users leaving before the request flushes), which is
// why Meta was not receiving leads that our own backend had already recorded.
// Every conversion is now also sent from the server with a shared `event_id`,
// so Meta deduplicates the pair and keeps whichever arrives.

import crypto from "crypto";

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "1991419668160970";
const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;
const TEST_EVENT_CODE = process.env.META_CAPI_TEST_EVENT_CODE;
const API_VERSION = "v21.0";

function sha256(value) {
  if (value === undefined || value === null || value === "") return undefined;
  return crypto.createHash("sha256").update(String(value).trim().toLowerCase()).digest("hex");
}

function normalizePhone(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  if (!digits) return undefined;
  // Meta wants a country code; local numbers here arrive as 10 digits.
  return digits.length === 10 ? `1${digits}` : digits;
}

function splitName(fullName) {
  const parts = String(fullName || "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return {};
  return { first: parts[0], last: parts.length > 1 ? parts[parts.length - 1] : undefined };
}

// Build the hashed user_data block. Meta requires SHA-256 for PII; fbp/fbc and
// the IP/user-agent pair are sent raw and carry most of the match quality.
export function buildUserData({ name, email, phone, clientIp, userAgent, fbp, fbc }) {
  const { first, last } = splitName(name);
  const userData = {
    em: sha256(email),
    ph: sha256(normalizePhone(phone)),
    fn: sha256(first),
    ln: sha256(last),
    country: sha256("ca"),
    client_ip_address: clientIp || undefined,
    client_user_agent: userAgent || undefined,
    fbp: fbp || undefined,
    fbc: fbc || undefined
  };
  Object.keys(userData).forEach(k => userData[k] === undefined && delete userData[k]);
  return userData;
}

// Reads the pixel's own cookies plus the caller's IP/UA off a Next request.
export function getRequestContext(req) {
  const forwarded = req.headers.get("x-forwarded-for") || "";
  const clientIp = forwarded.split(",")[0].trim() || req.headers.get("x-real-ip") || undefined;
  return {
    clientIp,
    userAgent: req.headers.get("user-agent") || undefined,
    fbp: req.cookies?.get?.("_fbp")?.value,
    fbc: req.cookies?.get?.("_fbc")?.value
  };
}

/**
 * Sends one conversion to Meta. Never throws: a booking must not fail because
 * Meta is unreachable, so failures are reported in the return value instead.
 */
export async function sendMetaConversion({
  eventName,
  eventId,
  eventSourceUrl,
  userData = {},
  customData = {},
  eventTime = Math.floor(Date.now() / 1000)
}) {
  if (!ACCESS_TOKEN) {
    console.warn(`[meta-capi] META_CAPI_ACCESS_TOKEN not set — "${eventName}" not sent server-side.`);
    return { sent: false, skipped: true, reason: "missing_access_token" };
  }

  const payload = {
    data: [
      {
        event_name: eventName,
        event_time: eventTime,
        event_id: eventId,
        action_source: "website",
        event_source_url: eventSourceUrl,
        user_data: userData,
        custom_data: customData
      }
    ],
    ...(TEST_EVENT_CODE ? { test_event_code: TEST_EVENT_CODE } : {})
  };

  try {
    const res = await fetch(
      `https://graph.facebook.com/${API_VERSION}/${META_PIXEL_ID}/events?access_token=${encodeURIComponent(ACCESS_TOKEN)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }
    );

    const result = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error(`[meta-capi] "${eventName}" rejected:`, result?.error?.message || res.status);
      return { sent: false, error: result?.error?.message || `HTTP ${res.status}` };
    }

    console.log(`[meta-capi] "${eventName}" accepted (events_received: ${result.events_received ?? "?"})`);
    return { sent: true, result };
  } catch (err) {
    console.error(`[meta-capi] "${eventName}" failed:`, err.message);
    return { sent: false, error: err.message };
  }
}

// Vehicle pricing lives here so the pixel value and the pricing cards cannot
// drift apart.
export const VEHICLE_VALUES = {
  sedan: 149.95,
  suv: 169.95,
  pickup: 189.95,
  other: 149.95
};

export function getVehicleValue(vehicleType) {
  return VEHICLE_VALUES[String(vehicleType || "").toLowerCase()] ?? VEHICLE_VALUES.other;
}
