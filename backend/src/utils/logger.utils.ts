import { createLogger, format, type Logger, transports } from "winston";

function buildCustomFormat() {
  return format.printf(({ timestamp, level, message, ...meta }) => {
    const dataKey = meta.data ? "data" : meta.log_data ? "log_data" : null;
    const dataValue = dataKey ? JSON.stringify(meta[dataKey]) : "";
    if (dataKey) delete meta[dataKey];

    const metaString = Object.keys(meta).length
      ? `| ${JSON.stringify(meta)}`
      : "";

    return [
      timestamp,
      level.toUpperCase(),
      "|",
      message,
      dataKey ? `| ${dataKey}:${dataValue}` : "",
      metaString,
    ]
      .filter(Boolean)
      .join(" ");
  });
}

function buildLogger(): Logger {
  const logLevel = process.env.LOG_LEVEL || "info";
  const timestampFormat = "ddd, DD MMM YYYY HH:mm:ss";

  return createLogger({
    level: logLevel,
    format: format.combine(
      format.timestamp({ format: timestampFormat }),
      format.errors({ stack: true }),
      format.splat(),
      buildCustomFormat(),
    ),
    transports: [
      new transports.Console({
        level: logLevel,
        format: format.combine(
          format.timestamp({ format: timestampFormat }),
          format.splat(),
          buildCustomFormat(),
        ),
      }),
      new transports.File({ filename: "logs/error.log", level: "error" }),
      new transports.File({ filename: "logs/combined.log" }),
    ],
    exitOnError: false,
  });
}

export const logger = buildLogger();
