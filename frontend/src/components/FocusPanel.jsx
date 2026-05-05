import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import { API } from "../api";

export default function FocusPanel({ onHistory, pushAlert }) {
  const camRef = useRef(null);
  const [running, setRunning] = useState(false);
  const [label, setLabel] = useState("idle");
  const [score, setScore] = useState(0);
  const [reason, setReason] = useState("");

  useEffect(() => {
    let id;
    if (running) id = setInterval(capture, 1200);
    return () => clearInterval(id);
  }, [running]);

  async function capture() {
    if (!camRef.current) return;
    const img = camRef.current.getScreenshot();
    if (!img) return;

    try {
      const res = await API.post("/predict", { image_b64: img });
      setLabel(res.data.label);
      setScore(Math.round(res.data.score * 100));
      setReason(res.data.reason);

      onHistory({
        label: res.data.label,
        score: res.data.score,
        t: Date.now(),
      });

      if (res.data.label === "drowsy") {
        pushAlert("You seem drowsy. Consider taking a short break 💤");
      }
    } catch {
      console.log("Prediction skipped (safe fallback)");
    }
  }

  const color =
    label === "focused"
      ? "#2ecc71"
      : label === "distracted"
      ? "#f1c40f"
      : label === "drowsy"
      ? "#e74c3c"
      : "#9aa4b2";

  return (
    <div className="card focus-card">
      <div className="card-header">
        <strong>Live Focus Monitor</strong>
      </div>

      <Webcam
        ref={camRef}
        audio={false}
        screenshotFormat="image/jpeg"
        width={320}
        style={{ borderRadius: 10 }}
      />

      <div style={{ marginTop: 12 }}>
        <h2 style={{ color }}>{label.toUpperCase()}</h2>
        <p>Confidence: {score}%</p>
        <p style={{ fontSize: 13, color: "#9aa4b2" }}>{reason}</p>
      </div>

      <button className="btn" onClick={() => setRunning(!running)}>
        {running ? "Stop Monitoring" : "Start Monitoring"}
      </button>
    </div>
  );
}
