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
}

export function KpiCard({ etiqueta, valor, icono: Icono, color, href }: KpiCardProps) {
  return (
    <Card href={href}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">{etiqueta}</p>
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${COLORES_BADGE[color]}`}>
          <Icono className="h-4 w-4" strokeWidth={2} />
        </span>
      </div>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900">{valor}</p>
    </Card>
  );
}
