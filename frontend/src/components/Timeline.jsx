import React from "react";

function colorFor(label){
  if(label === "focused") return "#00AEEF";
  if(label === "distracted") return "#FF6B6B";
  if(label === "drowsy") return "#FFD166";
  if(label === "thinking" || label === "notebook") return "#6BE7C1";
  return "#5b6b7a";
}

export default function Timeline({history=[]}){
  const slice = history.slice(-60);
  return (
    <div className="card timeline-card">
      <div className="card-header"><strong>Focus Timeline</strong></div>
      <div className="timeline-strip" title="Recent focus">
        {slice.length === 0 ? <div className="empty">No data yet — start monitoring</div> :
          slice.map((h, i) => (
            <div key={i} className="timeline-segment" style={{ background: colorFor(h.label), height: `${20 + (h.score||0)*0.6}px` }} title={`${new Date(h.t).toLocaleTimeString()} — ${h.label} (${Math.round((h.score||0)*100)}%)`} />
          ))
        }
      </div>
    </div>
  );
}
