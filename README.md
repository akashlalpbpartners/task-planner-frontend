# Task Planner — Frontend

A responsive split-screen dashboard for creating, editing, and managing tasks. Built with Next.js and Tailwind CSS, connected to the Task Planner REST API.

## Tech Stack

- **Next.js 14** (App Router)
- **React 18** + **TypeScript**
- **Tailwind CSS** for styling
- **Fetch API** for backend communication

## Features

- **Split-screen layout** — form panel (1/3) and task list (2/3)
- **Create & edit** — unified form with Create / Update modes and Cancel
- **Task table** — title, description, priority, status, due date, and actions
- **Priority badges** — Low (gray), Medium (blue), High (red)
- **Status badges** — To Do, In Progress, Done
- **Instant updates** — list refreshes after every create, update, or delete
- **Responsive design** — stacks vertically on smaller screens

## Project Structure

```
task-planner-frontend/
├── src/
│   └── app/
│       ├── layout.tsx      # Root layout and metadata
│       ├── page.tsx        # Main dashboard (form + task table)
│       └── globals.css     # Tailwind base styles
├── tailwind.config.ts
├── next.config.mjs
├── postcss.config.mjs
├── tsconfig.json
├── package.json
└── .gitignore
```

## Prerequisites

- Node.js 18+
- [task-planner-backend](../task-planner-backend) running on port **8002** with MySQL configured

## Installation & Running

```bash
npm install
npm run dev
```

Open **http://localhost:3002** in your browser.

### Other Scripts

| Command         | Description                    |
|-----------------|--------------------------------|
| `npm run dev`   | Start development server (3002)|
| `npm run build` | Production build               |
| `npm run start` | Start production server (3002) |
| `npm run lint`  | Run Next.js linter             |

## Backend Connection

The frontend calls the API at:

```
http://localhost:8002/api/tasks
```

This URL is defined in `src/app/page.tsx`. If your backend runs on a different host or port, update the `API_BASE` constant there.

The backend must have CORS enabled for `http://localhost:3002` (configured via `CORS_ORIGIN` in the backend `.env`).

## Task Data Model

Each task follows this shape (shared with the backend):

| Field         | Type                                              |
|---------------|---------------------------------------------------|
| `id`          | string (UUID)                                     |
| `title`       | string                                            |
| `description` | string                                            |
| `priority`    | `"Low"` \| `"Medium"` \| `"High"`                 |
| `status`      | `"To Do"` \| `"In Progress"` \| `"Done"`          |
| `due_date`    | ISO 8601 date string                              |

## UI Overview

### Left Panel — Task Form

- Fields: Title, Description, Priority, Status, Due Date
- **Create mode** (default): submit button reads "Create Task"
- **Edit mode**: clicking Edit on a row populates the form; button reads "Update Task"; Cancel resets to create mode

### Right Panel — Task List

- Table of all tasks from the API
- **Edit** — loads task into the form
- **Delete** — removes task after confirmation, then refreshes the list

## Full Stack Setup

Run both services in separate terminals:

```bash
# Terminal 1 — Backend
cd ../task-planner-backend
npm install
npm start

# Terminal 2 — Frontend
cd task-planner-frontend
npm install
npm run dev
```

1. Backend: http://localhost:8002  
2. Frontend: http://localhost:3002

## Production Build

```bash
npm run build
npm run start
```

For production, point `API_BASE` in `page.tsx` to your deployed backend URL.
