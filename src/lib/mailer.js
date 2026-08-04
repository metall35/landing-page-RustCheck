import nodemailer from "nodemailer";

/**
 * Send email notification for new contact leads via Gmail SMTP using Nodemailer
 */
export async function sendLeadNotificationEmail({ name, email, phone, formData, type = "Call Back Request", trafficSource = "Direct" }) {
  const senderEmail = process.env.GOOGLE_CALENDAR_ID || "newmarketrustcheck@gmail.com";
  const recipientEmail = process.env.NOTIFICATION_EMAIL || process.env.GMAIL_TO || senderEmail;
  const appPassword = process.env.GMAIL_APP_PASSWORD || process.env.GOOGLE_APP_PASSWORD;

  if (!appPassword) {
    console.warn("[MAILER WARNING] GMAIL_APP_PASSWORD is not set in environment variables. Email notification skipped.");
    return { success: false, reason: "GMAIL_APP_PASSWORD missing" };
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // TLS
      auth: {
        user: senderEmail,
        pass: appPassword,
      },
    });

    const timestamp = new Date().toLocaleString("en-US", { timeZone: process.env.TIMEZONE || "America/Toronto" });
    const vehicleStr = formData ? `${formData.make || ""} ${formData.model || ""} (${formData.vehicleType || "N/A"})`.trim() : "N/A";

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
        <div style="background-color: #d97706; padding: 20px; text-align: center; color: #ffffff;">
          <h2 style="margin: 0; font-size: 22px;">🚗 New Rust Check Contact Request</h2>
          <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">Lead received from website form</p>
        </div>
        <div style="padding: 24px; color: #333333;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #eeeeee;">
              <td style="padding: 10px 0; font-weight: bold; width: 40%;">Form Type:</td>
              <td style="padding: 10px 0;">${type}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eeeeee;">
              <td style="padding: 10px 0; font-weight: bold;">Full Name:</td>
              <td style="padding: 10px 0;">${name}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eeeeee;">
              <td style="padding: 10px 0; font-weight: bold;">Email:</td>
              <td style="padding: 10px 0;"><a href="mailto:${email}" style="color: #2563eb;">${email}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid #eeeeee;">
              <td style="padding: 10px 0; font-weight: bold;">Phone:</td>
              <td style="padding: 10px 0;"><a href="tel:${phone || ''}" style="color: #2563eb;">${phone || "N/A"}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid #eeeeee;">
              <td style="padding: 10px 0; font-weight: bold;">Vehicle Details:</td>
              <td style="padding: 10px 0;">${vehicleStr}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eeeeee;">
              <td style="padding: 10px 0; font-weight: bold;">Rust Condition:</td>
              <td style="padding: 10px 0;">${formData?.rustCondition || "N/A"}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eeeeee;">
              <td style="padding: 10px 0; font-weight: bold;">Traffic Source:</td>
              <td style="padding: 10px 0;"><span style="background-color: #f3f4f6; padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: 12px;">${trafficSource}</span></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold;">Received At:</td>
              <td style="padding: 10px 0;">${timestamp}</td>
            </tr>
          </table>

          <div style="margin-top: 24px; text-align: center;">
            <a href="https://docs.google.com/spreadsheets/d/1GzXdZDx6jdn2X6FDHVpkvn_QDkLOig6OEQ4NmTpRleE/edit" target="_blank" style="background-color: #059669; color: #ffffff; padding: 12px 20px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block;">
              📊 Open Google Sheets Spreadsheet
            </a>
          </div>
        </div>
        <div style="background-color: #f9fafb; padding: 15px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #eeeeee;">
          Rust Check Newmarket Notifications — Action Imaging System
        </div>
      </div>
    `;

    const info = await transporter.sendMail({
      from: `Rust Check Newmarket Notifications <${senderEmail}>`,
      to: recipientEmail,
      subject: `[New Lead] ${name} - ${type} (${trafficSource})`,
      html: htmlBody,
    });

    console.log(`[MAILER SUCCESS] Lead email sent to ${recipientEmail}, MessageId: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error("[MAILER ERROR] Failed to send lead notification email:", err);
    return { success: false, error: err.message };
  }
}
