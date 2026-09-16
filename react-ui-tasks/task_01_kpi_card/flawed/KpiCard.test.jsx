import React from "react";
import { render, screen } from "@testing-library/react";
import KpiCard from "./KpiCard";

describe("flawed KpiCard seeded bugs", () => {
  test("flawed fails loading precedence when error is also present", () => {
    render(<KpiCard label="Revenue" value={1200} loading error="Failed" />);

    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    expect(screen.getByText("Failed")).toBeInTheDocument();
  });

  test("flawed formats null currency value incorrectly", () => {
    render(<KpiCard label="Revenue" value={null} format="currency" />);

    expect(screen.queryByText("No data")).not.toBeInTheDocument();
    expect(screen.getByText("$0.00")).toBeInTheDocument();
  });

  test("flawed displays negative change incorrectly", () => {
    render(<KpiCard label="Churn" value={8.1} change={-2.3} />);

    expect(screen.queryByText("-2.3%")).not.toBeInTheDocument();
    expect(screen.getByText("+2.3%")).toHaveAttribute("data-state", "neutral");
  });

  test("flawed lacks expected accessible region or label", () => {
    render(<KpiCard label="Revenue" value={1200} />);

    expect(
      screen.queryByRole("region", { name: "Revenue KPI card" })
    ).not.toBeInTheDocument();
  });
});
