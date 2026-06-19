# task-planner-frontend — Blueprint

> **One-line summary:** A web dashboard where users create, edit, view, and delete tasks via a split-screen interface.

---

## 1. Project Identity

| Field            | Value |
|------------------|-------|
| Repo name        | `task-planner-frontend` |
| Type             | Frontend |
| Primary language | TypeScript |
| Runtime / engine | Node.js (build); browser (runtime) |
| Package manager  | npm |
| Entry point      | `src/app/page.tsx` (route `/`); bootstrapped by Next.js App Router |
| Exposed ports    | `3002` (dev and production start scripts) |
| Current version  | `1.0.0` (from `package.json`) |

---

## 2. Business Purpose  <!-- VECTOR CHUNK: purpose -->

The Task Planner frontend gives people a simple, visual way to manage their to-do list without needing technical knowledge. It solves the problem of scattered task tracking by presenting everything in one dashboard: a form to add or change tasks on the left, and a full list of tasks on the right. Users can set how urgent a task is, track whether it is not started, in progress, or done, and assign due dates. The app is used by anyone who opens the Task Planner website in a browser. The key outcome is immediate, intuitive task management — every button click saves to the backend and refreshes the list without reloading the page.

---

## 3. Tech Stack

| Layer          | Technology | Version | Notes |
|----------------|------------|---------|-------|
| Framework      | Next.js    | ^14.2.28 | App Router, `"use client"` on main page |
| Language       | TypeScript | ^5.8.3 | Strict mode enabled |
| Database       | none       | —       | Data fetched from backend API |
| ORM / Query    | none       | —       | Browser `fetch` API |
| Auth           | none       | —       | <!-- TODO: not found in codebase --> |
| Infra / Deploy | unknown    | —       | <!-- TODO: not found in codebase --> |
| Key libraries  | next, react, react-dom, tailwindcss, autoprefixer, postcss | — | Primary runtime and styling stack |

---

## 4. Repository Structure

```
task-planner-frontend/
├── src/
│   └── app/
│       ├── layout.tsx       # Root HTML shell, fonts, page metadata
│       ├── page.tsx         # Main dashboard: form + task table (entire UI)
│       └── globals.css      # Tailwind directives and base body styles
├── tailwind.config.ts       # Tailwind content paths and theme extensions
├── postcss.config.mjs       # PostCSS plugins (tailwindcss, autoprefixer)
├── next.config.mjs          # Next.js configuration (empty object)
├── tsconfig.json            # TypeScript compiler options
├── next-env.d.ts            # Next.js TypeScript references
├── package.json             # Scripts, dependencies
├── .gitignore               # Ignores .next, node_modules, .env, etc.
├── README.md                # Setup and feature documentation
└── blueprint.md             # Earlier blueprint document
```

---

## 5. Modules  <!-- PRIMARY VECTOR CHUNK SOURCE -->

### 5.1  Root Layout
<!-- VECTOR CHUNK: module:root-layout -->

| Field          | Detail |
|----------------|--------|
| Location       | `src/app/layout.tsx` |
| Type           | Component (Server Component) |
| Depends on     | `next/font/google` (Inter), `./globals.css` |
| Exposes        | Root `<html>` / `<body>` wrapper, site metadata |

**What it does (product view)**

This module sets up the overall look and browser tab information for the Task Planner app. It applies a clean, readable font across every page and ensures the browser shows "Task Planner" as the page title with a helpful description when bookmarked or shared.

**What it does (engineering view)**

Server Component (no `"use client"`). Imports Inter from `next/font/google` with Latin subset and applies `inter.className` to `<body>`. Exports static `metadata` with title and description. Renders `{children}` inside `<html lang="en">`. No navigation bar, footer, or auth providers.

**Key files**

| File | Responsibility |
|------|---------------|
| `src/app/layout.tsx` | Root layout and metadata |
| `src/app/globals.css` | Global Tailwind and body styles |

---

### 5.2  Task Dashboard Page
<!-- VECTOR CHUNK: module:task-dashboard-page -->

| Field          | Detail |
|----------------|--------|
| Location       | `src/app/page.tsx` (`Home` default export) |
| Type           | Page / Client Component |
| Depends on     | Backend API at `http://localhost:8002/api/tasks`, React hooks |
| Exposes        | Route `/` — full Task Planner UI |

**What it does (product view)**

This is the entire Task Planner experience in one screen. It powers the split-screen dashboard where users fill in a form to create or edit tasks and see all their tasks in a table beside it. It handles loading states, error messages when the server is down, and keeps the form and list in sync after every action.

**What it does (engineering view)**

