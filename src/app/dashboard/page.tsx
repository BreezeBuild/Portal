import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import SidebarDemo from "@/components/sidebar-demo";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return <SidebarDemo />;
}
