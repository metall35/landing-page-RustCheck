"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import carsData from "@/data/cars.json";

export default function Step2CarSelect({ formData, onSelectCar, onNext }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("all");

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

  return (
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
              onClick={() => onSelectCar(car.make, car.model)}
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
            No cars found matching &quot;{searchTerm}&quot;.
          </div>
        )}
      </div>

      {formData.make && formData.model && (
        <div className="pt-2 flex items-center justify-between text-xs text-muted-foreground border-t border-border">
          <span>Selected: <strong className="text-foreground">{formData.make} {formData.model}</strong></span>
          <button 
            onClick={onNext} 
            className="text-primary font-semibold hover:underline flex items-center"
          >
            Continue →
          </button>
        </div>
      )}
    </div>
  );
}
