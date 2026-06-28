# TaskFlow — Smart To-Do List Application

A fully functional, state-driven task management application built with **vanilla HTML, CSS, and JavaScript**. No frameworks, no libraries — just clean, modular code.

---

## Features

- **Full CRUD Operations** — Create, Read, Update, and Delete tasks
- **Persistent Storage** — All data is automatically saved to `localStorage` and restored on reload
- **Advanced Filtering** — View All, Active, or Completed tasks
- **Priority Levels** — Assign Low, Medium, or High priority to tasks
- **Dark/Light Mode** — Toggle theme with system preference detection
- **Progress Tracking** — Visual stats bar with completion percentage ring
- **Toast Notifications** — Contextual feedback for every action
- **Responsive Design** — Fully responsive from mobile (360px) to desktop
- **Smooth Animations** — Slide-in/out task transitions, modal animations
- **Accessible** — Semantic HTML, ARIA labels, keyboard navigation
- **XSS Protection** — All user input is escaped before rendering

---

## Folder Structure

```
todo-list-app/
│
├── index.html              # Main HTML file
│
├── css/
│   ├── style.css           # Core styles
│   ├── responsive.css      # Media queries & responsive design
│   └── theme.css           # CSS custom properties for theming
│
├── js/
│   ├── app.js              # Entry point — initialization & event binding
│   ├── storage.js          # localStorage abstraction layer
│   ├── ui.js               # DOM manipulation & rendering
│   ├── tasks.js            # CRUD operations & task state management
│   ├── filter.js           # Filter logic (All/Active/Completed)
│   └── theme.js            # Dark/Light mode management
│
├── assets/
│   ├── icons/              # Icon assets (SVGs are inline)
│   └── images/             # Image assets
│
├── favicon.ico             # App favicon
└── README.md               # This file
```

---

## Architecture

The application follows the **Revealing Module Pattern** for clean separation of concerns:

| Module | Responsibility |
|--------|---------------|
| `Storage` | Abstracts `localStorage` read/write operations |
| `Tasks` | Manages in-memory task state + CRUD operations |
| `Filter` | Handles filtering logic (All/Active/Completed) |
| `UI` | All DOM manipulation, rendering, and visual updates |
| `Theme` | Dark/Light mode toggle with persistence |
| `App` | Entry point — initializes modules and binds events |

### Data Flow

```
User Action → App (Event Handler) → Tasks (State Change) → Storage (Persist) → UI (Re-render)
```

---

## Getting Started

1. Clone or download this repository
2. Open `index.html` in any modern browser
3. Start adding tasks!

No build tools, no `npm install`, no server required.

---

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

---

## Key Implementation Details

### localStorage Persistence
All tasks, theme preference, and filter state are saved to `localStorage` automatically on every change. Data survives browser reloads and tab closures.

### Delegated Event Listeners
The task list uses **event delegation** — a single click/change listener on the parent `<ul>` handles all task interactions (toggle, edit, delete) regardless of how many tasks exist.

### XSS Prevention
All user-provided text is escaped via DOM text node creation before being rendered, preventing injection attacks.

### CSS Custom Properties
The theming system uses CSS custom properties (variables) defined on `[data-theme]` attributes, enabling instant theme switching without JavaScript DOM manipulation of individual elements.

---

## License

MIT — Free for personal and commercial use.
