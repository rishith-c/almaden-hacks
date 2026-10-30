"use client";
import { useId, useRef } from "react";
import { EVENT_LINKS } from "@/lib/event";

export default function EventActions({ kind = "register", className = "button" }: { kind?: "register" | "discord"; className?: string }) {
  const titleId = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const discord = kind === "discord";
  const href = discord ? EVENT_LINKS.discord : EVENT_LINKS.registration;
  if (href) return <a className={className} href={href} target="_blank" rel="noreferrer">{discord ? "Join our Discord" : "Join the charge"}<span aria-hidden="true">↗</span></a>;
  return <>
    <button className={className} onClick={() => dialog.current?.showModal()}>{discord ? "Join our Discord" : "Join the charge"}<span aria-hidden="true">↗</span></button>
    <dialog aria-labelledby={titleId} ref={dialog} className="event-dialog" onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
      <form method="dialog"><button className="dialog-close" aria-label="Close dialog">×</button></form>
      <p className="small-label">You’re early. We like that.</p>
      <h2 id={titleId}>{discord ? "Your future team is out there." : "Something good is coming to Almaden."}</h2>
      <p>{discord ? "Our Discord is getting ready. The invite will be posted here when the community opens." : "We’re planning Almaden Hacks for May–June. The exact date, venue, and registration link will be announced here."}</p>
      <p className="dialog-note">No signup is open yet. Check back for the announcement.</p>
      <form method="dialog"><button className="button">Got it <span aria-hidden="true">↗</span></button></form>
    </dialog>
  </>;
}
