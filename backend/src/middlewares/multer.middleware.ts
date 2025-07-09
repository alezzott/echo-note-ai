import multer from "multer";

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["audio/wav", "audio/mpeg", "audio/mp4", "audio/aac"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else
      cb(
        new multer.MulterError(
          "LIMIT_UNEXPECTED_FILE",
          "Tipo de arquivo não suportado. Envie um áudio nos formatos: mp3, wav, m4a ou mp4.",
        ),
      );
  },
});
