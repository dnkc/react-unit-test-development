import SignUpPage from "./SignUpPage";
import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  act,
} from "../test/setup";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { rest } from "msw";
import en from "../locale/en.json";
import tr from "../locale/tr.json";
import { changeLanguage } from "../locale/i18n";
// lifecycle describe functions
// beforeEach
// beforeAll
// afterEach
// afterAll

let requestBody;
let counter = 0;
let acceptLanguageHeader;
const server = setupServer(
  rest.post("/api/1.0/users", (req, res, ctx) => {
    requestBody = req.body;
    acceptLanguageHeader = req.headers.get("Accept-Language");
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
  server.resetHandlers();
});
afterEach(() => {
  localStorage.clear();
});
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
      const input = screen.getByLabelText("E-mail");
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
    let button, passwordInput, passwordRepeatInput, usernameInput, emailInput;
    const setup = () => {
      render(<SignUpPage />);
      usernameInput = screen.getByLabelText("Username");
      emailInput = screen.getByLabelText("E-mail");
      passwordInput = screen.getByLabelText("Password");
      passwordRepeatInput = screen.getByLabelText("Password Repeat");
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
    xit("TODO (works but fails test?): displays spinner after clicking the submit", async () => {
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

    const generateValidationError = (field, message) => {
      return rest.post("/api/1.0/users", (req, res, ctx) => {
        return res(
          ctx.status(400),
          ctx.json({
            validationErrors: { [field]: message },
          })
        );
      });
    };

    it.each`
      field         | message
      ${"username"} | ${"Username cannot be null"}
      ${"email"}    | ${"E-mail cannot be null"}
      ${"password"} | ${"Password cannot be null"}
    `("displays $message for $field", async ({ field, message }) => {
      server.use(generateValidationError(field, message));
      setup();
      userEvent.click(button);
      const validationError = await screen.findByText(message);
      expect(validationError).toBeInTheDocument();
    });

    it("hides spinner & disables button after response received", async () => {
      server.use(
        generateValidationError("username", "Username cannot be null")
      );
      setup();
      userEvent.click(button);
      await screen.findByText("Username cannot be null");
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
      expect(button).toBeDisabled();
    });

    it("displays mismatch message for password repeat input", async () => {
      setup();
      userEvent.type(passwordInput, "P4ssword");
      userEvent.type(passwordRepeatInput, "P4sswor");
      const validationError = await screen.queryByText("Password mismatch");
      expect(validationError).toBeInTheDocument();
    });

    it.each`
      field         | message                      | label
      ${"username"} | ${"Username cannot be null"} | ${"Username"}
      ${"email"}    | ${"E-mail cannot be null"}   | ${"E-mail"}
      ${"password"} | ${"Password cannot be null"} | ${"Password"}
    `(
      "clears validation error after $field is updated",
      async ({ field, message, label }) => {
        server.use(generateValidationError(field, message));
        setup();
        userEvent.click(button);
        const validationError = await screen.findByText(message);
        userEvent.type(screen.getByLabelText(label), "updated");
        expect(validationError).not.toBeInTheDocument();
      }
    );

    // it("displays validation message for email", async () => {
    //   server.use(
    //     rest.post("/api/1.0/users", (req, res, ctx) => {
    //       return res(
    //         ctx.status(400),
    //         ctx.json({
    //           validationErrors: { email: "E-mail cannot be null" },
    //         })
    //       );
    //     })
    //   );
    //   setup();
    //   userEvent.click(button);
    //   const validationError = await screen.findByText("E-mail cannot be null");
    //   expect(validationError).toBeInTheDocument();
    // });
  });
  describe("Internationalization", () => {
    let englishToggle;
    let turkishToggle;
    let passwordInput, passwordRepeatInput;

    const setup = () => {
      render(<SignUpPage />);
      turkishToggle = screen.getByTitle("Turkish");
      englishToggle = screen.getByTitle("English");
      passwordInput = screen.getByLabelText("Password");
      passwordRepeatInput = screen.getByLabelText("Password Repeat");
    };

    afterEach(() => {
      act(() => {
        changeLanguage("en");
      });
    });

    it("displays all text in turkish after changing the language", () => {
      setup();
      userEvent.click(turkishToggle);
      expect(
        screen.getByRole("heading", { name: tr.signUp })
      ).toBeInTheDocument();
      expect(screen.getByLabelText(tr.username)).toBeInTheDocument();
      expect(screen.getByLabelText(tr.email)).toBeInTheDocument();
      expect(screen.getByLabelText(tr.password)).toBeInTheDocument();
      expect(screen.getByLabelText(tr.passwordRepeat)).toBeInTheDocument();
    });
    it("initially displays all text in english", () => {
      setup();
      expect(
        screen.getByRole("heading", { name: en.signUp })
      ).toBeInTheDocument();
      expect(screen.getByLabelText(en.username)).toBeInTheDocument();
      expect(screen.getByLabelText(en.email)).toBeInTheDocument();
      expect(screen.getByLabelText(en.password)).toBeInTheDocument();
      expect(screen.getByLabelText(en.passwordRepeat)).toBeInTheDocument();
    });
    it("displays all text in english after changing back from turkish", () => {
      setup();
      userEvent.click(turkishToggle);
      userEvent.click(englishToggle);
      expect(
        screen.getByRole("heading", { name: en.signUp })
      ).toBeInTheDocument();
      expect(screen.getByLabelText(en.username)).toBeInTheDocument();
      expect(screen.getByLabelText(en.email)).toBeInTheDocument();
      expect(screen.getByLabelText(en.password)).toBeInTheDocument();
      expect(screen.getByLabelText(en.passwordRepeat)).toBeInTheDocument();
    });

    it("displays password mismatch validation in turkish", () => {
      setup();
      userEvent.click(turkishToggle);

      userEvent.type(passwordRepeatInput, "P4ss");
      const validationMessageTurkish = screen.queryByText(
        tr.passwordMismatchValidation
      );
      expect(validationMessageTurkish).toBeInTheDocument();
    });
    it("sends accept language header as en for outgoing request", async () => {
      setup();
      userEvent.type(passwordInput, "Password");
      userEvent.type(passwordRepeatInput, "Password");
      const button = screen.getByRole("button", { name: en.signUp });
      const form = screen.queryByTestId("form-sign-up");
      userEvent.click(button);
      await waitForElementToBeRemoved(form);
      expect(acceptLanguageHeader).toBe("en");
    });
    it("sends accept language header as tr for outgoing request after selecting that language", async () => {
      setup();
      userEvent.type(passwordInput, "Password");
      userEvent.type(passwordRepeatInput, "Password");
      const button = screen.getByRole("button", { name: en.signUp });
      userEvent.click(turkishToggle);
      const form = screen.queryByTestId("form-sign-up");
      userEvent.click(button);
      await waitForElementToBeRemoved(form);
      expect(acceptLanguageHeader).toBe("tr");
    });
  });
});
