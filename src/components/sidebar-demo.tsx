"use client";

import { useState } from "react";
import Image from "next/image";
import { UserButton, useClerk } from "@clerk/nextjs";
import {
  IconBrandTabler,
  IconLogout,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { DashboardButton } from "@/components/ui/dashboard-button";
import { clerkAppearance } from "@/app/clerkAppearance";
import backdrop from "@/app/backdrop.module.css";
import emptyStateIllustration from "@/assets/dashboard-empty-state.png";

const iconClass = "h-5 w-5 shrink-0";

export default function SidebarDemo() {
  const [open, setOpen] = useState(false);
  const { signOut } = useClerk();
  const links = [
    { label: "Dashboard", href: "/dashboard", icon: <IconBrandTabler className={iconClass} />, active: true },
    { label: "Profile", icon: <IconUserBolt className={iconClass} />, disabled: true },
    { label: "Settings", icon: <IconSettings className={iconClass} />, disabled: true },
  ];

  return (
    <div className={`${backdrop.plain} relative flex min-h-dvh w-full flex-col text-white md:flex-row`}>
      <div className="absolute right-5 top-3 z-20 flex min-h-8 items-center md:right-10 md:top-6">
        <UserButton appearance={clerkAppearance} />
      </div>
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="gap-6">
          <nav aria-label="Dashboard">
            <div className="flex flex-col gap-1">
              {links.map((link) => <SidebarLink key={link.label} link={link} />)}
            </div>
          </nav>
          <div className="mt-auto border-t border-neutral-800 pt-4">
            <SidebarLink
              link={{
                label: "Logout",
                icon: <IconLogout className={iconClass} />,
                onClick: () => signOut({ redirectUrl: "/" }),
              }}
              className="text-red-400 hover:bg-red-500/10 hover:text-red-300"
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <main
        className="flex min-h-[calc(100dvh-3.5rem)] flex-1 items-center justify-center px-5 py-12 md:min-h-dvh md:px-10"
        aria-label="Dashboard"
      >
        <section className="w-full max-w-2xl text-center">
          <Image
            src={emptyStateIllustration}
            alt="Illustration of a developer working at a desk"
            className="mx-auto h-auto w-full max-w-80 sm:max-w-96"
            priority
          />
          <h1 className="text-balance text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Nothing here yet — start with a new project.
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-pretty text-base leading-7 text-neutral-400">
            Your Spring Boot projects will appear here. Project creation and documentation are coming soon.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <DashboardButton disabled title="Project creation is coming soon">
              Create a new project
            </DashboardButton>
            <DashboardButton variant="secondary" disabled title="Documentation is coming soon">
              Read documentation
            </DashboardButton>
          </div>
        </section>
      </main>
    </div>
  );
}
