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
    const protocol = req.headers.get("x-forwarded-proto") || "http";
    const redirectUri = `${protocol}://${host}/api/auth/callback`;

    const clientId = process.env.GOOGLE_CLIENT_ID || "1039666854022-rrrtiol4qcvtp0lksuna48e23hp17cq7.apps.googleusercontent.com";
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!clientSecret) {
      return new NextResponse("Missing GOOGLE_CLIENT_SECRET in .env.local", { status: 400 });
    }

    const oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUri
    );

    const { tokens } = await oauth2Client.getToken(code);

    if (tokens.refresh_token) {
      // 1. Save to calendar_tokens.json file in project root
      const tokenStorePath = path.join(process.cwd(), "calendar_tokens.json");
      fs.writeFileSync(
        tokenStorePath,
        JSON.stringify(
          {
            refresh_token: tokens.refresh_token,
            updated_at: new Date().toISOString(),
          },
          null,
          2
        )
      );

      // 2. Also save to .env.local if exists
      const envPath = path.join(process.cwd(), ".env.local");
      if (fs.existsSync(envPath)) {
        let envContent = fs.readFileSync(envPath, "utf8");
        if (envContent.includes("GOOGLE_REFRESH_TOKEN=")) {
          envContent = envContent.replace(
            /GOOGLE_REFRESH_TOKEN=.*/,
            `GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`
          );
        } else {
          envContent += `\nGOOGLE_REFRESH_TOKEN=${tokens.refresh_token}\n`;
        }
        fs.writeFileSync(envPath, envContent);
      }
    }

    // Return beautiful success page to the user/client
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
              padding: 1rem;
            }
            .card {
              background: #1e293b;
              border: 1px solid #334155;
              padding: 2.5rem;
              border-radius: 1.25rem;
              text-align: center;
              max-width: 440px;
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
            }
            .dot {
              width: 8px;
              height: 8px;
              background: #4ade80;
              border-radius: 50%;
              margin-right: 0.5rem;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="icon-wrapper">📅</div>
            <h1>¡Google Calendar Vinculado!</h1>
            <p>Tu cuenta se ha conectado exitosamente. Todas las inspecciones de vehículos agendadas por clientes en la landing page aparecerán de forma automática en tu Google Calendar.</p>
            <div class="status-badge">
              <span class="dot"></span> Sincronización Automática Activa
            </div>
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
