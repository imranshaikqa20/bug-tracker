import { useState } from "react";
import api from "../api/axios";
import EditIssueModal from "./EditIssueModal";

const priorityColors = {
  LOW: "#22c55e",
  MEDIUM: "#eab308",
  HIGH: "#ef4444",
};

/* ================= PARSE DESCRIPTION ================= */
const parseDescription = (text = "") => {
  const sections = {
    description: "",
    steps: "",
    expected: "",
    actual: "",
  };

  const blocks = text.split(/\n(?=[A-Z][A-Za-z ]+:)/);

  blocks.forEach((b) => {
    if (b.startsWith("Description:"))
      sections.description = b.replace("Description:", "").trim();
    if (b.startsWith("Steps to Reproduce:"))
      sections.steps = b.replace("Steps to Reproduce:", "").trim();
    if (b.startsWith("Expected Result:"))
      sections.expected = b.replace("Expected Result:", "").trim();
    if (b.startsWith("Actual Result:"))
      sections.actual = b.replace("Actual Result:", "").trim();
  });

  return sections;
};

export default function IssueCard({ issue, users = [], onUpdated }) {
  const issueId = issue?.id ?? issue?.issueId;

  const [expanded, setExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  if (!issueId) return null;

  const parsed = parseDescription(issue.description);

  /* ================= DRAG ================= */
  const onDragStart = (e) => {
    if (expanded) return;
    e.dataTransfer.setData("issueId", issueId);
  };

  /* ================= ASSIGNEE ================= */
  const updateAssignee = async (email) => {
    try {
      await api.patch(`/issues/${issueId}/assignee`, null, {
        params: { assigneeEmail: email || "" },
      });
      onUpdated?.();
    } catch {
      alert("Failed to update assignee");
    }
  };

  /* ================= DELETE ISSUE ================= */
  const deleteIssue = async () => {
    const confirm = window.confirm(
      "Are you sure you want to delete this issue?"
    );
    if (!confirm) return;

    try {
      await api.delete(`/issues/${issueId}`);
      setExpanded(false);
      onUpdated?.();
    } catch (err) {
      console.error(err);
      alert("Failed to delete issue");
    }
  };

  /* ================= COMMENTS ================= */
  const addComment = () => {
    if (!commentText.trim()) return;

    setComments((prev) => [
      ...prev,
      { text: commentText, date: new Date().toLocaleString() },
    ]);
    setCommentText("");
  };

  return (
    <>
      {/* ================= MINIMIZED ================= */}
      {!expanded && (
        <div
          draggable
          onDragStart={onDragStart}
          onDoubleClick={() => setExpanded(true)}
          style={styles.card}
        >
          <div style={styles.cardHeader}>
            <h4 style={styles.title}>{issue.title}</h4>

            <select
              style={styles.select}
              value={issue.assignee?.email || ""}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => updateAssignee(e.target.value)}
            >
              <option value="">Unassigned</option>
              {users.map((u) => (
                <option key={u.email} value={u.email}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          <span
            style={{
              ...styles.priority,
              background:
                priorityColors[issue.priority] || "#64748b",
            }}
          >
            {issue.priority}
          </span>
        </div>
      )}

      {/* ================= EXPANDED ================= */}
      {expanded && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            {/* Header */}
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>{issue.title}</h2>

              <div style={styles.actions}>
                <span
                  style={styles.icon}
                  onClick={() => setShowComments((p) => !p)}
                  title="Comments"
                >
                  💬
                </span>

                <span
                  style={styles.icon}
                  onClick={() => setShowEdit(true)}
                  title="Edit"
                >
                  ✏️
                </span>

                <span
                  style={styles.icon}
                  onClick={deleteIssue}
                  title="Delete"
                >
                  🗑️
                </span>

                <span
                  style={{ ...styles.icon, color: "#ef4444" }}
                  onClick={() => setExpanded(false)}
                  title="Close"
                >
                  ✕
                </span>
              </div>
            </div>

            {/* Content */}
            <div style={styles.content}>
              <Section title="Description">
                {parsed.description}
              </Section>

              <Section title="Steps to Reproduce">
                <pre style={styles.pre}>{parsed.steps}</pre>
              </Section>

              <Section title="Expected Result">
                {parsed.expected}
              </Section>

              <Section title="Actual Result">
                {parsed.actual}
              </Section>
            </div>

            {/* Footer */}
            <div style={styles.footer}>
              <span
                style={{
                  ...styles.priority,
                  background:
                    priorityColors[issue.priority] || "#64748b",
                }}
              >
                {issue.priority}
              </span>

              <select
                style={styles.select}
                value={issue.assignee?.email || ""}
                onChange={(e) => updateAssignee(e.target.value)}
              >
                <option value="">Unassigned</option>
                {users.map((u) => (
                  <option key={u.email} value={u.email}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Comments */}
            {showComments && (
              <div style={styles.comments}>
                <h4>Comments</h4>

                {comments.map((c, i) => (
                  <div key={i} style={styles.comment}>
                    <div style={styles.commentDate}>
                      {c.date}
                    </div>
                    {c.text}
                  </div>
                ))}

                <textarea
                  style={styles.textarea}
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />

                <button
                  style={styles.addBtn}
                  onClick={addComment}
                >
                  Add Comment
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= EDIT ================= */}
      {showEdit && (
        <EditIssueModal
          issue={issue}
          users={users}
          onClose={() => setShowEdit(false)}
          onUpdated={onUpdated}
        />
      )}
    </>
  );
}

/* ================= UI HELPERS ================= */

const Section = ({ title, children }) =>
  children ? (
    <div style={styles.section}>
      <h4 style={styles.sectionTitle}>{title}</h4>
      <div style={styles.sectionBody}>{children}</div>
    </div>
  ) : null;

/* ================= STYLES ================= */

const styles = {
  card: {
    background: "#020617",
    border: "1px solid #1e293b",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    cursor: "grab",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },

  title: {
    fontSize: 14,
    fontWeight: 600,
    margin: 0,
  },

  priority: {
    fontSize: 11,
    padding: "4px 8px",
    borderRadius: 999,
    fontWeight: 600,
    color: "#020617",
  },

  select: {
    background: "#020617",
    color: "#e5e7eb",
    border: "1px solid #334155",
    borderRadius: 6,
    padding: "4px 6px",
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(2,6,23,0.85)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },

  modal: {
    width: "78%",
    maxHeight: "88vh",
    background: "#020617",
    borderRadius: 16,
    padding: 24,
    border: "1px solid #1e293b",
    overflowY: "auto",
  },

  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  modalTitle: {
    fontSize: 22,
    margin: 0,
  },

  actions: {
    display: "flex",
    gap: 14,
  },

  icon: {
    fontSize: 16,
    cursor: "pointer",
    opacity: 0.9,
  },

  content: {
    marginTop: 20,
    fontSize: 14,
  },

  section: {
    marginBottom: 16,
  },

  sectionTitle: {
    color: "#93c5fd",
    marginBottom: 6,
  },

  sectionBody: {
    opacity: 0.9,
  },

  pre: {
    whiteSpace: "pre-wrap",
    margin: 0,
  },

  footer: {
    marginTop: 20,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  comments: {
    marginTop: 24,
    borderTop: "1px solid #1e293b",
    paddingTop: 16,
  },

  comment: {
    background: "#020617",
    border: "1px solid #1e293b",
    padding: 8,
    borderRadius: 8,
    marginBottom: 6,
  },

  commentDate: {
    fontSize: 11,
    opacity: 0.6,
    marginBottom: 4,
  },

  textarea: {
    width: "100%",
    marginTop: 10,
    padding: 8,
    background: "#020617",
    color: "#e5e7eb",
    border: "1px solid #334155",
    borderRadius: 6,
  },

  addBtn: {
    marginTop: 8,
    background: "#2563eb",
    border: "none",
    padding: "6px 12px",
    borderRadius: 6,
    color: "#fff",
    cursor: "pointer",
  },
};
