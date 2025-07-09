import app from "./app";
import { connectDB } from "./config/database.config";
import { logger } from "./utils/logger.utils";

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
