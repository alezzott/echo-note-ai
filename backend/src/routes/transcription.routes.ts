import { Router } from "express";
import {
  exportTranscription,
  getTranscriptionById,
  listTranscriptions,
  transcribeAudio,
} from "../controllers/transcription.controller";
import { checkAudioDuration } from "../middlewares/ffmpeg.middleware";
import { upload } from "../middlewares/multer.middleware";
import { openAiRateLimiter } from "../middlewares/rate-limit.middleware";

const router = Router();

router.post(
  "/transcribe",
  openAiRateLimiter,
  upload.single("audio"),
  checkAudioDuration(10, "audio"),
  transcribeAudio,
);

router.get("/transcriptions", listTranscriptions);
router.get("/transcription/:id", getTranscriptionById);
router.get("/export/:id", exportTranscription);

export default router;
