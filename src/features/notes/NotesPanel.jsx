import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext.jsx";
import { listNotes, createNote, updateNote, deleteNote } from "./notesStore.js";

export default function NotesPanel() {
  const { user } = useAuth();

  const [items, setItems] = useState([]);
  const [mode, setMode] = useState("create"); // create | edit
  const [editingId, setEditingId] = useState(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const refresh = () => setItems(listNotes(user.id));

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);

  const resetForm = () => {
    setTitle("");
    setContent("");
    setError("");
    setMode("create");
    setEditingId(null);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) return setError("Title is required.");
    if (!content.trim()) return setError("Content is required.");

    try {
      if (mode === "create") {
        createNote({ userId: user.id, title: title.trim(), content: content.trim() });
      } else {
        updateNote(editingId, { title: title.trim(), content: content.trim() });
      }

      refresh();
      resetForm();
    } catch (err) {
      setError(err?.message ?? "Something went wrong.");
    }
  };

  const onEdit = (note) => {
    setMode("edit");
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setError("");
  };

  const onDelete = (id) => {
    if (!confirm("Delete this note?")) return;
    deleteNote(id);
    refresh();
    if (editingId === id) resetForm();
  };

  return (
    <section style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16, marginTop: 16 }}>
      <h3 style={{ marginTop: 0 }}>Notes</h3>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 10, maxWidth: 520 }}>
        <label>
          Title *
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>

        <label>
          Content *
          <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={4} />
        </label>

        {error && <div style={{ color: "crimson" }}>{error}</div>}

        <div style={{ display: "flex", gap: 10 }}>
          <button type="submit">{mode === "create" ? "Add Note" : "Save Changes"}</button>
          {mode === "edit" && (
            <button type="button" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <hr style={{ margin: "16px 0" }} />

      {items.length === 0 ? (
        <p style={{ opacity: 0.75 }}>No notes yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 10 }}>
          {items.map((n) => (
            <li key={n.id} style={{ border: "1px solid #eee", borderRadius: 12, padding: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{n.title}</div>
                  <div style={{ marginTop: 6, whiteSpace: "pre-wrap" }}>{n.content}</div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "start" }}>
                  <button type="button" onClick={() => onEdit(n)}>
                    Edit
                  </button>
                  <button type="button" onClick={() => onDelete(n.id)}>
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