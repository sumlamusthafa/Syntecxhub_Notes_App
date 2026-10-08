import { useState, useEffect, useMemo, useCallback } from "react";
import { TAGS, DEFAULT_TAG } from "./constants";
import Sidebar from "./components/Sidebar";
import NoteForm from "./components/NoteForm";
import NoteCard from "./components/NoteCard";
import "./App.css";

// Makes old notes (from the first version) work with the new format
function normalize(n) {
  return {
    id: n.id,
    title: n.title ?? "",
    body: n.body ?? n.text ?? "",
    tag: n.tag ?? DEFAULT_TAG,
    pinned: Boolean(n.pinned),
    trashed: Boolean(n.trashed),
    createdAt: n.createdAt ?? n.id,
    updatedAt: n.updatedAt ?? n.createdAt ?? n.id,
  };
}

function loadNotes() {
  try {
    const raw = localStorage.getItem("notes-v2") ?? localStorage.getItem("notes");
    return raw ? JSON.parse(raw).map(normalize) : [];
  } catch {
    return [];
  }
}

function loadTheme() {
  try {
    return localStorage.getItem("theme") || "light";
  } catch {
    return "light";
  }
}

const VIEW_TITLES = { all: "All notes", pinned: "Pinned", trash: "Trash" };

export default function App() {
  const [notes, setNotes] = useState(loadNotes);
  const [theme, setTheme] = useState(loadTheme);
  const [view, setView] = useState("all"); // all | pinned | trash
  const [tagFilter, setTagFilter] = useState(null);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState(null);

  // Save notes whenever they change
  useEffect(() => {
    localStorage.setItem("notes-v2", JSON.stringify(notes));
  }, [notes]);

  // Apply and save the theme
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  // ---- Handlers (useCallback keeps them stable, so memo cards don't re-render) ----
  const saveNote = useCallback((data) => {
    const now = Date.now();
    setNotes((prev) =>
      data.id
        ? prev.map((n) =>
            n.id === data.id
              ? { ...n, title: data.title, body: data.body, tag: data.tag, updatedAt: now }
              : n
          )
        : [
            {
              id: now,
              title: data.title,
              body: data.body,
              tag: data.tag,
              pinned: false,
              trashed: false,
              createdAt: now,
              updatedAt: now,
            },
            ...prev,
          ]
    );
    setEditing(null);
  }, []);

  const togglePin = useCallback((id) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n)));
  }, []);

  const moveToTrash = useCallback((id) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, trashed: true, pinned: false } : n))
    );
    setEditing((cur) => (cur?.id === id ? null : cur));
  }, []);

  const restoreNote = useCallback((id) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, trashed: false } : n)));
  }, []);

  const deleteForever = useCallback((id) => {
    if (!window.confirm("Delete this note forever? This can't be undone.")) return;
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const emptyTrash = useCallback(() => {
    if (!window.confirm("Delete everything in Trash forever?")) return;
    setNotes((prev) => prev.filter((n) => !n.trashed));
  }, []);

  const startEdit = useCallback((note) => {
    setEditing(note);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const cancelEdit = useCallback(() => setEditing(null), []);

  const selectView = useCallback((v) => {
    setView(v);
    setTagFilter(null);
    setEditing(null);
  }, []);

  const selectTag = useCallback((id) => {
    setTagFilter((cur) => (cur === id ? null : id));
    setView((v) => (v === "trash" ? "all" : v));
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  }, []);

  // ---- Derived data (useMemo: only recalculated when its inputs change) ----
  const counts = useMemo(() => {
    const active = notes.filter((n) => !n.trashed);
    return {
      all: active.length,
      pinned: active.filter((n) => n.pinned).length,
      trash: notes.length - active.length,
      byTag: Object.fromEntries(
        TAGS.map((t) => [t.id, active.filter((n) => n.tag === t.id).length])
      ),
    };
  }, [notes]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return notes
      .filter((n) => (view === "trash" ? n.trashed : !n.trashed))
      .filter((n) => view !== "pinned" || n.pinned)
      .filter((n) => !tagFilter || n.tag === tagFilter)
      .filter(
        (n) => !q || n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q)
      )
      .sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.updatedAt - a.updatedAt);
  }, [notes, view, tagFilter, query]);

  const activeTag = TAGS.find((t) => t.id === tagFilter);
  const heading = activeTag ? activeTag.label : VIEW_TITLES[view];

  let emptyText = "No notes yet. Add your first note above.";
  if (query.trim()) emptyText = `No notes match "${query.trim()}".`;
  else if (view === "trash") emptyText = "Trash is empty.";
  else if (view === "pinned") emptyText = "No pinned notes. Pin a note to keep it at the top.";
  else if (tagFilter) emptyText = `No notes tagged ${activeTag.label} yet.`;

  return (
    <div className="shell">
      <Sidebar
        view={view}
        onSelectView={selectView}
        tagFilter={tagFilter}
        onSelectTag={selectTag}
        counts={counts}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main className="main">
        <header className="main-head">
          <div>
            <h1>{heading}</h1>
            <p className="sub">
              {visible.length} {visible.length === 1 ? "note" : "notes"}
            </p>
          </div>

          <div className="head-actions">
            {view === "trash" && counts.trash > 0 && (
              <button type="button" className="btn btn-ghost danger" onClick={emptyTrash}>
                Empty trash
              </button>
            )}
            <input
              className="search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search notes"
              aria-label="Search notes"
            />
          </div>
        </header>

        {view !== "trash" && (
          <NoteForm
            key={editing ? editing.id : "new"}
            editing={editing}
            onSave={saveNote}
            onCancel={cancelEdit}
          />
        )}

        {visible.length === 0 ? (
          <p className="empty">{emptyText}</p>
        ) : (
          <section className="grid" aria-label="Notes">
            {visible.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={startEdit}
                onPin={togglePin}
                onTrash={moveToTrash}
                onRestore={restoreNote}
                onDeleteForever={deleteForever}
              />
            ))}
          </section>
        )}
      </main>
    </div>
  );
}