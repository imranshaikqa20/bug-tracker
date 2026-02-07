import { useEffect, useState, useCallback } from "react";
import api from "../api/axios";
import InviteMemberModal from "./InviteMemberModal";

export default function ProjectMembers({ projectId }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showInvite, setShowInvite] = useState(false);

  /* ================= LOAD MEMBERS ================= */
  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get(`/projects/${projectId}/members`);
      setMembers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setError("Failed to load project members");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (projectId) {
      fetchMembers();
    }
  }, [projectId, fetchMembers]);

  /* ================= UI STATES ================= */
  if (loading) {
    return (
      <div style={styles.container}>
        <p style={styles.loading}>Loading members...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <p style={styles.error}>{error}</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h3 style={styles.title}>Members</h3>

        <button
          style={styles.inviteBtn}
          onClick={() => setShowInvite(true)}
        >
          + Invite
        </button>
      </div>

      {/* Members List */}
      {members.length === 0 ? (
        <p style={styles.empty}>No members assigned</p>
      ) : (
        <div style={styles.list}>
          {members.map((m) => {
            const role =
              m.projectRole || m.role || "MEMBER"; // 🔥 FIX

            return (
              <div key={m.userId || m.id} style={styles.member}>
                <div>
                  <div style={styles.name}>{m.name}</div>
                  <div style={styles.email}>{m.email}</div>
                </div>

                <span
                  style={{
                    ...styles.role,
                    background: roleColors[role] || "#334155",
                  }}
                >
                  {role}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Invite Modal */}
      {showInvite && (
        <InviteMemberModal
          projectId={projectId}
          onClose={() => setShowInvite(false)}
          onSuccess={fetchMembers}
        />
      )}
    </div>
  );
}

/* ================= ROLE COLORS ================= */

const roleColors = {
  OWNER: "#7c3aed",   // Purple
  ADMIN: "#2563eb",   // Blue
  MEMBER: "#16a34a",  // Green
};

/* ================= STYLES ================= */

const styles = {
  container: {
    background: "#020617",
    color: "#e5e7eb",
    padding: 16,
    borderRadius: 12,
    border: "1px solid #1e293b",
    width: "100%",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  title: {
    margin: 0,
    fontSize: 16,
    fontWeight: 600,
  },

  inviteBtn: {
    background: "#2563eb",
    border: "none",
    color: "#fff",
    padding: "6px 12px",
    borderRadius: 8,
    fontSize: 12,
    cursor: "pointer",
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  member: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#020617",
    border: "1px solid #1e293b",
    borderRadius: 10,
    padding: "10px 12px",
  },

  name: {
    fontSize: 14,
    fontWeight: 600,
  },

  email: {
    fontSize: 12,
    opacity: 0.7,
  },

  role: {
    fontSize: 11,
    padding: "4px 8px",
    borderRadius: 999,
    fontWeight: 600,
    color: "#fff",
  },

  empty: {
    fontSize: 13,
    opacity: 0.6,
  },

  loading: {
    fontSize: 13,
    opacity: 0.7,
  },

  error: {
    fontSize: 13,
    color: "#f87171",
  },
};
