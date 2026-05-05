import React from "react";

export default function AlertsPanel({ alerts=[] }){
  return (
    <div className="alerts-wrapper">
      {alerts.map(a => (
        <div key={a.id} className="alert neon-alert">{a.text}</div>
      ))}
    </div>
  );
}
