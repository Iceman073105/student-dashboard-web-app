import { useAuth } from "../auth/AuthContext.jsx";
import AssignmentsPanel from "../features/assignments/AssignmentsPanel.jsx";
import NotesPanel from "../features/notes/NotesPanel.jsx";
import SchedulePanel from "../features/schedule/SchedulePanel.jsx";
import { listAssignments } from "../features/assignments/assignmentsStore.js";

export default function Dashboard() {
  const { user } = useAuth();

  // Pull assignments for summary stats
  const assignments = listAssignments(user.id);

  const total = assignments.length;
  const completed = assignments.filter((a) => a.completed).length;
  const active = total - completed;

  // Overdue = not completed + dueDate exists + dueDate before today
  const today = new Date().toISOString().slice(0, 10);
  const overdue = assignments.filter((a) => !a.completed && a.dueDate && a.dueDate < today).length;

  return (
    <div>
      <h2>Dashboard</h2>
      <p style={{ opacity: 0.8 }}>
        Signed in as: <strong>{user.email}</strong>
      </p>

      {/* SUMMARY PANEL */}
      <section style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16, marginTop: 16 }}>
        <h3 style={{ marginTop: 0 }}>Summary</h3>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 12 }}>
            <div style={{ opacity: 0.7 }}>Total</div>
            <div style={{ fontSize: 24, fontWeight: 800 }}>{total}</div>
          </div>

          <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 12 }}>
            <div style={{ opacity: 0.7 }}>Active</div>
            <div style={{ fontSize: 24, fontWeight: 800 }}>{active}</div>
          </div>

          <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 12 }}>
            <div style={{ opacity: 0.7 }}>Completed</div>
            <div style={{ fontSize: 24, fontWeight: 800 }}>{completed}</div>
          </div>

          <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 12 }}>
            <div style={{ opacity: 0.7 }}>Overdue</div>
            <div style={{ fontSize: 24, fontWeight: 800 }}>{overdue}</div>
          </div>
        </div>
      </section>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
          alignItems: "start",
          marginTop: 16,
        }}
      >
        <AssignmentsPanel />
        <NotesPanel />
      </div>

      <SchedulePanel />
    </div>
  );
}