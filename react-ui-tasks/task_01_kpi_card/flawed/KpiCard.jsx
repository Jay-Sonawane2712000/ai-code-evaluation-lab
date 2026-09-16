import React from "react";

function formatValue(value, format = "number") {
  const safeValue = value || 0;

  if (format === "currency") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(safeValue);
  }

  if (format === "percent") {
    return `${safeValue}%`;
  }

  return String(safeValue);
}

function KpiCard({
  label,
  value,
  change = null,
  format = "number",
  loading = false,
  error = null,
}) {
  if (error) {
    return (
      <div className="kpi-card">
        <h2>{label}</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="kpi-card">
        <h2>{label}</h2>
        <p>Loading...</p>
      </div>
    );
  }

  const hasChange = typeof change === "number";
  const displayChange = hasChange ? Math.abs(change) : null;
  const changeState = hasChange && change > 0 ? "positive" : "neutral";

  return (
    <div className="kpi-card">
      <h2>{label}</h2>
      <p>{formatValue(value, format)}</p>
      {hasChange ? (
        <p data-state={changeState}>+{displayChange}%</p>
      ) : null}
    </div>
  );
}

export default KpiCard;
