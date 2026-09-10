// Single source of truth for booking slots. Lives in lib/ (not formUtils) so the
// API routes can validate against the exact same definitions the UI renders,
// without pulling client-only imports into the server bundle.

// "hourly": the full 9 AM - 5 PM workday as eight one-hour blocks. Anything that
//   should not be bookable is blocked manually in Google Calendar.
// "fixed":  only the four core slots (9, 11, 1, 3).
export const SLOT_MODE = process.env.NEXT_PUBLIC_SLOT_MODE || "hourly";

export const SLOT_DURATION_MINUTES = 60;

const WEEKDAY_SLOTS_FIXED = ["09:00", "11:00", "13:00", "15:00"];
const WEEKDAY_SLOTS_HOURLY = [
  "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"
];
// Saturday stays reduced regardless of mode.
const SATURDAY_SLOTS = ["09:00", "13:00"];

// Day of week for a YYYY-MM-DD string, read as a calendar date (no timezone shift).
export function getDayOfWeek(dateStr) {
  if (!dateStr) return -1;
  const [y, m, d] = dateStr.split("-").map(Number);
  if (!y || !m || !d) return -1;
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

export function isSundayDate(dateStr) {
  return getDayOfWeek(dateStr) === 0;
}

export function getTimeSlotsForDate(dateStr) {
  const day = getDayOfWeek(dateStr);
  if (day < 0) return [];
  if (day === 0) return []; // Sunday: closed
  if (day === 6) return [...SATURDAY_SLOTS];
  return SLOT_MODE === "fixed" ? [...WEEKDAY_SLOTS_FIXED] : [...WEEKDAY_SLOTS_HOURLY];
}

export function formatSlotLabel(t) {
  if (!t) return "";
  const [h, m] = String(t).split(":").map(Number);
  if (Number.isNaN(h)) return t;
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m || 0).padStart(2, "0")} ${period}`;
}

export function toDateStr(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0")
  ].join("-");
}

// Earliest bookable date: 48h buffer, skipping Sunday. Built from local calendar
// parts instead of toISOString(), which used to roll the date forward for any
// user west of UTC once it got late in the evening.
export function getMinBookingDate() {
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 2);
  if (minDate.getDay() === 0) {
    minDate.setDate(minDate.getDate() + 1);
  }
  return toDateStr(minDate);
}
