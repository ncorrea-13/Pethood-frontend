import { cookies } from "next/headers";
import { AUTH_COOKIE } from "@/lib/auth";
import { obtenerDashboard, esDashboardVacio } from "@/services/dashboard";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { BarList } from "@/components/dashboard/BarList";
import { DonutChart } from "@/components/dashboard/DonutChart";
import { TablaSolicitudesPorEstado } from "@/components/dashboard/TablaSolicitudesPorEstado";
import { TablaPublicacionesPorMes } from "@/components/dashboard/TablaPublicacionesPorMes";
import { DashboardVacio } from "@/components/dashboard/DashboardVacio";

const ETIQUETAS_KPI: Record<string, string> = {
  usuariosActivos: "Usuarios activos",
  mascotasRegistradas: "Mascotas registradas",
  refugiosVerificados: "Refugios verificados",
  publicacionesActivas: "Publicaciones activas",
  adopcionesConcretadas: "Adopciones concretadas",
  campaniasActivas: "Campañas activas",
  montoDonadoDeclarado: "Donado declarado",
  reportesPendientes: "Reportes pendientes",
};

export default async function DashboardAdminPage() {
  const token = (await cookies()).get(AUTH_COOKIE)?.value ?? "";
  const dashboard = await obtenerDashboard(token);

  if (esDashboardVacio(dashboard)) return <DashboardVacio />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Object.entries(dashboard.kpis).map(([clave, valor]) => (
          <KpiCard
            key={clave}
            etiqueta={ETIQUETAS_KPI[clave] ?? clave}
            valor={clave === "montoDonadoDeclarado" ? `$${valor.toLocaleString("es-AR")}` : valor}
          />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <DonutChart
          titulo="Usuarios por rol"
          items={Object.entries(dashboard.usuariosPorRol).map(([etiqueta, valor]) => ({ etiqueta, valor }))}
        />
        <BarList
          titulo="Mascotas por estado"
          items={Object.entries(dashboard.mascotasPorEstado).map(([etiqueta, valor]) => ({
            etiqueta: etiqueta.replace(/_/g, " "),
            valor,
          }))}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <TablaSolicitudesPorEstado items={dashboard.solicitudesPorEstado} />
        <TablaPublicacionesPorMes items={dashboard.publicacionesPorMes} />
      </div>
    </div>
  );
}
