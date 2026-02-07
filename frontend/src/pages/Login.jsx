import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const login = async () => {
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      onLogin();
    } catch (err) {
      console.error(err);
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Sign in to BugTracker</h2>

        {error && <div style={styles.error}>{error}</div>}

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button
          style={styles.loginBtn}
          onClick={login}
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        {/* 🔹 SIGN UP */}
        <div style={styles.footer}>
          <span>Don’t have an account?</span>
          <button
            style={styles.signupBtn}
            onClick={() => navigate("/register")}
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #020617, #0f172a)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#e5e7eb",
  },
  card: {
    width: 360,
    background: "#020617",
    padding: 28,
    borderRadius: 14,
    border: "1px solid #1e293b",
    boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
  },
  title: {
    marginBottom: 20,
    textAlign: "center",
    fontWeight: 600,
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    marginBottom: 12,
    borderRadius: 8,
    border: "1px solid #334155",
    background: "#020617",
    color: "#e5e7eb",
    outline: "none",
  },
  loginBtn: {
    width: "100%",
    background: "#2563eb",
    border: "none",
    color: "#fff",
    padding: "10px",
    borderRadius: 8,
    fontWeight: 600,
    cursor: "pointer",
    marginTop: 6,
  },
  footer: {
    marginTop: 16,
    display: "flex",
    justifyContent: "center",
    gap: 6,
    fontSize: 13,
  },
  signupBtn: {
    background: "none",
    border: "none",
    color: "#60a5fa",
    cursor: "pointer",
    padding: 0,
  },
  error: {
    background: "#7f1d1d",
    color: "#fecaca",
    padding: "8px 10px",
    borderRadius: 6,
    marginBottom: 12,
    fontSize: 13,
    textAlign: "center",
  },
};
