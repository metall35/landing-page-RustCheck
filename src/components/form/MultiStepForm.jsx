"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Car, Truck, Van, Plus, Calendar, Smile, Meh, Frown, Check, X, Search, ChevronRight, ChevronLeft } from "lucide-react";
import carsData from "@/data/cars.json";

// Removed inline SVG components, using images instead

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

  useEffect(() => {
    const handleSelect = (e) => {
      const type = e.detail.type;
      // Pre-fill the form vehicle type
      setFormData(prev => ({ ...prev, vehicleType: type }));
      // Advance to Step 2
      setStep(2);
    };
    window.addEventListener("select-vehicle", handleSelect);
    return () => window.removeEventListener("select-vehicle", handleSelect);
  }, []);

  const updateForm = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, 6));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  // Step 1: Vehicle Type Options
  const vehicleTypes = [
    { id: "sedan", label: "Sedan", iconSrc: "/sedan.svg", iconClass: "w-14 h-14" },
    { id: "suv", label: "SUV", iconSrc: "/suv.svg", iconClass: "w-14 h-14" },
    { id: "pickup", label: "Pickup", iconSrc: "/truck.svg", iconClass: "w-14 h-14" },
    { id: "other", label: "Other", iconSrc: "/other.svg", iconClass: "w-20 h-20" },
  ];

  const [selectedBrand, setSelectedBrand] = useState("all");
  const [customMake, setCustomMake] = useState("");
  const [customModel, setCustomModel] = useState("");

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

  return (
    <Card className="w-full max-w-lg mx-auto shadow-2xl border-none ring-1 ring-primary/20 bg-background/95 backdrop-blur">
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
          {step === 2 && "Select your Car (All Brands & Models)"}
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
          <div className="grid grid-cols-2 gap-4">
            {vehicleTypes.map((type) => {
              const isSelected = formData.vehicleType === type.id;
              return (
                <button
                  key={type.id}
                  onClick={() => { updateForm("vehicleType", type.id); setTimeout(nextStep, 300); }}
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

            {/* Selected Summary or Custom Input option */}
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
