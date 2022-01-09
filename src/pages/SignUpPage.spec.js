import SignUpPage from "./SignUpPage";
import { render, screen } from "@testing-library/react";

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
  });
});
