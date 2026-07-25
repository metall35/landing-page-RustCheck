"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Calendar, Smile, Meh, Frown, Check, X, Search, ChevronRight, ChevronLeft, User, Mail, Phone, Clock, CalendarCheck, Loader2, AlertTriangle } from "lucide-react";
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
  "Timeframe Urgency",
  "Schedule Appointment",
  "Confirmation"
];

export default function MultiStepForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    vehicleType: "",
    make: "",
    model: "",
    duration: "",
    rustCondition: "",
    previousProtection: "",
    timeframe: ""
  });

  const [bookingData, setBookingData] = useState({
    name: "",
    email: "",
    phone: "",
    date: new Date().toISOString().split("T")[0],
    time: "10:00"
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("all");

  const [bookedSlots, setBookedSlots] = useState([]);
  const [emailAlreadyBooked, setEmailAlreadyBooked] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  // Check Calendar Availability and Duplicate Bookings for selected date & email
  useEffect(() => {
    if (step !== 7 || !bookingData.date) return;

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
  }, [step, bookingData.date, bookingData.email]);

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
      setFormData(prev => ({ ...prev, vehicleType: type }));
      trackFormEvent("form_option_selected", { step_number: 1, key: "vehicleType", value: type });
      setStep(2);
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
    setStep((s) => Math.max(s - 1, 1));
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

  // Step 6: Timeframe
  const timeframes = [
    { id: "asap", label: "ASAP", icon: Calendar },
    { id: "week", label: "Within a week", icon: Calendar },
    { id: "future", label: "Near future", icon: Calendar },
    { id: "looking", label: "Just looking", icon: Search },
  ];

  // Available Time Slots for Step 7
  const timeSlots = [
    "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"
  ];

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!bookingData.name || !bookingData.email || !bookingData.date || !bookingData.time) {
      toast.error("Please fill in all required contact and appointment fields.");
      return;
    }

    setIsSubmitting(true);
    try {
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
        setStep(8); // Go to confirmation screen
      } else {
        throw new Error(data.details || data.error || "Failed to schedule appointment");
      }
    } catch (err) {
      console.error("Booking error:", err);
      toast.error(err.message || "Something went wrong while booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const todayStr = new Date().toISOString().split("T")[0];

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
          {step === 6 && "When are you planning to have your vehicle checked?"}
          {step === 7 && "Select Date & Time for Your Inspection"}
          {step === 8 && "Appointment Confirmed!"}
        </CardTitle>
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
                  onClick={() => { 
                    updateForm("vehicleType", type.id); 
                    setTimeout(nextStep, 300); 
                  }}
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

        {/* STEP 6 */}
        {step === 6 && (
          <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4">
            {timeframes.map((t) => {
              const Icon = t.icon;
              const isSelected = formData.timeframe === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => { updateForm("timeframe", t.id); }}
                  className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all duration-200 ${
                    isSelected ? "border-primary bg-primary/10 scale-105" : "border-border hover:border-primary/50 hover:bg-secondary/50"
                  }`}
                >
                  <Icon className={`w-8 h-8 mb-3 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                  <span className="font-semibold text-sm">{t.label}</span>
                </button>
              );
            })}
            {formData.timeframe && (
              <div className="col-span-2 mt-4">
                <Button size="lg" className="w-full text-lg font-bold py-6 group" onClick={nextStep}>
                  Schedule Inspection <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            )}
          </div>
        )}

        {/* STEP 7: Google Calendar Booking Section */}
        {step === 7 && (
          <form onSubmit={handleScheduleSubmit} className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
            
            {/* Date & Time Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Select Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="date"
                    min={todayStr}
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
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border-2 border-border focus:border-primary focus:ring-0 outline-none transition-colors bg-background appearance-none"
                  >
                    {timeSlots.map((t) => {
                      const isBooked = bookedSlots.includes(t);
                      const label = t === "12:00" ? "12:00 PM" : Number(t.split(":")[0]) > 12 ? `${Number(t.split(":")[0]) - 12}:00 PM` : `${t} AM`;
                      return (
                        <option key={t} value={t} disabled={isBooked}>
                          {label} {isBooked ? "❌ (Occupied)" : ""}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            </div>

            {checkingAvailability && (
              <div className="flex items-center text-xs text-muted-foreground pt-1">
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin text-primary" />
                Verificando disponibilidad de horarios...
              </div>
            )}

            {/* Contact Details */}
            <div className="space-y-3 pt-2">
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
                  Email Address (for Google Calendar Invite) *
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
            {emailAlreadyBooked && (
              <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-500 flex items-center gap-2.5 animate-in fade-in">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Ya tienes una inspección agendada para este día con este correo. Elige otra fecha o contáctanos para modificarla.</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting || emailAlreadyBooked || bookedSlots.includes(bookingData.time)}
              size="lg"
              className="w-full text-lg font-bold py-6 mt-4 group"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Scheduling...
                </>
              ) : (
                <>
                  Confirm & Sync Calendar <CalendarCheck className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                </>
              )}
            </Button>
          </form>
        )}

        {/* STEP 8: Confirmation Screen */}
        {step === 8 && (
          <div className="text-center py-6 space-y-4 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto">
              <CalendarCheck className="w-10 h-10" />
            </div>

            <h3 className="text-xl font-bold text-foreground">
              Your Inspection is Booked!
            </h3>

            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              We have reserved your slot for <strong>{bookingData.date}</strong> at <strong>{bookingData.time}</strong>. An automatic Google Calendar invitation has been dispatched to <strong>{bookingData.email}</strong>.
            </p>

            <div className="p-4 bg-secondary/50 rounded-xl text-left text-xs space-y-1 max-w-sm mx-auto border border-border">
              <div><strong>Vehicle:</strong> {formData.make} {formData.model} ({formData.vehicleType})</div>
              <div><strong>Contact:</strong> {bookingData.name} ({bookingData.phone || "No phone provided"})</div>
              <div><strong>Status:</strong> Synced with Google Calendar</div>
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
                  timeframe: ""
                });
              }}
              variant="outline"
              className="mt-4"
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
