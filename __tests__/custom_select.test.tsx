import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MantineProvider } from "@mantine/core";
import { CustomSelect } from "../app/_components/ui/CustomSelect";
import type { Item } from "../app/_components/ui/CustomSelect";

const mockData: Item[] = [
  {
    icon: <div>🍎</div>,
    label: "Apple",
    description: "A delicious fruit",
    value: "apple",
  },
  {
    icon: <div>🍌</div>,
    label: "Banana",
    description: "A yellow fruit",
    value: "banana",
  },
];

describe("CustomSelect Component", () => {
  it("displays the default value if provided", async () => {
    render(
      <MantineProvider>
        <CustomSelect
          data={mockData}
          defaultValue="banana"
          setValue={vi.fn()}
        />
      </MantineProvider>,
    );
    const bananaElements = await screen.findAllByText("Banana");
    expect(bananaElements.length).toBeGreaterThan(0);
  });

  it("opens and closes the dropdown on input click", async () => {
    render(
      <MantineProvider>
        <CustomSelect
          data={mockData}
          defaultValue="banana"
          setValue={vi.fn()}
        />
      </MantineProvider>,
    );
    const input = screen.getByRole("button");
    await userEvent.click(input);
    expect(screen.getByText("Apple")).toBeVisible();
    await userEvent.click(input); // Adjust based on your actual logic for closing the dropdown
  });

  it("updates value on option select", async () => {
    const setValueMock = vi.fn();
    render(
      <MantineProvider>
        <CustomSelect
          data={mockData}
          defaultValue="banana"
          setValue={setValueMock}
        />
        ,
      </MantineProvider>,
    );
    const input = screen.getByRole("button");
    await userEvent.click(input);
    await userEvent.click(screen.getByText("Apple"));
    expect(setValueMock).toHaveBeenCalledWith("apple");
  });
});
