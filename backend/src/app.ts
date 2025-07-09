import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { errorHandler } from "./middlewares/error-handler.middleware";
import { requestLogger } from "./middlewares/request-logger.middleware";
import transcriptionRoutes from "./routes/transcription.routes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use(requestLogger);
app.use("/", transcriptionRoutes);

app.get("/ping", (_req, res) => {
  res.json({ message: "pong" });
});

app.use(errorHandler);

export default app;
