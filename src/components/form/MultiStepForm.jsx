"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Calendar, Smile, Meh, Frown, Check, X, Search, ChevronRight, ChevronLeft, User, Mail, Phone, Clock, CalendarCheck, Loader2, AlertTriangle, Send } from "lucide-react";
import carsData from "@/data/cars.json";
import ExitIntentModal from "@/components/form/ExitIntentModal";
import { trackFormEvent } from "@/lib/gtag";
import toast from "react-hot-toast";

const STEP_NAMES = [
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
  minDate.setDate(today.getDate() + 2); // 48h buffer: if booking today, tomorrow is blocked
  if (minDate.getDay() === 0) { // If Sunday, push to Monday
    minDate.setDate(minDate.getDate() + 1);
  }
  return minDate.toISOString().split("T")[0];
}

// Helper: Get available time slots by day of week
// Mon-Fri (1-5): 09:00, 13:00, 16:00 (9am, 1pm, 4pm)
// Sat (6): 09:00, 13:00 (9am, 1pm)
// Sun (0): OFF
export function getTimeSlotsForDate(dateStr) {
  if (!dateStr) return [];
  const d = new Date(`${dateStr}T00:00:00`);
  const day = d.getDay();
  if (day === 0) return []; // Sunday: OFF
  if (day === 6) return ["09:00", "13:00"]; // Saturday: 9 AM, 1 PM
  return ["09:00", "13:00", "16:00"]; // Mon - Fri: 9 AM, 1 PM, 4 PM
}

