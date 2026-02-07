import { useState } from "react";
import api from "../api/axios";

const priorityColors = {
  LOW: "#22c55e",
  MEDIUM: "#eab308",
  HIGH: "#ef4444",
};

export default function CreateIssueModal({
  projectId,
  users,
  onClose,
  onCreated,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [assignedToUserId, setAssignedToUserId] = useState("");

  /* ================= CREATE ================= */
  const createIssue = async () => {
    if (!title.trim()) {
      alert("Issue summary is required");
      return;
    }

    try {
      await api.post("/issues", {
        title,
        description,
        priority,
        projectId,
        assignedToUserId: assignedToUserId || null,
      });

      onCreated?.();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to create issue");
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* Header */}
        <div style={styles.header}>
          <h3 style={{ margin: 0 }}>Create Issue</h3>
          <button onClick={onClose} style={styles.closeBtn}>
            ✕
          </button>
        </div>

        {/* Title */}
        <input
          placeholder="Issue summary"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
        />

        {/* Description */}
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ ...styles.input, height: 90 }}
        />

        {/* Priority */}
        <div style={styles.field}>
          <label style={styles.label}>Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            style={{
              ...styles.select,
              borderColor: priorityColors[priority],
            }}
          >
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
          </select>
        </div>

        {/* Assignee */}
        <div style={styles.field}>
          <label style={styles.label}>Assignee</label>
          <select
            value={assignedToUserId}
            onChange={(e) => setAssignedToUserId(e.target.value)}
            style={styles.select}
          >
            <option value="">Unassigned</option>

            {users.map((user) => {
              const userId = user.userId || user.id;
              const role =
                user.projectRole ||
                user.role ||
                user.userRole ||
                "MEMBER";

              return (
                <option key={userId} value={userId}>
                  {user.name} ({role})
                </option>
              );
            })}
          </select>
        </div>

        {/* Actions */}
        <div style={styles.actions}>
          <button style={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button style={styles.createBtn} onClick={createIssue}>
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

/* ===================== STYLES ===================== */

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(2,6,23,0.8)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },

  modal: {
    background: "#020617",
    color: "#e5e7eb",
    padding: 20,
    width: 380,
    borderRadius: 12,
    border: "1px solid #1e293b",
    boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },

  closeBtn: {
    background: "transparent",
    border: "none",
    color: "#94a3b8",
    fontSize: 18,
    cursor: "pointer",
  },

  input: {
    width: "100%",
    background: "#020617",
    color: "#e5e7eb",
    border: "1px solid #334155",
    borderRadius: 8,
    padding: "8px 10px",
    marginBottom: 12,
    outline: "none",
  },

  field: {
    marginBottom: 12,
  },

  label: {
    fontSize: 12,
    opacity: 0.8,
    marginBottom: 4,
    display: "block",
  },

  select: {
    width: "100%",
    background: "#020617",
    color: "#e5e7eb",
    border: "1px solid #334155",
    borderRadius: 8,
    padding: "8px 10px",
    outline: "none",
  },

  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 10,
  },

  cancelBtn: {
    background: "transparent",
    border: "1px solid #334155",
    color: "#e5e7eb",
    padding: "6px 12px",
    borderRadius: 8,
    cursor: "pointer",
  },

  createBtn: {
    background: "#2563eb",
    border: "none",
    color: "#fff",
    padding: "6px 14px",
    borderRadius: 8,
    cursor: "pointer",
  },
};
