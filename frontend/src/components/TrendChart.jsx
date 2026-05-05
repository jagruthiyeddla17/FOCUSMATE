import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function TrendChart({ history }) {
  const labels = history.map((h) =>
    new Date(h.t).toLocaleTimeString()
  );

  const data = {
    labels,
    datasets: [
      {
        label: "Focus Trend",
        data: history.map((h) => Math.round(h.score * 100)),
        borderColor: "#6366f1",
        backgroundColor: "rgba(99, 102, 241, 0.3)",
        tension: 0.3,
        pointRadius: 0
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { labels: { color: "#fff" } }
    },
    scales: {
      x: { ticks: { color: "#aaa" } },
      y: { ticks: { color: "#aaa" }, min: 0, max: 100 }
    }
  };

  return (
    <div style={{ height: "230px" }}>
      <Line data={data} options={options} />
    </div>
  );
}
