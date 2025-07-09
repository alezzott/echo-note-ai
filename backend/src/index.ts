import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./config/database.config";
import { errorHandler } from "./middlewares/error-handler.middleware";
import transcriptionRoutes from "./routes/transcription.routes";
import { logger } from "./utils/logger.utils";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", transcriptionRoutes);

app.get("/ping", (_req, res) => {
  res.json({ message: "pong" });
});

app.use(errorHandler);

const PORT = process.env.PORT || 4000;

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  logger.error("MONGODB_URI não configurada no ambiente.");
  process.exit(1);
}
connectDB(mongoUri);

app.listen(PORT, () => {
  logger.info(`Servidor rodando na porta ${PORT}`);
});
