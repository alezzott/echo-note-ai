import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { errorHandler } from "./middlewares/error-handler.middleware";
import { requestLogger } from "./middlewares/request-logger.middleware";
import authRoutes from "./routes/auth.routes";
import transcriptionRoutes from "./routes/transcription.routes";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerOptions from "./config/swagger.config";

dotenv.config();

const app = express();
app.use(
	cors({
		origin: process.env.CORS_ORIGIN,
		credentials: true,
	}),
);
app.use(express.json());

app.use(requestLogger);
const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(authRoutes);
app.use("/", transcriptionRoutes);

app.get("/ping", (_req, res) => {
	res.json({ message: "pong" });
});

app.use(errorHandler);

export default app;
