import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("MEMBER");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  /* ================= REGISTER ================= */

  const register = async () => {
    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await api.post("/auth/register", {
        name,
        email,
        password,
        role, // OWNER | ADMIN | MEMBER
      });

      setSuccess("Account created successfully. Please sign in.");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create your account</h2>

        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}

        <input
          type="text"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
        />

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

        <label style={styles.label}>Role</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={styles.select}
        >
          <option value="MEMBER">Member</option>
          <option value="ADMIN">Admin</option>
          <option value="OWNER">Owner</option>
        </select>

        <button
          style={styles.registerBtn}
          onClick={register}
          disabled={loading}
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        <div style={styles.footer}>
          <span>Already have an account?</span>
          <button
            style={styles.linkBtn}
            onClick={() => navigate("/login")}
          >
            Sign in
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
    width: 380,
    background: "#020617",
    padding: 28,
    borderRadius: 14,
    border: "1px solid #1e293b",
    boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
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
  },
  label: {
    fontSize: 12,
    opacity: 0.8,
    marginBottom: 4,
    display: "block",
  },
  select: {
    width: "100%",
    padding: "10px 12px",
    marginBottom: 16,
    borderRadius: 8,
    border: "1px solid #334155",
    background: "#020617",
    color: "#e5e7eb",
  },
  registerBtn: {
    width: "100%",
    background: "#2563eb",
    border: "none",
    color: "#fff",
    padding: "10px",
    borderRadius: 8,
    fontWeight: 600,
    cursor: "pointer",
  },
  footer: {
    marginTop: 16,
    display: "flex",
    justifyContent: "center",
    gap: 6,
    fontSize: 13,
  },
  linkBtn: {
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
  success: {
    background: "#064e3b",
    color: "#bbf7d0",
    padding: "8px 10px",
    borderRadius: 6,
    marginBottom: 12,
    fontSize: 13,
    textAlign: "center",
  },
};
