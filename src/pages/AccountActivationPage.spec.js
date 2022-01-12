import { render, screen } from "@testing-library/react";
import AccountActivationPage from "./AccountActivationPage";
import { setupServer } from "msw/node";
import { rest } from "msw";

describe("Account Activation Page", () => {
  const setup = () => {
    render(<AccountActivationPage />);
  };

  let counter = 0;
  const server = setupServer(
    rest.post("/api/1.0/users/token/:token", (req, res, ctx) => {
      counter += 1;
      if (req.params.token === "5678") {
        return res(ctx.status(400));
      }

      return res(ctx.status(200));
    })
  );
  beforeAll(() => {
    server.listen();
  });
  afterAll(() => {
    server.close();
  });
  afterEach(() => {
    counter = 0;
  });

  it("displays activation success message when token is valid", async () => {
    setup("1234");
    const message = await screen.findByText("Account is activated");
    expect(message).toBeInTheDocument();
  });

  it("sends activation request to backend", async () => {
    setup("1234");
    await screen.findByText("Account is activated");
    expect(counter).toBe(1);
  });

  it("displays activation failure message when token is invalid", async () => {
    setup("5678");
    const message = await screen.findByText("Activation failure");
    expect(message).toBeInTheDocument();
  });
  xit("sends activation request after the token is changed", async () => {
    setup("1234");
    await screen.findByText("Account is activated");
    const { rerender } = render(<AccountActivationPage />);
    setup("5678");
    rerender(<AccountActivationPage />);
    await screen.findByText("Activation failure");
    expect(counter).toBe(2);
  });
});

console.error = () => {};