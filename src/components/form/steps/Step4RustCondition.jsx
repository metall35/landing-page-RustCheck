"use client";

import { conditions } from "../formUtils";

export default function Step4RustCondition({ selectedCondition, onSelect }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {conditions.map((c) => {
        const Icon = c.icon;
        const isSelected = selectedCondition === c.id;
        return (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
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
  );
}
