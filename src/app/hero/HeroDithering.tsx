import type { ReactNode } from "react";
import Image from "next/image";
import backdrop from "../backdrop.module.css";
import styles from "./hero.module.css";
import { CosmicButton } from "@/components/CosmicButton";
import { NoiseButton } from "@/components/NoiseButton";
import Wordmark from "@/assets/breezebuild-wordmark.svg";

/*
 * Server components - only the shader visuals are client-side. Keeping these on
 * the server means page.tsx retains its Clerk RSC usage.
 */

export function HeroDitheringRoot({ children }: { children: ReactNode }) {
  return <section className={styles.root}>{children}</section>;
}

export function HeroDitheringContainer({ children }: { children: ReactNode }) {
  return (
    <div className={`${backdrop.shell} ${styles.container}`}>{children}</div>
  );
}

export function HeroDitheringContent({ children }: { children: ReactNode }) {
  return <div className={styles.content}>{children}</div>;
}

/*
 * "BreezeBuild" is the wordmark asset rather than type, so the product name
 * always carries its own treatment ("Breeze" light, "Build" on the brand
 * gradient). aria-hidden on the image plus a visually-hidden word would split
 * the sentence for screen readers, so the image carries the word as its alt
 * text and the <h1> still reads as one continuous sentence.
 */
export function HeroDitheringHeading() {
  return (
    <h1 className={styles.heading}>
      <span className={`${styles.headingLine} ${styles.headingLineOne}`}>
        <Image
          src={Wordmark}
          alt="BreezeBuild"
          priority
          className={styles.wordmark}
        />{" "}
        <span className={styles.dotted}>your idea</span>
      </span>
      <span className={styles.headingLine}>into a deployed app.</span>
    </h1>
  );
}

export function HeroDitheringDescription() {
  return (
    <div className={styles.description}>
      <p className={styles.lead}>
        BreezeBuild is being built to turn backend ideas into reviewable Spring
        Boot applications with AI.
      </p>
      <p className={styles.detail}>
        The workflow below shows the planned experience: automated tests, live
        API previews, Swagger, and synthetic data in your browser.
      </p>
    </div>
  );
}

export function HeroDitheringActions() {
  return (
    <div className={styles.actions}>
      {/* ==== REVERT BLOCK ========================================
          To restore the plain CTAs: uncomment this block, then
          delete the two <CosmicButton> elements below it.
          The .primary / .secondary rules are still in
          hero.module.css, so nothing else needs changing.

      <a href="/sign-up" className={styles.primary}>
        Start Building <span aria-hidden="true">→</span>
      </a>
      <a href="#how-it-works" className={styles.secondary}>
        See How It Works
      </a>

          ==== END REVERT BLOCK ==================================== */}

      {/* NoiseButton and CosmicButton take identical props - swap the name to switch treatment. */}
      <NoiseButton
        label="Create an account"
        href="/sign-up"
        variant="primary"
        size="md"
        trailing="→"
      />
      <CosmicButton
        label="See How It Works"
        href="#how-it-works"
        variant="secondary"
        size="md"
      />
    </div>
  );
}

export {
  HeroDitheringVisual,
  HeroDitheringMobileVisual,
} from "./HeroDitheringVisual";
