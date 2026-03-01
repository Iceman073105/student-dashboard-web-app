import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext.jsx";
import {
  listAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  toggleAssignmentCompleted,
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

  // NEW: filter state
  const [filter, setFilter] = useState("all"); // all | active | completed

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

  // NEW: filtered view
  const filteredItems = items.filter((a) => {
    if (filter === "active") return !a.completed;
    if (filter === "completed") return a.completed;
    return true; // all
  });

  return (
    <section style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16, marginTop: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
        <h3 style={{ marginTop: 0, marginBottom: 0 }}>Assignments</h3>

        {/* NEW: filter buttons */}
        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="button"
            onClick={() => setFilter("all")}
            style={{
              border: "1px solid #444",
              borderRadius: 10,
              padding: "6px 10px",
              opacity: filter === "all" ? 1 : 0.7,
              fontWeight: filter === "all" ? 700 : 500,
            }}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setFilter("active")}
            style={{
              border: "1px solid #444",
              borderRadius: 10,
              padding: "6px 10px",
              opacity: filter === "active" ? 1 : 0.7,
              fontWeight: filter === "active" ? 700 : 500,
            }}
          >
            Active
          </button>
          <button
            type="button"
            onClick={() => setFilter("completed")}
            style={{
              border: "1px solid #444",
              borderRadius: 10,
              padding: "6px 10px",
              opacity: filter === "completed" ? 1 : 0.7,
              fontWeight: filter === "completed" ? 700 : 500,
            }}
          >
            Completed
          </button>
        </div>
      </div>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 10, maxWidth: 520, marginTop: 12 }}>
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

      {filteredItems.length === 0 ? (
        <p style={{ opacity: 0.75 }}>
          {filter === "all"
            ? "No assignments yet."
            : filter === "active"
              ? "No active assignments."
              : "No completed assignments."}
        </p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 10 }}>
          {filteredItems.map((a) => (
            <li key={a.id} style={{ border: "1px solid #eee", borderRadius: 12, padding: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <input
                      type="checkbox"
                      checked={a.completed}
                      onChange={() => {
                        toggleAssignmentCompleted(a.id);
                        refresh();
                      }}
                      style={{ marginRight: 8 }}
                    />
                    <div
                      style={{
                        fontWeight: 700,
                        textDecoration: a.completed ? "line-through" : "none",
                        opacity: a.completed ? 0.75 : 1,
                      }}
                    >
                      {a.title}
                    </div>
                  </div>

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