"use client";

import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import styles from "./NoiseBackground.module.css";

/* BreezeBuild brand stops: amber -> orange -> red. */
const BRAND_GRADIENT = ["#FB923C", "#F97316", "#EF4444"];

function GradientLayer({
  springX,
  springY,
  gradientColor,
  opacity,
  multiplier,
}: {
  springX: MotionValue<number>;
  springY: MotionValue<number>;
  gradientColor: string;
  opacity: number;
  multiplier: number;
}) {
  const x = useTransform(springX, (v) => v * multiplier);
  const y = useTransform(springY, (v) => v * multiplier);
  const background = useMotionTemplate`radial-gradient(circle at ${x}px ${y}px, ${gradientColor} 0%, transparent 50%)`;

  return (
    <motion.div
      className={styles.layer}
      style={{ opacity, background }}
      aria-hidden="true"
    />
  );
}

export type NoiseBackgroundProps = {
  children?: ReactNode;
  className?: string;
  containerClassName?: string;
  gradientColors?: string[];
  noiseIntensity?: number;
  speed?: number;
  animating?: boolean;
};

export function NoiseBackground({
  children,
  className,
  containerClassName,
  gradientColors = BRAND_GRADIENT,
  noiseIntensity = 0.22,
  speed = 0.06,
  animating = true,
}: NoiseBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dimensions = useRef({ width: 0, height: 0 });
  const reducedMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 100, damping: 30 });
  const springY = useSpring(y, { stiffness: 100, damping: 30 });
  const stripX = useTransform(springX, (v) => v * 0.1 - 50);

  const velocity = useRef({ x: 0, y: 0 });
  const lastTurn = useRef(0);

  const randomVelocity = useRef(() => {
    const angle = Math.random() * Math.PI * 2;
    const magnitude = speed * (0.5 + Math.random() * 0.5);
    return { x: Math.cos(angle) * magnitude, y: Math.sin(angle) * magnitude };
  });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const updateDimensions = () => {
      const rect = el.getBoundingClientRect();
      dimensions.current = { width: rect.width, height: rect.height };
      if (x.get() === 0 && y.get() === 0) {
        x.set(rect.width / 2);
        y.set(rect.height / 2);
      }
    };
    updateDimensions();
    const observer = new ResizeObserver(updateDimensions);
    observer.observe(el);
    return () => observer.disconnect();
  }, [x, y]);

  useEffect(() => {
    randomVelocity.current = () => {
      const angle = Math.random() * Math.PI * 2;
      const magnitude = speed * (0.5 + Math.random() * 0.5);
      return { x: Math.cos(angle) * magnitude, y: Math.sin(angle) * magnitude };
    };
    velocity.current = randomVelocity.current();
  }, [speed]);

  useAnimationFrame((time) => {
    if (!animating || reducedMotion || !containerRef.current) return;

    const { width: maxX, height: maxY } = dimensions.current;
    if (maxX === 0 || maxY === 0) return;

    if (time - lastTurn.current > 1500 + Math.random() * 1500) {
      velocity.current = randomVelocity.current();
      lastTurn.current = time;
    }

    const dt = 16;
    let nextX = x.get() + velocity.current.x * dt;
    let nextY = y.get() + velocity.current.y * dt;

    const padding = 20;
    if (
      nextX < padding ||
      nextX > maxX - padding ||
      nextY < padding ||
      nextY > maxY - padding
    ) {
      velocity.current = randomVelocity.current();
      lastTurn.current = time;
      nextX = Math.max(padding, Math.min(maxX - padding, nextX));
      nextY = Math.max(padding, Math.min(maxY - padding, nextY));
    }

    x.set(nextX);
    y.set(nextY);
  });

  return (
    <div
      ref={containerRef}
      className={[styles.container, containerClassName]
        .filter(Boolean)
        .join(" ")}
      style={{ "--noise-opacity": noiseIntensity } as CSSProperties}
    >
      {/* Above Aceternity's 0.4/0.3/0.25 defaults - the ring is thin, so it needs the lift. */}
      <GradientLayer
        springX={springX}
        springY={springY}
        gradientColor={gradientColors[0]}
        opacity={0.55}
        multiplier={1}
      />
      <GradientLayer
        springX={springX}
        springY={springY}
        gradientColor={gradientColors[1]}
        opacity={0.42}
        multiplier={0.7}
      />
      <GradientLayer
        springX={springX}
        springY={springY}
        gradientColor={gradientColors[2] ?? gradientColors[0]}
        opacity={0.34}
        multiplier={1.2}
      />

      <motion.div
        className={styles.strip}
        aria-hidden="true"
        style={{
          background: `linear-gradient(to right, ${gradientColors.join(", ")})`,
          x: animating && !reducedMotion ? stripX : 0,
        }}
      />

      <div className={styles.noise} aria-hidden="true" />

      <div className={[styles.content, className].filter(Boolean).join(" ")}>
        {children}
      </div>
    </div>
  );
}
