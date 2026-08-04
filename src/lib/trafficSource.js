// Client-side traffic source & social network detector utility

export function getTrafficSource() {
  if (typeof window === "undefined") return "Direct / Bookmark";

  try {
    const storedSource = sessionStorage.getItem("traffic_source");
    if (storedSource) {
      return storedSource;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = (urlParams.get("utm_source") || "").toLowerCase();
    const utmMedium = (urlParams.get("utm_medium") || "").toLowerCase();
    const gclid = urlParams.get("gclid");
    const fbclid = urlParams.get("fbclid");
    const ttclid = urlParams.get("ttclid");

    let source = "";

    if (fbclid || utmSource.includes("facebook") || utmSource.includes("fb")) {
      source = fbclid ? "Facebook Ads (Meta)" : "Facebook";
    } else if (utmSource.includes("instagram") || utmSource.includes("ig")) {
      source = "Instagram (Meta)";
    } else if (ttclid || utmSource.includes("tiktok")) {
      source = "TikTok Ads / Post";
    } else if (utmSource.includes("youtube")) {
      source = "YouTube";
    } else if (utmSource.includes("twitter") || utmSource.includes("x.com")) {
      source = "Twitter / X";
    } else if (utmSource.includes("linkedin")) {
      source = "LinkedIn";
    } else if (gclid || utmSource.includes("google")) {
      source = gclid ? "Google Ads (Paid)" : "Google Search";
    } else if (utmSource) {
      source = utmMedium ? `${utmSource} / ${utmMedium}` : utmSource;
    } else {
      const referrer = document.referrer;
      if (referrer) {
        const refUrl = new URL(referrer);
        const host = refUrl.hostname.toLowerCase();

        if (host.includes("facebook") || host.includes("fb.com")) {
          source = "Facebook";
        } else if (host.includes("instagram")) {
          source = "Instagram";
        } else if (host.includes("tiktok")) {
          source = "TikTok";
        } else if (host.includes("youtube") || host.includes("youtu.be")) {
          source = "YouTube";
        } else if (host.includes("t.co") || host.includes("twitter") || host.includes("x.com")) {
          source = "Twitter / X";
        } else if (host.includes("linkedin")) {
          source = "LinkedIn";
        } else if (host.includes("google")) {
          source = "Google Search (Organic)";
        } else if (host.includes("bing") || host.includes("yahoo") || host.includes("duckduckgo")) {
          source = "Search Engine";
        } else if (host !== window.location.hostname) {
          source = `Referral (${host})`;
        }
      }
    }

    if (!source) {
      source = "Direct / Bookmark";
    }

    sessionStorage.setItem("traffic_source", source);
    return source;
  } catch (e) {
    return "Direct / Bookmark";
  }
}
