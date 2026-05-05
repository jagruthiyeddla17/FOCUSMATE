import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar">
      <h2 className="title">FocusMate</h2>
      <div className="nav-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/monitor">Monitor</Link>
        <Link to="/heatmap">Heatmap</Link>
        <Link to="/study">Study</Link>
      </div>
    </nav>
  );
}
