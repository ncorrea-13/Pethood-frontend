"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export interface SidebarLink {
  href: string;
  label: string;
}

interface SidebarProps {
  titulo: string;
  links: SidebarLink[];
}

export function Sidebar({ titulo, links }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-60 shrink-0 border-r border-neutral-200 bg-white p-4">
      <p className="mb-4 px-2 text-xs font-semibold uppercase tracking-wide text-neutral-400">
        {titulo}
      </p>
      <nav className="flex flex-col gap-1">
        {links.map((link) => {
          const activo = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-md px-3 py-2 text-sm font-medium ${
                activo
                  ? "bg-pethood-orange/10 text-pethood-orange"
                  : "text-neutral-700 hover:bg-neutral-100"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
