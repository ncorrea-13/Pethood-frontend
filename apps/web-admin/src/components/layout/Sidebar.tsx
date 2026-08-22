"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

export interface SidebarLink {
  href: string;
  label: string;
  icono: ReactNode;
}

interface SidebarProps {
  titulo: string;
  links: SidebarLink[];
}

export function Sidebar({ titulo, links }: SidebarProps) {
  const pathname = usePathname();
  const [colapsado, setColapsado] = useState(false);

  return (
    <aside
      className={`shrink-0 bg-neutral-900 p-4 transition-[width] duration-200 ${colapsado ? "w-16" : "w-60"}`}
    >
      <div className={`mb-4 flex items-center ${colapsado ? "justify-center" : "justify-between px-2"}`}>
        {!colapsado && (
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">{titulo}</p>
        )}
        <button
          type="button"
          onClick={() => setColapsado((v) => !v)}
          className="rounded-md p-1 text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white"
          aria-label={colapsado ? "Expandir menú" : "Colapsar menú"}
        >
          {colapsado ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </button>
      </div>
      <nav className="flex flex-col gap-1">
        {links.map((link) => {
          const activo = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              title={colapsado ? link.label : undefined}
              className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                colapsado ? "justify-center" : ""
              } ${
                activo
                  ? "bg-pethood-orange text-white"
                  : "text-neutral-300 hover:bg-neutral-800 hover:text-white"
              }`}
            >
              {link.icono}
              {!colapsado && link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
