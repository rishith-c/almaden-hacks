/**
 * Every line here is one or two sentences, in the club's own voice: plain,
 * first person plural, no flourish. If a number is not real yet, it is not
 * on the page.
 */

export const LINKS = {
  email: "rishithchennupati@gmail.com",
  founder: "https://rishithc.com",
  instagram: "",
};

export const SCHOOL = "Leland High School";
export const CLUB = "Leland Hackathon Club";
export const EVENT = "Almaden Hacks";

export const INTRO =
  "A club at Leland High School that trains you to win hackathons, goes to them as a team, and hosts its own at the end of the year.";

export const WHAT =
  "You show up at a venue with a team. For eight hours you build a robot or write a program. Then you present it to judges, and the best builds win money.";

/* ── How one goes ───────────────────────────────────────────────── */

export const HOW = [
  { k: "Build", v: "Eight hours, one idea, whatever you can get working." },
  { k: "Present", v: "A few minutes in front of judges with a live demo." },
  { k: "Win", v: "The best teams take home prize money." },
];

/* ── The plan for the year ──────────────────────────────────────── */

export interface Step {
  name: string;
  line: string;
}

export const PLAN: Step[] = [
  {
    name: "Train",
    line:
      "Weekly sessions on the skills that actually win: scoping an idea in ten minutes, getting a demo working fast, and pitching it to a judge who has already seen forty other teams.",
  },
  {
    name: "Compete",
    line:
      "We go as a team to hackathons run by large tech companies around the Bay, all year. You never go alone.",
  },
  {
    name: "Give back",
    line:
      "Win money, and you can donate your prize to the school. It is your call every time, and the club makes it a one-step handoff.",
  },
  {
    name: "Host",
    line:
      "At the end of the year we run Almaden Hacks, our own hackathon, and bring hundreds of high schoolers from across the Bay to Almaden.",
  },
];

/* ── What we teach ──────────────────────────────────────────────── */

export const LESSONS: Step[] = [
  {
    name: "Scoping",
    line: "Picking an idea you can finish in eight hours, and cutting it until you can.",
  },
  {
    name: "Building fast",
    line: "Getting to a working demo first and making it look good last.",
  },
  {
    name: "Hardware",
    line: "Motors, sensors and microcontrollers, and how to wire a robot that works by the deadline.",
  },
  {
    name: "Pitching",
    line: "What to show, what to skip, and how to answer the question you did not expect.",
  },
  {
    name: "AI, with USAAI",
    line:
      "USAAI is a national nonprofit and movement that teaches students the technology behind AI, not just how to use it. We are bringing its lessons into the club so you understand what you build with.",
  },
];

/* ── Donate your prize ──────────────────────────────────────────── */

export const GIVE =
  "Every hackathon pays out to the winning teams. If you win as part of the club, you can choose to donate your prize back to Leland. It is optional and it is your money. We just make it easy, and we keep a running total.";

/** Update after every event. Starts honest. */
export const DONATED = 0;

/* ── Almaden Hacks ──────────────────────────────────────────────── */

export const ALMADEN =
  "One day at the end of the year. Hundreds of high schoolers from across the Bay Area, sponsored by tech companies, building in Almaden.";

export const ALMADEN_FACTS = [
  { k: "When", v: "End of the school year. Date to come." },
  { k: "Who", v: "High schoolers from across the Bay Area." },
  { k: "Sponsors", v: "Tech companies. We are talking to them now." },
];

/* ── Track record ───────────────────────────────────────────────── */

export const RECORD_NOTE = "The club is run by people who have been winning these.";

export const RECORD = [
  "1st place overall, CSI Hacks @ Zoho",
  "2nd place, Berkeley Robotics Hackathon",
  "Best website and design, Synthesis Hacks @ Google",
  "2nd place, mental health track, Milpitas Hacks 3",
  "Honorable mention, WeMakeDevs Zero Downtime Hackathon",
  "31st of 649, international hackathon",
];

/* ── Join ───────────────────────────────────────────────────────── */

export const JOIN = "Open to every Leland student. No experience needed. We teach it.";
