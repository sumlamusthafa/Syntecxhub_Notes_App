import { useState, useRef, useEffect } from "react";
import "./App.css";

// Read saved notes from localStorage (runs once on first load)
function loadNotes() {
  try {
    const saved = localStorage.getItem("notes");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

// Read saved theme (light or dark)
function loadTheme() {
  try {
    return localStorage.getItem("theme") || "light";
  } catch {
    return "light";
  }
}

// Show the note's created time in a friendly format
function formatDate(timestamp) {
  return new Date(timestamp).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function App() {
  const [notes, setNotes] = useState(loadNotes);
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [query, setQuery] = useState("");        // search text
  const [theme, setTheme] = useState(loadTheme); // light or dark
  const inputRef = useRef(null);

  // Save notes whenever they change
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  // Apply and save the theme whenever it changes
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Focus the input when the page loads
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;

    if (editingId) {
      setNotes(notes.map((n) => (n.id === editingId ? { ...n, text: value } : n)));
      setEditingId(null);
    } else {
      // id is also the created time
      setNotes([{ id: Date.now(), text: value }, ...notes]);
    }
    setText("");
    inputRef.current.focus();
  }

  function startEdit(note) {
    setEditingId(note.id);
    setText(note.text);
    inputRef.current.focus();
  }

  function deleteNote(id) {
    // Ask before deleting
    if (!window.confirm("Delete this note?")) return;

    setNotes(notes.filter((n) => n.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setText("");
    }
  }

  // Notes that match the search box
  const visibleNotes = notes.filter((n) =>
    n.text.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <main className="app">
      <header className="top">
        <h1>My Notes</h1>
        <button
          type="button"
          className="ghost"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? "Dark mode" : "Light mode"}
        </button>
      </header>

      <form onSubmit={handleSubmit} className="note-form">
        <input
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a note..."
        />
        <button type="submit">{editingId ? "Save" : "Add"}</button>
      </form>

      {notes.length > 0 && (
        <div className="toolbar">
          <input
            className="search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notes..."
            aria-label="Search notes"
          />
          <p className="count">
            {visibleNotes.length} of {notes.length}{" "}
            {notes.length === 1 ? "note" : "notes"}
          </p>
        </div>
      )}

      {notes.length === 0 ? (
        <p className="empty">No notes yet. Write your first one above.</p>
      ) : visibleNotes.length === 0 ? (
        <p className="empty">No notes match "{query}".</p>
      ) : (
        <ul className="note-list">
          {visibleNotes.map((note) => (
            <li key={note.id}>
              <div className="note-body">
                <span>{note.text}</span>
                <small className="date">{formatDate(note.id)}</small>
              </div>
              <div className="actions">
                <button onClick={() => startEdit(note)}>Edit</button>
                <button className="danger" onClick={() => deleteNote(note.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}