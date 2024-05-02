const request = require("supertest");
import app from "../server.js";

describe("Authentication Routes", () => {
  it("should register a new user", async () => {
    const response = await request(app).post("/auth/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
      confirmPassword: "password123",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(
      "message",
      "User created successfully!"
    );
    expect(response.body.user).toHaveProperty("id");
    expect(response.body.user).toHaveProperty("name", "Test User");
    expect(response.body.user).toHaveProperty("email", "test@example.com");
  });
});

describe("User Routes", () => {
  it("should get user by id", async () => {
    // Assuming there's a user in the database with id '123'
    const response = await request(app).get("/user/123");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("user");
    expect(response.body.user).toHaveProperty("id", "123");
    expect(response.body.user).toHaveProperty("name");
    expect(response.body.user).toHaveProperty("email");
    expect(response.body.user).not.toHaveProperty("password");
  });

  // Add more tests for other user routes if needed
});
