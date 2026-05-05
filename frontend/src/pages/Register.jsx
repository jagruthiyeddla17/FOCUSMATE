import { useState } from "react";
import { API } from "../api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const nav = useNavigate();
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [msg, setMsg] = useState("");

  async function submit() {
    try {
      await API.post("/register", { username: u, password: p });
      nav("/");
    } catch {
      setMsg("Username already exists");
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Create Account</h1>
        <p style={styles.subtitle}>Start your focus journey 🌙</p>

        <input style={styles.input} placeholder="Username" onChange={(e) => setU(e.target.value)} />
        <input style={styles.input} type="password" placeholder="Password" onChange={(e) => setP(e.target.value)} />

        <button style={styles.button} onClick={submit}>
          Sign Up
        </button>

        {msg && <p style={styles.error}>{msg}</p>}

        <p style={styles.link} onClick={() => nav("/")}>
          ← Back to Login
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    background: "linear-gradient(180deg, #0d1117, #090c10)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#e6edf3",
  },
  card: {
    width: 360,
    padding: 32,
    borderRadius: 14,
    background: "#0f1623",
    boxShadow: "0 0 40px rgba(66, 201, 255, 0.15)",
    textAlign: "center",
  },
  title: { marginBottom: 6, color: "#42c9ff" },
  subtitle: { fontSize: 14, marginBottom: 24, color: "#9aa4b2" },
  input: {
    width: "100%",
    padding: "12px 14px",
    marginBottom: 14,
    borderRadius: 8,
    border: "1px solid #1f2937",
    background: "#0d1117",
    color: "#e6edf3",
  },
  button: {
    width: "100%",
    padding: 12,
    borderRadius: 8,
    border: "none",
    background: "linear-gradient(90deg, #00aeef, #42c9ff)",
    color: "#001018",
    fontWeight: 600,
    cursor: "pointer",
  },
  error: { marginTop: 12, color: "#ff6b6b", fontSize: 13 },
  link: { marginTop: 18, fontSize: 13, color: "#42c9ff", cursor: "pointer" },
};
