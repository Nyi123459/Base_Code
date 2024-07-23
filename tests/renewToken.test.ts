import request from "supertest";
import express from "express";
import { renewAccessToken } from "../src/config/token/renewToken";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../src/config/token/token";
import UserModel from "../src/models/User.models";

const app = express();
app.use(express.json());
app.post("/renew-token", renewAccessToken);

describe("Token generation and renewal", () => {
  it("should generate a new access token and refresh token", async () => {
    const userId = "testUserId";
    const refreshToken = generateRefreshToken(userId);

    // Mock the UserModel
    jest.spyOn(UserModel, "findById").mockResolvedValue({
      _id: userId,
      refreshToken: refreshToken,
    } as any);

    const response = await request(app)
      .post("/renew-token")
      .send({ token: refreshToken });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("accessToken");
    expect(response.body).toHaveProperty("refreshToken");

    // Check that the tokens are non-empty strings
    expect(typeof response.body.accessToken).toBe("string");
    expect(response.body.accessToken).not.toBe("");
    expect(typeof response.body.refreshToken).toBe("string");
    expect(response.body.refreshToken).not.toBe("");
  });

  it("should return 403 if refresh token is invalid", async () => {
    const response = await request(app)
      .post("/renew-token")
      .send({ token: "invalid" });

    expect(response.status).toBe(403);
    expect(response.body).toStrictEqual({ message: "Invalid refresh token" });
  });

  it("should return 401 if no token is provided", async () => {
    const response = await request(app)
      .post("/renew-token")
      .send({ token: "" });

    expect(response.status).toBe(401);
    expect(response.body).toStrictEqual({ message: "Refresh Token Required" });
  });
});
