interface DonutChartProps {
  titulo: string;
  items: { etiqueta: string; valor: number }[];
}

// Rotación de colores con los tokens ya definidos (paleta pethood + escala neutral de Tailwind),
// nunca hex suelto — ver apps/web-admin/src/app/globals.css.
const COLORES = [
  "var(--color-pethood-orange)",
  "var(--color-pethood-orange-dark)",
  "var(--color-neutral-700)",
  "var(--color-neutral-300)",
];

// Torta en CSS puro (conic-gradient) — mismo criterio que BarList: spec 009 no pide
// interactividad, así que no suma una librería de gráficos para esto.
export function DonutChart({ titulo, items }: DonutChartProps) {
  const total = items.reduce((acc, item) => acc + item.valor, 0) || 1;

  const stops = items
    .reduce<{ acumulado: number; partes: string[] }>(
      (acc, item, i) => {
        const desde = (acc.acumulado / total) * 100;
        const acumulado = acc.acumulado + item.valor;
        const hasta = (acumulado / total) * 100;
        acc.partes.push(`${COLORES[i % COLORES.length]} ${desde}% ${hasta}%`);
        return { acumulado, partes: acc.partes };
      },
      { acumulado: 0, partes: [] },
    )
    .partes.join(", ");

  return (
    <div className="rounded-lg border border-pethood-beige-dark bg-white p-4">
      <h2 className="text-sm font-semibold text-neutral-700">{titulo}</h2>
      <div className="mt-4 flex items-center gap-6">
        <div
          className="h-28 w-28 shrink-0 rounded-full"
          style={{ background: `conic-gradient(${stops})` }}
        />
        <ul className="w-full space-y-1.5 text-sm">
          {items.map((item, i) => (
            <li key={item.etiqueta} className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: COLORES[i % COLORES.length] }}
              />
              <span className="text-neutral-600">{item.etiqueta}</span>
              <span className="ml-auto font-medium text-neutral-900">
                {Math.round((item.valor / total) * 100)}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
