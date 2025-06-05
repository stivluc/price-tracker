"use client"

import React from "react";

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
import { usePathname } from "next/navigation"
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
          title: "Détail par flux",
          url: "/detail_flux",
        },
        {
          title: "Détail par site",
          url: "/detail_site",
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

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
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
        </header>
        <SidebarInset className="flex flex-col flex-1 overflow-auto">
          {children}
        </SidebarInset>
      </div>
    </div>
  )
} 