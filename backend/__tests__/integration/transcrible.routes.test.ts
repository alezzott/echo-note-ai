import fs from "node:fs";
import type http from "node:http";
import path from "node:path";
import mongoose from "mongoose";
import request from "supertest";
import app from "../../src/app";
import { connectDB } from "./../../src/config/database.config";
import { logger } from "../../src/utils/logger.utils";

let server: http.Server;

jest.mock("../../src/middlewares/firebase-auth.middleware", () => ({
  firebaseAuth: require("../../src/middlewares/mock/auth.mock")
    .firebaseAuthMock,
}));

beforeAll(async () => {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error("MONGODB_URI não configurada no ambiente de teste");
  }
  await connectDB(mongoUri);
  server = app.listen(0);
});

afterAll(async () => {
  await mongoose.connection.close();
  await new Promise((resolve) => setTimeout(resolve, 500));

  const uploadsDir = path.join(__dirname, "../../uploads");
  if (fs.existsSync(uploadsDir)) {
    fs.readdirSync(uploadsDir).forEach((file) => {
      fs.unlinkSync(path.join(uploadsDir, file));
    });
  }

  for (const transport of logger.transports) {
    if (typeof transport.close === "function") {
      transport.close();
    }
  }

  if (server) {
    await new Promise<void>((resolve) => {
      server.close(() => {
        resolve();
      });
    });
  }
});

jest.mock("ffprobe-client", () => {
  return {
    __esModule: true,
    default: jest.fn((filePath: string) => {
      if (filePath.includes("test-endpoint-trancrible-10seg.m4a")) {
        return Promise.resolve({ streams: [{ duration: "12.0" }] });
      }
      return Promise.resolve({ streams: [{ duration: "1.0" }] });
    }),
  };
});

describe("POST /transcribe", () => {
  it("retorna sucesso para áudio válido", async () => {
    const res = await request(server)
      .post("/transcribe")
      .set("x-user-id", "test-user")
      .set("Authorization", `Bearer mock_auth`)
      .attach(
        "audio",
        path.join(__dirname, "fixtures/teste-endpoint-post-transcrible.m4a"),
      );
    expect(res.status).toBe(200);
    expect(res.body.text).toBeDefined();
  });

  it("retorna erro para tipo MIME inválido", async () => {
    const res = await request(server)
      .post("/transcribe")
      .set("x-user-id", "test-user")
      .set("Authorization", `Bearer mock_auth`)
      .attach("audio", path.join(__dirname, "fixtures/arquivo.txt"));
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/tipo de arquivo/i);
  });

  it("retorna erro para áudio maior que 10s", async () => {
    const res = await request(server)
      .post("/transcribe")
      .set("x-user-id", "test-user")
      .set("Authorization", `Bearer mock_auth`)
      .attach(
        "audio",
        path.join(__dirname, "fixtures/test-endpoint-trancrible-10seg.m4a"),
      );
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/no máximo 10 segundos/i);
  });

  it("retorna sucesso para áudio válido", async () => {
    const res = await request(server)
      .post("/transcribe")
      .set("x-user-id", "test-user")
      .set("Authorization", `Bearer mock_auth`)
      .attach(
        "audio",
        path.join(__dirname, "fixtures/teste-endpoint-post-transcrible.m4a"),
      );
    expect(res.status).toBe(200);
    expect(res.body.text).toBeDefined();
    expect(Array.isArray(res.body.segments)).toBe(true);
  });

  it("retorna erro de rate limit após muitas requisições", async () => {
    for (let i = 0; i < 5; i++) {
      await request(server)
        .post("/transcribe")
        .set("x-user-id", "test-user")
        .set("Authorization", `Bearer mock_auth`)
        .attach(
          "audio",
          path.join(__dirname, "fixtures/teste-endpoint-post-transcrible.m4a"),
        );
    }
    const res = await request(server)
      .post("/transcribe")
      .set("x-user-id", "test-user")
      .set("Authorization", `Bearer mock_auth`)
      .attach(
        "audio",
        path.join(__dirname, "fixtures/teste-endpoint-post-transcrible.m4a"),
      );
    expect(res.status).toBe(429);
    expect(res.body.error).toBe("Rate limit exceeded");
    expect(res.body.message).toMatch(/muitas transcrições/i);
  });
});
