import { TAGS } from "../constants";

const VIEWS = [
  { id: "all", label: "All notes" },
  { id: "pinned", label: "Pinned" },
  { id: "trash", label: "Trash" },
];

export default function Sidebar({
  view,
  onSelectView,
  tagFilter,
  onSelectTag,
  counts,
  theme,
  onToggleTheme,
}) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark" aria-hidden="true">N</span>
        <span>Notes</span>
      </div>

      <nav className="side-group" aria-label="Views">
        {VIEWS.map((v) => (
          <button
            key={v.id}
            type="button"
            className={"side-item" + (view === v.id ? " is-active" : "")}
            onClick={() => onSelectView(v.id)}
            aria-current={view === v.id ? "page" : undefined}
          >
            <span>{v.label}</span>
            <span className="badge">{counts[v.id]}</span>
          </button>
        ))}
      </nav>

      <nav className="side-group" aria-label="Tags">
        <p className="side-title">Tags</p>
        {TAGS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={"side-item" + (tagFilter === t.id ? " is-active" : "")}
            onClick={() => onSelectTag(t.id)}
            aria-pressed={tagFilter === t.id}
          >
            <span className="tag-label">
              <span className="dot" style={{ "--c": t.color }} />
              {t.label}
            </span>
            <span className="badge">{counts.byTag[t.id]}</span>
          </button>
        ))}
      </nav>

      <button type="button" className="btn btn-ghost theme-btn" onClick={onToggleTheme}>
        {theme === "light" ? "Dark mode" : "Light mode"}
      </button>
    </aside>
  );
}