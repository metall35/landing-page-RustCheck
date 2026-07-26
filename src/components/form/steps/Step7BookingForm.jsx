"use client";

import { Calendar, Clock, Phone, User, Mail, AlertTriangle, Loader2, Send, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatSlotLabel } from "../formUtils";

export default function Step7BookingForm({
  bookingData,
  updateBooking,
  isJustLooking,
  minDateStr,
  availableTimeSlots,
  isSunday,
  bookedSlots,
  checkingAvailability,
  emailAlreadyBooked,
  isSubmitting,
  onSubmit,
  onRequestCall
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
      {/* Date & Time Selection (Hidden if "We Contact You") */}
      {!isJustLooking && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Select Date (Min. 48h advance)
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="date"
                  min={minDateStr}
                  value={bookingData.date}
                  onChange={(e) => updateBooking("date", e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border-2 border-border focus:border-primary focus:ring-0 outline-none transition-colors bg-background"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Select Time Slot
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <select
                  value={bookingData.time}
                  onChange={(e) => updateBooking("time", e.target.value)}
                  required
                  disabled={isSunday || availableTimeSlots.length === 0}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border-2 border-border focus:border-primary focus:ring-0 outline-none transition-colors bg-background appearance-none disabled:opacity-50"
                >
                  {isSunday ? (
                    <option value="">Closed on Sundays</option>
                  ) : (
                    availableTimeSlots.map((t) => {
                      const isBooked = bookedSlots.includes(t);
                      const label = formatSlotLabel(t);
                      return (
                        <option key={t} value={t} disabled={isBooked}>
                          {label} {isBooked ? "❌ (Occupied)" : ""}
                        </option>
                      );
                    })
                  )}
                </select>
              </div>
            </div>
          </div>

          {isSunday && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-500 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>We are closed on Sundays. Please select a date from Monday to Saturday.</span>
            </div>
          )}

          {checkingAvailability && (
            <div className="flex items-center text-xs text-muted-foreground pt-1">
              <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin text-primary" />
              Checking availability...
            </div>
          )}

          {/* Callout Banner: Didn't find your time? We contact you! */}
          <div className="p-3.5 bg-secondary/60 border border-border rounded-xl flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-primary shrink-0" />
              <span className="text-muted-foreground font-medium">
                Looking for a specific time? We&apos;ll call you!
              </span>
            </div>
            <button
              type="button"
              onClick={onRequestCall}
              className="text-primary font-bold hover:underline shrink-0 text-xs flex items-center"
            >
              Request Call →
            </button>
          </div>
        </>
      )}

      {/* Contact Details */}
      <div className="space-y-3 pt-1">
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1">
            Full Name *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="John Doe"
              value={bookingData.name}
              onChange={(e) => updateBooking("name", e.target.value)}
              required
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border-2 border-border focus:border-primary focus:ring-0 outline-none transition-colors bg-background"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1">
            Email Address *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="email"
              placeholder="john@example.com"
              value={bookingData.email}
              onChange={(e) => updateBooking("email", e.target.value)}
              required
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border-2 border-border focus:border-primary focus:ring-0 outline-none transition-colors bg-background"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1">
            Phone Number
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="tel"
              placeholder="(555) 123-4567"
              value={bookingData.phone}
              onChange={(e) => updateBooking("phone", e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border-2 border-border focus:border-primary focus:ring-0 outline-none transition-colors bg-background"
            />
          </div>
        </div>
      </div>

      {/* Duplicate Email Warning */}
      {!isJustLooking && emailAlreadyBooked && (
        <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-500 flex items-center gap-2.5 animate-in fade-in">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>You already have an appointment scheduled for this date with this email. Please select another date or contact us to reschedule.</span>
        </div>
      )}

      <Button
        type="submit"
        disabled={isSubmitting || (!isJustLooking && (isSunday || emailAlreadyBooked || bookedSlots.includes(bookingData.time)))}
        size="lg"
        className="w-full text-lg font-bold py-6 mt-4 group"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing...
          </>
        ) : isJustLooking ? (
          <>
            Contact Me <Send className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </>
        ) : (
          <>
            Confirm & Sync Calendar <CalendarCheck className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />
          </>
        )}
      </Button>
    </form>
  );
}
