"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import Logo from "@/assets/breezebuild-logo.svg";
import backdrop from "@/app/backdrop.module.css";
import styles from "./multi-step-loader.module.css";

type LoadingState = { text: string };

type MultiStepLoaderProps = {
  loadingStates: LoadingState[];
  loading?: boolean;
  /** Zero-based active stage. Supplying it disables automatic progression. */
  event?: number;
  /** Called after the active stage's entrance animation has settled. */
  onStageSettled?: (stage: number) => void;
  duration?: number;
  loop?: boolean;
};

export function MultiStepLoader({
  loadingStates,
  loading = false,
  event,
  onStageSettled,
  duration = 2000,
  loop = true,
}: MultiStepLoaderProps) {
  const reducedMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {loading && (
        <motion.section
          className={`${backdrop.bg} ${styles.screen}`}
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reducedMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.24, ease: "easeOut" }}
        >
          <div className={`${backdrop.content} ${styles.layout}`}>
            <header className={styles.brand}>
              <Image src={Logo} alt="BreezeBuild" priority className={styles.logo} />
            </header>

            <div className={styles.main}>
              <LoadingSequence
                loadingStates={loadingStates}
                event={event}
                onStageSettled={onStageSettled}
                duration={duration}
                loop={loop}
                reducedMotion={Boolean(reducedMotion)}
              />
            </div>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}

function LoadingSequence({
  loadingStates,
  event,
  onStageSettled,
  duration,
  loop,
  reducedMotion,
}: Pick<Required<MultiStepLoaderProps>, "loadingStates" | "duration" | "loop"> & {
  event?: number;
  onStageSettled?: (stage: number) => void;
  reducedMotion: boolean;
}) {
  const [currentState, setCurrentState] = useState(() => stageIndex(event ?? 0, loadingStates.length));
  const [checkedThrough, setCheckedThrough] = useState(() =>
    event === undefined ? -1 : stageIndex(event, loadingStates.length) - 1
  );
  const targetState = event === undefined ? null : stageIndex(event, loadingStates.length);

  useEffect(() => {
    if (event !== undefined || loadingStates.length === 0) {
      return;
    }

    const atLastStage = currentState >= loadingStates.length - 1;
    const checkTimeout = window.setTimeout(() => {
      setCheckedThrough(currentState);
    }, duration);

    const advanceTimeout = loop || !atLastStage
      ? window.setTimeout(() => {
          if (loop && atLastStage) {
            setCheckedThrough(-1);
          }
          setCurrentState(loop && atLastStage ? 0 : currentState + 1);
        }, duration + (reducedMotion ? 150 : 520))
      : undefined;

    return () => {
      window.clearTimeout(checkTimeout);
      if (advanceTimeout !== undefined) window.clearTimeout(advanceTimeout);
    };
  }, [currentState, duration, event, loadingStates.length, loop, reducedMotion]);

  useEffect(() => {
    if (targetState === null || loadingStates.length === 0) return;

    if (targetState <= currentState) {
      const resetTimeout = window.setTimeout(() => {
        setCheckedThrough(targetState - 1);
        if (targetState < currentState) setCurrentState(targetState);
      }, 0);
      return () => window.clearTimeout(resetTimeout);
    }

    const checkTimeout = window.setTimeout(() => setCheckedThrough(currentState), 0);
    const advanceTimeout = window.setTimeout(
      () => setCurrentState(currentState + 1),
      reducedMotion ? 150 : 520
    );

    return () => {
      window.clearTimeout(checkTimeout);
      window.clearTimeout(advanceTimeout);
    };
  }, [currentState, loadingStates.length, reducedMotion, targetState]);

  const activeState = Math.min(currentState, Math.max(loadingStates.length - 1, 0));

  return (
    <div className={styles.sequence}>
      <h1 className={styles.heading}>Setting up your account...</h1>
      <div className={styles.viewport} aria-hidden="true">
        <motion.ol
          className={styles.stages}
          initial={false}
          animate={{ y: -activeState * 80 }}
          transition={{ duration: reducedMotion ? 0 : 0.55, ease: [0.16, 1, 0.3, 1] }}
          onAnimationComplete={() => onStageSettled?.(activeState)}
        >
          {loadingStates.map((state, index) => {
            const complete = index < activeState || (
              index === activeState &&
              checkedThrough >= activeState &&
              (targetState === null || targetState > activeState)
            );
            const stageState = index === activeState
              ? complete ? "completing" : "current"
              : index < activeState ? "past" : "next";

            return (
              <li
                key={`${index}-${state.text}`}
                className={styles.stage}
                data-state={stageState}
              >
                <svg
                  className={styles.icon}
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    className={styles.spinner}
                    cx="12"
                    cy="12"
                    r="8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray="17 34"
                  />
                  <motion.path
                    d="m5 12 4.5 4.5L19 7"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={false}
                    animate={{ pathLength: complete ? 1 : 0, opacity: complete ? 1 : 0 }}
                    transition={{
                      duration: reducedMotion ? 0 : 0.36,
                      delay: complete && !reducedMotion ? 0.1 : 0,
                      ease: "easeOut",
                    }}
                  />
                </svg>
                <span>{state.text}</span>
              </li>
            );
          })}
        </motion.ol>
      </div>
      <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {loadingStates[activeState]?.text ?? "Loading BreezeBuild"}
      </p>
    </div>
  );
}

function stageIndex(value: number, length: number) {
  if (!Number.isFinite(value) || length === 0) return 0;
  return Math.min(Math.max(Math.trunc(value), 0), length - 1);
}
