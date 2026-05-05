export default function SummaryCard({ history }) {
  const total = history.length || 1;

  const focused = history.filter(h => h.label === "focused").length;
  const distracted = history.filter(h => h.label === "distracted").length;
  const drowsy = history.filter(h => h.label === "drowsy").length;

  return (
    <div className="card">
      <div className="card-header">
        <strong>Focus Report</strong>
      </div>

      <p>Focused: {Math.round((focused / total) * 100)}%</p>
      <p>Distracted: {Math.round((distracted / total) * 100)}%</p>
      <p>Drowsy: {Math.round((drowsy / total) * 100)}%</p>

      <hr />

      <h4>Suggestions</h4>
      <ul style={{ fontSize: 13, color: "#9aa4b2" }}>
        {drowsy > 3 && <li>Take short breaks every 25 minutes</li>}
        {distracted > 3 && <li>Reduce phone usage during study</li>}
        {focused > distracted && <li>Great focus! Keep going 💙</li>}
      </ul>
    </div>
  );
}
