import { ScanEye } from "lucide-react"
import { IconTrendingDown } from "@tabler/icons-react"
import { LoginForm } from "@/components/login-form"
import { Heatmap } from "@/components/heatmap"
import { Badge } from "@/components/ui/badge"
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CONCORDANCE, FLOWS, SITES } from "@/lib/demo-data"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Connexion",
  description: "Connexion à la démo Price Tracker.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function LoginPage() {
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <div className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg">
              <ScanEye className="size-4" />
            </div>
            Price Tracker
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <LoginForm />
          </div>
        </div>
      </div>
      {/* Decorative preview of the dashboard */}
      <div
        aria-hidden
        inert
        className="bg-muted hidden items-center justify-center p-10 select-none lg:flex"
      >
        <div className="flex w-full max-w-md flex-col gap-4 opacity-80">
          <Card className="from-primary/5 to-card bg-gradient-to-t shadow-xs dark:bg-card">
            <CardHeader>
              <CardDescription>Concordance globale</CardDescription>
              <CardTitle className="text-3xl font-semibold tabular-nums">96,4 %</CardTitle>
              <CardAction>
                <Badge variant="outline">
                  <IconTrendingDown />
                  -1,2 pt
                </Badge>
              </CardAction>
            </CardHeader>
          </Card>
          <Heatmap data={CONCORDANCE} rows={FLOWS} cols={SITES} />
        </div>
      </div>
    </div>
  )
}
