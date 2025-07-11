import { Router } from "express";
import { googleAuthController } from "../controllers/auth.controller";

const router = Router();

router.post("/auth/google", googleAuthController);

export default router;
