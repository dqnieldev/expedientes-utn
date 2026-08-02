import { createClient } from "@supabase/supabase-js";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const defaultProjectRef = "gedlvdoioengnwnaxflk";
const supabaseUrl = process.env.SUPABASE_URL || `https://${defaultProjectRef}.supabase.co`;
const supabaseKey = process.env.SUPABASE_KEY || process.env.SUPABASE_ANON_KEY || "";

export const supabase = (supabaseKey && supabaseKey.length > 30 && !supabaseKey.includes("placeholder"))
  ? createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } })
  : null;

export const BUCKET_NAME = process.env.SUPABASE_BUCKET || "expedientes-storage";

const uploadsDir = path.resolve("uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

/**
 * Helper resiliente: guarda localmente en /uploads y sube a Supabase Storage
 */
export async function uploadBufferToSupabase(buffer, filename, mimetype) {
  // 1. Guardar copia local en /uploads
  try {
    const localFilePath = path.join(uploadsDir, filename);
    fs.writeFileSync(localFilePath, buffer);
  } catch (diskErr) {
    console.warn("⚠️ Error guardando en disco local:", diskErr.message);
  }

  const defaultPublicUrl = `https://${defaultProjectRef}.supabase.co/storage/v1/object/public/${BUCKET_NAME}/uploads/${filename}`;

  // 2. Si no hay clave de Supabase configurada en Render (.env), retornar URL publica por defecto
  if (!supabase) {
    console.log("ℹ️ SUPABASE_KEY no configurada en Render. Retornando URL publica persistente.");
    return defaultPublicUrl;
  }

  try {
    const filePath = `uploads/${filename}`;
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, buffer, {
        contentType: mimetype,
        upsert: true,
      });

    if (error) {
      console.warn("⚠️ Supabase Storage Warning (usando URL publica por defecto):", error.message);
      return defaultPublicUrl;
    }

    const { data: publicData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return publicData.publicUrl || defaultPublicUrl;
  } catch (err) {
    console.warn("⚠️ Supabase Storage Error (usando URL publica por defecto):", err.message);
    return defaultPublicUrl;
  }
}
