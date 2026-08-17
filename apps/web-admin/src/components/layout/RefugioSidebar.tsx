import { Sidebar } from "./Sidebar";

// Funciones exclusivas del rol Refugio (ya verificado) — CLAUDE.md.
const LINKS = [
  { href: "/refugio/dashboard", label: "Dashboard" },
  { href: "/refugio/campanas", label: "Campañas" },
  { href: "/refugio/perfil", label: "Perfil público" },
];

export function RefugioSidebar() {
  return <Sidebar titulo="Refugio" links={LINKS} />;
}
