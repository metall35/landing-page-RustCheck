"use client";

import { Check, X } from "lucide-react";

export default function Step5PreviousProtection({ selectedValue, onSelect }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <button
        onClick={() => onSelect("yes")}
        className={`flex flex-col items-center justify-center p-8 rounded-xl border-2 transition-all duration-200 ${
          selectedValue === "yes" ? "border-primary bg-primary/10 scale-105" : "border-border hover:border-primary/50 hover:bg-secondary/50"
        }`}
      >
        <Check className={`w-12 h-12 mb-3 ${selectedValue === "yes" ? "text-primary" : "text-muted-foreground"}`} />
        <span className="font-semibold text-lg">Yes</span>
      </button>
      <button
        onClick={() => onSelect("no")}
        className={`flex flex-col items-center justify-center p-8 rounded-xl border-2 transition-all duration-200 ${
          selectedValue === "no" ? "border-primary bg-primary/10 scale-105" : "border-border hover:border-primary/50 hover:bg-secondary/50"
        }`}
      >
        <X className={`w-12 h-12 mb-3 ${selectedValue === "no" ? "text-primary" : "text-muted-foreground"}`} />
        <span className="font-semibold text-lg">No</span>
      </button>
    </div>
  );
}
