import { Card } from "@/components/ui/Card";

interface DonutChartProps {
  titulo: string;
  items: { etiqueta: string; valor: number }[];
}

// Mismos tokens que las badges de KpiCard.tsx, para que el color de un estado se lea igual
// en toda la pantalla. Las claves son los literales de EstadoSolicitud (backend/prisma/seed.ts:
// Pendiente, En_Revision, Aprobada, Rechazada, Cancelada) — acá también les damos su etiqueta
// en español, porque "En_Revision" es un valor técnico, no un texto para mostrar.
const CONFIG_ESTADO: Record<string, { etiqueta: string; color: string }> = {
  Pendiente: { etiqueta: "Pendiente", color: "var(--color-pethood-orange-dark)" },
  En_Revision: { etiqueta: "En revisión", color: "var(--color-sky-600)" },
  Aprobada: { etiqueta: "Aprobada", color: "var(--color-green-600)" },
  Rechazada: { etiqueta: "Rechazada", color: "var(--color-red-500)" },
  Cancelada: { etiqueta: "Cancelada", color: "var(--color-neutral-400)" },
};
const CONFIG_RESERVA = { color: "var(--color-sky-600)" };

function configDe(estado: string) {
  return CONFIG_ESTADO[estado] ?? { etiqueta: estado.replace(/_/g, " "), ...CONFIG_RESERVA };
}

// Dona en CSS puro (conic-gradient + círculo hueco encima) — mismo criterio que BarList:
// spec 009 no pide interactividad, así que no suma una librería de gráficos para esto.
export function DonutChart({ titulo, items }: DonutChartProps) {
  const total = items.reduce((acc, item) => acc + item.valor, 0) || 1;

  const stops = items
    .reduce<{ acumulado: number; partes: string[] }>(
      (acc, item) => {
        const desde = (acc.acumulado / total) * 100;
        const acumulado = acc.acumulado + item.valor;
        const hasta = (acumulado / total) * 100;
        acc.partes.push(`${configDe(item.etiqueta).color} ${desde}% ${hasta}%`);
        return { acumulado, partes: acc.partes };
      },
      { acumulado: 0, partes: [] },
    )
    .partes.join(", ");

  return (
    <Card>
      <h2 className="text-sm font-semibold text-neutral-700">{titulo}</h2>
      <div className="mt-4 flex items-center gap-6">
        <div className="relative h-24 w-24 shrink-0">
          <div className="h-24 w-24 rounded-full" style={{ background: `conic-gradient(${stops})` }} />
          <div className="absolute inset-3 flex flex-col items-center justify-center rounded-full bg-white">
            <span className="text-base font-semibold leading-none text-neutral-900">{total}</span>
            <span className="mt-1 text-[10px] leading-none text-neutral-400">total</span>
          </div>
        </div>
        <ul className="w-full space-y-2 text-sm">
          {items.map((item) => (
            <li key={item.etiqueta} className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: configDe(item.etiqueta).color }}
              />
              <span className="text-neutral-600">{configDe(item.etiqueta).etiqueta}</span>
              <span className="ml-auto font-medium text-neutral-900">
                {Math.round((item.valor / total) * 100)}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
