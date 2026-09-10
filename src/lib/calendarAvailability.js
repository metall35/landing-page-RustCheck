// Availability logic for the booking calendar.
//
// The previous version only compared an event's *start* time against a slot, so a
// block from 10:00 to 15:00 freed everything except the 10:00 slot, and all-day
// events (which carry `start.date` and no `start.dateTime`) were skipped entirely
// — meaning a full-day block in Google Calendar had no effect on the form.
// Slots are now matched by interval overlap, and all-day events close the day.

import { SLOT_DURATION_MINUTES } from "@/lib/slots";

// Offset of `timeZone` at a given instant, in ms (zone wall time - UTC).
export function tzOffsetMs(instant, timeZone) {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23"
  });
  const parts = {};
  dtf.formatToParts(instant).forEach(p => {
    if (p.type !== "literal") parts[p.type] = p.value;
  });
  const asUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second)
  );
  return asUtc - instant.getTime();
}

// "2026-08-31" + "09:00" read as wall time in `timeZone` -> absolute instant.
// Two passes so the offset is sampled at the resulting instant, which keeps DST
// transition days correct.
export function zonedWallTimeToInstant(dateStr, timeStr, timeZone) {
  const naiveUtc = Date.parse(`${dateStr}T${timeStr}:00Z`);
  if (!Number.isFinite(naiveUtc)) return null;
  const firstGuess = naiveUtc - tzOffsetMs(new Date(naiveUtc), timeZone);
  return new Date(naiveUtc - tzOffsetMs(new Date(firstGuess), timeZone));
}

export function addDays(dateStr, n) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + n);
  return dt.toISOString().slice(0, 10);
}

// Splits calendar events into timed busy intervals and fully-blocked days.
export function collectBusy(events) {
  const timed = [];
  const blockedDays = new Set();

  (events || []).forEach(ev => {
    if (!ev || ev.status === "cancelled") return;
    // Google's own semantics: events shown as "Free" do not consume the slot.
    if (ev.transparency === "transparent") return;

    if (ev.start?.dateTime && ev.end?.dateTime) {
      const start = Date.parse(ev.start.dateTime);
      const end = Date.parse(ev.end.dateTime);
      if (Number.isFinite(start) && Number.isFinite(end) && end > start) {
        timed.push({ start, end });
      }
      return;
    }

    // All-day event: `end.date` is exclusive in the Google Calendar API.
    if (ev.start?.date) {
      const firstDay = ev.start.date;
      const endExclusive = ev.end?.date || addDays(firstDay, 1);
      let day = firstDay;
      let guard = 0;
      while (day < endExclusive && guard < 366) {
        blockedDays.add(day);
        day = addDays(day, 1);
        guard++;
      }
      if (guard === 0) blockedDays.add(firstDay);
    }
  });

  return { timed, blockedDays };
}

export function isIntervalBusy(startMs, endMs, timedIntervals) {
  return timedIntervals.some(iv => iv.start < endMs && iv.end > startMs);
}

// Slots that overlap any busy interval on `dateStr`.
export function getBlockedSlots(dateStr, slots, timeZone, busy) {
  const durationMs = SLOT_DURATION_MINUTES * 60 * 1000;
  return (slots || []).filter(slot => {
    const startDate = zonedWallTimeToInstant(dateStr, slot, timeZone);
    if (!startDate) return false;
    const start = startDate.getTime();
    return isIntervalBusy(start, start + durationMs, busy.timed);
  });
}

export function isDayBlocked(dateStr, busy) {
  return busy.blockedDays.has(dateStr);
}
