import SignUpPage from "./SignUpPage";
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { setupServer } from "msw/node";
import { rest } from "msw";

// lifecycle describe functions
// beforeEach
// beforeAll
// afterEach
// afterAll

describe("Sign Up Page", () => {
  describe("Layout", () => {
    // must use either test() or it()
    it("has header", () => {
      render(<SignUpPage />);
      const header = screen.queryByRole("heading", { name: "Sign Up" });
      expect(header).toBeInTheDocument(); // jest-dom
    });
    it("has username input", () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText("Username");
      expect(input).toBeInTheDocument();
    });
    it("has email input", () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText("Email");
      expect(input).toBeInTheDocument();
    });
    it("has password input", () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText("Password");
      expect(input).toBeInTheDocument();
    });
    it("has password type for password input", () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText("Password");
      expect(input.type).toBe("password");
    });
    it("has password repeat input", () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText("Password Repeat");
      expect(input).toBeInTheDocument();
    });
    it("has password type for password repeat input", () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText("Password Repeat");
      expect(input.type).toBe("password");
    });
    it("has sign up button", () => {
      render(<SignUpPage />);
      const button = screen.queryByRole("button", { name: "Sign Up" });
      expect(button).toBeInTheDocument(); // jest-dom
    });
    it("disables the button initially", () => {
      render(<SignUpPage />);
      const button = screen.queryByRole("button", { name: "Sign Up" });
      expect(button).toBeDisabled(); // jest-dom
    });
  });
  describe("Interactions", () => {
    let requestBody;
    let counter = 0;
    const server = setupServer(
      rest.post("/api/1.0/users", (req, res, ctx) => {
        requestBody = req.body;
        counter += 1;
        return res(ctx.status(200));
      })
    );
    beforeAll(() => {
      server.listen();
    });
    afterAll(() => {
      server.close();
    });
    beforeEach(() => {
      counter = 0;
    });
    let button;
    const setup = () => {
      render(<SignUpPage />);
      const usernameInput = screen.getByLabelText("Username");
      const emailInput = screen.getByLabelText("Email");
      const passwordInput = screen.getByLabelText("Password");
      const passwordRepeatInput = screen.getByLabelText("Password Repeat");
      userEvent.type(usernameInput, "user1");
      userEvent.type(emailInput, "user1@mail.com");
      userEvent.type(passwordInput, "P4ssword");
      userEvent.type(passwordRepeatInput, "P4ssword");
      button = screen.queryByRole("button", { name: "Sign Up" });
    };

    it("enables the button when password and password repeat fields have the same value", () => {
      setup();
      expect(button).toBeEnabled();
    });
    it("sends username, email, and password to backend after clicking the button", async () => {
      setup();

      userEvent.click(button);

      // MOCK SERVER API w/ MSW
      // does not matter if fetch or axios used
      await screen.findByText(
        "Please check your e-mail to activate your account."
      );
      expect(requestBody).toEqual({
        username: "user1",
        email: "user1@mail.com",
        password: "P4ssword",
      });
      //const mockFn = jest.fn();

      // MOCK WINDOWS FETCH
      //   window.fetch = mockFn;
      //   const firstCallofMockFunction = mockFn.mock.calls[0];
      //   const body = JSON.parse(firstCallofMockFunction[1].body);
      //   expect(body).toEqual({
      //     username: "user1",
      //     email: "user1@mail.com",
      //     password: "P4ssword",
      //   });

      // // MOCK AXIOS POST
      //   axios.post = mockFn;
      //   userEvent.click(button);
      //   const firstCallofMockFunction = mockFn.mock.calls[0];
      //   const body = firstCallofMockFunction[1];
      //   expect(body).toEqual({
      //     username: "user1",
      //     email: "user1@mail.com",
      //     password: "P4ssword",
      //   });
    });
    it("disables button when there is an ongoing api call", async () => {
      setup();

      userEvent.click(button);
      userEvent.click(button);

      await new Promise((resolve) => setTimeout(resolve, 500));
      expect(counter).toBe(1);
    });
    // TO DO:
    xit("displays spinner after clicking the submit", async () => {
      setup();

      expect(screen.queryByRole("status")).not.toBeInTheDocument();
      userEvent.click(button);
      const spinner = await screen.queryByRole("status");
      expect(spinner).toBeInTheDocument();
      await screen.findByText(
        "Please check your e-mail to activate your account."
      );
    });
    it("displays account activation notification after successful sign up request", async () => {
      setup();
      const message = "Please check your e-mail to activate your account.";
      expect(screen.queryByText(message)).not.toBeInTheDocument();
      userEvent.click(button);

      const text = await screen.findByText(message);
      expect(text).toBeInTheDocument();
    });
    it("hides sign up form after successful sign up request", async () => {
      setup();
      const form = screen.getByTestId("form-sign-up");
      userEvent.click(button);
      // await waitFor(() => {
      //   expect(form).not.toBeInTheDocument();
      // });
      await waitForElementToBeRemoved(form);
    });
  });
});
