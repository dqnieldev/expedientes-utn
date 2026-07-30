import dns from "dns/promises";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const DEFAULT_GMAIL_USER = "paperlessutndev@gmail.com";
const DEFAULT_GMAIL_PASS = "sskquqgqajdkrftj";

const gmailUser = (process.env.GMAIL_USER || DEFAULT_GMAIL_USER).trim();
const gmailPass = (process.env.GMAIL_PASS || DEFAULT_GMAIL_PASS).replace(/\s+/g, "");

// Resolver smtp.gmail.com a una dirección IPv4 explícita al arranque.
// Render no soporta IPv6 saliente y Node.js resuelve a IPv6 por defecto,
// causando ENETUNREACH. Al resolver manualmente con dns.resolve4 (registros A),
// se garantiza una IP v4 y se omite la resolución DNS en cada sendMail.
let gmailHost = "smtp.gmail.com";
try {
  const ipv4Addresses = await dns.resolve4("smtp.gmail.com");
  if (ipv4Addresses.length > 0) {
    gmailHost = ipv4Addresses[0];
    console.log(`📧 [Mailer] smtp.gmail.com resuelto a IPv4: ${gmailHost}`);
  }
} catch (err) {
  console.warn(`⚠️ [Mailer] No se pudo resolver IPv4, usando hostname: ${err.message}`);
}

console.log(`📧 [Mailer] Configurado con remitente: ${gmailUser} → host: ${gmailHost}:465`);

const transporter = nodemailer.createTransport({
  host: gmailHost,
  port: 465,
  secure: true,
  auth: {
    user: gmailUser,
    pass: gmailPass,
  },
  tls: {
    servername: "smtp.gmail.com", // Necesario para validación TLS al usar IP directa
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
    console.log(`✅ [Mailer] Correo enviado a: ${to} | ID: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`❌ [Mailer] Error enviando correo a ${to}:`, error.message);
    return null;
  }
};

export default transporter;