import Image from "next/image";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import backdrop from "./backdrop.module.css";
import styles from "./page.module.css";
import { clerkAppearance } from "./clerkAppearance";
// import { CosmicButton } from "@/components/CosmicButton"; // REVERT: swap back to cosmic
import { NoiseButton } from "@/components/NoiseButton";
import {
  HeroDitheringRoot,
  HeroDitheringContainer,
  HeroDitheringContent,
  HeroDitheringHeading,
  HeroDitheringDescription,
  HeroDitheringActions,
  HeroDitheringVisual,
  HeroDitheringMobileVisual,
} from "./hero/HeroDithering";
import { StackSection } from "./stack/StackSection";
import { WorkflowSection } from "./workflow/WorkflowSection";
import { PricingSection } from "./pricing/PricingSection";
import { FooterSection } from "./footer/FooterSection";
import Logo from "@/assets/breezebuild-logo.svg";

export default function Home() {
  return (
    <div className={backdrop.bg}>
      <div className={backdrop.content}>
        <header className={`${backdrop.shell} ${styles.header}`}>
          <Image src={Logo} alt="BreezeBuild" priority className={styles.logo} />
          <div className={styles.auth}>
            <Show when="signed-out">
              <SignInButton>
                {/* REVERT: <CosmicButton label="Sign in" variant="secondary" size="sm" /> */}
                <NoiseButton label="Sign in" variant="secondary" size="sm" />
              </SignInButton>
            </Show>
            <Show when="signed-in">
              <UserButton appearance={clerkAppearance} />
            </Show>
          </div>
        </header>

        <main>
          <HeroDitheringRoot>
            <HeroDitheringContainer>
              <HeroDitheringContent>
                <HeroDitheringHeading />
                <HeroDitheringDescription />
                <HeroDitheringActions />
                <HeroDitheringMobileVisual />
              </HeroDitheringContent>
              <HeroDitheringVisual />
            </HeroDitheringContainer>
          </HeroDitheringRoot>

          <StackSection />

          <WorkflowSection />

          <PricingSection />
        </main>

        <FooterSection />
      </div>
    </div>
  );
}
