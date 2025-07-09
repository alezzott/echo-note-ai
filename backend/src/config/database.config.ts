import mongoose from "mongoose";
import { logger } from "../utils/logger.utils";

export const connectDB = async (mongoUri: string) => {
  try {
    await mongoose.connect(mongoUri);
    logger.info("MongoDB conectado!");
  } catch (err) {
    logger.error("Erro ao conectar no MongoDB:", {
      error: err instanceof Error ? err.message : err,
      stack: err instanceof Error ? err.stack : undefined,
    });
    process.exit(1);
  }
};