Marked `"use client"`. Manages state: `tasks`, `form`, `isEditing`, `currentTaskId`, `loading`, `submitting`, `error`. On mount, `useEffect` calls `fetchTasks` which GETs from `API_BASE`. Layout: header + error alert + flex row (1/3 form, 2/3 table on `lg`; stacked on mobile). Highlights table row matching `currentTaskId` during edit. Mutations call `fetch` then `fetchTasks()` — no optimistic updates.

**Key files**

| File | Responsibility |
|------|---------------|
| `src/app/page.tsx` | Complete dashboard UI and state machine |

---

### 5.3  Task Form Panel
<!-- VECTOR CHUNK: module:task-form-panel -->

| Field          | Detail |
|----------------|--------|
| Location       | `src/app/page.tsx` (left section, form, handlers) |
| Type           | Component (inline in page) |
| Depends on     | `form` state, `handleSubmit`, `resetForm`, `isEditing` |
| Exposes        | Create and edit UI for tasks |

**What it does (product view)**

This form allows users to add a new task or change an existing one. Users enter a title, optional description, pick priority and status, and choose a due date. When creating, the button says "Create Task"; when editing, it says "Update Task" and shows Cancel to return to create mode.

**What it does (engineering view)**

Controlled inputs bound to `FormState`. Submit builds payload with `toIsoDate(form.due_date)`, POST or PUT based on `isEditing`. On success: `resetForm()` + `fetchTasks()`. Defaults: Medium priority, To Do status, today's date. HTML `required` on title and due_date.

**Key files**

| File | Responsibility |
|------|---------------|
| `src/app/page.tsx` | Form markup, `handleSubmit`, `resetForm`, `handleEdit` |

**API surface / Public interface**

```typescript
POST http://localhost:8002/api/tasks
PUT  http://localhost:8002/api/tasks/:id
Body: { title, description, priority, status, due_date }
```

---

### 5.4  Task List Table
<!-- VECTOR CHUNK: module:task-list-table -->

| Field          | Detail |
|----------------|--------|
| Location       | `src/app/page.tsx` (right section, table, actions) |
| Type           | Component (inline in page) |
| Depends on     | `tasks`, `handleEdit`, `handleDelete`, badge helpers |
| Exposes        | Task list with Edit and Delete actions |

**What it does (product view)**

This table shows every saved task with color-coded priority and status, due dates, and Edit/Delete buttons. When empty, it encourages users to create their first task.

**What it does (engineering view)**

States: loading, empty (dashed border), or table. Edit populates form; Delete uses `window.confirm` then DELETE request. If deleted task was being edited, form resets. Row highlighted when `currentTaskId === task.id`.

**Key files**

| File | Responsibility |
|------|---------------|
| `src/app/page.tsx` | Table, `handleEdit`, `handleDelete` |

---

### 5.5  UI Helpers and Icons
<!-- VECTOR CHUNK: module:ui-helpers -->

| Field          | Detail |
|----------------|--------|
| Location       | `src/app/page.tsx` |
| Type           | Utility / Presentational |
| Exposes        | Date formatters, badge classes, SVG icons |

**What it does (product view)**

Powers visual polish: readable due dates, color-coded priority (gray/blue/red) and status badges, pencil and trash icons for row actions.

**What it does (engineering view)**

`toDateInputValue`, `toIsoDate`, `formatDisplayDate`, `priorityBadgeClass`, `statusBadgeClass`, `PencilIcon`, `TrashIcon` — all defined inline in `page.tsx`.

---

### 5.6  Styling and Build Configuration
<!-- VECTOR CHUNK: module:styling-config -->

| Field          | Detail |
|----------------|--------|
| Location       | `tailwind.config.ts`, `postcss.config.mjs`, `globals.css`, `next.config.mjs` |
| Type           | Configuration |

**What it does (product view)**

Defines the app's visual foundation — spacing, colors, shadows, responsive layout — for a modern dashboard on desktop and mobile.

**What it does (engineering view)**

Tailwind scans `src/app/**`. Theme extends slate colors and `shadow-panel`. PostCSS chains tailwindcss + autoprefixer. Page uses gradient background, rounded panels, `lg:w-1/3` / `lg:w-2/3` split.

---

### 5.7  Type Definitions
<!-- VECTOR CHUNK: module:type-definitions -->

**What it does (product view)**

Ensures every task has consistent fields matching the backend: title, description, priority, status, due date.

**What it does (engineering view)**

```typescript
type Priority = "Low" | "Medium" | "High";
type Status = "To Do" | "In Progress" | "Done";
interface Task { id, title, description, priority, status, due_date }
interface FormState { title, description, priority, status, due_date }
```

Local to `page.tsx`; not exported.

