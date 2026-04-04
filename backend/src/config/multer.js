import multer from "multer";
import path from "path";

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + ".pdf";
    cb(null, uniqueName);
  }
});

// Filtro (solo PDF)
const fileFilter = (req, file, cb) => {
  // Validar por extensión
  const ext = path.extname(file.originalname).toLowerCase();
  
  // Permitir múltiples MIME types que usan los PDFs
  const allowedMimetypes = [
    "application/pdf",
    "application/x-pdf",
    "application/x-bzpdf",
    "application/x-gzpdf"
  ];
  
  if (ext === ".pdf" && allowedMimetypes.includes(file.mimetype)) {
    cb(null, true);
  } else if (ext === ".pdf") {
    // Si tiene extensión .pdf pero mimetype desconocido, permitir igualmente
    console.warn(`MIME type desconocido para PDF: ${file.mimetype}`);
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten archivos PDF"), false);
  }
};

const upload = multer({
  storage,
  fileFilter
});

// Configuración para imágenes de perfil (opcional)
const storageImg = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `foto_${Date.now()}${ext}`);
  }
});

// Filtro para imágenes de perfil
const fileFilterImg = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error("Solo imágenes JPG, PNG o WEBP"), false);
};

export const uploadImg = multer({ storage: storageImg, fileFilter: fileFilterImg });

export default upload;