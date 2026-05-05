import React, { useEffect, useRef } from "react";
import { API } from "../api";

export default function HeatmapPanel() {
  const canvasRef = useRef(null);
  const userId = 1; // demo-safe

  useEffect(() => {
    const draw = async () => {
      try {
        const res = await API.get(`/heatmap/${userId}`);
        const points = res.data.points || [];

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");

        const width = canvas.width;
        const height = canvas.height;

        // Background
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = "#0b1220";
        ctx.fillRect(0, 0, width, height);

        // Grid overlay (subtle)
        ctx.strokeStyle = "rgba(255,255,255,0.03)";
        for (let i = 0; i < width; i += 40) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i, height);
          ctx.stroke();
        }
        for (let j = 0; j < height; j += 40) {
          ctx.beginPath();
          ctx.moveTo(0, j);
          ctx.lineTo(width, j);
          ctx.stroke();
        }

        // Draw heat
        points.forEach((p) => {
          const x = p.x * width;
          const y = p.y * height;

          const gradient = ctx.createRadialGradient(
            x,
            y,
            0,
            x,
            y,
            80
          );

          gradient.addColorStop(0, "rgba(66,201,255,0.9)");
          gradient.addColorStop(0.4, "rgba(66,201,255,0.35)");
          gradient.addColorStop(1, "rgba(66,201,255,0)");

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(x, y, 80, 0, Math.PI * 2);
          ctx.fill();
        });
      } catch (err) {
        console.error("Heatmap render error:", err);
      }
    };

    draw();
    const id = setInterval(draw, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="card heatmap-card">
      <div className="card-header">
        <strong>Gaze Heatmap</strong>
      </div>

      <canvas
        ref={canvasRef}
        width={360}
        height={200}
        style={{
          width: "100%",
          borderRadius: 10,
          boxShadow: "0 0 25px rgba(66,201,255,0.2)",
        }}
      />

      <div className="hint">
        Bright regions indicate sustained visual attention.
      </div>
    </div>
  );
}
