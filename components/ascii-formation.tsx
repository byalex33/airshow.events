import styles from "./ascii-formation.module.css";

const plane = "     ^\n     |\n    /|\\\n __/ | \\__\n/____|____\\\n    /|\\\n   /_|_\\";

const trail = Array.from({ length: 20 }, (_, i) =>
  i % 3 === 0 ? " : : " : " . . ",
).join("\n");

export function AsciiFormation() {
  return (
    <figure className={styles.frame}>
      <div
        className={styles.sky}
        role="img"
        aria-label="Five ASCII aircraft flying in a V formation, with smoke trails drifting behind them"
      >
        <div className={styles.coordinates} aria-hidden="true">
          <span>+ 51° N</span>
          <span>LOOK UP ↗</span>
        </div>
        <div className={styles.formation} aria-hidden="true">
          {["lead", "left", "right", "farLeft", "farRight"].map((position) => (
            <div className={`${styles.aircraft} ${styles[position]}`} key={position}>
              <pre className={styles.plane}>{plane}</pre>
              <div className={styles.trailWindow}>
                <pre className={styles.trail}>{trail}</pre>
              </div>
            </div>
          ))}
        </div>
        <span className={styles.horizon} aria-hidden="true">+ · · · · · · · · · · · · · · · · · · · · +</span>
      </div>
      <figcaption className={styles.caption}>
        <span>01 / IN FORMATION</span>
        <span>Five aircraft. One sky.</span>
      </figcaption>
    </figure>
  );
}
