import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import FocusPanel from "./components/FocusPanel";
import Timeline from "./components/Timeline";
import StudyAssistantPanel from "./components/StudyAssistantPanel";
import SummaryCard from "./components/SummaryCard";
import AlertsPanel from "./components/AlertsPanel";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { setAuthToken } from "./api";

/* ---------------- PRIVATE ROUTE ---------------- */
function PrivateRoute({ children }) {
  const token = localStorage.getItem("fm_token");
  return token ? children : <Navigate to="/" replace />;
}

/* ---------------- DASHBOARD LAYOUT ---------------- */
function Dashboard() {
  const [username] = useState(localStorage.getItem("fm_user") || "");
  const [token] = useState(localStorage.getItem("fm_token"));
  const [alerts, setAlerts] = useState([]);
  const [focusHistory, setFocusHistory] = useState([]);

  useEffect(() => {
    if (token) setAuthToken(token);
  }, [token]);

  function pushAlert(text) {
    const a = { id: Date.now(), text };
    setAlerts((s) => [a, ...s].slice(0, 5));
    setTimeout(() => {
      setAlerts((s) => s.filter((x) => x.id !== a.id));
    }, 12000);
  }

  function handleHistoryUpdate(entry) {
    setFocusHistory((h) => [...h.slice(-360), entry]);
    if (entry.label === "distracted") {
      pushAlert(`Hey ${username}, take a short pause and refocus your attention!`);
    }
  }

  function handleLogout() {
    localStorage.removeItem("fm_user");
    localStorage.removeItem("fm_token");
    setAuthToken(null);
    window.location.href = "/";
  }

  return (
    <div className="fm-root">
      <Header username={username} onLogout={handleLogout} />

      <main className="fm-main">
        <section className="left-column">
          <FocusPanel
            username={username}
            token={token}
            onHistory={handleHistoryUpdate}
            pushAlert={pushAlert}
          />
          <Timeline history={focusHistory} />
        </section>

        <aside className="right-column">
          <SummaryCard history={focusHistory} />
          <StudyAssistantPanel username={username} pushAlert={pushAlert} />
          <AlertsPanel alerts={alerts} />
        </aside>
      </main>

      <footer className="fm-footer">
        <div>FocusMate++{new Date().getFullYear()}</div>
        <div className="small">Local-first • Privacy-friendly </div>
      </footer>
    </div>
  );
}

/* ---------------- APP ROOT ---------------- */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
