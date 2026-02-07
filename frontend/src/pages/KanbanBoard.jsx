import {
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

import Column from "../components/Column";
import CreateIssueModal from "../components/CreateIssueModal";
import ProjectMembers from "../components/ProjectMembers";

const STATUSES = ["TODO", "IN_PROGRESS", "DONE"];
const PRIORITIES = ["LOW", "MEDIUM", "HIGH"];

export default function KanbanBoard() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [board, setBoard] = useState({
    TODO: [],
    IN_PROGRESS: [],
    DONE: [],
  });

  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState("ALL");
  const [assignee, setAssignee] = useState("ALL");

  /* ================= LOAD BOARD ================= */

  const loadBoard = useCallback(async () => {
    try {
      const res = await api.get(
        `/issues/kanban/project/${projectId}`
      );

      const normalized = {
        TODO: [],
        IN_PROGRESS: [],
        DONE: [],
      };

      if (!Array.isArray(res.data)) {
        STATUSES.forEach((status) => {
          normalized[status] = (res.data[status] || []).map(
            (issue) => ({
              ...issue,
              assignee: issue.assignee || null,
            })
          );
        });
      } else {
        res.data.forEach((issue) => {
          if (normalized[issue.status]) {
            normalized[issue.status].push({
              ...issue,
              assignee: issue.assignee || null,
            });
          }
        });
      }

      setBoard(normalized);
    } catch (err) {
      console.error("Failed to load board", err);
    }
  }, [projectId]);

  /* ================= LOAD MEMBERS ================= */

  const loadProjectMembers = useCallback(async () => {
    try {
      const res = await api.get(
        `/projects/${projectId}/members`
      );
      setUsers(res.data || []);
    } catch (err) {
      console.error("Failed to load members", err);
    }
  }, [projectId]);

  /* ================= MOVE ISSUE ================= */

  const moveIssue = async (issueId, status) => {
    try {
      await api.patch(
        `/issues/${issueId}/status`,
        null,
        { params: { status } }
      );
      loadBoard();
    } catch (err) {
      console.error("Failed to move issue", err);
    }
  };

  useEffect(() => {
    if (projectId) {
      loadBoard();
      loadProjectMembers();
    }
  }, [projectId, loadBoard, loadProjectMembers]);

  /* ================= FILTERED BOARD ================= */

  const filteredBoard = useMemo(() => {
    const matches = (issue) => {
      if (
        search &&
        !issue.title.toLowerCase().includes(search.toLowerCase())
      )
        return false;

      if (priority !== "ALL" && issue.priority !== priority)
        return false;

      if (
        assignee !== "ALL" &&
        (issue.assignee?.email || "") !== assignee
      )
        return false;

      return true;
    };

    const filtered = {};
    STATUSES.forEach((s) => {
      filtered[s] = board[s].filter(matches);
    });

    return filtered;
  }, [board, search, priority, assignee]);

  /* ================= RENDER ================= */

  return (
    <div style={styles.page}>
      {/* ================= HEADER ================= */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          {/* 🔙 BACK ARROW */}
          <span
            style={styles.backArrow}
            onClick={() => navigate("/dashboard")}
            title="Back to Dashboard"
          >
            ←
          </span>

          <h2 style={styles.title}>Kanban</h2>
        </div>

        <button
          style={styles.createBtn}
          onClick={() => setShowModal(true)}
        >
          + Create Issue
        </button>
      </div>

      {/* ================= FILTER BAR ================= */}
      <div style={styles.filters}>
        <input
          style={styles.search}
          placeholder="Search issues..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          style={styles.select}
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="ALL">All Priorities</option>
          {PRIORITIES.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>

        <select
          style={styles.select}
          value={assignee}
          onChange={(e) => setAssignee(e.target.value)}
        >
          <option value="ALL">All Assignees</option>
          {users.map((u) => (
            <option key={u.email} value={u.email}>
              {u.name}
            </option>
          ))}
        </select>
      </div>

      {/* ================= MAIN ================= */}
      <div style={styles.main}>
        {/* Board */}
        <div style={styles.board}>
          {STATUSES.map((status) => (
            <Column
              key={status}
              status={status}
              issues={filteredBoard[status]}
              onMove={moveIssue}
              users={users}
              onUpdated={loadBoard}
            />
          ))}
        </div>

        {/* Members */}
        <div style={styles.members}>
          <ProjectMembers projectId={projectId} />
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <CreateIssueModal
          projectId={projectId}
          users={users}
          onClose={() => setShowModal(false)}
          onCreated={() => {
            setShowModal(false);
            loadBoard();
          }}
        />
      )}
    </div>
  );
}

/* ===================== STYLES ===================== */

const styles = {
  page: {
    background: "#0f172a",
    minHeight: "100vh",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
  },

  header: {
    padding: "16px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #1e293b",
  },

  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },

  backArrow: {
    fontSize: 18,
    cursor: "pointer",
    color: "#93c5fd",
    padding: "2px 6px",
    borderRadius: 6,
    userSelect: "none",
  },

  title: {
    margin: 0,
    fontSize: 22,
    fontWeight: 600,
  },

  createBtn: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 500,
  },

  filters: {
    display: "flex",
    gap: 12,
    padding: "14px 24px",
    borderBottom: "1px solid #1e293b",
  },

  search: {
    flex: 1,
    background: "#020617",
    border: "1px solid #1e293b",
    borderRadius: 8,
    padding: "8px 12px",
    color: "#fff",
  },

  select: {
    background: "#020617",
    border: "1px solid #1e293b",
    borderRadius: 8,
    padding: "8px 10px",
    color: "#fff",
  },

  main: {
    display: "flex",
    flex: 1,
    overflow: "hidden",
  },

  board: {
    display: "flex",
    gap: 20,
    padding: 24,
    flex: 1,
    overflowX: "auto",
  },

  members: {
    width: 280,
    padding: "24px 24px 24px 0",
    borderLeft: "1px solid #1e293b",
  },
};
