import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const gmailUser = process.env.GMAIL_USER || "paperlessutndev@gmail.com";
const gmailPass = (process.env.GMAIL_PASS || "sskq uqgq ajdk rftj").replace(/\s+/g, "");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Usar SSL en puerto 465 (compatible con Render)
  auth: {
    user: gmailUser,
    pass: gmailPass,
  },
  tls: {
    rejectUnauthorized: false
  }
});

export default transporter;