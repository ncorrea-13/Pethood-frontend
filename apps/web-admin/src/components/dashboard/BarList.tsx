import { Card } from "@/components/ui/Card";

interface BarListProps {
  titulo: string;
  items: { etiqueta: string; valor: number }[];
}

// Barras con CSS puro, sin librería de gráficos — alcance de spec 009 no pide interactividad.
export function BarList({ titulo, items }: BarListProps) {
  const max = Math.max(1, ...items.map((item) => item.valor));

  return (
    <Card>
      <h2 className="text-sm font-semibold text-neutral-700">{titulo}</h2>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item.etiqueta} className="text-sm">
            <div className="flex justify-between text-neutral-600">
              <span>{item.etiqueta}</span>
              <span className="font-medium text-neutral-900">{item.valor}</span>
            </div>
            <div className="mt-1.5 h-2 rounded-full bg-neutral-100">
              <div
                className="h-2 rounded-full bg-pethood-orange transition-[width] duration-500 ease-out"
                style={{ width: `${(item.valor / max) * 100}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