---

## 6. Data Flow  <!-- VECTOR CHUNK: data-flow -->

**Create task**

1. User fills form and clicks Create Task.
2. `handleSubmit` sends POST to `http://localhost:8002/api/tasks`.
3. Backend validates and saves to MySQL.
4. Frontend resets form and GETs all tasks to refresh table.

**Edit task**

1. Edit button loads task into form (`isEditing=true`).
2. Update sends PUT to `/api/tasks/:id`.
3. Form resets; list refetches.

**Delete task**

1. Confirm dialog → DELETE `/api/tasks/:id`.
2. If editing same task, form resets.
3. List refetches.

**Initial load:** mount → GET `/api/tasks` → render table or error.

---

## 7. API Reference  <!-- VECTOR CHUNK: api -->

Frontend consumes backend only; no exposed HTTP routes.

| Method | Path | Used when |
|--------|------|-----------|
| GET | `http://localhost:8002/api/tasks` | Load and refresh list |
| POST | `http://localhost:8002/api/tasks` | Create task |
| PUT | `http://localhost:8002/api/tasks/:id` | Update task |
| DELETE | `http://localhost:8002/api/tasks/:id` | Delete task |

```typescript
const API_BASE = "http://localhost:8002/api/tasks";
```

<!-- TODO: not found in codebase --> No Next.js API routes under `src/app/api/`.

---

## 8. Environment & Configuration  <!-- VECTOR CHUNK: config -->

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| — | — | — | <!-- TODO: not found in codebase --> No env vars in frontend |

| Setting | Value | Location |
|---------|-------|----------|
| Port | `3002` | `package.json` scripts |
| API URL | `http://localhost:8002/api/tasks` | `src/app/page.tsx` |

---

## 9. Setup & Running

**Prerequisites:** Node.js 18+, npm, backend on port 8002.

**Install:** `npm install`

**Development:** `npm run dev` → http://localhost:3002

**Production:** `npm run build && npm run start`

**Tests:** <!-- TODO: not found in codebase --> `npm run lint` available; no test suite.

---

## 10. Integration Points  <!-- VECTOR CHUNK: integrations -->

| System | Direction | Protocol | Auth | Notes |
|--------|-----------|----------|------|-------|
| task-planner-backend | Outbound | HTTP REST / JSON | none | Hardcoded localhost:8002 |
| Google Fonts (Inter) | Outbound | HTTPS | none | via `next/font/google` |

---

## 11. Known Constraints & Decisions  <!-- VECTOR CHUNK: decisions -->

- All UI in single `page.tsx` file; no component split.
- `API_BASE` hardcoded — not env-configurable.
- No auth, routing beyond `/`, or state management library.
- No optimistic UI; refetch after every mutation.
- Delete uses native confirm dialog.
- No pagination, search, or filter UI.
- `package-lock.json` gitignored.

---

## 12. Product Capabilities Summary  <!-- VECTOR CHUNK: product-capabilities -->

This repository powers the following product capabilities:

- **Task dashboard:** Split-screen planner with form and list (side-by-side on desktop, stacked on mobile).
- **Create tasks:** Add tasks with title, description, priority, status, and due date.
- **Edit tasks:** Load any row into the form, update fields, save with "Update Task."
- **Cancel editing:** Return to create mode without saving changes.
- **Delete tasks:** Remove tasks after confirmation; list updates immediately.
- **Priority badges:** Low (gray), Medium (blue), High (red).
- **Status badges:** To Do, In Progress, Done with distinct colors.
- **Due dates:** Human-readable dates in the table.
- **Empty and loading states:** Guidance when loading or when no tasks exist.
- **Connection errors:** Alert if backend on port 8002 is unreachable.

---

## 13. Glossary  <!-- VECTOR CHUNK: glossary -->

| Term | Meaning |
|------|---------|
| Dashboard | Main `/` page with form and table |
| Create mode | Form for new tasks (`isEditing === false`) |
| Edit mode | Form populated from selected task |
| Badge | Colored pill for priority or status |
| API_BASE | Backend URL constant in `page.tsx` |
| Refetch | Re-call GET after mutations to sync UI |

---

## 14. Changelog / Version Notes

<!-- TODO: not found in codebase --> No CHANGELOG or release tags.

| Version | Date | Summary |
|---------|------|---------|
| 1.0.0 | unknown | Initial release |

---

## Vector DB ingestion hint

Split by chunks: `purpose`, `module:*`, `data-flow`, `api`, `integrations`, `product-capabilities`, `glossary`.

Query example: *"How does task editing work?"* → `module:task-form-panel`, `module:task-list-table`, `product-capabilities`.
