import { Router } from "express";
import { transcribeAudio } from "../controllers/transcription.controller";
import { upload } from "../middlewares/multer.middleware";
import { openAiRateLimiter } from "../middlewares/rate-limit.middleware";

const router = Router();

router.post(
  "/transcribe",
  openAiRateLimiter,
  upload.single("audio"),
  transcribeAudio,
);

export default router;
