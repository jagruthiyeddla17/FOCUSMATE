import React from "react";

export default function FocusGauge({ value }) {
  const color =
    value > 75 ? "#22c55e" : value > 50 ? "#f59e0b" : "#ef4444";

  return (
    <div style={{ color }}>
      <h2 style={{ fontSize: "42px" }}>{value}%</h2>
      <p>Focus Score</p>
    </div>
  );
}
