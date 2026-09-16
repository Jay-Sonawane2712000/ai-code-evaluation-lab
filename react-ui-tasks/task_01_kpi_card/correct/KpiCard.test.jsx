import React from "react";
import { render, screen } from "@testing-library/react";
import KpiCard from "./KpiCard";

describe("correct KpiCard", () => {
  test("loading state takes precedence over error", () => {
    render(<KpiCard label="Revenue" value={1200} loading error="Failed" />);

    expect(screen.getByRole("status")).toHaveTextContent("Loading...");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.queryByText("$1,200.00")).not.toBeInTheDocument();
  });

  test("error state appears when not loading", () => {
    render(<KpiCard label="Revenue" value={1200} error="Failed to load" />);

    expect(screen.getByRole("alert")).toHaveTextContent("Failed to load");
  });

  test("null value renders No data", () => {
    render(<KpiCard label="Conversion" value={null} />);

    expect(screen.getByText("No data")).toBeInTheDocument();
  });

  test("currency formatting works", () => {
    render(<KpiCard label="Revenue" value={12345.67} format="currency" />);

    expect(screen.getByLabelText("Revenue value")).toHaveTextContent(
      "$12,345.67"
    );
  });

  test("percent formatting works", () => {
    render(<KpiCard label="Conversion" value={12.5} format="percent" />);

    expect(screen.getByLabelText("Conversion value")).toHaveTextContent("12.5%");
  });

  test("positive change renders positive state", () => {
    render(<KpiCard label="Orders" value={250} change={7.4} />);

    expect(screen.getByLabelText("Orders positive change")).toHaveAttribute(
      "data-state",
      "positive"
    );
    expect(screen.getByText("+7.4%")).toBeInTheDocument();
  });

  test("negative change renders negative state", () => {
    render(<KpiCard label="Churn" value={8.1} change={-2.3} />);

    expect(screen.getByLabelText("Churn negative change")).toHaveAttribute(
      "data-state",
      "negative"
    );
    expect(screen.getByText("-2.3%")).toBeInTheDocument();
  });

  test("missing change does not crash or render change text", () => {
    render(<KpiCard label="Users" value={1000} change={null} />);

    expect(screen.getByLabelText("Users value")).toHaveTextContent("1,000");
    expect(screen.queryByLabelText(/Users .* change/)).not.toBeInTheDocument();
  });

  test("component exposes accessible label or region", () => {
    render(<KpiCard label="Net Revenue" value={5000} />);

    expect(screen.getByRole("region", { name: "Net Revenue KPI card" }))
      .toBeInTheDocument();
  });
});
