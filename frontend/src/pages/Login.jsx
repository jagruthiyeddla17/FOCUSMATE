import { useState } from "react";
import { API, setAuthToken } from "../api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const nav = useNavigate();
  const [username, setU] = useState("");
  const [password, setP] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function loginUser() {
    if (!username || !password) {
      setMsg("Please enter username and password");
      return;
    }

    setLoading(true);
    setMsg("");

    try {
      const res = await API.post("/login", { username, password });
      localStorage.setItem("fm_token", res.data.token);
      localStorage.setItem("fm_user", username);

      setAuthToken(res.data.token);

      nav("/dashboard", { replace: true });
    } catch (err) {
      setMsg("Invalid username or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>FocusMate ✨</h1>
        <p style={styles.subtitle}>
          Gentle focus. Intelligent guidance.
        </p>

        <input
          style={styles.input}
          placeholder="Username"
          value={username}
          onChange={(e) => setU(e.target.value)}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setP(e.target.value)}
        />

        <button
          style={{
            ...styles.button,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
          onClick={loginUser}
          disabled={loading}
        >
          {loading ? "Signing in…" : "Login"}
        </button>

        {msg && <p style={styles.error}>{msg}</p>}

        <p style={styles.link} onClick={() => nav("/register")}>
          New here? Create an account →
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
    boxShadow: "0 0 40px rgba(66, 201, 255, 0.18)",
    textAlign: "center",
  },
  title: {
    marginBottom: 6,
    color: "#42c9ff",
    fontWeight: 700,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 26,
    color: "#9aa4b2",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    marginBottom: 14,
    borderRadius: 8,
    border: "1px solid #1f2937",
    background: "#0d1117",
    color: "#e6edf3",
    outline: "none",
    fontSize: 14,
  },
  button: {
    width: "100%",
    padding: 12,
    borderRadius: 8,
    border: "none",
    background: "linear-gradient(90deg, #00aeef, #42c9ff)",
    color: "#001018",
    fontWeight: 600,
    fontSize: 15,
    marginTop: 6,
  },
  error: {
    marginTop: 14,
    color: "#ff6b6b",
    fontSize: 13,
  },
  link: {
    marginTop: 20,
    fontSize: 13,
    color: "#42c9ff",
    cursor: "pointer",
  },
};
