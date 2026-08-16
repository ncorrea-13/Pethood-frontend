import { Sidebar } from "./Sidebar";

// Funciones exclusivas del rol Administrador — CLAUDE.md.
const LINKS = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/refugios", label: "Refugios" },
  { href: "/admin/usuarios", label: "Usuarios" },
  { href: "/admin/moderacion", label: "Moderación" },
  { href: "/admin/catalogos", label: "Catálogos" },
  { href: "/admin/exportacion", label: "Exportación" },
];

export function AdminSidebar() {
  return <Sidebar titulo="Administrador" links={LINKS} />;
}
