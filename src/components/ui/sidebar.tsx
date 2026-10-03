"use client";

import Link from "next/link";
import Image from "next/image";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import Logo from "@/assets/breezebuild-logo.svg";
import Icon from "@/assets/breezebuild-icon.svg";

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) throw new Error("useSidebar must be used within a SidebarProvider");
  return context;
}

export function SidebarProvider({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) {
  const [openState, setOpenState] = useState(false);
  return (
    <SidebarContext.Provider
      value={{
        open: openProp ?? openState,
        setOpen: setOpenProp ?? setOpenState,
        animate,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function Sidebar({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
}

export function SidebarBody({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <DesktopSidebar className={className}>{children}</DesktopSidebar>
      <MobileSidebar className={className}>{children}</MobileSidebar>
    </>
  );
}

function SidebarBrand({
  expanded,
  onClick,
}: {
  expanded: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href="/dashboard"
      aria-label="BreezeBuild dashboard"
      onClick={onClick}
      className={cn(
        "flex h-11 w-full shrink-0 items-center overflow-hidden rounded-md focus-visible:outline-2 focus-visible:outline-orange-500",
        expanded ? "justify-start" : "justify-center",
      )}
    >
      <Image
        src={expanded ? Logo : Icon}
        alt=""
        className={expanded ? "h-8 w-auto max-w-none" : "h-8 w-8 max-w-none"}
      />
    </Link>
  );
}

export function DesktopSidebar({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const { open, setOpen, animate } = useSidebar();
  const reducedMotion = useReducedMotion();
  return (
    <motion.aside
      className={cn(
        "hidden h-dvh shrink-0 flex-col overflow-hidden border-r border-neutral-800 bg-[#1a1a1a] px-4 py-5 md:flex",
        className,
      )}
      animate={{ width: animate ? (open ? 260 : 68) : 260 }}
      transition={{ duration: reducedMotion ? 0 : 0.2 }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocusCapture={() => setOpen(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
      aria-label="Dashboard sidebar"
    >
      <SidebarBrand expanded={open} />
      {children}
    </motion.aside>
  );
}

export function MobileSidebar({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const { open, setOpen } = useSidebar();
  const reducedMotion = useReducedMotion();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    closeRef.current?.focus();
    return () => trigger?.focus();
  }, [open]);

  function handlePanelKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (event.key === "Escape") {
      setOpen(false);
      return;
    }
    if (event.key !== "Tab") return;
    const controls = panelRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    if (!controls?.length) return;
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <>
      <div className="flex h-14 w-full items-center border-b border-neutral-800 bg-[#1a1a1a] px-4 md:hidden">
        <div className="w-11">
          <SidebarBrand expanded={false} />
        </div>
        <button
          ref={triggerRef}
          type="button"
          className="ml-auto mr-12 flex min-h-11 min-w-11 items-center justify-center rounded-md text-neutral-200 focus-visible:outline-2 focus-visible:outline-orange-500"
          aria-label="Open navigation"
          aria-expanded={open}
          aria-controls="dashboard-mobile-navigation"
          onClick={() => setOpen(true)}
        >
          <IconMenu2 size={24} />
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.aside
            id="dashboard-mobile-navigation"
            ref={panelRef}
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.25, ease: "easeInOut" }}
            className={cn(
              "fixed inset-0 z-50 flex flex-col bg-[#1a1a1a] px-5 py-5 md:hidden",
              className,
            )}
            role="dialog"
            aria-modal="true"
            aria-label="Dashboard navigation"
            onKeyDown={handlePanelKeyDown}
          >
            <button
              ref={closeRef}
              type="button"
              className="absolute right-5 top-5 flex min-h-11 min-w-11 items-center justify-center rounded-md text-neutral-200 focus-visible:outline-2 focus-visible:outline-orange-500"
              aria-label="Close navigation"
              onClick={() => setOpen(false)}
            >
              <IconX size={24} />
            </button>
            <SidebarBrand expanded onClick={() => setOpen(false)} />
            {children}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

export function SidebarLink({
  link,
  className,
}: {
  link: {
    label: string;
    icon: React.ReactNode;
    href?: string;
    onClick?: () => void;
    disabled?: boolean;
    active?: boolean;
  };
  className?: string;
}) {
  const { open, setOpen, animate } = useSidebar();
  const content = (
    <>
      <span className="flex h-5 w-5 shrink-0 items-center justify-center">{link.icon}</span>
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="whitespace-nowrap text-sm"
      >
        {link.label}
      </motion.span>
    </>
  );
  const classes = cn(
    "flex min-h-11 w-full items-center gap-4 rounded-lg px-1.5 py-2 text-left text-neutral-300 transition-colors",
    link.active && "bg-neutral-800 text-white",
    link.disabled ? "cursor-not-allowed opacity-40" : "hover:bg-neutral-800 hover:text-white",
    className,
  );

  if (link.disabled) {
    return (
      <button type="button" className={classes} disabled aria-label={`${link.label} (coming soon)`}>
        {content}
      </button>
    );
  }
  if (link.href) {
    return (
      <Link href={link.href} className={classes} aria-label={link.label} aria-current={link.active ? "page" : undefined} onClick={() => setOpen(false)}>
        {content}
      </Link>
    );
  }
  return (
    <button type="button" className={classes} onClick={link.onClick} aria-label={link.label}>
      {content}
    </button>
  );
}
