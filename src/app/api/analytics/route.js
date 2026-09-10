import { NextResponse } from "next/server";
import { google } from "googleapis";
import fs from "fs";
import path from "path";

const storeFilePath = path.join(process.cwd(), "analytics_store.json");

const EMPTY_COUNTERS = {
  pageViews: 0,
  bookNowNavbar: 0,
  heroAppointment: 0,
  phoneClicks: 0,
  vehicleSedan: 0,
  vehicleSuv: 0,
  vehiclePickup: 0,
  vehicleOther: 0,
  formStep1: 0,
  formStep2: 0,
  formStep3: 0,
  formStep4: 0,
  formStep5: 0,
  formStep6: 0,
  formStep7: 0,
  // Used to be missing from the initial shape, so `formStep8++` ran against
  // undefined and turned the counter into NaN.
  formStep8: 0,
  completedAppointment: 0,
  completedCallBack: 0
};

let inMemoryStore = null;

function getStore() {
  if (inMemoryStore) return inMemoryStore;
  try {
    if (fs.existsSync(storeFilePath)) {
      const content = fs.readFileSync(storeFilePath, "utf8");
      const parsed = JSON.parse(content);
      inMemoryStore = {
        events: parsed.events || [],
        // Merge so stores written before a counter existed still load clean.
        counters: { ...EMPTY_COUNTERS, ...(parsed.counters || {}) },
        sources: parsed.sources || {}
      };
      return inMemoryStore;
    }
  } catch (err) {
    console.warn("Could not read analytics_store.json:", err);
  }
  inMemoryStore = { events: [], counters: { ...EMPTY_COUNTERS }, sources: {} };
  return inMemoryStore;
}

let saveTimeout = null;
function saveStore(store) {
  inMemoryStore = store;
  if (saveTimeout) return;
  saveTimeout = setTimeout(() => {
    try {
      fs.writeFileSync(storeFilePath, JSON.stringify(inMemoryStore, null, 2), "utf8");
    } catch (err) {
      console.warn("Could not save analytics_store.json:", err);
    } finally {
      saveTimeout = null;
    }
  }, 2000);
}

// ---------------------------------------------------------------------------
// Traffic source classification
// ---------------------------------------------------------------------------
// Buckets are matched against both our own trafficSource strings and GA4's
// `sessionSource` values (facebook.com, l.instagram.com, google, (direct), ...).
const SOURCE_BUCKETS = [
  { key: "facebook",  source: "Facebook (Meta)",       category: "Social Network", color: "bg-blue-600",    test: s => /facebook|fb\.com|fbclid|(^|\W)fb(\W|$)|meta/.test(s) },
  { key: "instagram", source: "Instagram (Meta)",      category: "Social Network", color: "bg-pink-600",    test: s => /instagram|(^|\W)ig(\W|$)/.test(s) },
  { key: "google",    source: "Google (Search & Ads)", category: "Search / Ads",   color: "bg-emerald-600", test: s => /google|gclid/.test(s) },
  { key: "tiktok",    source: "TikTok",                category: "Social Network", color: "bg-purple-600",  test: s => /tiktok/.test(s) },
  { key: "youtube",   source: "YouTube",               category: "Social Video",   color: "bg-red-600",     test: s => /youtube|youtu\.be/.test(s) },
  { key: "direct",    source: "Direct / Bookmark",     category: "Direct Traffic", color: "bg-zinc-600",    test: s => /direct|bookmark|^\(none\)$|^\(not set\)$/.test(s) }
];

const OTHER_BUCKET = {
  key: "other",
  source: "Other / Referral",
  category: "Referral",
  color: "bg-slate-500"
};

function classifySource(raw) {
  const s = String(raw || "").toLowerCase().trim();
  if (!s) return null;
  const hit = SOURCE_BUCKETS.find(b => b.test(s));
  return hit ? hit.key : OTHER_BUCKET.key;
}

function buildTrafficSources(counts) {
  const total = Object.values(counts).reduce((sum, n) => sum + n, 0);
  if (total === 0) return [];

  return [...SOURCE_BUCKETS, OTHER_BUCKET]
    .map(bucket => ({
      source: bucket.source,
      category: bucket.category,
      color: bucket.color,
      count: counts[bucket.key] || 0,
      percentage: Math.round(((counts[bucket.key] || 0) / total) * 100)
    }))
    .filter(row => row.count > 0)
    .sort((a, b) => b.count - a.count);
}

