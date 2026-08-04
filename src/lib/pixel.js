// Centralized Meta Pixel tracking helper module
export const PIXEL_ID = "1991419668160970";

function fbq(...args) {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq(...args);
  }
}

export const pixel = {
  pageView: () => fbq("track", "PageView"),

  viewContent: () =>
    fbq("track", "ViewContent", {
      content_name: "Rust Protection Pricing",
      content_category: "Auto Services",
      currency: "CAD",
    }),

  initiateCheckout: (vehicleType, value) =>
    fbq("track", "InitiateCheckout", {
      content_name: vehicleType ? `${vehicleType} Rust Protection` : "Rust Protection",
      content_category: "Auto Services",
      currency: "CAD",
      ...(value ? { value } : {}),
    }),

  schedule: (vehicleType, value) =>
    fbq("track", "Schedule", {
      content_name: vehicleType ? `${vehicleType} Rust Protection Appointment` : "Rust Protection Appointment",
      content_category: "Auto Services",
      currency: "CAD",
      ...(value ? { value } : {}),
    }),

  contact: (method = "Phone Call") =>
    fbq("track", "Contact", { content_name: method }),
};
