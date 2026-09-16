"use client";

import { useEffect, useState } from "react";

/**
 * The top rail. Links sit in the same column grid as the page, so the
 * vertical rules run straight through the nav and down the rest of the site.
 * Collapses to a single control on narrow screens.
 */

const LINKS = [
  { id: "what", label: "Hackathons" },
  { id: "plan", label: "The plan" },
  { id: "learn", label: "What we teach" },
  { id: "almaden", label: "Almaden Hacks" },
  { id: "join", label: "Join" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={`rail${open ? " is-open" : ""}`}>
      <a href="#top" className="wordmark">
        Hackathon Club<sup>LHS</sup>
      </a>

      <nav className="rail-links" aria-label="Sections">
        {LINKS.map((l) => (
          <a key={l.id} href={`#${l.id}`} onClick={() => setOpen(false)}>
            {l.label}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="burger"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span aria-hidden />
        <span aria-hidden />
      </button>
    </header>
  );
}
