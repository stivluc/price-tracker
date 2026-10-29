export type NavSection = {
  title: string
  items: { title: string; url: string }[]
}

export const navSections: NavSection[] = [
  {
    title: "Dashboard",
    items: [
      { title: "Vue d'ensemble", url: "/" },
      { title: "Détail par flux et site", url: "/detail_flux_site" },
    ],
  },
  {
    title: "Anomalies",
    items: [
      { title: "Liste des anomalies", url: "/liste_anomalies" },
      { title: "Évolution temporelle", url: "/evolution_temporelle" },
      { title: "Alertes et incidents", url: "/alertes_incidents" },
    ],
  },
]

export function isActivePath(pathname: string, url: string) {
  const path = pathname.replace(/\/$/, "") || "/"
  return url === "/" ? path === "/" : path === url || path.startsWith(url + "/")
}

export function findNavItem(pathname: string) {
  for (const section of navSections) {
    const item = section.items.find((i) => isActivePath(pathname, i.url))
    if (item) return { section: section.title, page: item.title }
  }
  return null
}
