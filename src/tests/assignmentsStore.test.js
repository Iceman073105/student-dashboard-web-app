const storage = {};

global.localStorage = {
  getItem: (key) => storage[key] ?? null,
  setItem: (key, value) => {
    storage[key] = value;
  },
  removeItem: (key) => {
    delete storage[key];
  },
  clear: () => {
    for (const key in storage) delete storage[key];
  },
};

import { beforeEach, describe, it, expect } from "vitest";
import {
  createAssignment,
  toggleAssignmentCompleted,
} from "../features/assignments/assignmentsStore.js";

beforeEach(() => {
  localStorage.clear();
});

describe("Assignments Store", () => {
  it("should create an assignment object", () => {
    const assignment = createAssignment({
      userId: "123",
      title: "Test Assignment",
      description: "Testing creation",
      dueDate: "2026-03-20",
    });

    expect(assignment.title).toBe("Test Assignment");
  });

  it("should toggle assignment completed status", () => {
    const assignment = createAssignment({
      userId: "123",
      title: "Toggle Test",
      description: "Testing toggle",
      dueDate: "2026-03-20",
    });

    const updatedAssignment = toggleAssignmentCompleted(assignment.id);

    expect(updatedAssignment.completed).toBe(true);
  });
});