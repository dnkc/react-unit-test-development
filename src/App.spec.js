import { render, screen } from "@testing-library/react";
import App from "./App";
import userEvent from "@testing-library/user-event";

import { setupServer } from "msw/node";
import { rest } from "msw";

let acceptLanguageHeader;
const server = setupServer(
  rest.post("/api/1.0/users", (req, res, ctx) => {
    acceptLanguageHeader = req.headers.get("Accept-Language");
    return res(ctx.status(200));
  }),
  rest.post("/api/1.0/users/token/:token", (req, res, ctx) => {
    return res(ctx.status(200));
  })
);

describe("Routing", () => {
  const setup = (path) => {
    window.history.pushState({}, "", path);
    render(<App />);
  };

  beforeAll(() => {
    server.listen();
  });
  afterAll(() => {
    server.close();
  });
  beforeEach(() => {
    server.resetHandlers();
  });

  it.each`
    path               | pageTestId
    ${"/"}             | ${"home-page"}
    ${"/signup"}       | ${"sign-up-page"}
    ${"/login"}        | ${"login-page"}
    ${"/user/1"}       | ${"user-page"}
    ${"/user/2"}       | ${"user-page"}
    ${"/activate/123"} | ${"activation-page"}
    ${"/activate/456"} | ${"activation-page"}
  `("displays $pageTestId when path is $path", ({ path, pageTestId }) => {
    setup(path);
    const page = screen.queryByTestId(pageTestId);
    expect(page).toBeInTheDocument();
  });

  it.each`
    path               | pageTestId
    ${"/"}             | ${"sign-up-page"}
    ${"/"}             | ${"login-page"}
    ${"/"}             | ${"user-page"}
    ${"/"}             | ${"activation-page"}
    ${"/signup"}       | ${"home-page"}
    ${"/signup"}       | ${"login-page"}
    ${"/signup"}       | ${"user-page"}
    ${"/signup"}       | ${"activation-page"}
    ${"/login"}        | ${"sign-up-page"}
    ${"/login"}        | ${"home-page"}
    ${"/login"}        | ${"user-page"}
    ${"/login"}        | ${"activation-page"}
    ${"/user/1"}       | ${"home-page"}
    ${"/user/1"}       | ${"sign-up-page"}
    ${"/user/1"}       | ${"login-page"}
    ${"/user/1"}       | ${"activation-page"}
    ${"/activate/123"} | ${"sign-up-page"}
    ${"/activate/123"} | ${"login-page"}
    ${"/activate/123"} | ${"user-page"}
    ${"/activate/123"} | ${"home-page"}
  `(
    "does not display $pageTestId when path is $path",
    ({ path, pageTestId }) => {
      setup(path);
      const page = screen.queryByTestId(pageTestId);
      expect(page).not.toBeInTheDocument();
    }
  );

  it.each`
    targetPage
    ${"Home"}
    ${"Sign Up"}
    ${"Login"}
  `("has link to $targetPage on navbar", ({ targetPage }) => {
    setup("/");
    const link = screen.getByRole("link", { name: targetPage });
    expect(link).toBeInTheDocument();
  });

  it.each`
    initialPath  | clickInTo    | visiblePage
    ${"/"}       | ${"Sign Up"} | ${"sign-up-page"}
    ${"/signup"} | ${"Home"}    | ${"home-page"}
    ${"/login"}  | ${"Login"}   | ${"login-page"}
  `(
    "displays $visiblePage after clicking $clickInTo",
    ({ initialPath, clickInTo, visiblePage }) => {
      setup(initialPath);
      const link = screen.getByRole("link", { name: clickInTo });
      userEvent.click(link);
      expect(screen.getByTestId(visiblePage)).toBeInTheDocument();
    }
  );
  it("displays home page when clicking brand logo", () => {
    setup("/login");
    const logo = screen.queryByAltText("hoax");
    userEvent.click(logo);
    expect(screen.getByTestId("home-page")).toBeInTheDocument();
  });
});
