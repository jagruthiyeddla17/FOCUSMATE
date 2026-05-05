import React, { useState } from "react";
import { API } from "../api";

export default function AuthModal({ onSuccess }){
  const [mode, setMode] = useState("login"); // login | register
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit(){
    setError("");
    try{
      if(mode === "register"){
        await API.post("/register", { username, password });
        // auto login after register
        const res = await API.post("/login", { username, password });
        onSuccess({ username, token: res.data.token });
      } else {
        const res = await API.post("/login", { username, password });
        onSuccess({ username, token: res.data.token });
      }
    }catch(e){
      const msg = e?.response?.data?.detail || e.message || "Error";
      setError(msg);
    }
  }

  return (
    <div className="auth-overlay">
      <div className="auth-card">
        <h2>{mode === "login" ? "Welcome back" : "Create account"}</h2>
        <div className="auth-row">
          <input placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
          <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        <div className="auth-actions">
          <button className="btn" onClick={submit}>{mode === "login" ? "Login" : "Sign Up"}</button>
          <button className="btn ghost" onClick={()=> setMode(m => m === "login" ? "register" : "login")}>
            {mode === "login" ? "Create an account" : "Have an account? Login"}
          </button>
        </div>
        {error && <div className="error">{error}</div>}
        <div className="small muted">Your data stays local. Passwords are hashed on the server.</div>
      </div>
    </div>
  );
}
