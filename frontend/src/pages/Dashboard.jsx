import { useEffect, useState, useCallback } from "react";
import api from "../api/axios";

/* ================= TOKEN HELPERS ================= */

function getUserFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return { name: "User", email: "" };

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const email = payload.email || payload.sub || "";

    return {
      email: email.toLowerCase(),
      name: email ? email.split("@")[0] : "User",
    };
  } catch {
    return { name: "User", email: "" };
  }
}

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create modal
  const [showModal, setShowModal] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");

  // Delete modal
  const [deleteProject, setDeleteProject] = useState(null);

  const user = getUserFromToken();

  /* ================= AUTH GUARD ================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.replace("/login");
    }
  }, []);

  /* ================= LOAD PROJECTS ================= */

  const fetchMyProjects = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/projects/my-projects");
      setProjects(res.data || []);
    } catch (err) {
      console.error("Failed to load projects", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyProjects();
  }, [fetchMyProjects]);

  /* ================= CREATE PROJECT ================= */

  const handleCreateProject = async () => {
    if (!projectName.trim()) return;

    try {
      await api.post("/projects", {
        name: projectName,
        description: projectDesc,
      });

      setShowModal(false);
      setProjectName("");
      setProjectDesc("");
      fetchMyProjects();
    } catch {
      alert("Failed to create project");
    }
  };

  /* ================= DELETE PROJECT ================= */

  const handleDeleteProject = async () => {
    if (!deleteProject) return;

    try {
      await api.delete(`/projects/${deleteProject.id}`);
      setDeleteProject(null);
      fetchMyProjects();
    } catch (err) {
      if (err.response?.status === 403) {
        alert("Only project OWNER can delete this project");
      } else {
        alert("Failed to delete project");
      }
    }
  };

  /* ================= LOGOUT ================= */

  const handleLogout = () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    window.location.replace("/login");
  };

  if (loading) return <p style={{ padding: 24 }}>Loading…</p>;

  return (
    <div style={styles.page}>
      {/* ===== HEADER ===== */}
      <header style={styles.header}>
        <h2 style={styles.welcome}>👋 Hi, {user.name}</h2>

        <div style={styles.headerActions}>
          <button style={styles.createBtn} onClick={() => setShowModal(true)}>
            + Create Project
          </button>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* ===== CONTENT ===== */}
      <section style={styles.content}>
        <h3 style={styles.sectionTitle}>My Projects</h3>

        {projects.length === 0 ? (
          <p style={styles.empty}>No projects found</p>
        ) : (
          <div style={styles.grid}>
            {projects.map((project) => (
              <div key={project.id} style={styles.card}>
                <button
                  style={styles.deleteIcon}
                  onClick={() => setDeleteProject(project)}
                >
                  🗑️
                </button>

                <h4>{project.name}</h4>
                <p style={styles.description}>
                  {project.description || "No description"}
                </p>

                <button
                  style={styles.openBtn}
                  onClick={() =>
                    (window.location.href = `/projects/${project.id}`)
                  }
                >
                  Open Board →
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ===== CREATE PROJECT MODAL (IMPROVED UI) ===== */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            {/* Header */}
            <div style={styles.modalHeader}>
              <h3>Create New Project</h3>
              <button
                style={styles.closeBtn}
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Project Name *</label>
              <input
                style={styles.input}
                placeholder="e.g. Bug Tracker"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Description</label>
              <textarea
                style={styles.textarea}
                placeholder="Short description about the project"
                value={projectDesc}
                onChange={(e) => setProjectDesc(e.target.value)}
              />
            </div>

            {/* Footer */}
            <div style={styles.modalActions}>
              <button
                style={styles.cancelBtn}
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                style={{
                  ...styles.primaryBtn,
                  opacity: projectName.trim() ? 1 : 0.5,
                }}
                disabled={!projectName.trim()}
                onClick={handleCreateProject}
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== DELETE CONFIRM ===== */}
      {deleteProject && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>Delete Project</h3>
            <p>
              Are you sure you want to delete{" "}
              <b>{deleteProject.name}</b>?
            </p>

            <div style={styles.modalActions}>
              <button
                style={styles.cancelBtn}
                onClick={() => setDeleteProject(null)}
              >
                Cancel
              </button>
              <button
                style={styles.deleteConfirmBtn}
                onClick={handleDeleteProject}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #0f172a, #020617)",
    color: "#e5e7eb",
  },
  header: {
    padding: "20px 32px",
    display: "flex",
    justifyContent: "space-between",
    borderBottom: "1px solid #1e293b",
  },
  welcome: { margin: 0, fontSize: 22 },
  headerActions: { display: "flex", gap: 12 },
  createBtn: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "10px 18px",
    borderRadius: 10,
    cursor: "pointer",
  },
  logoutBtn: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "10px 18px",
    borderRadius: 10,
    cursor: "pointer",
  },
  content: { padding: "28px 32px" },
  sectionTitle: { marginBottom: 18 },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: 20,
  },
  card: {
    position: "relative",
    background: "#020617",
    padding: 20,
    borderRadius: 16,
    border: "1px solid #1e293b",
  },
  deleteIcon: {
    position: "absolute",
    top: 12,
    right: 12,
    background: "transparent",
    border: "none",
    fontSize: 18,
    color: "#ef4444",
    cursor: "pointer",
  },
  description: { fontSize: 13, color: "#94a3b8" },
  openBtn: {
    marginTop: 12,
    background: "#22c55e",
    border: "none",
    padding: "8px 14px",
    borderRadius: 10,
    cursor: "pointer",
  },
  empty: { opacity: 0.7 },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    background: "#020617",
    padding: 24,
    borderRadius: 16,
    width: 420,
    border: "1px solid #1e293b",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  closeBtn: {
    background: "transparent",
    border: "none",
    color: "#94a3b8",
    fontSize: 18,
    cursor: "pointer",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    marginBottom: 6,
    color: "#cbd5f5",
  },
  input: {
    padding: 10,
    borderRadius: 10,
    border: "1px solid #334155",
    background: "#020617",
    color: "#e5e7eb",
  },
  textarea: {
    padding: 10,
    borderRadius: 10,
    border: "1px solid #334155",
    background: "#020617",
    color: "#e5e7eb",
    minHeight: 80,
    resize: "none",
  },
  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 16,
  },
  cancelBtn: {
    background: "#1e293b",
    color: "#e5e7eb",
    border: "none",
    padding: "8px 14px",
    borderRadius: 10,
    cursor: "pointer",
  },
  primaryBtn: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: 10,
    cursor: "pointer",
  },
  deleteConfirmBtn: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: 10,
    cursor: "pointer",
  },
};
