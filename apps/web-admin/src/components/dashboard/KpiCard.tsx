interface KpiCardProps {
  etiqueta: string;
  valor: number | string;
}

export function KpiCard({ etiqueta, valor }: KpiCardProps) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">{etiqueta}</p>
      <p className="mt-1 text-2xl font-semibold text-neutral-900">{valor}</p>
    </div>
  );
}
