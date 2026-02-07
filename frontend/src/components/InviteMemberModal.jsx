import { useEffect, useState } from "react";
import api from "../api/axios";

export default function InviteMemberModal({
  projectId,
  onClose,
  onSuccess,
}) {
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("MEMBER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= LOAD USERS ================= */
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setError("");
        const res = await api.get("/users");

        // 🔥 SAFETY: support id / userId
        const data = Array.isArray(res.data)
          ? res.data.map((u) => ({
              id: u.id ?? u.userId,
              name: u.name,
              email: u.email,
            }))
          : [];

        setUsers(data);
      } catch (err) {
        console.error("Failed to load users", err);
        setError("Failed to load users");
      }
    };

    loadUsers();
  }, []);

  /* ================= INVITE ================= */
  const invite = async () => {
    if (!userId) {
      alert("Please select a user");
      return;
    }

    try {
      setLoading(true);

      await api.post("/project-members", {
        projectId,
        userId,
        role, // OWNER / ADMIN / MEMBER
      });

      onSuccess?.();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to invite member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3 style={styles.title}>Invite Member</h3>

        {/* USER */}
        <label style={styles.label}>User</label>
        <select
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          style={styles.select}
          disabled={users.length === 0}
        >
          <option value="">Select user</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name} ({u.email})
            </option>
          ))}
        </select>

        {users.length === 0 && !error && (
          <div style={styles.hint}>No users available</div>
        )}

        {error && <div style={styles.error}>{error}</div>}

        {/* ROLE */}
        <label style={styles.label}>Role</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={styles.select}
        >
          <option value="OWNER">OWNER</option>
          <option value="ADMIN">ADMIN</option>
          <option value="MEMBER">MEMBER</option>
        </select>

        {/* ACTIONS */}
        <div style={styles.actions}>
          <button style={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>

          <button
            style={styles.inviteBtn}
            onClick={invite}
            disabled={loading || !userId}
          >
            {loading ? "Inviting..." : "Invite"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },

  modal: {
    background: "#020617",
    color: "#e5e7eb",
    padding: 20,
    width: 320,
    borderRadius: 12,
    border: "1px solid #1e293b",
  },

  title: {
    margin: 0,
    marginBottom: 12,
    fontSize: 18,
    fontWeight: 600,
  },

  label: {
    fontSize: 12,
    opacity: 0.8,
    display: "block",
    marginTop: 10,
    marginBottom: 4,
  },

  select: {
    width: "100%",
    background: "#020617",
    color: "#e5e7eb",
    border: "1px solid #334155",
    borderRadius: 8,
    padding: "8px 10px",
  },

  hint: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 4,
  },

  error: {
    fontSize: 12,
    color: "#f87171",
    marginTop: 4,
  },

  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 16,
  },

  cancelBtn: {
    background: "transparent",
    border: "1px solid #334155",
    color: "#e5e7eb",
    padding: "6px 12px",
    borderRadius: 8,
    cursor: "pointer",
  },

  inviteBtn: {
    background: "#2563eb",
    border: "none",
    color: "#fff",
    padding: "6px 14px",
    borderRadius: 8,
    cursor: "pointer",
  },
};
