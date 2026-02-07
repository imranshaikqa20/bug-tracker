import { useState, useEffect } from "react";
import api from "../api/axios";

/* ================= AUTH HELPER ================= */
function getLoggedInUserEmail() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.email || payload.sub || null;
  } catch {
    return null;
  }
}

export default function EditIssueModal({
  issue,
  users = [],
  onClose,
  onUpdated,
}) {
  const issueId = issue?.id ?? issue?.issueId;

  /* ================= HOOKS (ALWAYS FIRST) ================= */
  const [title, setTitle] = useState(issue?.title || "");
  const [priority, setPriority] = useState(issue?.priority || "MEDIUM");
  const [assigneeEmail, setAssigneeEmail] = useState(
    issue?.assignee?.email || ""
  );
  const [description, setDescription] = useState(
    issue?.description ||
      `Description:\n\nSteps to Reproduce:\n\nExpected Result:\n\nActual Result:`
  );
  const [loading, setLoading] = useState(false);

  const loggedInEmail = getLoggedInUserEmail();

  /* ================= AUTH CHECK ================= */
  const canEdit =
    issue?.assignee?.email === loggedInEmail ||
    issue?.createdBy?.email === loggedInEmail ||
    ["OWNER", "ADMIN"].includes(issue?.currentUserRole);

  /* ================= BLOCK UNAUTHORIZED ================= */
  useEffect(() => {
    if (!canEdit) {
      alert("You are not authorized to edit this issue");
      onClose();
    }
  }, [canEdit, onClose]);

  if (!issueId || !canEdit) return null;

  /* ================= UPDATE ================= */
  const updateIssue = async () => {
    if (!title.trim()) {
      alert("Title is required");
      return;
    }

    try {
      setLoading(true);

      await api.put(`/issues/${issueId}`, {
        title,
        priority,
        description,
        assigneeEmail: assigneeEmail || null,
      });

      onUpdated?.();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to update issue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2>Edit Issue</h2>
          <button style={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <label style={styles.label}>Title</label>
        <input
          style={styles.input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label style={styles.label}>Priority</label>
        <select
          style={styles.select}
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="LOW">LOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HIGH">HIGH</option>
        </select>

        <label style={styles.label}>Assignee</label>
        <select
          style={styles.select}
          value={assigneeEmail}
          onChange={(e) => setAssigneeEmail(e.target.value)}
        >
          <option value="">Unassigned</option>
          {users.map((u) => (
            <option key={u.email} value={u.email}>
              {u.name} ({u.projectRole || u.role || "MEMBER"})
            </option>
          ))}
        </select>

        <label style={styles.label}>Description</label>
        <textarea
          style={styles.textarea}
          rows={10}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div style={styles.actions}>
          <button style={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button
            style={styles.saveBtn}
            onClick={updateIssue}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
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
    background: "rgba(2,6,23,0.85)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1100,
  },
  modal: {
    background: "#020617",
    width: 620,
    borderRadius: 14,
    padding: 24,
    border: "1px solid #1e293b",
    color: "#e5e7eb",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  closeBtn: {
    background: "transparent",
    border: "none",
    color: "#94a3b8",
    fontSize: 20,
    cursor: "pointer",
  },
  label: { color: "#93c5fd", marginTop: 12 },
  input: {
    width: "100%",
    padding: 8,
    background: "#020617",
    color: "#e5e7eb",
    border: "1px solid #334155",
    borderRadius: 6,
  },
  select: {
    width: "100%",
    padding: 8,
    background: "#020617",
    color: "#e5e7eb",
    border: "1px solid #334155",
    borderRadius: 6,
  },
  textarea: {
    width: "100%",
    padding: 10,
    background: "#020617",
    color: "#e5e7eb",
    border: "1px solid #334155",
    borderRadius: 6,
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 20,
  },
  cancelBtn: { background: "#1e293b", color: "#fff", border: "none" },
  saveBtn: { background: "#2563eb", color: "#fff", border: "none" },
};
