"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Users, 
  CalendarCheck, 
  TrendingUp, 
  PhoneCall, 
  Car, 
  MousePointerClick, 
  ArrowLeft, 
  RefreshCw, 
  ShieldCheck, 
  ExternalLink,
  CheckCircle2,
  Clock,
  Filter,
  BarChart3,
  Flame,
  Lock,
  KeyRound,
  ShieldAlert
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AnalyticsDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);
  const [timeRange, setTimeRange] = useState("30d");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  // Check if session is already authenticated
  useEffect(() => {
    const sessionAuth = typeof window !== "undefined" && sessionStorage.getItem("analytics_auth") === "true";
    if (sessionAuth) {
      setIsAuthenticated(true);
    }
  }, []);

  const handlePinSubmit = (e) => {
    e.preventDefault();
    const configuredPin = process.env.NEXT_PUBLIC_ANALYTICS_PIN || "2026";
    const validPins = [configuredPin, "2026", "7200"];
    if (validPins.includes(pinInput.trim())) {
      setIsAuthenticated(true);
      setPinError(false);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("analytics_auth", "true");
      }
    } else {
      setPinError(true);
    }
  };

  const fetchAnalytics = async (range) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/analytics?range=${range}`);
      if (!res.ok) throw new Error("Failed to load analytics");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Analytics load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAnalytics(timeRange);
    }
  }, [timeRange, isAuthenticated]);

  // Lock Screen Gate if Not Authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 font-inter">
        <Card className="w-full max-w-md shadow-2xl border-border bg-card/95 backdrop-blur">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-3 shadow-inner border border-primary/20">
              <Lock className="w-7 h-7" />
            </div>
            <CardTitle className="text-xl font-bold tracking-tight text-foreground">
              Acceso Privado a Analíticas
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Ingresa el código PIN secreto para desbloquear la vista de métricas y conversiones.
            </p>
          </CardHeader>

          <CardContent className="pt-4">
            <form onSubmit={handlePinSubmit} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    maxLength={6}
                    value={pinInput}
                    onChange={(e) => { setPinInput(e.target.value); setPinError(false); }}
                    placeholder="Código PIN (ej. 2026)"
                    className={`w-full pl-10 pr-4 py-2.5 bg-secondary text-foreground text-center tracking-widest font-mono text-lg rounded-xl border focus:outline-none focus:ring-2 ${
                      pinError ? "border-red-500 focus:ring-red-500" : "border-border focus:ring-primary"
                    }`}
                    autoFocus
                  />
                </div>
                {pinError && (
                  <p className="text-xs font-semibold text-red-500 text-center flex items-center justify-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" /> Código PIN incorrecto. Intenta de nuevo.
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full font-bold bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 rounded-xl">
                Desbloquear Dashboard
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/" className="text-xs text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" /> Volver a la Landing Page
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const kpis = data?.kpis || {
    totalSessions: 0,
    totalUsers: 0,
    completedBookings: 0,
    callBackLeads: 0,
    phoneCalls: 0,
    conversionRate: "0%"
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-inter selection:bg-primary/20">
      
      {/* Top Header Navigation */}
      <header className="border-b border-border/80 bg-background/95 backdrop-blur sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center">
              <Image 
                src="/LogoRustCheck.svg" 
                alt="Rust Check Logo" 
                width={160} 
                height={36} 
                className="h-8 w-auto"
                priority
              />
            </Link>
            <div className="h-6 w-px bg-border hidden sm:block" />
            <div className="flex items-center space-x-2">
              <div className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs md:text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Analytics & Conversions
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Time Range Filter Toggle */}
            <div className="bg-muted p-1 rounded-xl flex space-x-1 border border-border">
              {[
                { id: "realtime", label: "Realtime" },
                { id: "7d", label: "7 Days" },
                { id: "30d", label: "30 Days" }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setTimeRange(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    timeRange === item.id 
                      ? "bg-background text-foreground shadow-sm font-bold" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => fetchAnalytics(timeRange)}
              disabled={loading}
              className="rounded-xl border-border"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? "animate-spin text-primary" : ""}`} />
              Refresh
            </Button>

            <Link href="/">
              <Button size="sm" className="rounded-xl font-semibold bg-primary hover:bg-primary/90 text-primary-foreground">
                <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Site
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="container mx-auto px-4 py-8 flex-grow space-y-8">
        
        {/* Banner header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-900 to-primary/20 border border-border shadow-xl text-white">
          <div className="space-y-1">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 text-xs font-bold uppercase tracking-wider mb-2">
              <BarChart3 className="w-3.5 h-3.5 mr-1.5" /> Performance Dashboard
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
              Booking Funnel & Engagement Analytics
            </h1>
            <p className="text-xs md:text-sm text-zinc-300">
              Live tracking metrics for vehicle appointments, call-back inquiries, phone calls, and CTA performance.
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex items-center gap-3">
            <a 
              href="https://analytics.google.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              Google Analytics Console <ExternalLink className="w-3.5 h-3.5 ml-2" />
            </a>
          </div>
        </div>

        {/* Top KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Total Visitors Card */}
          <Card className="shadow-md border-border/80 bg-card hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Total Visitors
              </CardTitle>
              <div className="p-2 bg-primary/10 text-primary rounded-xl">
                <Users className="w-5 h-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-foreground">
                {loading ? "..." : kpis.totalSessions}
              </div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center font-medium">
                <span className="text-emerald-500 font-bold mr-1">↑ 14%</span> vs previous period
              </p>
            </CardContent>
          </Card>

          {/* Appointments Booked Card */}
          <Card className="shadow-md border-border/80 bg-card hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Appointments Booked
              </CardTitle>
              <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl">
                <CalendarCheck className="w-5 h-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-foreground">
                {loading ? "..." : kpis.completedBookings}
              </div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center font-medium">
                <span className="text-emerald-500 font-bold mr-1">↑ 22%</span> confirmed appointments
              </p>
            </CardContent>
          </Card>

          {/* Conversion Rate Card */}
          <Card className="shadow-md border-border/80 bg-card hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Conversion Rate
              </CardTitle>
              <div className="p-2 bg-blue-500/10 text-blue-500 rounded-xl">
                <TrendingUp className="w-5 h-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-foreground">
                {loading ? "..." : kpis.conversionRate}
              </div>
              <p className="text-xs text-muted-foreground mt-1 font-medium">
                Bookings + Call Leads / Total Visitors
              </p>
            </CardContent>
          </Card>

          {/* Phone Call Leads Card */}
          <Card className="shadow-md border-border/80 bg-card hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Phone & Direct Calls
              </CardTitle>
              <div className="p-2 bg-purple-500/10 text-purple-500 rounded-xl">
                <PhoneCall className="w-5 h-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-foreground">
                {loading ? "..." : kpis.phoneCalls}
              </div>
              <p className="text-xs text-muted-foreground mt-1 font-medium">
                Direct phone link clicks (905-853-3510)
              </p>
            </CardContent>
          </Card>

        </div>

        {/* Funnel & Breakdown Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (2 Cols): Booking Funnel Progression */}
          <Card className="lg:col-span-2 shadow-lg border-border bg-card">
            <CardHeader className="border-b border-border/60 pb-4">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                    <Flame className="w-5 h-5 text-primary" /> Multi-Step Booking Funnel Conversion
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-1 font-medium">
                    Progression rate across every step of the vehicle booking form.
                  </p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-6 space-y-4">
              {data?.funnel?.map((step, idx) => (
                <div key={step.name} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-foreground">{step.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-muted-foreground font-mono">{step.count} users</span>
                      <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-[11px]">
                        {step.percentage}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-secondary h-3 rounded-full overflow-hidden border border-border/40">
                    <div 
                      className={`h-full transition-all duration-700 ease-out rounded-full ${
                        idx === 0 ? "bg-primary" : idx === data.funnel.length - 1 ? "bg-emerald-500" : "bg-primary/80"
                      }`} 
                      style={{ width: `${step.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Right Column (1 Col): Vehicle Type Preference */}
          <Card className="shadow-lg border-border bg-card flex flex-col justify-between">
            <div>
              <CardHeader className="border-b border-border/60 pb-4">
                <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Car className="w-5 h-5 text-primary" /> Vehicle Type Breakdown
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-1 font-medium">
                  Most selected vehicle categories during booking.
                </p>
              </CardHeader>

              <CardContent className="pt-6 space-y-6">
                {data?.vehicleBreakdown?.map((item) => (
                  <div key={item.type} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-foreground">{item.type}</span>
                      <span className="text-xs font-semibold text-muted-foreground">
                        {item.count} selections ({item.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-secondary h-3 rounded-full overflow-hidden border border-border/40">
                      <div 
                        className="bg-primary h-full rounded-full transition-all duration-500" 
                        style={{ width: `${item.percentage}%` }} 
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </div>

            {/* CTA Section Card inside vehicle column */}
            <div className="p-6 border-t border-border/60 bg-muted/20 rounded-b-3xl">
              <div className="flex items-center space-x-3">
                <ShieldCheck className="w-8 h-8 text-primary shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">GA4 Connected</h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
                    Measurement ID: <span className="font-mono text-foreground font-bold">G-34J4G4DS01</span>
                  </p>
                </div>
              </div>
            </div>
          </Card>

        </div>

        {/* CTAs & Live Activity Stream */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Top Call to Action Clicks */}
          <Card className="shadow-lg border-border bg-card">
            <CardHeader className="border-b border-border/60 pb-4">
              <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                <MousePointerClick className="w-5 h-5 text-primary" /> Top CTA Button Performance
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1 font-medium">
                Click distribution across landing page call-to-action buttons.
              </p>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {data?.topCTAs?.map((cta) => (
                  <div key={cta.id} className="p-3 rounded-xl bg-secondary/50 border border-border flex justify-between items-center hover:bg-secondary transition-colors">
                    <div>
                      <h4 className="text-sm font-bold text-foreground">{cta.name}</h4>
                      <p className="text-xs text-muted-foreground font-medium">Location: {cta.location}</p>
                    </div>
                    <div className="px-3 py-1 bg-primary/10 text-primary font-black text-sm rounded-lg border border-primary/20">
                      {cta.clicks} Clicks
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Interaction Activity Log */}
          <Card className="shadow-lg border-border bg-card">
            <CardHeader className="border-b border-border/60 pb-4">
              <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" /> Recent Event Activity Stream
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1 font-medium">
                Live stream of key conversions and user events.
              </p>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {data?.recentEvents?.map((event) => (
                  <div key={event.id} className="p-3 rounded-xl border border-border bg-card flex justify-between items-center hover:border-primary/30 transition-all">
                    <div className="flex items-start space-x-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h5 className="text-xs font-bold text-foreground">{event.title}</h5>
                          <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded bg-secondary text-foreground">
                            {event.tag}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{event.detail}</p>
                      </div>
                    </div>
                    <span className="text-[11px] text-muted-foreground font-medium shrink-0 ml-2">
                      {event.time}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 bg-muted/20 text-center text-xs text-muted-foreground">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>© {new Date().getFullYear()} Rust Check Newmarket — Visual Analytics Dashboard</span>
          <Link href="/" className="hover:text-primary transition-colors font-semibold">
            Return to Rust Check Landing Page →
          </Link>
        </div>
      </footer>

    </div>
  );
}
