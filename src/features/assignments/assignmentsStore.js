const KEY = "sd_assignments_v1";

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

export function listAssignments(userId) {
  return loadAll()
    .filter((a) => a.userId === userId)
    .sort((a, b) => (a.dueDate || "").localeCompare(b.dueDate || ""));
}

export function createAssignment({ userId, title, description, dueDate }) {
  if (!title || title.trim() === "") {
    throw new Error("Assignment title is required.");
  }

  const all = loadAll();
  const item = {
    id: crypto.randomUUID(),
    userId,
    title: title.trim(),
    description: description || "",
    dueDate: dueDate || "",
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  all.push(item);
  saveAll(all);
  return item;
}

export function updateAssignment(id, patch) {
  const all = loadAll();
  const idx = all.findIndex((a) => a.id === id);

  if (idx === -1) throw new Error("Assignment not found");

  if (patch.title !== undefined && patch.title.trim() === "") {
    throw new Error("Assignment title is required.");
  }

  all[idx] = {
    ...all[idx],
    ...patch,
    title: patch.title !== undefined ? patch.title.trim() : all[idx].title,
    updatedAt: new Date().toISOString(),
  };

  saveAll(all);
  return all[idx];
}

export function deleteAssignment(id) {
  const all = loadAll();
  const next = all.filter((a) => a.id !== id);
  saveAll(next);
}

export function toggleAssignmentCompleted(id) {
  const all = loadAll();
  const idx = all.findIndex((a) => a.id === id);

  if (idx === -1) throw new Error("Assignment not found");

  all[idx] = {
    ...all[idx],
    completed: !all[idx].completed,
    updatedAt: new Date().toISOString(),
  };

  saveAll(all);
  return all[idx];
}