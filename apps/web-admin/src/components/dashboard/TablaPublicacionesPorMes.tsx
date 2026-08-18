import type { PublicacionPorMes } from "@/types/dashboard";

export function TablaPublicacionesPorMes({ items }: { items: PublicacionPorMes[] }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-4">
      <h2 className="text-sm font-semibold text-neutral-700">Publicaciones y adopciones (últimos 6 meses)</h2>
      <table className="mt-3 w-full text-sm">
        <thead>
          <tr className="text-left text-neutral-500">
            <th className="pb-2 font-medium">Mes</th>
            <th className="pb-2 font-medium">Publicaciones</th>
            <th className="pb-2 font-medium">Adopciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.mes} className="border-t border-neutral-100">
              <td className="py-2 text-neutral-700">{item.mes}</td>
              <td className="py-2 text-neutral-700">{item.publicaciones}</td>
              <td className="py-2 text-neutral-700">{item.adopciones}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
