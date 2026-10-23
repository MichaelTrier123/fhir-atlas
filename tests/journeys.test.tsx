import { beforeEach, describe, expect, it } from "vitest";
import { render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import App from "../src/app/App";
import { StateProvider } from "../src/app/state";
import { STORAGE_KEY } from "../src/domain/model";
function mount(route: string) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <StateProvider>
        <App />
      </StateProvider>
    </MemoryRouter>,
  );
}
beforeEach(() => localStorage.clear());
describe("the connected prototype journeys", () => {
  it("finds a resource and inspects a nested element", async () => {
    const user = userEvent.setup();
    mount("/explore/Patient");
    await user.click(screen.getByRole("tab", { name: "Structure" }));
    await user.click(screen.getByRole("button", { name: "given" }));
    expect(
      screen.getByRole("heading", { name: "Patient.name.given" }),
    ).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: "Collapse Patient.name" }),
    );
    expect(
      screen.queryByRole("button", { name: "given" }),
    ).not.toBeInTheDocument();
  });
  it("keeps research and hints while completing a sourced task", async () => {
    const user = userEvent.setup();
    mount("/workspace");
    await user.click(screen.getByRole("button", { name: /Show next hint/ }));
    expect(
      screen.getByText(/Separate the common FHIR foundation/),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Resource profiles/ }));
    await user.click(
      screen.getByRole("button", { name: "Save as task evidence" }),
    );
    expect(
      screen.getByRole("button", { name: "Evidence saved to task" }),
    ).toBeInTheDocument();
    await user.click(
      screen.getByRole("radio", { name: "The applicable resource profile" }),
    );
    await user.selectOptions(
      screen.getByLabelText("2. Why is it the right place?"),
      "constraints",
    );
    await user.type(
      screen.getByLabelText(/Your reflection/),
      "I will inspect the applicable constraints.",
    );
    await user.click(
      screen.getByRole("button", { name: "Check my reasoning" }),
    );
    expect(screen.getByText("Correct answer")).toBeInTheDocument();
    await waitFor(() =>
      expect(
        JSON.parse(localStorage.getItem(STORAGE_KEY)!).exerciseComplete,
      ).toBe(true),
    );
    await user.click(screen.getByRole("link", { name: /Back to lesson/ }));
    await user.click(screen.getByRole("link", { name: "Resume task" }));
    expect(
      screen.getByRole("heading", { name: "Resource profiles" }),
    ).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("I will inspect the applicable constraints."),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Separate the common FHIR foundation/),
    ).toBeInTheDocument();
  });
  it("marks a lesson as read without pretending that the exercise is complete", async () => {
    const user = userEvent.setup();
    mount("/lesson/resource-profile-ig");
    await user.click(
      screen.getByRole("button", { name: "Mark lesson as read" }),
    );
    expect(
      screen.getByRole("button", { name: "Lesson marked as read" }),
    ).toBeInTheDocument();
    const state = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(state.lessonComplete).toBe(true);
    expect(state.exerciseComplete).toBe(false);
  });
  it("provides a usable empty search and search dialog", async () => {
    const user = userEvent.setup();
    mount("/explore");
    await user.type(
      screen.getByRole("textbox", { name: "Search prototype artifacts" }),
      "no-such-resource",
    );
    expect(
      screen.getByText("No matches in this sample corpus."),
    ).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: "Clear search and filters" }),
    );
    await user.click(screen.getByRole("button", { name: /Search the atlas/ }));
    const dialog = screen.getByRole("dialog");
    await user.type(within(dialog).getByRole("textbox"), "Patient");
    expect(
      within(dialog).getByRole("link", { name: /Patient/ }),
    ).toBeInTheDocument();
    await user.click(
      within(dialog).getByRole("button", { name: "Close search" }),
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
