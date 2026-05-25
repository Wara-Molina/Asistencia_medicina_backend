// src/__tests__/auth.integration.test.ts
import request from "supertest";

import app from "../../app";

import { AppDataSource } from "../../config/database";

beforeAll(async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
});

afterAll(async () => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
});

describe("Auth API", () => {
  it("login inválido", async () => {
    const response = await request(app)
      .post("/api/auth/login")

      .send({
        email: "fake@test.com",

        password: "123",
      });

    expect([400, 401]).toContain(response.status);
  });
});
