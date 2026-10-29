"use client"

import React, { useEffect, useState } from "react"
import Cookies from "js-cookie"
import { usePathname, useRouter } from "next/navigation"

import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { findNavItem } from "@/lib/navigation"

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [ready, setReady] = useState(false)

  // Demo auth: client-side guard (static hosting, no middleware)
  useEffect(() => {
    if (Cookies.get("isAuthenticated") === "true") setReady(true)
    else router.replace("/login")
  }, [router])

  const current = findNavItem(pathname) ?? { section: "Dashboard", page: "Vue d'ensemble" }

  if (!ready) return null

  return (
    <div className="flex min-h-svh w-full">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="bg-background sticky top-0 z-20 flex shrink-0 items-center gap-2 border-b pt-[env(safe-area-inset-top)] pr-[max(1rem,env(safe-area-inset-right))] pl-[max(1rem,env(safe-area-inset-left))]">
          <div className="flex h-14 min-w-0 items-center gap-2 sm:h-16">
            <SidebarTrigger className="-ml-2 size-9 md:-ml-1 md:size-7" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb className="min-w-0">
              <BreadcrumbList className="flex-nowrap">
                <BreadcrumbItem className="shrink-0">{current.section}</BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem className="min-w-0">
                  <BreadcrumbPage className="truncate">{current.page}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <SidebarInset className="flex flex-1 flex-col pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
          {children}
        </SidebarInset>
      </div>
    </div>
  )
}
