"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Car, Truck, Van, Plus, Calendar, Smile, Meh, Frown, Check, X, Search, ChevronRight, ChevronLeft } from "lucide-react";
import carsData from "@/data/cars.json";

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

  const [searchTerm, setSearchTerm] = useState("");

  const updateForm = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, 6));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  // Step 1: Vehicle Type Options
  const vehicleTypes = [
    { id: "sedan", label: "Sedan", icon: Car },
    { id: "suv", label: "SUV", icon: Car }, // Reusing Car for SUV for simplicity
    { id: "truck", label: "Truck", icon: Truck },
    { id: "minivan", label: "Minivan", icon: Van },
    { id: "other", label: "Other", icon: Plus },
  ];

  // Step 2: Make & Model logic
  const filteredMakes = carsData.filter(car => car.make.toLowerCase().includes(searchTerm.toLowerCase()));
  const selectedMakeData = carsData.find(car => car.make === formData.make);

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

  return (
    <Card className="w-full max-w-lg mx-auto border border-border bg-card">
      <CardHeader className="text-center pb-2">
        <div className="flex justify-between items-center mb-2 text-sm font-medium text-muted-foreground">
          {step > 1 ? (
            <button onClick={prevStep} className="flex items-center hover:text-primary transition-colors">
              <ChevronLeft className="w-4 h-4 mr-1" /> Back
            </button>
          ) : (
            <span />
          )}
          <span>Step {step} of 6</span>
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
          {step === 1 && "What type of vehicle do you have?"}
          {step === 2 && "What is the make and model?"}
          {step === 3 && "How long do you plan to keep your vehicle?"}
          {step === 4 && "What condition is your vehicle in?"}
          {step === 5 && "Have you ever used any type of rust protection?"}
          {step === 6 && "When are you planning to have your vehicle checked?"}
        </CardTitle>
        <div className="w-full bg-secondary h-2 mt-4 rounded-full overflow-hidden">
          <div className="bg-primary h-full transition-all duration-500 ease-in-out" style={{ width: `${(step / 6) * 100}%` }} />
        </div>
      </CardHeader>

      <CardContent className="pt-6 min-h-[300px]">
        
        {/* STEP 1 */}
        {step === 1 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {vehicleTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = formData.vehicleType === type.id;
              return (
                <button
                  key={type.id}
                  onClick={() => { updateForm("vehicleType", type.id); setTimeout(nextStep, 300); }}
                  className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all duration-200 ${
                    isSelected ? "border-primary bg-primary/10 scale-105" : "border-border hover:border-primary/50 hover:bg-secondary/50"
                  }`}
                >
                  <Icon className={`w-10 h-10 mb-3 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                  <span className="font-semibold text-sm">{type.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="space-y-6">
            {!formData.make ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input 
                    type="text" 
                    placeholder="Search Make (e.g. Toyota, Ford)" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-border focus:border-primary focus:ring-0 outline-none transition-colors"
                  />
                </div>
                <div className="max-h-[200px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                  {filteredMakes.map(car => (
                    <button
                      key={car.make}
                      onClick={() => updateForm("make", car.make)}
                      className="w-full text-left px-4 py-3 rounded-lg bg-secondary/30 hover:bg-primary/10 hover:text-primary font-medium transition-colors"
                    >
                      {car.make}
                    </button>
                  ))}
                  {filteredMakes.length === 0 && <p className="text-center text-muted-foreground py-4">No makes found.</p>}
                </div>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-lg">{formData.make}</span>
                  <button onClick={() => updateForm("make", "")} className="text-sm text-primary hover:underline">Change Make</button>
                </div>
                <div className="max-h-[240px] overflow-y-auto space-y-2 pr-2 custom-scrollbar grid grid-cols-2 gap-2">
                  {selectedMakeData?.models.map(model => (
                    <button
                      key={model}
                      onClick={() => { updateForm("model", model); setTimeout(nextStep, 300); }}
                      className={`text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 border-2 ${
                        formData.model === model ? "border-primary bg-primary/10" : "border-transparent bg-secondary/30 hover:bg-primary/10"
                      }`}
                    >
                      {model}
                    </button>
                  ))}
                </div>
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
                  onClick={() => updateForm("timeframe", t.id)}
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
                <Button size="lg" className="w-full text-lg font-bold py-6 group" onClick={() => alert("Form Submitted! (This is a demo)")}>
                  Get My Quote <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            )}
          </div>
        )}

      </CardContent>

      <CardFooter className="flex justify-center border-t py-4 bg-muted/20">
        <div className="flex items-center text-sm font-medium text-muted-foreground">
          <Lock className="w-4 h-4 mr-2 text-primary" />
          Safe, Secure, and Confidential
        </div>
      </CardFooter>
    </Card>
  );
}
