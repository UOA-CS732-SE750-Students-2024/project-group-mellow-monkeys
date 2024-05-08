const request = require("supertest");
import app from "../server.js";

describe("Login Functionality Tests", () => {
  it("should log in an existing user with correct credentials", async () => {
    const response = await request(app).post("/auth/login").send({
      email: "test@123.com",
      password: "test",
    });

    // Assuming a token is returned on login
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "User logged in successfully!");
    expect(response.body).toHaveProperty("token"); 
  });

  it("should fail to log in with incorrect password", async () => {
    const response = await request(app).post("/auth/login").send({
      email: "test@example.com",
      password: "wrongpassword",
    });

    //API sends back on auth failure
    expect(response.status).toBe(422); 
    expect(response.body).toHaveProperty("error", "Wrong password, try again.");
  });

  it("should fail to log in with non-existent email", async () => {
    const response = await request(app).post("/auth/login").send({
      email: "nonexistent@example.com",
      password: "password123",
    });

    expect(response.status).toBe(404); 
    expect(response.body).toHaveProperty("error", "No user was found with this email.");
  });
});