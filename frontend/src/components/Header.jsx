import React from "react";
import logo from "../assets/focusmate-logo.png";

export default function Header({ username, onLogout }) {
  return (
    <header style={styles.header}>
      <div style={styles.left}>
        <img src={logo} alt="FocusMate Logo" style={styles.logo} />
        <span style={styles.title}>FocusMate</span>
      </div>

      <div style={styles.right}>
        <span style={styles.user}>Hi, {username}</span>
        <button style={styles.logout} onClick={onLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}

const styles = {
  header: {
    height: 64,
    padding: "0 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "#0d1117",
    borderBottom: "1px solid #1f2937",
  },
  left: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  logo: {
    height: 36,
    width: 36,
  },
  title: {
    fontSize: 20,
    fontWeight: 600,
    color: "#42c9ff",
    letterSpacing: 0.5,
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: 16,
  },
  user: {
    color: "#9aa4b2",
    fontSize: 14,
  },
  logout: {
    padding: "6px 12px",
    background: "transparent",
    border: "1px solid #42c9ff",
    borderRadius: 6,
    color: "#42c9ff",
    cursor: "pointer",
  },
};
