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

// Slot definitions, min-date logic and label formatting live in @/lib/slots so the
// API routes validate against exactly what the UI offers. Re-exported here to keep
// the existing import sites working.
export {
  getMinBookingDate,
  getTimeSlotsForDate,
  formatSlotLabel,
  isSundayDate,
  SLOT_MODE
} from "@/lib/slots";

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
