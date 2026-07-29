import multer from "multer";
import path from "path";
import fs from "fs";

const uploadsDir = path.resolve("uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configuración de almacenamiento para PDFs
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + ".pdf";
    cb(null, uniqueName);
  }
});

// Filtro (solo PDF)
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedMimetypes = [
    "application/pdf",
    "application/x-pdf",
    "application/x-bzpdf",
    "application/x-gzpdf"
  ];
  if (ext === ".pdf" || allowedMimetypes.includes(file.mimetype) || file.mimetype?.includes("pdf")) {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten archivos PDF"), false);
  }
};

const upload = multer({
  storage,
  fileFilter
});

// Configuración para imágenes de perfil
const storageImg = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || ".png";
    cb(null, `foto_${Date.now()}${ext}`);
  }
});

// Filtro para imágenes de perfil
const fileFilterImg = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
  if (allowed.includes(file.mimetype) || file.mimetype?.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Solo imágenes JPG, PNG o WEBP"), false);
  }
};

export const uploadImg = multer({ storage: storageImg, fileFilter: fileFilterImg });

export default upload;