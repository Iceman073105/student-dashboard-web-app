import { useAuth } from "../auth/AuthContext.jsx";
import AssignmentsPanel from "../features/assignments/AssignmentsPanel.jsx";
import NotesPanel from "../features/notes/NotesPanel.jsx";
import SchedulePanel from "../features/schedule/SchedulePanel.jsx";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div>
      <h2>Dashboard</h2>
      <p style={{ opacity: 0.8 }}>
        Signed in as: <strong>{user.email}</strong>
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
          alignItems: "start",
        }}
      >
        <AssignmentsPanel />
        <NotesPanel />
      </div>

      <SchedulePanel />
    </div>
  );
}


