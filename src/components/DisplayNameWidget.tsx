"use client";

import { useEffect, useState } from "react";

export const DISPLAY_NAME_KEY = "roastpilot.displayName";

export function getDisplayName(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(DISPLAY_NAME_KEY);
}

export function setDisplayName(name: string) {
  window.localStorage.setItem(DISPLAY_NAME_KEY, name);
  window.dispatchEvent(new Event("roastpilot:name-changed"));
}

export function DisplayNameWidget() {
  const [name, setName] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    setName(getDisplayName());
    const onChange = () => setName(getDisplayName());
    window.addEventListener("roastpilot:name-changed", onChange);
    return () => window.removeEventListener("roastpilot:name-changed", onChange);
  }, []);

  function save() {
    const cleaned = draft.trim().slice(0, 32);
    if (!cleaned) return;
    setDisplayName(cleaned);
    setName(cleaned);
    setEditing(false);
    setDraft("");
  }

  if (editing) {
    return (
      <div className="flex items-center gap-2">
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") save();
            if (e.key === "Escape") setEditing(false);
          }}
          placeholder="pick a handle"
          className="text-sm px-3 py-1.5 rounded-full border border-rule bg-paper focus:outline-none focus:border-accent"
        />
        <button
          onClick={save}
          className="text-sm font-medium px-3 py-1.5 rounded-full bg-accent text-paper hover:bg-accent-strong"
        >
          Save
        </button>
      </div>
    );
  }

  if (!name) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="text-sm font-medium px-3 py-1.5 rounded-full border border-rule text-ink hover:border-accent hover:text-accent"
      >
        Pick a handle
      </button>
    );
  }

  return (
    <button
      onClick={() => {
        setDraft(name);
        setEditing(true);
      }}
      className="text-sm px-3 py-1.5 rounded-full border border-rule text-ink-soft hover:border-accent hover:text-accent"
      title="Click to change"
    >
      <span className="text-ink-soft">u/</span>
      <span className="font-medium text-ink">{name}</span>
    </button>
  );
}
