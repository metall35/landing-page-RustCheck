"use client";

import { durations } from "../formUtils";

export default function Step3Duration({ selectedDuration, onSelect }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {durations.map((d) => {
        const Icon = d.icon;
        const isSelected = selectedDuration === d.id;
        return (
          <button
            key={d.id}
            onClick={() => onSelect(d.id)}
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
  );
}
