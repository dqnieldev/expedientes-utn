import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const DEFAULT_GMAIL_USER = "paperlessutndev@gmail.com";
const DEFAULT_GMAIL_PASS = "sskquqgqajdkrftj";

const gmailUser = (process.env.GMAIL_USER || DEFAULT_GMAIL_USER).trim();
const gmailPass = (process.env.GMAIL_PASS || DEFAULT_GMAIL_PASS).replace(/\s+/g, "");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  family: 4, // Forzar IPv4 — Render no soporta IPv6 saliente (ENETUNREACH)
  auth: {
    user: gmailUser,
    pass: gmailPass,
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Función centralizada para enviar correos con remitente garantizado
export const sendEmail = async ({ to, subject, html }) => {
  if (!to) {
    console.warn("⚠️ [Mailer] Intento de envío sin destinatario 'to'");
    return null;
  }

  const mailOptions = {
    from: `"Paperless UTN" <${gmailUser}>`,
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ [Mailer] Correo enviado exitosamente a: ${to} | ID: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`❌ [Mailer] Error enviando correo a ${to}:`, error.message);
    return null;
  }
};

export default transporter;