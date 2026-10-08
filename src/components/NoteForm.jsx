import { useState, useRef, useEffect } from "react";
import { TAGS, DEFAULT_TAG } from "../constants";

// The parent gives this form a `key`, so it resets itself
// whenever you start editing a different note.
export default function NoteForm({ editing, onSave, onCancel }) {
  const [title, setTitle] = useState(editing?.title ?? "");
  const [body, setBody] = useState(editing?.body ?? "");
  const [tag, setTag] = useState(editing?.tag ?? DEFAULT_TAG);
  const titleRef = useRef(null); // used to focus the title field

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  const isEmpty = !title.trim() && !body.trim();

  function submit() {
    if (isEmpty) return;
    onSave({ id: editing?.id, title: title.trim(), body: body.trim(), tag });
    if (!editing) {
      setTitle("");
      setBody("");
      setTag(DEFAULT_TAG);
      titleRef.current?.focus();
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    submit();
  }

  function handleKeyDown(e) {
    // Ctrl + Enter saves from the text area
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) submit();
  }

  return (
    <form className="composer" onSubmit={handleSubmit}>
      <input
        ref={titleRef}
        className="composer-title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        aria-label="Note title"
      />
      <textarea
        className="composer-body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Write your note..."
        aria-label="Note text"
        rows={3}
      />

      <div className="composer-foot">
        <div className="tag-picker" role="group" aria-label="Choose a tag">
          {TAGS.map((t) => (
            <button
              key={t.id}
              type="button"
              className="tag-pick"
              aria-pressed={tag === t.id}
              onClick={() => setTag(t.id)}
            >
              <span className="dot" style={{ "--c": t.color }} />
              {t.label}
            </button>
          ))}
        </div>

        <div className="composer-actions">
          {editing && (
            <button type="button" className="btn btn-ghost" onClick={onCancel}>
              Cancel
            </button>
          )}
          <button type="submit" className="btn btn-primary" disabled={isEmpty}>
            {editing ? "Save changes" : "Add note"}
          </button>
        </div>
      </div>
    </form>
  );
}