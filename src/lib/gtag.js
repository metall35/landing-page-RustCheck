export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url) => {
  if (typeof window !== "undefined" && window.gtag && GA_MEASUREMENT_ID) {
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

// Generic GA event dispatching & Realtime Local Telemetry Sync
export const trackEvent = (action, params = {}) => {
  if (typeof window !== "undefined") {
    if (window.gtag) {
      window.gtag("event", action, params);
    }
    // Also post to local real-time telemetry store for instantaneous dashboard rendering
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, params })
    }).catch(() => {});
  }
};

// Form Progression event tracker (backward compatible)
export const trackFormEvent = (action, params = {}) => {
  trackEvent(action, {
    event_category: "Form Progression",
    ...params,
  });
};

// CTA click tracker
export const trackCTA = (ctaName, location) => {
  trackEvent("select_content", {
    content_type: "button",
    item_id: ctaName,
    location: location,
    event_category: "CTA Click",
  });
};

// Phone call link tracker
export const trackPhoneClick = (phoneNumber, location = "header") => {
  trackEvent("contact", {
    method: "phone",
    phone_number: phoneNumber,
    location: location,
    event_category: "Conversion",
  });
};

// Location / Map click tracker
export const trackLocationClick = (actionType = "view_map") => {
  trackEvent("view_item", {
    item_type: "location_map",
    action_type: actionType,
    event_category: "User Engagement",
  });
};

// GA4 Standard Begin Checkout Event
export const trackBeginCheckout = (vehicleType = "") => {
  trackEvent("begin_checkout", {
    event_category: "Booking Funnel",
    vehicle_type: vehicleType,
  });
};

// GA4 Standard Generate Lead Event
export const trackLead = (leadType, details = {}) => {
  trackEvent("generate_lead", {
    event_category: "Lead Conversion",
    lead_type: leadType, // 'appointment_booking' | 'call_back_request'
    ...details,
  });
};

