import jwt from "jsonwebtoken";
import { generateJwtToken, verifyJwtToken } from "../src/config/token/token";
import { JWT_SECRET } from "../src/config";

// Mock the JWT secret values
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

describe("JWT Token Generation and Validation", () => {
  const userId = "testUserId";
  const mockToken = "mockToken";
  const decodedToken = { id: userId };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should generate a JWT token", () => {
    (jwt.sign as jest.Mock).mockReturnValue(mockToken);

    const token = generateJwtToken(userId);
    expect(token).toBe(mockToken);
    expect(jwt.sign).toHaveBeenCalledWith({ id: userId }, JWT_SECRET, {
      expiresIn: "1hr",
    });
  });

  it("should verify a JWT token", () => {
    (jwt.verify as jest.Mock).mockReturnValue(decodedToken);

    const token = "someToken";
    const decoded = verifyJwtToken({ token });

    expect(decoded).toEqual(decodedToken);
    expect(jwt.verify).toHaveBeenCalledWith(token, JWT_SECRET);
  });

  it("should throw an error for invalid or expired tokens", () => {
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error("Invalid or expired token");
    });

    expect(() => verifyJwtToken({ token: "invalidToken" })).toThrow(
      "Invalid or expired data"
    );
  });
});
