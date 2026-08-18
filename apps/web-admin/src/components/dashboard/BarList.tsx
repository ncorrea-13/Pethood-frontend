interface BarListProps {
  titulo: string;
  items: { etiqueta: string; valor: number }[];
}

// Barras con CSS puro, sin librería de gráficos — alcance de spec 009 no pide interactividad.
export function BarList({ titulo, items }: BarListProps) {
  const max = Math.max(1, ...items.map((item) => item.valor));

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-4">
      <h2 className="text-sm font-semibold text-neutral-700">{titulo}</h2>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item.etiqueta} className="text-sm">
            <div className="flex justify-between text-neutral-600">
              <span>{item.etiqueta}</span>
              <span>{item.valor}</span>
            </div>
            <div className="mt-1 h-2 rounded-full bg-neutral-100">
              <div
                className="h-2 rounded-full bg-pethood-orange"
                style={{ width: `${(item.valor / max) * 100}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
