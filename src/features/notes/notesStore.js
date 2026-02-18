const KEY = "sd_notes_v1";

function loadAll() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? [];
  } catch {
    return [];
  }
}

function saveAll(items) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function listNotes(userId) {
  return loadAll().filter((n) => n.userId === userId);
}

export function createNote({ userId, title, content }) {
  const all = loadAll();

  const item = {
    id: crypto.randomUUID(),
    userId,
    title,
    content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  all.push(item);
  saveAll(all);
  return item;
}

export function updateNote(id, patch) {
  const all = loadAll();
  const idx = all.findIndex((n) => n.id === id);
  if (idx === -1) throw new Error("Note not found");

  all[idx] = { ...all[idx], ...patch, updatedAt: new Date().toISOString() };
  saveAll(all);
  return all[idx];
}

export function deleteNote(id) {
  const all = loadAll();
  saveAll(all.filter((n) => n.id !== id));
}