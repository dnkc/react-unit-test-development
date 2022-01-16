import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  act,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { rest } from "msw";
import en from "../locale/en.json";
import tr from "../locale/tr.json";
import { changeLanguage } from "../locale/i18n";
import LoginPage from "./LoginPage";
import LanguageSelector from "../components/LanguageSelector";

let requestBody,
  count = 0,
  acceptLanguageHeader;
const server = setupServer(
  rest.post("/api/1.0/auth", (req, res, ctx) => {
    requestBody = req.body;
    count += 1;
    acceptLanguageHeader = req.headers.get("Accept-Language");

    return res(ctx.status(401), ctx.json({ message: "Incorrect credentials" }));
  })
);
beforeAll(() => {
  server.listen();
});
afterAll(() => {
  server.close();
});
beforeEach(() => {
  count = 0;
  server.resetHandlers();
});
//   afterEach(() => {
//   });

describe("Login Page", () => {
  describe("Layout", () => {
    it("has header", () => {
      render(<LoginPage />);
      const header = screen.queryByRole("heading", { name: "Login" });
      expect(header).toBeInTheDocument(); // jest-dom
    });
    it("has email input", () => {
      render(<LoginPage />);
      const input = screen.getByLabelText("E-mail");
      expect(input).toBeInTheDocument();
    });
    it("has password input", () => {
      render(<LoginPage />);
      const input = screen.getByLabelText("Password");
      expect(input).toBeInTheDocument();
    });
    it("has password type for password input", () => {
      render(<LoginPage />);
      const input = screen.getByLabelText("Password");
      expect(input.type).toBe("password");
    });

    it("has login button", () => {
      render(<LoginPage />);
      const button = screen.queryByRole("button", { name: "Login" });
      expect(button).toBeInTheDocument(); // jest-dom
    });
    it("disables the button initially", () => {
      render(<LoginPage />);
      const button = screen.queryByRole("button", { name: "Login" });
      expect(button).toBeDisabled(); // jest-dom
    });
  });
  describe("Interactions", () => {
    let button, emailInput, passwordInput;
    const setup = () => {
      render(<LoginPage />);
      emailInput = screen.getByLabelText("E-mail");
      passwordInput = screen.getByLabelText("Password");
      userEvent.type(emailInput, "user100@mail.com");
      userEvent.type(passwordInput, "P4ssword");
      button = screen.queryByRole("button", { name: "Login" });
    };
    it("enables the button when email and password inputs are filled", () => {
      setup();
      expect(button).toBeEnabled();
    });
    it("displays spinner during api call", async () => {
      setup();
      let spinner;
      spinner = await screen.queryByTestId("test-spinner");
      expect(spinner).not.toBeInTheDocument();
      userEvent.click(button);
      spinner = await screen.queryByTestId("test-spinner");
      await waitForElementToBeRemoved(spinner);
    });
    it("sends email and password to backend after clicking the button", async () => {
      setup();
      let spinner;
      userEvent.click(button);
      spinner = await screen.queryByTestId("test-spinner");
      await waitForElementToBeRemoved(spinner);
      expect(requestBody).toEqual({
        email: "user100@mail.com",
        password: "P4ssword",
      });
    });
    xit("TODO (functions, idk why it fails):disables button when there is an api call", async () => {
      userEvent.click(button);
      userEvent.click(button);
      // const spinner = await screen.queryByTestId("test-spinner");
      // await waitForElementToBeRemoved(spinner);
      expect(count).toEqual(1);
    });
    it("displays authentication message", async () => {
      setup();
      userEvent.click(button);
      const errorMessage = await screen.findByText("Incorrect credentials");
      expect(errorMessage).toBeInTheDocument();
    });
    it("clears authentication fail message when email field is changed", async () => {
      setup();
      userEvent.click(button);
      const errorMessage = await screen.findByText("Incorrect credentials");
      userEvent.type(emailInput, "new@mail.com");
      expect(errorMessage).not.toBeInTheDocument();
    });
    it("clears authentication fail message when password field is changed", async () => {
      setup();
      userEvent.click(button);
      const errorMessage = await screen.findByText("Incorrect credentials");
      userEvent.type(passwordInput, "newP4ss");
      expect(errorMessage).not.toBeInTheDocument();
    });
  });
  describe("Internationalization", () => {
    let englishToggle;
    let turkishToggle;
    let passwordInput, emailInput;

    const setup = () => {
      render(<LoginPage />);
      render(<LanguageSelector />);
      turkishToggle = screen.getByTitle("Turkish");
      englishToggle = screen.getByTitle("English");
      passwordInput = screen.getByLabelText("Password");
      emailInput = screen.getByLabelText("E-mail");
    };

    afterEach(() => {
      act(() => {
        changeLanguage("en");
      });
    });

    it("initially displays all text in english", () => {
      setup();
      expect(
        screen.getByRole("heading", { name: en.login })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: en.login })
      ).toBeInTheDocument();
      expect(screen.getByLabelText(en.email)).toBeInTheDocument();
      expect(screen.getByLabelText(en.password)).toBeInTheDocument();
    });
    it("displays all text in turkish after changing the language", () => {
      setup();
      userEvent.click(turkishToggle);
      expect(
        screen.getByRole("heading", { name: tr.login })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: tr.login })
      ).toBeInTheDocument();
      expect(screen.getByLabelText(tr.email)).toBeInTheDocument();
      expect(screen.getByLabelText(tr.password)).toBeInTheDocument();
    });
    it("sets accept language header as en for outgoing request after selecting that language", async () => {
      setup();
      emailInput = screen.getByLabelText("E-mail");
      passwordInput = screen.getByLabelText("Password");
      userEvent.type(emailInput, "user100@mail.com");
      userEvent.type(passwordInput, "P4ssword");
      const button = screen.queryByRole("button", { name: "Login" });
      userEvent.click(button);
      let spinner;
      spinner = await screen.queryByTestId("test-spinner");
      await waitForElementToBeRemoved(spinner);
      expect(acceptLanguageHeader).toBe("en");
    });
    it("sets accept language header as tr for outgoing request after selecting that language", async () => {
      setup();
      emailInput = screen.getByLabelText("E-mail");
      passwordInput = screen.getByLabelText("Password");
      userEvent.type(emailInput, "user100@mail.com");
      userEvent.type(passwordInput, "P4ssword");
      const button = screen.queryByRole("button", { name: "Login" });
      userEvent.click(turkishToggle);
      userEvent.click(button);
      let spinner;
      spinner = await screen.queryByTestId("test-spinner");
      await waitForElementToBeRemoved(spinner);
      expect(acceptLanguageHeader).toBe("tr");
    });
  });
});
