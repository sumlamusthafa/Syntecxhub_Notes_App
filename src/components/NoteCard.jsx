import { memo } from "react";
import { TAGS } from "../constants";

const TAG_BY_ID = Object.fromEntries(TAGS.map((t) => [t.id, t]));

function formatDate(timestamp) {
  return new Date(timestamp).toLocaleDateString([], {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function NoteCard({ note, onEdit, onPin, onTrash, onRestore, onDeleteForever }) {
  const tag = TAG_BY_ID[note.tag] ?? TAGS[0];

  return (
    <article className={"note" + (note.pinned ? " is-pinned" : "")}>
      <header className="note-head">
        <span className="chip" style={{ "--c": tag.color }}>
          {tag.label}
        </span>

        {!note.trashed && (
          <button
            type="button"
            className={"icon-btn" + (note.pinned ? " is-on" : "")}
            onClick={() => onPin(note.id)}
            aria-pressed={note.pinned}
            aria-label={note.pinned ? "Unpin note" : "Pin note"}
            title={note.pinned ? "Unpin" : "Pin"}
          >
            <svg
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill={note.pinned ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 17v5" />
              <path d="M9 3h6l-1 6 3 3v2H7v-2l3-3z" />
            </svg>
          </button>
        )}
      </header>

      {note.title && <h3 className="note-title">{note.title}</h3>}
      {note.body && <p className="note-text">{note.body}</p>}

      <footer className="note-foot">
        <time dateTime={new Date(note.updatedAt).toISOString()}>
          {formatDate(note.updatedAt)}
        </time>

        <div className="note-actions">
          {note.trashed ? (
            <>
              <button type="button" className="link" onClick={() => onRestore(note.id)}>
                Restore
              </button>
              <button
                type="button"
                className="link danger"
                onClick={() => onDeleteForever(note.id)}
              >
                Delete forever
              </button>
            </>
          ) : (
            <>
              <button type="button" className="link" onClick={() => onEdit(note)}>
                Edit
              </button>
              <button type="button" className="link danger" onClick={() => onTrash(note.id)}>
                Trash
              </button>
            </>
          )}
        </div>
      </footer>
    </article>
  );
}

export default memo(NoteCard);