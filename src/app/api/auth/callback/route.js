import { NextResponse } from "next/server";
import { google } from "googleapis";
import fs from "fs";
import path from "path";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");

    if (!code) {
      return new NextResponse("No authorization code provided.", { status: 400 });
    }

    const host = req.headers.get("host");
    const protocol = req.headers.get("x-forwarded-proto") || "https";
    const redirectUri = `${protocol}://${host}/api/auth/callback`;

    const clientId = process.env.GOOGLE_CLIENT_ID || "1039666854022-rrrtiol4qcvtp0lksuna48e23hp17cq7.apps.googleusercontent.com";
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!clientSecret) {
      return new NextResponse("Missing GOOGLE_CLIENT_SECRET in Environment Variables", { status: 400 });
    }

    const oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUri
    );

    const { tokens } = await oauth2Client.getToken(code);
    const refreshToken = tokens.refresh_token || "";

    if (refreshToken) {
      // 1. Try writing to /tmp/calendar_tokens.json (Writable in Vercel Serverless environment)
      try {
        const tmpPath = path.join("/tmp", "calendar_tokens.json");
        fs.writeFileSync(
          tmpPath,
          JSON.stringify({ refresh_token: refreshToken, updated_at: new Date().toISOString() }, null, 2)
        );
      } catch (err) {
        console.warn("Could not write to /tmp:", err);
      }

      // 2. Try writing to project root (Local dev environment)
      try {
        const tokenStorePath = path.join(process.cwd(), "calendar_tokens.json");
        fs.writeFileSync(
          tokenStorePath,
          JSON.stringify({ refresh_token: refreshToken, updated_at: new Date().toISOString() }, null, 2)
        );
      } catch (err) {
        // Ignore read-only filesystem error on Vercel
      }

      // 3. Try updating .env.local if locally writable
      try {
        const envPath = path.join(process.cwd(), ".env.local");
        if (fs.existsSync(envPath)) {
          let envContent = fs.readFileSync(envPath, "utf8");
          if (envContent.includes("GOOGLE_REFRESH_TOKEN=")) {
            envContent = envContent.replace(
              /GOOGLE_REFRESH_TOKEN=.*/,
              `GOOGLE_REFRESH_TOKEN=${refreshToken}`
            );
          } else {
            envContent += `\nGOOGLE_REFRESH_TOKEN=${refreshToken}\n`;
          }
          fs.writeFileSync(envPath, envContent);
        }
      } catch (err) {
        // Ignore read-only filesystem error on Vercel
      }
    }

    // Return confirmation page displaying token for Vercel Environment Variables
    const html = `
      <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Google Calendar Vinculado Exitosamente</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              background: #0f172a;
              color: #f8fafc;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              padding: 1.5rem;
            }
            .card {
              background: #1e293b;
              border: 1px solid #334155;
              padding: 2.5rem;
              border-radius: 1.25rem;
              text-align: center;
              max-width: 480px;
              box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            }
            .icon-wrapper {
              width: 70px;
              height: 70px;
              background: rgba(56, 189, 248, 0.1);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 0 auto 1.5rem auto;
              font-size: 2.5rem;
            }
            h1 {
              font-size: 1.5rem;
              font-weight: 700;
              margin-bottom: 0.75rem;
              color: #f8fafc;
            }
            p {
              font-size: 0.95rem;
              color: #94a3b8;
              line-height: 1.6;
              margin-bottom: 1.5rem;
            }
            .status-badge {
              display: inline-flex;
              align-items: center;
              background: rgba(34, 197, 94, 0.15);
              color: #4ade80;
              border: 1px solid rgba(34, 197, 94, 0.3);
              padding: 0.5rem 1.25rem;
              border-radius: 9999px;
              font-weight: 600;
              font-size: 0.875rem;
              margin-bottom: 1.5rem;
            }
            .dot {
              width: 8px;
              height: 8px;
              background: #4ade80;
              border-radius: 50%;
              margin-right: 0.5rem;
            }
            .token-box {
              background: #0f172a;
              border: 1px solid #334155;
              padding: 1rem;
              border-radius: 0.75rem;
              text-align: left;
              margin-top: 1rem;
            }
            .token-title {
              font-size: 0.75rem;
              font-weight: 600;
              color: #38bdf8;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              margin-bottom: 0.5rem;
            }
            .token-input {
              width: 100%;
              background: transparent;
              border: none;
              color: #e2e8f0;
              font-family: monospace;
              font-size: 0.8rem;
              word-break: break-all;
            }
            .btn {
              background: #0284c7;
              color: white;
              border: none;
              padding: 0.6rem 1.2rem;
              border-radius: 0.5rem;
              font-weight: 600;
              font-size: 0.85rem;
              cursor: pointer;
              margin-top: 0.75rem;
              width: 100%;
              transition: background 0.2s;
            }
            .btn:hover {
              background: #0369a1;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="icon-wrapper">📅</div>
            <h1>¡Google Calendar Vinculado!</h1>
            <p>Tu cuenta se ha conectado exitosamente. Las inspecciones de vehículos agendadas por clientes se sincronizarán directamente en tu Google Calendar.</p>
            
            <div class="status-badge">
              <span class="dot"></span> Vinculación Lista
            </div>

            ${
              refreshToken
                ? `
              <div class="token-box">
                <div class="token-title">Para guardar permanentemente en Vercel:</div>
                <input type="text" readonly value="${refreshToken}" class="token-input" id="tokenField" />
                <button onclick="copyToken()" class="btn" id="copyBtn">📋 Copiar GOOGLE_REFRESH_TOKEN</button>
              </div>
              <script>
                function copyToken() {
                  var copyText = document.getElementById("tokenField");
                  copyText.select();
                  navigator.clipboard.writeText(copyText.value);
                  document.getElementById("copyBtn").innerText = "✓ ¡Copiado al Portapapeles!";
                }
              </script>
            `
                : ""
            }
          </div>
        </body>
      </html>
    `;

    return new NextResponse(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
  } catch (error) {
    console.error("Callback error:", error);
    return new NextResponse(`Error linking account: ${error.message}`, { status: 500 });
  }
}
