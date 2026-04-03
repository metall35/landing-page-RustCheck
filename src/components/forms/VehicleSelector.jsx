"use client";

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Button from "@/components/common/Button";
import { vehicleTypes } from "@/data/constants";
import { Card, CardContent } from "@/components/ui/card";

export default function VehicleSelector({ onSelect }) {
  const [step, setStep] = useState("vehicle");
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  const handleSelectVehicle = (type) => {
    setSelectedVehicle(type);
  };

  const handleNext = () => {
    if (!selectedVehicle) {
      toast.error("Please select a vehicle type");
      return;
    }
    setStep("contact");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.phone) {
      toast.error("Please fill in all fields");
      return;
    }

    toast.success("Quote request submitted successfully!");
    
    setTimeout(() => {
      setStep("vehicle");
      setSelectedVehicle(null);
      setFormData({ fullName: "", email: "", phone: "" });
    }, 1500);
  };

  return (
    <>
      <Toaster position="top-center" />
      {step === "vehicle" ? (
        <div className="w-full">
          <h3 className="mb-6 text-center text-xl font-semibold text-gray-900">
            What type of vehicle do you have?
          </h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {vehicleTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => handleSelectVehicle(type.id)}
                className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all ${
                  selectedVehicle === type.id
                    ? "border-gray-800 bg-gray-100"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <span className="text-3xl">{type.icon}</span>
                <span className="text-sm font-medium text-gray-700">{type.label}</span>
              </button>
            ))}
          </div>
          {selectedVehicle && (
            <div className="mt-8 flex justify-center">
              <Button size="lg" onClick={handleNext} className="bg-gray-800 hover:bg-gray-900">
                Next →
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full max-w-md mx-auto">
          <h3 className="mb-6 text-center text-xl font-semibold text-gray-900">
            Contact Information
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="John Doe"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="john@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="(555) 123-4567"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button 
                type="button"
                onClick={() => setStep("vehicle")} 
                variant="secondary"
                className="flex-1"
              >
                Back
              </Button>
              <Button 
                type="submit"
                className="flex-1 bg-gray-800 hover:bg-gray-900"
              >
                Submit
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
