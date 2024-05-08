import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserInfoPage from "../../Pages/UserInfoPage/UserInfoPage";
import { BrowserRouter as Router } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth"; // Ensure this path is correct
import axios from "axios";
import { act } from "react-dom/test-utils";

// Correctly mock hooks and modules
jest.mock("axios");
jest.mock("../../hooks/useAuth"); // Ensure this path is correct

// Mock navigation
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

describe("UserInfoPage Component", () => {
  beforeEach(() => {
    // Correct implementation for user auth and navigation
    useAuth.mockImplementation(() => ({
      auth: {
        id: "1",
        token: "fake_token",
        name: "John Doe",
        email: "john@example.com",
        avatar: "avatar.jpg",
      },
    }));
  });

  test("displays user information correctly", async () => {
    axios.get.mockResolvedValue({
      data: {
        user: {
          name: "John Doe",
          email: "john@example.com",
          avatar: "avatar.jpg",
        },
      },
    });

    render(
      <Router>
        <UserInfoPage />
      </Router>
    );

    await waitFor(() => screen.getByText("John Doe"));
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "User avatar" })).toHaveAttribute(
      "src",
      "avatar.jpg"
    );
  });

  test("enters editing mode when 'Modify Personal Information' button is clicked", async () => {
    render(
      <Router>
        <UserInfoPage />
      </Router>
    );

    await waitFor(() =>
      expect(screen.getByText("John Doe")).toBeInTheDocument()
    );

    // Click on the button to enter editing mode
    fireEvent.click(screen.getByTestId("modifyButton"));

    await waitFor(() => {
      // Assert that the editing mode is entered and the input element is present
      expect(screen.getByTestId("nameInput")).toBeInTheDocument();
    });
    await waitFor(() => {
      // Assert that the editing mode is entered and the input element is present
      expect(screen.getByTestId("nameInput")).toBeInTheDocument();
    });
  });

  test("submits form with updated user information when 'Save Changes' button is clicked", async () => {
    // Mock axios.put to resolve successfully
    axios.put.mockResolvedValueOnce();

    render(
      <Router>
        <UserInfoPage />
      </Router>
    );

    await waitFor(() =>
      expect(screen.getByText("John Doe")).toBeInTheDocument()
    );

    // Click on the button to enter editing mode
    fireEvent.click(screen.getByTestId("modifyButton"));

    // Simulate user updating information
    fireEvent.change(screen.getByTestId("nameInput"), {
      target: { value: "Jane Doe" },
    });
    fireEvent.change(screen.getByTestId("emailInput"), {
      target: { value: "jane@example.com" },
    });

    // Click on the 'Save Changes' button
    fireEvent.click(screen.getByText("Save Changes"));

    // Wait for the update request to be sent
    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        "/user/1",
        {
          name: "Jane Doe",
          email: "jane@example.com",
          avatar: "avatar.jpg",
        },
        {
          headers: { Authorization: "Bearer fake_token" },
        }
      );
    });

    // Assert that user is no longer in editing mode after successful update
    expect(screen.queryByTestId("nameInput")).not.toBeInTheDocument();
  });

  test("resets user information to original state when 'Cancel' button is clicked", async () => {
    render(
      <Router>
        <UserInfoPage />
      </Router>
    );

    await waitFor(() =>
      expect(screen.getByText("John Doe")).toBeInTheDocument()
    );

    // Click on the button to enter editing mode
    fireEvent.click(screen.getByTestId("modifyButton"));

    // Simulate user updating information
    fireEvent.change(screen.getByTestId("nameInput"), {
      target: { value: "Jane Doe" },
    });
    fireEvent.change(screen.getByTestId("emailInput"), {
      target: { value: "jane@example.com" },
    });

    // Click on the 'Cancel' button
    fireEvent.click(screen.getByText("Cancel"));

    // Assert that user information is reset to original state
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
  });
});
