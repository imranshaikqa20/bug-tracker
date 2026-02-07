import IssueCard from "./IssueCard";

export default function Column({
  status,
  issues = [],
  onMove,
  users = [],
  onUpdated,
}) {
  const allowDrop = (e) => e.preventDefault();

  const onDrop = (e) => {
    e.preventDefault();
    const issueId = e.dataTransfer.getData("issueId");
    if (issueId) {
      onMove(issueId, status);
    }
  };

  console.log(`Column ${status}`, issues);

  return (
    <div
      onDragOver={allowDrop}
      onDrop={onDrop}
      style={styles.column}
    >
      <h3 style={styles.title}>
        {status.replace("_", " ")}
      </h3>

      {issues.length === 0 && (
        <p style={styles.empty}>No issues</p>
      )}

      {issues.map((issue) => {
        const realId = issue.id ?? issue.issueId; // 🔥 FIX

        if (!realId) return null; // safety

        return (
          <IssueCard
            key={realId}
            issue={issue}
            users={users}
            onUpdated={onUpdated}
          />
        );
      })}
    </div>
  );
}

const styles = {
  column: {
    width: 280,
    minHeight: 420,
    padding: 14,
    borderRadius: 12,
    background: "#020617",
    border: "1px solid #1e293b",
    display: "flex",
    flexDirection: "column",
  },
  title: {
    textAlign: "center",
    marginBottom: 12,
    fontSize: 16,
    fontWeight: 600,
  },
  empty: {
    textAlign: "center",
    opacity: 0.6,
    marginTop: 20,
  },
};
