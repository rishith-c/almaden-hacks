/**
 * Text running across the screen. The row is rendered twice end to end and
 * translated by half its width, so the loop has no seam. Pure CSS; paused
 * under prefers-reduced-motion.
 */

interface Props {
  words: string[];
  /** which way it travels */
  dir?: "left" | "right";
  /** seconds for one full pass; longer is slower */
  speed?: number;
  size?: "lg" | "sm";
}

export default function Ticker({ words, dir = "left", speed = 40, size = "lg" }: Props) {
  const row = words.map((w, i) => (
    <span key={i} className="tk-word">
      {w}
      <i className="tk-dot" aria-hidden />
    </span>
  ));

  return (
    <div
      className={`ticker ticker--${size} ticker--${dir}`}
      style={{ ["--tk-speed" as string]: `${speed}s` }}
      aria-label={words.join(". ")}
    >
      <div className="tk-track">
        <div className="tk-row">{row}</div>
        <div className="tk-row" aria-hidden>
          {row}
        </div>
      </div>
    </div>
  );
}
