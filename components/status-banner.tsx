interface StatusBannerProps {
  value: number; // percentage
  threshold?: number; // default 50
}

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function StatusBanner({ value, threshold = 50 }: StatusBannerProps) {
  let status = {
    className: "bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400",
    label: "Stable",
    desc: "Le système fonctionne normalement",
  };

  if (value > threshold) {
    status = {
      className: "bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400",
      label: "Critique",
      desc: "Trop de divergences détectées",
    };
  } else if (value > threshold / 2) {
    status = {
      className: "bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400",
      label: "Alerte",
      desc: "Des divergences nécessitent une attention",
    };
  }

  return (
    <div className="px-4 lg:px-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-bold text-lg">Statut général du système</CardTitle>
          <div
            className={`rounded-md px-2 py-1 text-sm font-medium bg-gradient-to-t from-primary/5 to-card dark:bg-card ${status.className}`}
          >
            {status.label}
          </div>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          {status.desc} ({value.toFixed(2)}% d&apos;erreurs)
        </CardContent>
      </Card>
    </div>
  );
}
