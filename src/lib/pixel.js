// Centralized Meta Pixel tracking helper module
//
// Every conversion is also sent from the server via the Conversions API
// (@/lib/meta). Both copies share an `eventID` so Meta deduplicates them and
// keeps whichever one arrives — the browser call is the one ad blockers and
// Safari/ITP drop, which is why Meta was missing leads the backend had.
export const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "1991419668160970";

// Vehicle pricing must match @/lib/meta VEHICLE_VALUES and the pricing cards.
export const VEHICLE_VALUES = {
  sedan: 149.95,
  suv: 169.95,
  pickup: 189.95,
  other: 149.95
};

export function getVehicleValue(vehicleType) {
  return VEHICLE_VALUES[String(vehicleType || "").toLowerCase()] ?? VEHICLE_VALUES.other;
}

// One id per submission; the server appends the same suffixes.
export function createEventId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `evt-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function fbq(...args) {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq(...args);
  }
}

function contentPayload(vehicleType, value) {
  const type = String(vehicleType || "").toLowerCase() || "vehicle";
  return {
    content_category: "Auto Services",
    content_type: "product",
    content_ids: [type],
    currency: "CAD",
    ...(value ? { value } : {})
  };
}

export const pixel = {
  pageView: () => fbq("track", "PageView"),

  viewContent: () =>
    fbq("track", "ViewContent", {
      content_name: "Rust Protection Pricing",
      content_category: "Auto Services",
      currency: "CAD",
    }),

  initiateCheckout: (vehicleType, value) =>
    fbq("track", "InitiateCheckout", {
      content_name: vehicleType ? `${vehicleType} Rust Protection` : "Rust Protection",
      ...contentPayload(vehicleType, value),
    }),

  // The event Meta Ads lead campaigns optimise for. Fires for both the booked
  // appointment and the call-back request — previously the call-back path sent
  // nothing at all, so half the conversions never reached Meta.
  lead: (vehicleType, value, eventId, leadType = "appointment_booking") =>
    fbq(
      "track",
      "Lead",
      {
        content_name: vehicleType ? `${vehicleType} Rust Protection` : "Rust Protection",
        lead_type: leadType,
        ...contentPayload(vehicleType, value),
      },
      eventId ? { eventID: `${eventId}-lead` } : undefined
    ),

  schedule: (vehicleType, value, eventId) =>
    fbq(
      "track",
      "Schedule",
      {
        content_name: vehicleType
          ? `${vehicleType} Rust Protection Appointment`
          : "Rust Protection Appointment",
        ...contentPayload(vehicleType, value),
      },
      eventId ? { eventID: `${eventId}-schedule` } : undefined
    ),

  contact: (method = "Phone Call") =>
    fbq("track", "Contact", { content_name: method }),
};
