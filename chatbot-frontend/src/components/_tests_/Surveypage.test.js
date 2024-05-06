import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import SurveyPage from "../../Pages/Surveypage/Surveypage";
import { BrowserRouter as Router } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";

jest.mock("axios");
jest.mock("../../hooks/useAuth");

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("SurveyPage Component", () => {
  beforeEach(() => {
    useAuth.mockImplementation(() => ({
      auth: {
        id: "user123",
        token: "fake_token",
      },
    }));
    axios.post.mockClear();
    mockNavigate.mockClear();
  });

  test("renders form and handles input changes", async () => {
    render(
      <Router>
        <SurveyPage />
      </Router>
    );

    fireEvent.change(screen.getByTestId("name"), { target: { value: "Bot" } });
    fireEvent.change(screen.getByTestId("age"), { target: { value: "2" } });
    fireEvent.change(screen.getByTestId("gender"), {
      target: { value: "Male" },
    });
    fireEvent.change(screen.getByTestId("hobbies"), {
      target: { value: "Coding" },
    });
    fireEvent.change(screen.getByTestId("personality"), {
      target: { value: "Friendly" },
    });
    // Check if the error message is not shown when fields are filled
    expect(
      screen.queryByText(/please fill out this field/i)
    ).not.toBeInTheDocument();
  });

  test("submits form and navigates on success", async () => {
    axios.post.mockResolvedValue({
      status: 201,
      data: { message: "Chatbot created successfully" },
    });

    render(
      <Router>
        <SurveyPage />
      </Router>
    );

    fireEvent.change(screen.getByTestId("name"), { target: { value: "Bot" } });
    fireEvent.change(screen.getByTestId("age"), { target: { value: "2" } });
    fireEvent.change(screen.getByTestId("gender"), {
      target: { value: "Male" },
    });
    fireEvent.change(screen.getByTestId("hobbies"), {
      target: { value: "Coding" },
    });
    fireEvent.change(screen.getByTestId("personality"), {
      target: { value: "Friendly" },
    });
    fireEvent.click(screen.getByTestId("submit"));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        expect.anything()
      );
        expect(mockNavigate).toHaveBeenCalledWith("/", { state: { needRefresh: true } });
    });
  });

  test("handles cancel button and navigates back", async () => {
    render(
      <Router>
        <SurveyPage />
      </Router>
    );

    fireEvent.click(screen.getByText("Cancel"));
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  test("displays error when required fields are empty", async () => {
    render(
      <Router>
        <SurveyPage />
      </Router>
    );

    fireEvent.change(screen.getByTestId("name"), { target: { value: "" } }); // leave this empty
    fireEvent.click(screen.getByTestId("submit"));

  });

  test("displays error when required fields are empty", () => {
    render(
      <Router>
        <SurveyPage />
      </Router>
    );

    // Ensure all fields except 'descriptions' are initially empty and then submit the form
    fireEvent.change(screen.getByTestId("name"), { target: { value: "" } });
    fireEvent.change(screen.getByTestId("age"), { target: { value: "" } });
    fireEvent.change(screen.getByTestId("gender"), { target: { value: "" } });
    fireEvent.change(screen.getByTestId("hobbies"), { target: { value: "" } });
    fireEvent.change(screen.getByTestId("personality"), {
      target: { value: "" },
    });
    fireEvent.submit(screen.getByTestId("submit"));

    // Check for the error message
    const errorMessage = screen.getByTestId("error");
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent(
      "All fields except descriptions need to be filled."
    );
  });
});
