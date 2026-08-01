import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

// Extraer el project ref de DIRECT_URL o DATABASE_URL si no se define SUPABASE_URL explícitamente
const defaultProjectRef = "gedlvdoioengnwnaxflk";
const supabaseUrl = process.env.SUPABASE_URL || `https://${defaultProjectRef}.supabase.co`;

// Clave anon o service_role
const supabaseKey = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlZGx2ZG9pb2VuZ253bmF4ZmxrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MjAwMDAwMDAwMH0.placeholder";

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

export const BUCKET_NAME = process.env.SUPABASE_BUCKET || "expedientes-storage";

/**
 * Helper para subir un buffer a Supabase Storage y retornar su URL pública
 */
export async function uploadBufferToSupabase(buffer, filename, mimetype) {
  try {
    const filePath = `uploads/${filename}`;
    
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, buffer, {
        contentType: mimetype,
        upsert: true,
      });

    if (error) {
      console.warn("⚠️ Supabase Storage Upload Warning:", error.message);
      return null;
    }

    const { data: publicData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return publicData.publicUrl;
  } catch (err) {
    console.error("❌ Error uploading to Supabase Storage:", err);
    return null;
  }
}
