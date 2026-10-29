import * as React from "react"

import { cn } from "@/lib/utils"

// Mobile section (< sm): flat block with generous vertical padding, followed by
// a full-bleed separator band. The negative bottom margin absorbs the page's
// 16px gap so the band sits right above the next section.
const mobileSection =
  "max-sm:relative max-sm:pt-[26px] max-sm:pb-[34px] max-sm:-mb-4 max-sm:last:mb-0 max-sm:after:absolute max-sm:after:-inset-x-4 max-sm:after:bottom-0 max-sm:after:h-2 max-sm:after:bg-sep max-sm:last:after:hidden"

// `bleed`: on phones, drop the card chrome and render the card as a mobile
// section; a CardBleed child spans the full screen width (like the tables).
function Card({
  className,
  bleed = false,
  ...props
}: React.ComponentProps<"div"> & { bleed?: boolean }) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-4 rounded-xl border py-4 shadow-sm sm:gap-6 sm:py-6",
        bleed &&
          cn(
            mobileSection,
            "max-sm:rounded-none max-sm:border-0 max-sm:bg-transparent max-sm:shadow-none max-sm:*:px-0",
            "max-sm:*:data-[slot=card-header]:*:data-[slot=card-title]:text-[1.14rem] max-sm:*:data-[slot=card-header]:*:data-[slot=card-title]:font-[650]"
          ),
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-4 has-data-[slot=card-action]:grid-cols-[1fr_auto] sm:px-6 [.border-b]:pb-4 sm:[.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-4 sm:px-6", className)}
      {...props}
    />
  )
}

function CardBleed({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-bleed"
      className={cn("max-sm:-mx-4 max-sm:px-3", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-4 sm:px-6 [.border-t]:pt-4 sm:[.border-t]:pt-6", className)}
      {...props}
    />
  )
}

export {
  mobileSection,
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  CardBleed,
}
