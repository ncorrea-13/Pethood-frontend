import type { ReactNode } from "react";
import Link from "next/link";

const ESTILO = "rounded-xl border border-pethood-beige-dark bg-white p-5 shadow-sm transition-shadow hover:shadow-md";

interface CardProps {
  className?: string;
  href?: string;
  children: ReactNode;
}

// Estilo de tarjeta compartido por los widgets del dashboard (GUI-39) — un solo lugar
// para el look "moderno" (sombra + hover) en vez de repetirlo en cada componente.
// Sin "display" en ESTILO: className puede pedir flex/h-full (GraficoPublicacionesPorMes)
// sin pisar un "block" de base que compita por especificidad.
// Con href se renderiza como link (KPIs que llevan a su pantalla de gestión).
export function Card({ className = "", href, children }: CardProps) {
  if (href) {
    return (
      <Link href={href} className={`block ${ESTILO} ${className}`}>
        {children}
      </Link>
    );
  }
  return <div className={`${ESTILO} ${className}`}>{children}</div>;
}
