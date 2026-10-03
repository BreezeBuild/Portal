import backdrop from "../backdrop.module.css";
import { MacbookScroll } from "@/components/ui/macbook-scroll";
import { BreezeWorkspace } from "./BreezeWorkspace";
import styles from "./WorkflowSection.module.css";

/*
 * MacbookScroll is a client component (scroll-driven motion values); this
 * wrapper stays on the server, so only the laptop hydrates.
 */

const PRINCIPLES = [
  {
    label: "Guided",
    body: "Agents help with the decisions you'd rather not repeat.",
  },
  {
    label: "Reviewable",
    body: "Every meaningful AI change is small, explained, tested, and reviewable.",
  },
  {
    label: "Deployed",
    body: "Go from a clean Spring Boot project to a real preview without managing the infrastructure yourself.",
  },
];

export function WorkflowSection() {
  return (
    <section id="how-it-works" className={styles.root} aria-labelledby="workflow-heading">
      <div className={backdrop.shell}>
        <div className={styles.head}>
          <span className={styles.eyebrow}>
            The backend workflow, in your browser
          </span>
          <h2 id="workflow-heading" className={styles.heading}>
            Your backend. Our defaults.{" "}
            <span className={styles.headingAccent}>Your control.</span>
          </h2>
          <p className={styles.lead}>
            You know backend engineering. BreezeBuild removes the repetitive
            setup and enforces good defaults so you can get to the interesting
            parts faster.
          </p>
          <p className={styles.sub}>
            Guiding agents help you make decisions, implement changes, test,
            review, and deploy &mdash; while you remain in control.
          </p>
          <span className={styles.positioning}>
            Built for greenfield Spring Boot projects.
          </span>
        </div>
      </div>

      <div className={styles.stage}>
        <MacbookScroll
          showGradient={false}
          title={
            <span>
              You know how to build it.
              <br /> BreezeBuild helps you build it faster.
            </span>
          }
          screen={<BreezeWorkspace />}
        />
      </div>

      <div className={`${backdrop.shell} ${styles.below}`}>
        <div className={styles.principles}>
          {PRINCIPLES.map((p) => (
            <div key={p.label} className={styles.principle}>
              <span className={styles.principleLabel}>{p.label}</span>
              <p className={styles.principleBody}>{p.body}</p>
            </div>
          ))}
        </div>

        <div className={styles.philosophy}>
          <span className={styles.philosophyLine}>
            Build like a Ferrari. Keep your hands on the wheel.
          </span>
          <p className={styles.philosophyNote}>
            Move fast without giving up engineering discipline. The agent does
            the heavy lifting; the engineer stays in the driving seat.
          </p>
          <p className={styles.closing}>
            Spend your time on the product, not the scaffolding.
          </p>
        </div>
      </div>
    </section>
  );
}