function formatPrivateKey(privateKey) {
  let formatted = privateKey.trim();
  if (formatted.startsWith('"') && formatted.endsWith('"')) {
    formatted = formatted.slice(1, -1);
  }
  return formatted.replace(/\\n/g, "\n");
}

// El dashboard hace polling cada 5-15s. Crear un JWT por petición abre una
// conexión TLS nueva contra Google y descarta un token que dura una hora, así
// que el cliente se reutiliza: googleapis renueva el token solo al caducar.
let cachedAuth = null;
function getAnalyticsAuth(clientEmail, privateKey) {
  if (!cachedAuth) {
    cachedAuth = new google.auth.JWT({
      email: clientEmail,
      key: formatPrivateKey(privateKey),
      scopes: ["https://www.googleapis.com/auth/analytics.readonly"]
    });
  }
  return cachedAuth;
}

// Aun reutilizando el cliente, cada poll golpearía la GA Data API. Los informes
// no cambian a ese ritmo, así que se cachea la respuesta por rango.
const gaCache = new Map();

export async function POST(req) {
  try {
    const body = await req.json();
    const { action, params } = body;
    const store = getStore();

    store.events.unshift({
      id: Date.now(),
      action,
      params,
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    });

    if (store.events.length > 50) store.events.pop();

    // Attribution is counted here rather than by re-scanning `events`, which
    // only keeps the last 50 and so could never produce a real breakdown.
    const sourceKey = classifySource(params?.traffic_source || params?.trafficSource || params?.source);
    if (sourceKey && (action === "page_view" || action === "session_start" || action === "begin_checkout")) {
      store.sources[sourceKey] = (store.sources[sourceKey] || 0) + 1;
    }

    if (action === "page_view" || action === "session_start") {
      store.counters.pageViews++;
    }

    if (action === "click_book_now_navbar" || (action === "select_content" && params?.item_id === "book_now")) {
      store.counters.bookNowNavbar++;
    }
    if (action === "click_hero_appointment" || (action === "select_content" && params?.item_id === "set_appointment_hero")) {
      store.counters.heroAppointment++;
    }
    if (action === "click_phone" || action === "contact") {
      store.counters.phoneClicks++;
    }

    // Only the numbered event counts. Matching `form_step_view` as well used to
    // add a second hit for every step the user saw.
    const stepMatch = /^form_step_(\d)$/.exec(action || "");
    if (stepMatch) {
      const step = Number(stepMatch[1]);
      const counterKey = `formStep${step}`;
      if (counterKey in store.counters) store.counters[counterKey]++;
    }

    // ONLY update completed vehicle breakdown counters on form completion.
    // Step 8 itself is counted by the `form_step_8` event above.
    if (action === "booking_submit_success" || action === "lead_submit_success") {
      if (action === "booking_submit_success") store.counters.completedAppointment++;
      if (action === "lead_submit_success") store.counters.completedCallBack++;

      const vType = String(params?.vehicle_type || "").toLowerCase();
      if (vType === "sedan") store.counters.vehicleSedan++;
      else if (vType === "suv") store.counters.vehicleSuv++;
      else if (vType === "pickup") store.counters.vehiclePickup++;
      else if (vType === "other") store.counters.vehicleOther++;
    }

    saveStore(store);

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

// Pulls three separate reports: per-event counts, session/user totals, and the
// session source breakdown. Totals and sources need their own requests — asking
// for them alongside an `eventName` dimension returns them *per event*, which
// is what made the old "sessions" number a page_view count.
async function fetchGaReports(analyticsdata, propertyId, timeRange) {
  const property = `properties/${propertyId}`;

  if (timeRange === "realtime") {
    const realtime = await analyticsdata.properties.runRealtimeReport({
      property,
      requestBody: {
        dimensions: [{ name: "eventName" }],
        metrics: [{ name: "eventCount" }]
      }
    });
    const events = {};
    (realtime.data.rows || []).forEach(row => {
      events[row.dimensionValues[0].value] =
        (events[row.dimensionValues[0].value] || 0) + (parseInt(row.metricValues[0].value, 10) || 0);
    });
    return { events, totals: null, sources: null };
  }

  const startDate = timeRange === "7d" ? "7daysAgo" : "30daysAgo";
  const dateRanges = [{ startDate, endDate: "today" }];

  const [eventsRes, totalsRes, sourcesRes] = await Promise.all([
    analyticsdata.properties.runReport({
      property,
      requestBody: { dateRanges, dimensions: [{ name: "eventName" }], metrics: [{ name: "eventCount" }] }
    }),
    analyticsdata.properties.runReport({
      property,
      requestBody: { dateRanges, metrics: [{ name: "sessions" }, { name: "totalUsers" }] }
    }),
    analyticsdata.properties.runReport({
      property,
      requestBody: { dateRanges, dimensions: [{ name: "sessionSource" }], metrics: [{ name: "sessions" }] }
    })
  ]);

  const events = {};
  (eventsRes.data.rows || []).forEach(row => {
    events[row.dimensionValues[0].value] =
      (events[row.dimensionValues[0].value] || 0) + (parseInt(row.metricValues[0].value, 10) || 0);
  });

  const totalsRow = totalsRes.data.rows?.[0];
  const totals = totalsRow
    ? {
        sessions: parseInt(totalsRow.metricValues[0].value, 10) || 0,
        totalUsers: parseInt(totalsRow.metricValues[1].value, 10) || 0
      }
    : null;

  const sources = {};
  (sourcesRes.data.rows || []).forEach(row => {
    const key = classifySource(row.dimensionValues[0].value);
    if (!key) return;
    sources[key] = (sources[key] || 0) + (parseInt(row.metricValues[0].value, 10) || 0);
  });

  return { events, totals, sources: Object.keys(sources).length ? sources : null };
}

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const timeRange = url.searchParams.get("range") || "30d";
    const store = getStore();

    const propertyId = process.env.GA_PROPERTY_ID || "15343179608";
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    let privateKey = process.env.GOOGLE_PRIVATE_KEY;

    let ga = null;
    let gaErrorNotice = null;

    const gaTtlMs = timeRange === "realtime" ? 30000 : 300000;
    const gaCached = gaCache.get(timeRange);
    if (gaCached && Date.now() - gaCached.at < gaTtlMs) {
      ga = gaCached.data;
    } else if (propertyId && clientEmail && privateKey) {
      try {
        const auth = getAnalyticsAuth(clientEmail, privateKey);
        const analyticsdata = google.analyticsdata({ version: "v1beta", auth });
        ga = await fetchGaReports(analyticsdata, propertyId, timeRange);
        gaCache.set(timeRange, { data: ga, at: Date.now() });
      } catch (gaError) {
        gaErrorNotice = gaError.message;
        console.warn("GA Data API query notice:", gaError.message);
      }
    }

    const gaEvents = ga?.events || null;

    // Sessions and users come from GA's own metrics. They used to be derived
    // from the page_view event count, with users guessed at 85% of that.
    const totalSessions =
      ga?.totals?.sessions ??
      gaEvents?.["session_start"] ??
      store.counters.pageViews ??
      0;
    const totalUsers = ga?.totals?.totalUsers ?? null;

    const completedBookings = gaEvents?.["booking_submit_success"] ?? store.counters.completedAppointment ?? 0;
    const callBackLeads = gaEvents?.["lead_submit_success"] ?? store.counters.completedCallBack ?? 0;
    const phoneCalls = gaEvents?.["click_phone"] ?? store.counters.phoneClicks ?? 0;
    const totalConversions = completedBookings + callBackLeads;
    const conversionRate = totalSessions > 0
      ? ((totalConversions / totalSessions) * 100).toFixed(1) + "%"
      : "0%";

    // Raw step counts, reported as measured. The previous version ran them
    // through a Math.max chain that forced the funnel to be monotonic, which
    // hid exactly the tracking gaps this dashboard exists to reveal.
    const stepCount = (n) => gaEvents?.[`form_step_${n}`] ?? store.counters[`formStep${n}`] ?? 0;
    const funnelCounts = Object.fromEntries(
      [1, 2, 3, 4, 5, 6, 7, 8].map(n => [n, stepCount(n)])
    );

    const funnelNames = {
      2: "Step 2: Brand & Model",
      3: "Step 3: Ownership Duration",
      4: "Step 4: Rust Condition",
      5: "Step 5: Previous Protection",
      6: "Step 6: Scheduling Option",
      7: "Step 7: Contact / Schedule Form",
      8: "Step 8: Form Completed"
    };

    const funnelBase = funnelCounts[2] || funnelCounts[1] || 0;

    const funnel = [2, 3, 4, 5, 6, 7].map(n => {
      const count = funnelCounts[n];
      const next = funnelCounts[n + 1];
      const droppedOff = Math.max(count - next, 0);
      return {
        stepNumber: n,
        name: funnelNames[n],
        count,
        // Drop-off relative to the people who actually reached this step, not
        // to step 2 as before — that made every rate read far too low.
        percentage: count > 0 ? Math.round((droppedOff / count) * 100) : 0,
        droppedOff,
        isDropOff: true
      };
    });

    funnel.push({
      stepNumber: 8,
      name: funnelNames[8],
      count: funnelCounts[8],
      percentage: funnelBase > 0 ? Math.round((funnelCounts[8] / funnelBase) * 100) : 0,
      droppedOff: 0,
      isDropOff: false
    });

    const navbarBookNow = gaEvents?.["click_book_now_navbar"] ?? store.counters.bookNowNavbar ?? 0;
    const heroAppointment = gaEvents?.["click_hero_appointment"] ?? store.counters.heroAppointment ?? 0;

    const vehicleSedan = gaEvents?.["vehicle_completed_sedan"] ?? store.counters.vehicleSedan ?? 0;
    const vehicleSuv = gaEvents?.["vehicle_completed_suv"] ?? store.counters.vehicleSuv ?? 0;
    const vehiclePickup = gaEvents?.["vehicle_completed_pickup"] ?? store.counters.vehiclePickup ?? 0;
    const vehicleOther = gaEvents?.["vehicle_completed_other"] ?? store.counters.vehicleOther ?? 0;
    const totalVehicles = vehicleSedan + vehicleSuv + vehiclePickup + vehicleOther;

    // Real numbers only. This block used to fabricate the whole breakdown from
    // fixed ratios of the session count (35% Facebook, 25% Instagram, ...)
    // whenever no live counts existed — and since attribution never reached the
    // analytics events, that fallback was what the dashboard always showed.
    const sourceCounts = ga?.sources || store.sources || {};
    const trafficSources = buildTrafficSources(sourceCounts);

    return NextResponse.json({
      isLiveGA: Boolean(gaEvents),
      gaErrorNotice,
      timeRange,
      kpis: {
        totalSessions,
        totalUsers,
        completedBookings,
        callBackLeads,
        phoneCalls,
        conversionRate
      },
      bookingCTAs: {
        navbarBookNow,
        heroAppointment,
        phoneClicks: phoneCalls
      },
      formOptions: {
        optionA_Appointment: completedBookings,
        optionB_CallBack: callBackLeads
      },
      funnel,
      vehicleBreakdown: [
        { type: "SUV", count: vehicleSuv, percentage: totalVehicles > 0 ? Math.round((vehicleSuv / totalVehicles) * 100) : 0 },
        { type: "Sedan", count: vehicleSedan, percentage: totalVehicles > 0 ? Math.round((vehicleSedan / totalVehicles) * 100) : 0 },
        { type: "Pickup Truck", count: vehiclePickup, percentage: totalVehicles > 0 ? Math.round((vehiclePickup / totalVehicles) * 100) : 0 },
        { type: "Other", count: vehicleOther, percentage: totalVehicles > 0 ? Math.round((vehicleOther / totalVehicles) * 100) : 0 }
      ],
      trafficSources,
      trafficSourcesOrigin: ga?.sources ? "ga4" : Object.keys(store.sources || {}).length ? "local" : "none",
      recentEvents: store.events
    });
  } catch (error) {
    console.error("Error in analytics API:", error);
    return NextResponse.json({ error: "Failed to fetch analytics metrics" }, { status: 500 });
  }
}
