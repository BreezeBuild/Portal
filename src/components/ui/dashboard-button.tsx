"use client";

import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type SharedProps = {
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
};

type ButtonProps = SharedProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof SharedProps> & {
    href?: undefined;
  };

type LinkProps = SharedProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, keyof SharedProps> & {
    href: string;
  };

export type DashboardButtonProps = ButtonProps | LinkProps;

export function DashboardButton(props: DashboardButtonProps) {
  const { variant = "primary", className, children, ...rest } = props;
  const classes = cn(
    "inline-flex min-h-11 items-center justify-center rounded-lg px-5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400",
    variant === "primary"
      ? "bg-[#F97316] text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:hover:bg-[#F97316]"
      : "bg-transparent text-orange-400 hover:text-orange-300 disabled:cursor-not-allowed disabled:hover:text-orange-400",
    className,
  );

  if (typeof props.href === "string") {
    const linkProps = rest as ComponentPropsWithoutRef<typeof Link>;
    return (
      <Link {...linkProps} className={classes}>
        {children}
      </Link>
    );
  }

  const buttonProps = rest as ComponentPropsWithoutRef<"button">;
  return (
    <button type="button" {...buttonProps} className={classes}>
      {children}
    </button>
  );
}
