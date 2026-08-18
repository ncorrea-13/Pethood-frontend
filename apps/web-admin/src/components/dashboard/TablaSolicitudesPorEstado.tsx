import type { SolicitudPorEstado } from "@/types/dashboard";

export function TablaSolicitudesPorEstado({ items }: { items: SolicitudPorEstado[] }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-4">
      <h2 className="text-sm font-semibold text-neutral-700">Solicitudes por estado</h2>
      <table className="mt-3 w-full text-sm">
        <thead>
          <tr className="text-left text-neutral-500">
            <th className="pb-2 font-medium">Estado</th>
            <th className="pb-2 font-medium">Cantidad</th>
            <th className="pb-2 font-medium">%</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.estado} className="border-t border-neutral-100">
              <td className="py-2 text-neutral-700">{item.estado.replace(/_/g, " ")}</td>
              <td className="py-2 text-neutral-700">{item.cantidad}</td>
              <td className="py-2 text-neutral-700">{item.porcentaje}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
