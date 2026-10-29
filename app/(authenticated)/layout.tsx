"use client"

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"

// Import the navigation data structure
const navData = {
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      items: [
        {
          title: "Vue d'ensemble",
          url: "/",
        },
        {
          title: "Détail par flux et site",
          url: "/detail_flux_site",
        },
      ],
    },
    {
      title: "Anomalies",
      url: "#",
      items: [
        {
          title: "Liste des anomalies",
          url: "/liste_anomalies",
        },
        {
          title: "Evolution temporelle",
          url: "/evolution_temporelle",
        },
        {
          title: "Alertes et incidents",
          url: "/alertes_incidents",
        },
      ],
    },
  ],
};

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  // Demo auth: client-side guard (static hosting, no middleware)
  useEffect(() => {
    if (Cookies.get("isAuthenticated") === "true") setReady(true);
    else router.replace("/login");
  }, [router]);

  // Find the current section and page based on the pathname
  const findCurrentNavigation = () => {
    for (const section of navData.navMain) {
      const matchingItem = section.items.find(item => 
        pathname === item.url || (item.url === '/' && pathname === '/(authenticated)')
      );
      if (matchingItem) {
        return {
          section: section.title,
          page: matchingItem.title
        };
      }
    }
    return {
      section: 'Dashboard',
      page: 'Vue d\'ensemble'
    };
  };

  const { section, page } = findCurrentNavigation();

  if (!ready) return null;

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <header className="sticky top-0 z-20 flex shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur pt-[env(safe-area-inset-top)] pr-[max(1rem,env(safe-area-inset-right))] pl-[max(1rem,env(safe-area-inset-left))]">
          <div className="flex h-14 items-center gap-2 sm:h-16">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="#">{section}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{page}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          </div>
        </header>
        <SidebarInset className="flex flex-col flex-1 overflow-auto pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
          {children}
        </SidebarInset>
      </div>
    </div>
  )
} 