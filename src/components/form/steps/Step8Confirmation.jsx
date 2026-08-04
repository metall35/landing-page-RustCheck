"use client";

import { CalendarCheck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatSlotLabel } from "../formUtils";

export default function Step8Confirmation({
  isJustLooking,
  formData,
  bookingData,
  onReset
}) {
  return (
    <div className="text-center py-4 space-y-4 animate-in zoom-in-95 duration-300">
      {/* Headline */}
      <h3 className="text-2xl font-black text-primary tracking-tight mt-[-40px]">
        {isJustLooking ? "Thank you for contacting us" : "Thank you for booking your appointment"}
      </h3>

      {/* Center Image Container */}
      <div className="relative w-full max-w-sm aspect-[4/3] mx-auto rounded-2xl overflow-hidden border border-border shadow-md flex items-center justify-center p-3 group">
        <img 
          src="/Thank You Page - Rust Check.gif" 
          alt="Selected Vehicle" 
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* 24-Hour Prior Notice Alert Box (Hidden if "We Contact You") */}
      {!isJustLooking && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-left space-y-2 max-w-sm mx-auto shadow-sm">
          <div className="flex items-center gap-2 font-bold text-amber-500 text-xs">
            <Clock className="w-4 h-4 shrink-0" />
            <span>24-Hour Confirmation Notice</span>
          </div>
          <p className="text-xs text-foreground/90 leading-relaxed font-medium">
            We will contact you <strong>24 hours prior</strong> to your scheduled inspection to confirm your appointment.
          </p>
          <p className="text-[11px] text-amber-500 font-semibold italic border-t border-amber-500/20 pt-1.5">
            * Please note: Unconfirmed appointments will be automatically cancelled.
          </p>
        </div>
      )}

      {/* Booking Details Box */}
      <div className="p-4 bg-secondary/50 rounded-2xl text-left text-xs space-y-1.5 max-w-sm mx-auto border border-border">
        <div><strong>Vehicle:</strong> {formData.make || "N/A"} {formData.model || ""} ({formData.vehicleType || "Vehicle"})</div>
        {!isJustLooking && (
          <div><strong>Scheduled Date & Time:</strong> {bookingData.date} at {formatSlotLabel(bookingData.time)}</div>
        )}
        <div><strong>Contact:</strong> {bookingData.name} ({bookingData.email})</div>
        {!isJustLooking && (
          <div><strong>Status:</strong> Synced with Google Calendar (24h & 3h Reminders Set)</div>
        )}
      </div>

      <Button
        onClick={onReset}
        variant="outline"
        className="mt-2 font-bold"
      >
        {isJustLooking ? "Book an inspection" : "Book Another Inspection"}
      </Button>
    </div>
  );
}