export default function MultiStepForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    vehicleType: "",
    make: "",
    model: "",
    duration: "",
    rustCondition: "",
    previousProtection: "",
    timeframe: "book"
  });

  const minDateStr = getMinBookingDate();

  const [bookingData, setBookingData] = useState({
    name: "",
    email: "",
    phone: "",
    date: minDateStr,
    time: "09:00"
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("all");

  const [bookedSlots, setBookedSlots] = useState([]);
  const [emailAlreadyBooked, setEmailAlreadyBooked] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  const isJustLooking = formData.timeframe === "looking";
  const availableTimeSlots = getTimeSlotsForDate(bookingData.date);
  const isSunday = new Date(`${bookingData.date}T00:00:00`).getDay() === 0;

  // Auto-adjust selected time if current time is not available for selected date
  useEffect(() => {
    if (availableTimeSlots.length > 0 && !availableTimeSlots.includes(bookingData.time)) {
      setBookingData(prev => ({ ...prev, time: availableTimeSlots[0] }));
    }
  }, [bookingData.date]);

  // Check Calendar Availability and Duplicate Bookings for selected date & email
  useEffect(() => {
    if (step !== 7 || isJustLooking || !bookingData.date) return;

    let isMounted = true;
    setCheckingAvailability(true);

    const queryParams = new URLSearchParams({ date: bookingData.date });
    if (bookingData.email) queryParams.append("email", bookingData.email);

    fetch(`/api/schedule?${queryParams.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        setBookedSlots(data.bookedSlots || []);
        setEmailAlreadyBooked(Boolean(data.emailAlreadyBooked));
      })
      .catch((err) => console.error("Error checking availability:", err))
      .finally(() => {
        if (isMounted) setCheckingAvailability(false);
      });

    return () => {
      isMounted = false;
    };
  }, [step, bookingData.date, bookingData.email, isJustLooking]);

  // Safety prompt before closing tab or reloading page
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if ((step > 1 || formData.vehicleType) && step < 8) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [step, formData.vehicleType]);

  // Track step view on load and whenever step changes
  useEffect(() => {
    trackFormEvent("form_step_view", {
      step_number: step,
      step_name: STEP_NAMES[step - 1] || `Step ${step}`
    });
  }, [step]);

  useEffect(() => {
    const handleSelect = (e) => {
      const type = e.detail.type;
      updateForm("vehicleType", type);
      trackFormEvent("form_option_selected", { step_number: 1, key: "vehicleType", value: type });
      if (type === "other") {
        updateForm("make", "Other");
        updateForm("model", "Other");
        setStep(3);
      } else {
        setStep(2);
      }
    };
    window.addEventListener("select-vehicle", handleSelect);
    return () => window.removeEventListener("select-vehicle", handleSelect);
  }, []);

  const updateForm = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    trackFormEvent("form_option_selected", { step_number: step, key, value });
  };

  const updateBooking = (key, value) => {
    setBookingData(prev => ({ ...prev, [key]: value }));
  };

  const nextStep = () => {
    trackFormEvent("form_step_complete", {
      step_number: step,
      step_name: STEP_NAMES[step - 1]
    });
    setStep((s) => Math.min(s + 1, 8));
  };

  const prevStep = () => {
    if (step === 3 && formData.vehicleType === "other") {
      setStep(1);
    } else {
      setStep((s) => Math.max(s - 1, 1));
    }
  };

  // Step 1: Vehicle Type Options
  const vehicleTypes = [
    { id: "sedan", label: "Sedan", iconSrc: "/sedan.svg", iconClass: "w-14 h-14" },
    { id: "suv", label: "SUV", iconSrc: "/suv.svg", iconClass: "w-14 h-14" },
    { id: "pickup", label: "Pickup", iconSrc: "/truck.svg", iconClass: "w-14 h-14" },
    { id: "other", label: "Other", iconSrc: "/other.svg", iconClass: "w-20 h-20" },
  ];

  // Flatten all cars from all brands
  const allCars = carsData.flatMap(b =>
    b.models.map(m => ({
      make: b.make,
      model: m,
      id: `${b.make}-${m}`
    }))
  );

  const filteredCars = allCars.filter(car => {
    const matchesBrand = selectedBrand === "all" || car.make === selectedBrand;
    const matchesSearch =
      !searchTerm ||
      car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesBrand && matchesSearch;
  });

  const handleVehicleTypeSelect = (typeId) => {
    updateForm("vehicleType", typeId);
    if (typeId === "other") {
      updateForm("make", "Other");
      updateForm("model", "Other");
      setTimeout(() => setStep(3), 300);
    } else {
      setTimeout(nextStep, 300);
    }
  };

  const handleSelectCar = (make, model) => {
    setFormData(prev => ({ ...prev, make, model }));
    trackFormEvent("form_option_selected", { step_number: 2, key: "car", make, model });
    setTimeout(nextStep, 300);
  };

  // Step 3: Duration
  const durations = [
    { id: "1year", label: "1 year", icon: Calendar },
    { id: "5years", label: "5 years", icon: Calendar },
    { id: "10years", label: "10 years", icon: Calendar },
    { id: "forever", label: "Forever", icon: Calendar },
  ];

  // Step 4: Rust Condition
  const conditions = [
    { id: "none", label: "No rust", icon: Smile },
    { id: "some", label: "Some rust", icon: Meh },
    { id: "lots", label: "Lots of rust", icon: Frown },
  ];

  // Step 6: Options (Clean labels without subtitles)
  const timeframes = [
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

  const handleTimeframeSelect = (tId) => {
    updateForm("timeframe", tId);
    setTimeout(nextStep, 300);
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!bookingData.name || !bookingData.email) {
      toast.error("Please fill in your name and email.");
      return;
    }

    if (!isJustLooking && (!bookingData.date || !bookingData.time)) {
      toast.error("Please select a date and time for your appointment.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isJustLooking) {
        // Submit lead to Google Sheets (We Contact You)
        const res = await fetch("/api/lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...bookingData,
            formData
          })
        });

        const data = await res.json();
        if (res.ok && data.success) {
          trackFormEvent("lead_submit_success", { name: bookingData.name });
          toast.success("Thank you! We will contact you soon.");
          setStep(8);
        } else {
          throw new Error(data.details || data.error || "Failed to submit contact request.");
        }
      } else {
        // Submit Google Calendar appointment
        const res = await fetch("/api/schedule", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...bookingData,
            formData
          })
        });

        const data = await res.json();
        if (res.ok && data.success) {
          trackFormEvent("booking_submit_success", {
            date: bookingData.date,
            time: bookingData.time,
            vehicle: `${formData.make} ${formData.model}`
          });
          toast.success("Appointment successfully scheduled!");
          setStep(8);
        } else {
          throw new Error(data.details || data.error || "Failed to schedule appointment.");
        }
      }
    } catch (err) {
      console.error("Form submit error:", err);
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatSlotLabel = (t) => {
    if (t === "09:00") return "9:00 AM";
    if (t === "13:00") return "1:00 PM";
    if (t === "16:00") return "4:00 PM";
    return t;
  };

  return (
    <Card className="w-full max-w-lg mx-auto shadow-2xl border-none ring-1 ring-primary/20 bg-background/95 backdrop-blur">
      <CardHeader className="text-center pb-2">
        <div className="flex justify-between items-center mb-2 text-sm font-medium text-muted-foreground">
          {step > 1 && step < 8 ? (
            <button onClick={prevStep} className="flex items-center hover:text-primary transition-colors">
              <ChevronLeft className="w-4 h-4 mr-1" /> Back
            </button>
          ) : (
            <span />
          )}
          {step <= 7 && <span>Step {step} of 7</span>}
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
          {step === 1 && "What type of vehicle do you have?"}
          {step === 2 && "Select your Car (All Brands & Models)"}
          {step === 3 && "How long do you plan to keep your vehicle?"}
          {step === 4 && "What condition is your vehicle in?"}
          {step === 5 && "Have you ever used any type of rust protection?"}
          {step === 6 && "How would you like to proceed?"}
          {step === 7 && (isJustLooking ? "We Contact You" : "Select Date & Time for Your Inspection")}
          {step === 8 && (isJustLooking ? "Request Received!" : "Appointment Scheduled!")}
        </CardTitle>

        {step === 7 && isJustLooking && (
          <p className="text-xs text-muted-foreground mt-1.5 max-w-sm mx-auto leading-relaxed font-medium">
            Provide your contact details below and one of our specialists will reach out as soon as possible to confirm your preferred schedule.
          </p>
        )}

        {step <= 7 && (
          <div className="w-full bg-secondary h-2 mt-4 rounded-full overflow-hidden">
            <div className="bg-primary h-full transition-all duration-500 ease-in-out" style={{ width: `${(step / 7) * 100}%` }} />
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-6 min-h-[300px]">
        
        {/* STEP 1 */}
        {step === 1 && (
          <div className="grid grid-cols-2 gap-4">
            {vehicleTypes.map((type) => {
              const isSelected = formData.vehicleType === type.id;
              return (
                <button
                  key={type.id}
                  onClick={() => handleVehicleTypeSelect(type.id)}
                  className={`group flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all duration-200 ${
                    isSelected ? "border-primary bg-primary/10 scale-105" : "border-border hover:border-primary/50 hover:bg-secondary/50"
                  }`}
                >
                  <img 
                    src={type.iconSrc} 
                    alt={type.label} 
                    className={`${type.iconClass || "w-14 h-14"} mb-3 object-contain transition-all duration-200 ${isSelected ? "" : "opacity-70 group-hover:opacity-100"}`} 
                  />
                  <span className={`font-semibold text-sm transition-colors ${isSelected ? "text-primary" : "text-foreground"}`}>{type.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search any car or brand (e.g. Toyota, Civic, F-150)..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border-2 border-border focus:border-primary focus:ring-0 outline-none transition-colors text-sm"
              />
            </div>

            {/* Brand Filter Pills */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 custom-scrollbar text-xs">
              <button
                type="button"
                onClick={() => setSelectedBrand("all")}
                className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors ${
                  selectedBrand === "all"
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                All Brands ({allCars.length})
              </button>
              {carsData.map(b => (
                <button
                  key={b.make}
                  type="button"
                  onClick={() => setSelectedBrand(b.make)}
                  className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors ${
                    selectedBrand === b.make
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {b.make}
                </button>
              ))}
            </div>

            {/* All Cars Grid */}
            <div className="max-h-[260px] overflow-y-auto pr-1 custom-scrollbar grid grid-cols-2 gap-2">
              {filteredCars.map((car) => {
                const isSelected = formData.make === car.make && formData.model === car.model;
                return (
                  <button
                    key={car.id}
                    type="button"
                    onClick={() => handleSelectCar(car.make, car.model)}
                    className={`flex flex-col text-left px-3 py-2.5 rounded-lg border-2 transition-all duration-200 ${
                      isSelected
                        ? "border-primary bg-primary/10 scale-[1.02]"
                        : "border-border/60 bg-secondary/20 hover:border-primary/50 hover:bg-secondary/60"
                    }`}
                  >
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                      {car.make}
                    </span>
                    <span className="text-sm font-semibold text-foreground truncate">
                      {car.model}
                    </span>
                  </button>
                );
              })}
              {filteredCars.length === 0 && (
                <div className="col-span-2 text-center py-6 text-muted-foreground text-sm">
                  No cars found matching "{searchTerm}".
                </div>
              )}
            </div>

            {formData.make && formData.model && (
              <div className="pt-2 flex items-center justify-between text-xs text-muted-foreground border-t border-border">
                <span>Selected: <strong className="text-foreground">{formData.make} {formData.model}</strong></span>
                <button 
                  onClick={nextStep} 
                  className="text-primary font-semibold hover:underline flex items-center"
                >
                  Continue →
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="grid grid-cols-2 gap-4">
            {durations.map((d) => {
              const Icon = d.icon;
              const isSelected = formData.duration === d.id;
              return (
                <button
                  key={d.id}
                  onClick={() => { updateForm("duration", d.id); setTimeout(nextStep, 300); }}
                  className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all duration-200 ${
                    isSelected ? "border-primary bg-primary/10 scale-105" : "border-border hover:border-primary/50 hover:bg-secondary/50"
                  }`}
                >
                  <Icon className={`w-8 h-8 mb-3 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                  <span className="font-semibold">{d.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {conditions.map((c) => {
              const Icon = c.icon;
              const isSelected = formData.rustCondition === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => { updateForm("rustCondition", c.id); setTimeout(nextStep, 300); }}
                  className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all duration-200 ${
                    isSelected ? "border-primary bg-primary/10 scale-105" : "border-border hover:border-primary/50 hover:bg-secondary/50"
                  }`}
                >
                  <Icon className={`w-10 h-10 mb-3 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                  <span className="font-semibold text-sm">{c.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* STEP 5 */}
        {step === 5 && (
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => { updateForm("previousProtection", "yes"); setTimeout(nextStep, 300); }}
              className={`flex flex-col items-center justify-center p-8 rounded-xl border-2 transition-all duration-200 ${
                formData.previousProtection === "yes" ? "border-primary bg-primary/10 scale-105" : "border-border hover:border-primary/50 hover:bg-secondary/50"
              }`}
            >
              <Check className={`w-12 h-12 mb-3 ${formData.previousProtection === "yes" ? "text-primary" : "text-muted-foreground"}`} />
              <span className="font-semibold text-lg">Yes</span>
            </button>
            <button
              onClick={() => { updateForm("previousProtection", "no"); setTimeout(nextStep, 300); }}
              className={`flex flex-col items-center justify-center p-8 rounded-xl border-2 transition-all duration-200 ${
                formData.previousProtection === "no" ? "border-primary bg-primary/10 scale-105" : "border-border hover:border-primary/50 hover:bg-secondary/50"
              }`}
            >
              <X className={`w-12 h-12 mb-3 ${formData.previousProtection === "no" ? "text-primary" : "text-muted-foreground"}`} />
              <span className="font-semibold text-lg">No</span>
            </button>
          </div>
        )}

        {/* STEP 6 (Clean minimalist buttons without subtitles) */}
        {step === 6 && (
          <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-bottom-4">
            {timeframes.map((t) => {
              const Icon = t.icon;
              const isSelected = formData.timeframe === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => handleTimeframeSelect(t.id)}
                  className={`flex items-center gap-4 p-6 rounded-2xl border-2 text-left transition-all duration-200 ${
                    isSelected ? "border-primary bg-primary/10 scale-[1.01]" : "border-border hover:border-primary/50 hover:bg-secondary/50"
                  }`}
                >
                  <div className={`p-3.5 rounded-xl shrink-0 ${isSelected ? "bg-primary text-white" : "bg-secondary text-primary"}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-lg text-foreground">{t.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* STEP 7: Google Calendar Booking or Lead Contact Section */}
        {step === 7 && (
          <form onSubmit={handleScheduleSubmit} className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
            
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
                      Looking for a specific time? We'll call you!
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateForm("timeframe", "looking")}
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

            {/* Duplicate Email Warning in English */}
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
        )}

        {/* STEP 8: High-Converting Thank You / Confirmation Screen */}
        {step === 8 && (
          <div className="text-center py-4 space-y-4 animate-in zoom-in-95 duration-300">
            {/* Top Icon Badge */}
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto border border-primary/20 shadow-inner">
              <CalendarCheck className="w-8 h-8" />
            </div>

            {/* Red Pill Badge */}
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-primary bg-primary/10 px-4 py-1.5 rounded-full border border-primary/25 shadow-xs inline-block">
                {isJustLooking ? "REQUEST RECEIVED" : "APPOINTMENT SCHEDULED"}
              </span>
            </div>

            {/* Headline */}
            <h3 className="text-2xl font-black text-foreground tracking-tight">
              {isJustLooking ? "Thank you for contacting us" : "Thank you for booking your appointment"}
            </h3>

            {/* Center Image Container (for vehicle / brand image) */}
            <div className="relative w-full max-w-sm h-48 mx-auto rounded-2xl overflow-hidden border border-border shadow-md bg-zinc-900/90 flex items-center justify-center p-3 group">
              <img 
                src={
                  formData.vehicleType === "sedan" 
                    ? "/civic.png" 
                    : formData.vehicleType === "suv" 
                    ? "/rav4.png" 
                    : formData.vehicleType === "pickup" 
                    ? "/f150.png" 
                    : "/LogoRustCheck.svg"
                } 
                alt="Selected Vehicle" 
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* 24-Hour Prior Notice Alert Box */}
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

            {/* Booking Details Box */}
            <div className="p-4 bg-secondary/50 rounded-2xl text-left text-xs space-y-1.5 max-w-sm mx-auto border border-border">
              <div><strong>Vehicle:</strong> {formData.make || "N/A"} {formData.model || ""} ({formData.vehicleType || "Vehicle"})</div>
              {!isJustLooking && (
                <div><strong>Scheduled Date & Time:</strong> {bookingData.date} at {formatSlotLabel(bookingData.time)}</div>
              )}
              <div><strong>Contact:</strong> {bookingData.name} ({bookingData.email})</div>
              <div><strong>Status:</strong> {isJustLooking ? "Saved in Google Sheets" : "Synced with Google Calendar (24h & 3h Reminders Set)"}</div>
            </div>

            <Button
              onClick={() => {
                setStep(1);
                setFormData({
                  vehicleType: "",
                  make: "",
                  model: "",
                  duration: "",
                  rustCondition: "",
                  previousProtection: "",
                  timeframe: "book"
                });
              }}
              variant="outline"
              className="mt-2 font-bold"
            >
              Book Another Inspection
            </Button>
          </div>
        )}

      </CardContent>

      <CardFooter className="flex justify-center border-t py-4 bg-muted/20">
        <div className="flex items-center text-sm font-medium text-muted-foreground">
          <Lock className="w-4 h-4 mr-2 text-primary" />
          Safe, Secure, and Confidential
        </div>
      </CardFooter>
      <ExitIntentModal step={step} hasStartedForm={Boolean(formData.vehicleType || step > 1)} />
    </Card>
  );
}
