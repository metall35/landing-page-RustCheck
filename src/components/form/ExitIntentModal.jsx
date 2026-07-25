"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ShieldCheck, X, ArrowRight } from "lucide-react";
import { trackFormEvent } from "@/lib/gtag";

export default function ExitIntentModal({ step, hasStartedForm, onConfirmLeave }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasDismissed, setHasDismissed] = useState(false);

  useEffect(() => {
    // Only activate if form is in progress (between step 2 and step 7)
    if (!hasStartedForm || step < 2 || step >= 8 || hasDismissed) return;

    const handleMouseLeave = (e) => {
      // Trigger if cursor moves towards top of screen or leaves document window
      if (e.clientY <= 30 || (!e.relatedTarget && e.clientY <= 50)) {
        setIsOpen(true);
        trackFormEvent("exit_modal_triggered", { step_number: step });
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [step, hasStartedForm, hasDismissed]);

  if (!isOpen) return null;

  const handleKeepFilling = () => {
    setIsOpen(false);
    setHasDismissed(true); // Don't annoy the user repeatedly in the same session
    trackFormEvent("exit_modal_dismissed", { action: "continued_form" });
  };

  const handleLeaveAnyway = () => {
    setIsOpen(false);
    setHasDismissed(true);
    trackFormEvent("exit_modal_leave_confirmed", { action: "left_form" });
    if (onConfirmLeave) onConfirmLeave();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="relative w-full max-w-md p-6 overflow-hidden rounded-2xl border border-primary/30 bg-background/95 shadow-2xl shadow-primary/10 text-center animate-in zoom-in-95 duration-300"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={handleKeepFilling}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full hover:bg-secondary/50"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Glowing Badge / Icon */}
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-inner">
          <AlertTriangle className="w-9 h-9" />
        </div>

        {/* Title & Body */}
        <h3 className="text-2xl font-bold tracking-tight text-foreground mb-2">
          ¿Seguro que deseas salir?
        </h3>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          ¡Estás a solo un paso de extender la vida útil de tu vehículo y protegerlo contra la corrosión! Si te vas ahora, perderás tu avance.
        </p>

        {/* Value Proposition Box */}
        <div className="flex items-center gap-3 p-3.5 mb-6 rounded-xl bg-primary/10 border border-primary/20 text-left text-xs font-medium text-foreground">
          <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
          <span>Cotización 100% gratuita y sin compromiso en menos de 1 minuto.</span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            size="lg"
            onClick={handleKeepFilling}
            className="w-full font-bold py-6 text-base shadow-lg shadow-primary/20 group"
          >
            Continuar con mi Cotización
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>

          <button
            onClick={handleLeaveAnyway}
            className="w-full py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
          >
            Abandonar de todos modos
          </button>
        </div>
      </div>
    </div>
  );
}
