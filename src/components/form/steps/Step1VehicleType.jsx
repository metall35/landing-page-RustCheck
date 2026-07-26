"use client";

import { vehicleTypes } from "../formUtils";

export default function Step1VehicleType({ vehicleType, onSelect }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {vehicleTypes.map((type) => {
        const isSelected = vehicleType === type.id;
        return (
          <button
            key={type.id}
            onClick={() => onSelect(type.id)}
            className={`group flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all duration-200 ${
              isSelected ? "border-primary bg-primary/10 scale-105" : "border-border hover:border-primary/50 hover:bg-secondary/50"
            }`}
          >
            <img 
              src={type.iconSrc} 
              alt={type.label} 
              className={`${type.iconClass || "w-14 h-14"} mb-3 object-contain transition-all duration-200 dark:invert dark:brightness-200 ${isSelected ? "" : "opacity-70 group-hover:opacity-100"}`} 
            />
            <span className={`font-semibold text-sm transition-colors ${isSelected ? "text-primary" : "text-foreground"}`}>{type.label}</span>
          </button>
        );
      })}
    </div>
  );
}
