"use client"

import React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { NavUser } from "./nav-user"
import { usePathname } from "next/navigation"

// This is sample data.
const data = {
  user: {
    name: "Steven Lucas",
    email: "contact@stivluc.com",
    avatar: "/avatars/newpp.png",
  },
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
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  return (
    <Sidebar {...props}>
      <SidebarHeader className="px-4 py-2 h-16 flex items-center justify-start">
        <Link href="/" className="flex items-center h-full">
          <img
            src="/castorama_logo.png"
            alt="Castorama Logo"
            className="h-10 w-auto object-contain"
          />
        </Link>
      </SidebarHeader>
      <SidebarContent className="pt-0">
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((navItem) => {
                  // Check if the current pathname starts with the nav item's URL for active status
                  const isActive = pathname.startsWith(navItem.url) && (navItem.url !== '/' || pathname === '/' || pathname === '/(authenticated)');
                  return (
                    <SidebarMenuItem key={navItem.title}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link href={navItem.url}>{navItem.title}</Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}



