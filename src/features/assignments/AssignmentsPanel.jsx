import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext.jsx";
import {
  listAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
} from "./assignmentsStore.js";

export default function AssignmentsPanel() {
  const { user } = useAuth();

  const [items, setItems] = useState([]);
  const [mode, setMode] = useState("create"); // create | edit
  const [editingId, setEditingId] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");

  const refresh = () => setItems(listAssignments(user.id));

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDueDate("");
    setError("");
    setMode("create");
    setEditingId(null);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    try {
      if (mode === "create") {
        createAssignment({
          userId: user.id,
          title: title.trim(),
          description,
          dueDate,
        });
      } else {
        updateAssignment(editingId, {
          title: title.trim(),
          description,
          dueDate,
        });
      }

      refresh();
      resetForm();
    } catch (err) {
      setError(err?.message ?? "Something went wrong.");
    }
  };

  const onEdit = (item) => {
    setMode("edit");
    setEditingId(item.id);
    setTitle(item.title);
    setDescription(item.description);
    setDueDate(item.dueDate);
    setError("");
  };

  const onDelete = (id) => {
    if (!confirm("Delete this assignment?")) return;
    deleteAssignment(id);
    refresh();
    if (editingId === id) resetForm();
  };

  return (
    <section style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16, marginTop: 16 }}>
      <h3 style={{ marginTop: 0 }}>Assignments</h3>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 10, maxWidth: 520 }}>
        <label>
          Title *
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>

        <label>
          Description
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
        </label>

        <label style={{ maxWidth: 220 }}>
          Due Date
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </label>

        {error && <div style={{ color: "crimson" }}>{error}</div>}

        <div style={{ display: "flex", gap: 10 }}>
          <button type="submit">{mode === "create" ? "Add Assignment" : "Save Changes"}</button>
          {mode === "edit" && (
            <button type="button" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <hr style={{ margin: "16px 0" }} />

      {items.length === 0 ? (
        <p style={{ opacity: 0.75 }}>No assignments yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 10 }}>
          {items.map((a) => (
            <li key={a.id} style={{ border: "1px solid #eee", borderRadius: 12, padding: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{a.title}</div>
                  {a.dueDate && <div style={{ opacity: 0.75 }}>Due: {a.dueDate}</div>}
                  {a.description && <div style={{ marginTop: 6 }}>{a.description}</div>}
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "start" }}>
                  <button type="button" onClick={() => onEdit(a)}>
                    Edit
                  </button>
                  <button type="button" onClick={() => onDelete(a.id)}>
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}