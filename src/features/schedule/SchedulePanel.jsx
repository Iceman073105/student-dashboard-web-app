import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext.jsx";
import { listSchedule, createScheduleItem, deleteScheduleItem } from "./scheduleStore.js";

export default function SchedulePanel() {
  const { user } = useAuth();

  const [items, setItems] = useState([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [error, setError] = useState("");

  const refresh = () => setItems(listSchedule(user.id));

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);

  const onSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) return setError("Title is required.");
    if (!date) return setError("Date is required.");

    createScheduleItem({
      userId: user.id,
      title: title.trim(),
      date,
      time,
    });

    setTitle("");
    setDate("");
    setTime("");
    refresh();
  };

  const onDelete = (id) => {
    if (!confirm("Delete this schedule item?")) return;
    deleteScheduleItem(id);
    refresh();
  };

  return (
    <section style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16, marginTop: 16 }}>
      <h3 style={{ marginTop: 0 }}>Schedule</h3>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 10, maxWidth: 520 }}>
        <label>
          Title *
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Study group" />
        </label>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <label style={{ maxWidth: 220 }}>
            Date *
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>

          <label style={{ maxWidth: 220 }}>
            Time
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </label>
        </div>

        {error && <div style={{ color: "crimson" }}>{error}</div>}

        <button type="submit">Add to schedule</button>
      </form>

      <hr style={{ margin: "16px 0" }} />

      {items.length === 0 ? (
        <p style={{ opacity: 0.75 }}>No schedule items yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 10 }}>
          {items.map((s) => (
            <li key={s.id} style={{ border: "1px solid #eee", borderRadius: 12, padding: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{s.title}</div>
                  <div style={{ opacity: 0.75 }}>
                    {s.date} {s.time ? `• ${s.time}` : ""}
                  </div>
                </div>
                <button type="button" onClick={() => onDelete(s.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}