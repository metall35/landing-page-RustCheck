"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, ChevronLeft } from "lucide-react";
import ExitIntentModal from "@/components/form/ExitIntentModal";
import { trackFormEvent, trackBeginCheckout, trackLead } from "@/lib/gtag";
import toast from "react-hot-toast";

import { STEP_NAMES, getMinBookingDate, getTimeSlotsForDate } from "./formUtils";
import Step1VehicleType from "./steps/Step1VehicleType";
import Step2CarSelect from "./steps/Step2CarSelect";
import Step3Duration from "./steps/Step3Duration";
import Step4RustCondition from "./steps/Step4RustCondition";
import Step5PreviousProtection from "./steps/Step5PreviousProtection";
import Step6Timeframe from "./steps/Step6Timeframe";
import Step7BookingForm from "./steps/Step7BookingForm";
import Step8Confirmation from "./steps/Step8Confirmation";

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
  const [bookedSlots, setBookedSlots] = useState([]);
  const [emailAlreadyBooked, setEmailAlreadyBooked] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  const isJustLooking = formData.timeframe === "looking";
  const availableTimeSlots = getTimeSlotsForDate(bookingData.date);
  const isSunday = new Date(`${bookingData.date}T00:00:00`).getDay() === 0;

  useEffect(() => {
    if (availableTimeSlots.length > 0) {
      const freeSlots = availableTimeSlots.filter(t => !bookedSlots.includes(t));
      if (!freeSlots.includes(bookingData.time)) {
        if (freeSlots.length > 0) {
          setBookingData(prev => ({ ...prev, time: freeSlots[0] }));
        } else if (!availableTimeSlots.includes(bookingData.time)) {
          setBookingData(prev => ({ ...prev, time: availableTimeSlots[0] }));
        }
      }
    }
  }, [bookingData.date, bookedSlots, availableTimeSlots]);

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

  useEffect(() => {
    if (step > 1) {
      trackFormEvent("form_step_view", {
        step_number: step,
        step_name: STEP_NAMES[step - 1] || `Step ${step}`
      });
    } else {
      trackBeginCheckout(formData.vehicleType || "not_selected");
    }
  }, [step]);

  useEffect(() => {
    const handleSelect = (e) => {
      const type = e.detail.type;
      updateForm("vehicleType", type);
      trackFormEvent("form_step_view", { step_number: 1, step_name: "Vehicle Type" });
      trackFormEvent("form_option_selected", { step_number: 1, key: "vehicleType", value: type });
      trackBeginCheckout(type);
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

  const handleVehicleTypeSelect = (typeId) => {
    updateForm("vehicleType", typeId);
    trackFormEvent("form_step_view", { step_number: 1, step_name: "Vehicle Type" });
    trackBeginCheckout(typeId);
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
      const endpoint = isJustLooking ? "/api/lead" : "/api/schedule";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...bookingData, formData })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (isJustLooking) {
          trackFormEvent("lead_submit_success", { 
            name: bookingData.name,
            vehicle_type: formData.vehicleType || "other"
          });
          trackLead("call_back_request", {
            vehicle_type: formData.vehicleType,
            vehicle: `${formData.make} ${formData.model}`
          });
          toast.success("Thank you! We will contact you soon.");
        } else {
          trackFormEvent("booking_submit_success", {
            date: bookingData.date,
            time: bookingData.time,
            vehicle_type: formData.vehicleType || "other",
            vehicle: `${formData.make} ${formData.model}`
          });
          trackLead("appointment_booking", {
            date: bookingData.date,
            time: bookingData.time,
            vehicle_type: formData.vehicleType,
            vehicle: `${formData.make} ${formData.model}`
          });
          toast.success("Appointment successfully scheduled!");
        }
        setStep(8);
      } else {
        throw new Error(data.details || data.error || "Failed to process request.");
      }
    } catch (err) {
      console.error("Form submit error:", err);
      trackFormEvent("form_submit_error", {
        error_message: err.message,
        is_just_looking: isJustLooking
      });
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <Step1VehicleType 
            vehicleType={formData.vehicleType} 
            onSelect={handleVehicleTypeSelect} 
          />
        );
      case 2:
        return (
          <Step2CarSelect 
            formData={formData} 
            onSelectCar={handleSelectCar} 
            onNext={nextStep} 
          />
        );
      case 3:
        return (
          <Step3Duration 
            selectedDuration={formData.duration} 
            onSelect={(id) => { updateForm("duration", id); setTimeout(nextStep, 300); }} 
          />
        );
      case 4:
        return (
          <Step4RustCondition 
            selectedCondition={formData.rustCondition} 
            onSelect={(id) => { updateForm("rustCondition", id); setTimeout(nextStep, 300); }} 
          />
        );
      case 5:
        return (
          <Step5PreviousProtection 
            selectedValue={formData.previousProtection} 
            onSelect={(val) => { updateForm("previousProtection", val); setTimeout(nextStep, 300); }} 
          />
        );
      case 6:
        return (
          <Step6Timeframe 
            selectedTimeframe={formData.timeframe} 
            onSelect={(id) => { updateForm("timeframe", id); setTimeout(nextStep, 300); }} 
          />
        );
      case 7:
        return (
          <Step7BookingForm
            bookingData={bookingData}
            updateBooking={updateBooking}
            isJustLooking={isJustLooking}
            minDateStr={minDateStr}
            availableTimeSlots={availableTimeSlots}
            isSunday={isSunday}
            bookedSlots={bookedSlots}
            checkingAvailability={checkingAvailability}
            emailAlreadyBooked={emailAlreadyBooked}
            isSubmitting={isSubmitting}
            onSubmit={handleScheduleSubmit}
            onRequestCall={() => updateForm("timeframe", "looking")}
          />
        );
      case 8:
        return (
          <Step8Confirmation
            isJustLooking={isJustLooking}
            formData={formData}
            bookingData={bookingData}
            onReset={() => {
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
          />
        );
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1: return "What type of vehicle do you have?";
      case 2: return "Select your Car (All Brands & Models)";
      case 3: return "How long do you plan to keep your vehicle?";
      case 4: return "What condition is your vehicle in?";
      case 5: return "Have you ever used any type of rust protection?";
      case 6: return "How would you like to proceed?";
      case 7: return isJustLooking ? "We Contact You" : "Select Date & Time for Your Inspection";
      case 8: return isJustLooking ? "Request Received!" : "Appointment Scheduled!";
      default: return "";
    }
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
          {getStepTitle()}
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
        {renderStepContent()}
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
