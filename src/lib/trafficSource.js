// Client-side traffic source detector & helper

export function getTrafficSource() {
  if (typeof window === "undefined") return "Direct";

  try {
    // 1. Check if already stored in current session
    const storedSource = sessionStorage.getItem("traffic_source");
    if (storedSource) {
      return storedSource;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get("utm_source");
    const utmMedium = urlParams.get("utm_medium");
    const gclid = urlParams.get("gclid");
    const fbclid = urlParams.get("fbclid");

    let source = "";

    if (gclid) {
      source = "Google Ads (gclid)";
    } else if (fbclid) {
      source = "Meta Ads (fbclid)";
    } else if (utmSource) {
      source = utmMedium ? `${utmSource} / ${utmMedium}` : utmSource;
    } else {
      const referrer = document.referrer;
      if (referrer) {
        const refUrl = new URL(referrer);
        const host = refUrl.hostname.toLowerCase();

        if (host.includes("google")) {
          source = "Google Organic";
        } else if (host.includes("facebook") || host.includes("fb.com")) {
          source = "Facebook";
        } else if (host.includes("instagram")) {
          source = "Instagram";
        } else if (host.includes("t.co") || host.includes("twitter") || host.includes("x.com")) {
          source = "Twitter / X";
        } else if (host.includes("bing") || host.includes("yahoo") || host.includes("duckduckgo")) {
          source = "Search Engine";
        } else if (host !== window.location.hostname) {
          source = `Referral (${host})`;
        }
      }
    }

    if (!source) {
      source = "Direct / None";
    }

    sessionStorage.setItem("traffic_source", source);
    return source;
  } catch (e) {
    return "Direct";
  }
}
