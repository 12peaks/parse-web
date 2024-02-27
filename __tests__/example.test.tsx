import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";

test("example", () => {
  render(<div>hello world</div>);
  expect(screen.getByText("hello world")).toBeDefined();
});
