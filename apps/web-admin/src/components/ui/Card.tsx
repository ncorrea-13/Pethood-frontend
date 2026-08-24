import type { ReactNode } from "react";
import Link from "next/link";

const BASE = "rounded-xl p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md";
const SUPERFICIE_DEFECTO = "border border-pethood-beige-dark bg-white";

interface CardProps {
  className?: string;
  /** Fondo + borde de la tarjeta. Reemplaza el blanco por defecto (ej. la tarjeta destacada de KpiCard). */
  superficie?: string;
  href?: string;
  children: ReactNode;
}

// Estilo de tarjeta compartido por los widgets del dashboard (GUI-39) — un solo lugar
// para el look "moderno" (sombra + hover) en vez de repetirlo en cada componente.
// "superficie" (bg/border) va separado de BASE a propósito: si un consumidor necesita
// pisar el fondo blanco por className, dos utilidades de "bg-*" con la misma especificidad
// compiten por orden de generación de Tailwind (no por orden en el HTML) y el resultado es
// impredecible — separarlas evita que dos clases "bg-*" convivan en el mismo elemento.
// Sin "display" en BASE: className puede pedir flex/h-full (GraficoPublicacionesPorMes)
// sin pisar un "block" de base que compita por especificidad.
// Con href se renderiza como link (KPIs que llevan a su pantalla de gestión).
export function Card({ className = "", superficie = SUPERFICIE_DEFECTO, href, children }: CardProps) {
  if (href) {
    return (
      <Link href={href} className={`block ${BASE} ${superficie} ${className}`}>
        {children}
      </Link>
    );
  }
  return <div className={`${BASE} ${superficie} ${className}`}>{children}</div>;
}
