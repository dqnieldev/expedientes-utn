import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

const resendApiKey = process.env.RESEND_API_KEY;
const defaultFrom  = process.env.RESEND_FROM || "Paperless UTN <onboarding@resend.dev>";

if (!resendApiKey) {
  console.error("❌ [Mailer] RESEND_API_KEY no está configurada en las variables de entorno");
}

const resend = new Resend(resendApiKey);

console.log(`📧 [Mailer] Configurado con Resend — remitente: ${defaultFrom}`);

// Función centralizada para enviar correos con remitente garantizado
export const sendEmail = async ({ to, subject, html }) => {
  if (!to) {
    console.warn("⚠️ [Mailer] Intento de envío sin destinatario 'to'");
    return null;
  }

  if (!resendApiKey) {
    console.error("❌ [Mailer] No se puede enviar: RESEND_API_KEY no configurada");
    return null;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: defaultFrom,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    });

    if (error) {
      console.error(`❌ [Mailer] Error enviando correo a ${to}:`, error.message || JSON.stringify(error));
      return null;
    }

    console.log(`✅ [Mailer] Correo enviado a: ${to} | ID: ${data?.id}`);
    return data;
  } catch (error) {
    console.error(`❌ [Mailer] Error enviando correo a ${to}:`, error.message);
    return null;
  }
};

export default resend;