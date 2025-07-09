import multer from "multer";

enum AllowedMimeTypes {
  WAV = "audio/wav",
  MPEG = "audio/mpeg",
  MP4 = "audio/mp4",
  AAC = "audio/aac",
  X_M4A = "audio/x-m4a",
  M4A = "audio/m4a",
}

const allowedTypes = new Set<string>(Object.values(AllowedMimeTypes));

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
    if (allowedTypes.has(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Tipo de arquivo não suportado. Envie um áudio nos formatos: mp3, wav, m4a ou mp4.",
        ),
      );
    }
  },
});
