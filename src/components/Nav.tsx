"use client";
import { useState } from "react";
import EventActions from "./EventActions";
export default function Nav() {
  const [open, setOpen] = useState(false);
  return <header className="nav"><a href="#top" className="brand" aria-label="Almaden Hacks home"><span className="brand-mark" aria-hidden="true">a<span>h</span></span><span>Almaden Hacks</span></a><button className="menu-button" aria-expanded={open} aria-controls="site-navigation" onClick={() => setOpen(!open)}>{open ? "Close" : "Menu"}</button><nav id="site-navigation" className={open ? "nav-links is-open" : "nav-links"} aria-label="Main navigation">{[["The experience", "about"], ["The day", "schedule"], ["Sponsors", "sponsors"], ["FAQ", "faq"]].map(([label, id]) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>{label}</a>)}<EventActions className="nav-join" /></nav></header>;
}
