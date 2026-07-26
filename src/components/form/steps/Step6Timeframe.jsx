"use client";

import { timeframes } from "../formUtils";

export default function Step6Timeframe({ selectedTimeframe, onSelect }) {
  return (
    <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-bottom-4">
      {timeframes.map((t) => {
        const Icon = t.icon;
        const isSelected = selectedTimeframe === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onSelect(t.id)}
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
  );
}
