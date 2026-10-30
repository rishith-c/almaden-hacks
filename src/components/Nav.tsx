"use client";
import { useEffect, useState } from "react";
import EventActions from "./EventActions";
export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(scrollY > 40);
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);
  return <header className={scrolled ? "nav is-scrolled" : "nav"}><a href="#top" className="brand" aria-label="Almaden Hacks home"><span className="brand-wordmark">Almaden Hacks</span></a><button className="menu-button" aria-expanded={open} aria-controls="site-navigation" onClick={() => setOpen(!open)}>{open ? "Close" : "Menu"}</button><nav id="site-navigation" className={open ? "nav-links is-open" : "nav-links"} aria-label="Main navigation">{[["The experience", "about"], ["The day", "schedule"], ["Sponsors", "sponsors"], ["FAQ", "faq"]].map(([label, id]) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>{label}</a>)}<EventActions className="nav-join" /></nav></header>;
}
