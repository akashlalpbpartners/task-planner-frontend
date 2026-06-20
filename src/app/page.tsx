"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";

const API_BASE = "http://localhost:8002/api/tasks";

type Priority = "Low" | "Medium" | "High";
type Status = "To Do" | "In Progress" | "Done";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  due_date: string;
}

interface FormState {
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  due_date: string;
}

const emptyForm: FormState = {
  title: "",
  description: "",
  priority: "Medium",
  status: "To Do",
  due_date: new Date().toISOString().slice(0, 10),
};

function toDateInputValue(isoString: string) {
  return isoString.slice(0, 10);
}

function toIsoDate(dateInput: string) {
  return new Date(`${dateInput}T00:00:00.000Z`).toISOString();
}

function formatDisplayDate(isoString: string) {
  return new Date(isoString).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function priorityBadgeClass(priority: Priority) {
  switch (priority) {
    case "Low":
      return "bg-slate-200 text-slate-700 ring-slate-300";
    case "Medium":
      return "bg-blue-100 text-blue-800 ring-blue-200";
    case "High":
      return "bg-red-100 text-red-800 ring-red-200";
  }
}

function statusBadgeClass(status: Status) {
  switch (status) {
    case "To Do":
      return "bg-amber-100 text-amber-800 ring-amber-200";
    case "In Progress":
      return "bg-indigo-100 text-indigo-800 ring-indigo-200";
    case "Done":
      return "bg-emerald-100 text-emerald-800 ring-emerald-200";
  }
}

function PencilIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="m2.695 14.762-1.262 3.154a.5.5 0 0 0 .65.65l3.155-1.262a4 4 0 0 0 1.343-.885L17.5 5.501a2.121 2.121 0 0 0-3-3L3.58 13.42a4 4 0 0 0-.885 1.343Z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setError(null);
    try {
      const response = await fetch(API_BASE);
      if (!response.ok) {
        throw new Error("Failed to load tasks");
      }
      const data: Task[] = await response.json();
      setTasks(data);
    } catch {
      setError("Unable to connect to the backend. Make sure the API is running on port 8002.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const resetForm = () => {
    setForm(emptyForm);
    setIsEditing(false);
    setCurrentTaskId(null);
  };

  const handleEdit = (task: Task) => {
    setForm({
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      due_date: toDateInputValue(task.due_date),
    });
    setIsEditing(true);
    setCurrentTaskId(task.id);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this task?")) {
      return;
    }

    setError(null);
    try {
      const response = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error("Failed to delete task");
      }
      if (currentTaskId === id) {
        resetForm();
      }
      await fetchTasks();
    } catch {
      setError("Failed to delete task. Please try again.");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const payload = {
      title: form.title,
      description: form.description,
      priority: form.priority,
      status: form.status,
      due_date: toIsoDate(form.due_date),
    };

    try {
      const response = await fetch(
        isEditing && currentTaskId ? `${API_BASE}/${currentTaskId}` : API_BASE,
        {
          method: isEditing && currentTaskId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(isEditing ? "Failed to update task" : "Failed to create task");
      }

      resetForm();
      await fetchTasks();
    } catch {
      setError(isEditing ? "Failed to update task. Please try again." : "Failed to create task. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Handler for redirecting to Google
  const handleGoogleRedirect = () => {
    window.location.href = "https://www.google.com";
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-blue-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Productivity
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Task Planner
          </h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Create, update, and track tasks in a clean split-screen dashboard.
          </p>
        </header>

        {error && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <div className="flex flex-col gap-6 lg:flex-row">
          <section className="w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-panel lg:w-1/3">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-slate-900">
                {isEditing ? "Edit Task" : "Create Task"}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {isEditing
                  ? "Update the selected task and save your changes."
                  : "Fill in the details below to add a new task."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  required
                  value={form.title}
                  onChange={(event) => setForm({ ...form, title: event.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  placeholder="Write a clear task title"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  value={form.description}
                  onChange={(event) => setForm({