import mongoose from "mongoose";
import request from "supertest";
import app from "../../src/app";
import Transcription from "../../src/models/transcription.model";

jest.mock("../../src/middlewares/firebase-auth.middleware", () => ({
  firebaseAuth: require("../../src/middlewares/mock/auth.mock")
    .firebaseAuthMock,
}));

describe("GET /transcriptions?userId=", () => {
  const userId = "test-user-123";

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI as string);
    await Transcription.create([
      {
        userId,
        filename: "audio1.mp3",
        transcript: "Primeira transcrição",
        segments: [],
        language: "pt",
      },
      {
        userId,
        filename: "audio2.mp3",
        transcript: "Segunda transcrição",
        segments: [],
        language: "pt",
      },
    ]);
  });

  afterAll(async () => {
    await Transcription.deleteMany({ userId });
    await mongoose.disconnect();
  });

  it("deve retornar as transcrições do usuário", async () => {
    const res = await request(app)
      .get(`/transcriptions?userId=${userId}`)
      .set("Authorization", `Bearer mock_token`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(2);
    expect(res.body[0]).toHaveProperty("userId", userId);
    expect(res.body[0]).toHaveProperty("filename");
    expect(res.body[0]).toHaveProperty("transcript");
  });

  it("deve retornar erro se userId não for informado", async () => {
    const res = await request(app)
      .get("/transcriptions")
      .set("Authorization", `Bearer mock_token`)
      .expect(400);
    expect(res.body).toHaveProperty("error");
  });

  it("deve respeitar paginação e ordenação", async () => {
    const res = await request(app)
      .get(
        `/transcriptions?userId=${userId}&limit=1&page=2&sortBy=filename&order=asc`,
      )
      .set("Authorization", `Bearer mock_token`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0]).toHaveProperty("filename", "audio2.mp3");
  });
});
