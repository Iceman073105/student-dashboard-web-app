const KEY = "sd_schedule_v1";

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

export function listSchedule(userId) {
  return loadAll()
    .filter((s) => s.userId === userId)
    .sort((a, b) => (a.date || "").localeCompare(b.date || ""));
}

export function createScheduleItem({ userId, title, date, time }) {
  const all = loadAll();

  const item = {
    id: crypto.randomUUID(),
    userId,
    title,
    date,
    time,
    createdAt: new Date().toISOString(),
  };

  all.push(item);
  saveAll(all);
  return item;
}

export function deleteScheduleItem(id) {
  const all = loadAll();
  saveAll(all.filter((s) => s.id !== id));
}