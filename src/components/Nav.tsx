"use client";
import { useState } from "react";
import EventActions from "./EventActions";
export default function Nav() {
  const [open, setOpen] = useState(false);
  return <header className="nav"><a href="#top" className="brand" aria-label="Almaden Hacks home"><svg className="brand-mark" viewBox="0 0 48 48" aria-hidden="true"><rect x="1" y="1" width="46" height="46" rx="10" fill="#e1e8f0"/><path d="m7 35 10-23 10 23M11 27h12m7-14v22m10-22v22M30 24h10" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"/></svg><span>Almaden Hacks</span></a><button className="menu-button" aria-expanded={open} aria-controls="site-navigation" onClick={() => setOpen(!open)}>{open ? "Close" : "Menu"}</button><nav id="site-navigation" className={open ? "nav-links is-open" : "nav-links"} aria-label="Main navigation">{[["The experience", "about"], ["The day", "schedule"], ["Sponsors", "sponsors"], ["FAQ", "faq"]].map(([label, id]) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>{label}</a>)}<EventActions className="nav-join" /></nav></header>;
}
