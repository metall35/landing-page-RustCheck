import { Calendar, Smile, Meh, Frown, CalendarCheck, Phone } from "lucide-react";

export const STEP_NAMES = [
  "Vehicle Type",
  "Car Brand & Model",
  "Keep Duration",
  "Rust Condition",
  "Previous Protection",
  "Scheduling Option",
  "Schedule / Contact",
  "Confirmation"
];

// Helper: Calculate earliest allowed date (at least 2 days / 48h buffer, skipping Sundays)
export function getMinBookingDate() {
  const today = new Date();
  const minDate = new Date(today);
  minDate.setDate(today.getDate() + 2);
  if (minDate.getDay() === 0) {
    minDate.setDate(minDate.getDate() + 1);
  }
  return minDate.toISOString().split("T")[0];
}

// Helper: Get available time slots by day of week
export function getTimeSlotsForDate(dateStr) {
  if (!dateStr) return [];
  const d = new Date(`${dateStr}T00:00:00`);
  const day = d.getDay();
  if (day === 0) return []; // Sunday: OFF
  if (day === 6) return ["09:00", "13:00"]; // Saturday: 9 AM, 1 PM
  return ["09:00", "13:00", "16:00"]; // Mon - Fri: 9 AM, 1 PM, 4 PM
}

export function formatSlotLabel(t) {
  if (t === "09:00") return "9:00 AM";
  if (t === "13:00") return "1:00 PM";
  if (t === "16:00") return "4:00 PM";
  return t;
}

export const vehicleTypes = [
  { id: "sedan", label: "Sedan", iconSrc: "/sedan.svg", iconClass: "w-14 h-14" },
  { id: "suv", label: "SUV", iconSrc: "/suv.svg", iconClass: "w-14 h-14" },
  { id: "pickup", label: "Pickup", iconSrc: "/truck.svg", iconClass: "w-14 h-14" },
  { id: "other", label: "Other", iconSrc: "/other.svg", iconClass: "w-20 h-20" },
];

export const durations = [
  { id: "1year", label: "1 year", icon: Calendar },
  { id: "5years", label: "5 years", icon: Calendar },
  { id: "10years", label: "10 years", icon: Calendar },
  { id: "forever", label: "Forever", icon: Calendar },
];

export const conditions = [
  { id: "none", label: "No rust", icon: Smile },
  { id: "some", label: "Some rust", icon: Meh },
  { id: "lots", label: "Lots of rust", icon: Frown },
];

export const timeframes = [
  { 
    id: "book", 
    label: "Book Appointment", 
    icon: CalendarCheck 
  },
  { 
    id: "looking", 
    label: "We Contact You", 
    icon: Phone 
  },
];
