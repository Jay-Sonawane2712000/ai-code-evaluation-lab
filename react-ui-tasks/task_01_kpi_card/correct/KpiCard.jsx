import React from "react";

function formatValue(value, format = "number") {
  if (value === null || value === undefined) {
    return "No data";
  }

  if (typeof value === "string") {
    return value;
  }

  if (format === "currency") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  }

  if (format === "percent") {
    return `${new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 2,
    }).format(value)}%`;
  }

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(value);
}

function getChangeState(change) {
  if (change > 0) {
    return "positive";
  }

  if (change < 0) {
    return "negative";
  }

  return "neutral";
}

function KpiCard({
  label,
  value,
  change = null,
  format = "number",
  loading = false,
  error = null,
}) {
  if (loading) {
    return (
      <section aria-label={`${label} KPI card`} className="kpi-card">
        <h2>{label}</h2>
        <p role="status" aria-live="polite">
          Loading...
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section aria-label={`${label} KPI card`} className="kpi-card">
        <h2>{label}</h2>
        <p role="alert">{error}</p>
      </section>
    );
  }

  const hasChange = typeof change === "number";
  const changeState = hasChange ? getChangeState(change) : null;

  return (
    <section aria-label={`${label} KPI card`} className="kpi-card">
      <h2>{label}</h2>
      <p aria-label={`${label} value`}>{formatValue(value, format)}</p>
      {hasChange && change !== 0 ? (
        <p
          aria-label={`${label} ${changeState} change`}
          data-state={changeState}
        >
          {change > 0 ? "+" : ""}
          {change}%
        </p>
      ) : null}
      {hasChange && change === 0 ? (
        <p aria-label={`${label} neutral change`} data-state="neutral">
          0%
        </p>
      ) : null}
    </section>
  );
}

export default KpiCard;
