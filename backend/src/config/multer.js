import multer from "multer";
import path from "path";
import fs from "fs";

const uploadsDir = path.resolve("uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Usar memoryStorage para procesar buffers directamente hacia Supabase Storage
const memoryStorage = multer.memoryStorage();

// Filtro (PDFs o imágenes)
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedPDF = ["application/pdf", "application/x-pdf", "application/x-bzpdf", "application/x-gzpdf"];
  const isPDF = ext === ".pdf" || allowedPDF.includes(file.mimetype) || file.mimetype?.includes("pdf");
  const isImage = file.mimetype?.startsWith("image/") || [".png", ".jpg", ".jpeg", ".webp"].includes(ext);

  if (isPDF || isImage) {
    cb(null, true);
  } else {
    cb(new Error("Formato de archivo no soportado. Se permiten PDF e imágenes."), false);
  }
};

const upload = multer({
  storage: memoryStorage,
  fileFilter,
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB
});

export const uploadImg = multer({
  storage: memoryStorage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

export default upload;