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
    color: "var(--chart-5)",
    label: "\u{1F7E2} Stable",
    desc: "Le système fonctionne normalement",
  };

  if (value > threshold) {
    status = {
      color: "var(--destructive)",
      label: "\u{1F534} Critique",
      desc: "Trop de divergences détectées",
    };
  } else if (value > threshold / 2) {
    status = {
      color: "var(--chart-4)",
      label: "\u{1F7E0} Alerte",
      desc: "Des divergences nécessitent une attention",
    };
  }

  return (
    <div className="px-4 lg:px-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Statut général</CardTitle>
          <div
            className="rounded-md px-2 py-1 text-sm font-medium"
            style={{ backgroundColor: status.color, color: "var(--card-foreground)" }}
          >
            {status.label}
          </div>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          {status.desc} ({value}% d'erreurs)
        </CardContent>
      </Card>
    </div>
  );
}
