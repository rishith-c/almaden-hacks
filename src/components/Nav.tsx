/**
 * The top rail. One screen, so there is nothing to navigate: the wordmark on
 * the left and the one action on the right.
 */

import { LINKS } from "@/lib/content";

const JOIN_MAIL = `mailto:${LINKS.email}?subject=${encodeURIComponent("Joining the Hackathon Club")}`;

export default function Nav() {
  return (
    <header className="rail">
      <a href="#top" className="wordmark">
        Hackathon Club<sup>LHS</sup>
      </a>

      <nav className="rail-links" aria-label="Links">
        <a href={JOIN_MAIL}>Join</a>
      </nav>
    </header>
  );
}
