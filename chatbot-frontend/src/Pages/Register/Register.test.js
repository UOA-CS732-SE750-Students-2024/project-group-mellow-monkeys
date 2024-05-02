import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Register from "./Register";
import { BrowserRouter as Router } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth"; // Ensure this path is correct

// Mocking modules and hooks
jest.mock("../../hooks/useAuth");

describe("Register Component", () => {
  beforeEach(() => {
    // Mock the useAuth hook's implementation
    useAuth.mockImplementation(() => ({
      auth: { isLoading: false, error: null },
      submitRegister: jest.fn()
    }));
  });

  test("renders registration form fields", () => {
    render(
      <Router>
        <Register />
      </Router>
    );

    // Check for input fields presence
    expect(screen.getByPlaceholderText("Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Confirm Password")).toBeInTheDocument();
  });

  test("allows input to be entered into form fields", () => {
    render(
      <Router>
        <Register />
      </Router>
    );

    const nameInput = screen.getByPlaceholderText("Name");
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Enter Password");
    const confirmPasswordInput = screen.getByPlaceholderText("Confirm Password");

    fireEvent.change(nameInput, { target: { value: 'Alice' } });
    fireEvent.change(emailInput, { target: { value: 'alice@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });

    expect(nameInput.value).toBe('Alice');
    expect(emailInput.value).toBe('alice@example.com');
    expect(passwordInput.value).toBe('password123');
    expect(confirmPasswordInput.value).toBe('password123');
  });

});
