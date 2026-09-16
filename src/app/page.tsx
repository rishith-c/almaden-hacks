import Nav from "@/components/Nav";
import Reveal from "@/components/Reveal";
import Clock from "@/components/Clock";
import {
  INTRO,
  WHAT,
  HOW,
  PLAN,
  LESSONS,
  GIVE,
  DONATED,
  ALMADEN,
  ALMADEN_FACTS,
  RECORD_NOTE,
  RECORD,
  JOIN,
  LINKS,
  CLUB,
} from "@/lib/content";

/** Arrow used on every outbound link. */
function Out() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}

function Lines() {
  return (
    <div className="grid-lines" aria-hidden>
      <i />
      <i />
      <i />
    </div>
  );
}

const JOIN_MAIL = `mailto:${LINKS.email}?subject=${encodeURIComponent("Joining the Hackathon Club")}`;
const SPONSOR_MAIL = `mailto:${LINKS.email}?subject=${encodeURIComponent("Sponsoring Almaden Hacks")}`;

export default function HomePage() {
  const thisYear = new Date().getFullYear();
  const donated = DONATED.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  return (
    <>
      <Reveal />
      <Nav />

      <main id="top">
        {/* ── Cold open ──────────────────────────────────────────── */}
        <section className="void">
          <div className="void-glow" aria-hidden />

          <div className="wrap void-in">
            <div>
              <h1 className="mega" data-reveal="lines">
                <span className="mega-line">
                  <span>Learn to win</span>
                </span>
                <span className="mega-line">
                  <span className="serif">hackathons.</span>
                </span>
              </h1>

              <p className="hero-line">{INTRO}</p>

              <div className="hero-cta">
                <a className="slab" href={JOIN_MAIL}>
                  <span>Join the club</span>
                  <i aria-hidden>
                    <Out />
                  </i>
                </a>
                <a className="slab slab--ghost" href="#almaden">
                  <span>Almaden Hacks</span>
                </a>
              </div>
            </div>

            <Clock />
          </div>

          <p className="hero-scroll" aria-hidden>
            Scroll
          </p>
        </section>

        {/* ── What a hackathon is ────────────────────────────────── */}
        <section id="what" className="band">
          <Lines />
          <div className="wrap">
            <p className="eyebrow" data-reveal>
              What a hackathon is
            </p>
            <p className="note note--lg" data-reveal>
              {WHAT}
            </p>

            <ol className="facts" data-reveal="stagger">
              {HOW.map((h) => (
                <li key={h.k}>
                  <b>{h.k}</b>
                  <p>{h.v}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── The plan ───────────────────────────────────────────── */}
        <section id="plan" className="band band--dark">
          <Lines />
          <div className="wrap">
            <h2 className="mega mega--sec" data-reveal>
              The plan for <span className="serif">the year</span>
            </h2>

            <ol className="steps" data-reveal="stagger">
              {PLAN.map((s, i) => (
                <li key={s.name}>
                  <span className="st-no">{String(i + 1).padStart(2, "0")}</span>
                  <span className="st-body">
                    <b>{s.name}</b>
                    <i>{s.line}</i>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── What we teach ──────────────────────────────────────── */}
        <section id="learn" className="band">
          <Lines />
          <div className="wrap split">
            <div className="split-head">
              <p className="eyebrow" data-reveal>
                What we teach
              </p>
              <h2 className="mega mega--sec" data-reveal>
                The skills that <span className="serif">win</span>
              </h2>
              <p className="note" data-reveal>
                Most teams lose in the first hour, when they pick something they cannot finish. Every session
                is about the eight hours, not the theory.
              </p>
            </div>

            <ol className="soft" data-reveal="stagger">
              {LESSONS.map((l) => (
                <li key={l.name}>
                  <h3>{l.name}</h3>
                  <p>{l.line}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── Donate your prize ──────────────────────────────────── */}
        <section id="give" className="band band--light">
          <Lines />
          <div className="wrap split">
            <div>
              <p className="eyebrow" data-reveal>
                Donate your prize
              </p>
              <h2 className="mega mega--sec" data-reveal>
                Win it, then <span className="serif">give it</span>
              </h2>
              <p className="note" data-reveal>
                {GIVE}
              </p>
            </div>

            <div className="tally" data-reveal>
              <b>Given back to Leland</b>
              <span>{donated}</span>
              <small>Updated after every hackathon.</small>
            </div>
          </div>
        </section>

        {/* ── Almaden Hacks ──────────────────────────────────────── */}
        <section id="almaden" className="band band--dark band--almaden">
          <Lines />
          <div className="wrap">
            <p className="eyebrow" data-reveal>
              End of the year
            </p>
            <h2 className="mega" data-reveal>
              Almaden <span className="serif">Hacks</span>
            </h2>
            <p className="note note--lg" data-reveal>
              {ALMADEN}
            </p>

            <ol className="facts" data-reveal="stagger">
              {ALMADEN_FACTS.map((f) => (
                <li key={f.k}>
                  <b>{f.k}</b>
                  <p>{f.v}</p>
                </li>
              ))}
            </ol>

            <div className="hero-cta" data-reveal>
              <a className="slab" href={SPONSOR_MAIL}>
                <span>Sponsor Almaden Hacks</span>
                <i aria-hidden>
                  <Out />
                </i>
              </a>
              <a className="slab slab--ghost" href={JOIN_MAIL}>
                <span>Get updates</span>
              </a>
            </div>
          </div>
        </section>

        {/* ── Track record ───────────────────────────────────────── */}
        <section id="record" className="band">
          <Lines />
          <div className="wrap split">
            <div className="split-head">
              <p className="eyebrow" data-reveal>
                Why us
              </p>
              <h2 className="mega mega--sec" data-reveal>
                We have <span className="serif">done this</span>
              </h2>
              <p className="note" data-reveal>
                {RECORD_NOTE}
              </p>
              <a href={LINKS.founder} target="_blank" rel="noopener noreferrer" className="more" data-reveal>
                Founder
                <Out />
              </a>
            </div>

            <ol className="record" data-reveal="stagger">
              {RECORD.map((a, i) => (
                <li key={a}>
                  <span className="st-no">{String(i + 1).padStart(2, "0")}</span>
                  <b>{a}</b>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── Join ───────────────────────────────────────────────── */}
        <section id="join" className="band band--dark band--end">
          <Lines />
          <div className="wrap end">
            <h2 className="mega" data-reveal>
              Join <span className="serif">the club</span>
            </h2>

            <p className="note note--center" data-reveal>
              {JOIN}
            </p>

            <div className="hero-cta hero-cta--center" data-reveal>
              <a className="slab" href={JOIN_MAIL}>
                <span>{LINKS.email}</span>
                <i aria-hidden>
                  <Out />
                </i>
              </a>
              <a className="slab slab--ghost" href={SPONSOR_MAIL}>
                <span>Sponsor</span>
              </a>
            </div>

            <div className="foot">
              <span>
                © {thisYear} {CLUB} · San Jose, California
              </span>
              <span className="foot-links">
                <a href={LINKS.founder} target="_blank" rel="noopener noreferrer">
                  rishithc.com
                </a>
                <a href={`mailto:${LINKS.email}`}>Email</a>
              </span>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
