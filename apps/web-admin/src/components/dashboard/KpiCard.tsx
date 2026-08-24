import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";

// Pasteles suaves para no desentonar con la paleta cálida de PetHood.
const COLORES_BADGE = {
  naranja: "bg-orange-50 text-pethood-orange-dark",
  verde: "bg-green-50 text-green-600",
  celeste: "bg-sky-50 text-sky-600",
  rojo: "bg-red-50 text-red-500",
} as const;

interface KpiCardProps {
  etiqueta: string;
  valor: number | string;
  icono: LucideIcon;
  color: keyof typeof COLORES_BADGE;
  href?: string;
  /** Tarjeta con fondo sólido en vez de blanco, para destacar un KPI sobre el resto (ej. donaciones). */
  destacado?: boolean;
  /** Texto chico debajo del valor, ej. "Objetivo: $50.000". */
  nota?: string;
}

export function KpiCard({ etiqueta, valor, icono: Icono, color, href, destacado = false, nota }: KpiCardProps) {
  if (destacado) {
    return (
      <Card
        href={href}
        superficie="border border-transparent bg-linear-to-br from-green-600 to-green-700"
        className="text-white"
      >
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-white/90">{etiqueta}</p>
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15">
            <Icono className="h-4 w-4" strokeWidth={2} />
          </span>
        </div>
        <p className="mt-2 text-3xl font-semibold tracking-tight">{valor}</p>
        {nota && <p className="mt-1 text-xs font-medium text-white/90">{nota}</p>}
      </Card>
    );
  }

  return (
    <Card href={href}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-700">{etiqueta}</p>
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${COLORES_BADGE[color]}`}>
          <Icono className="h-4 w-4" strokeWidth={2} />
        </span>
      </div>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900">{valor}</p>
      {nota && <p className="mt-1 text-xs font-medium text-neutral-600">{nota}</p>}
    </Card>
  );
}
