import { cookies } from "next/headers";
import { HeartHandshake, ClipboardList, PawPrint } from "lucide-react";
import { AUTH_COOKIE } from "@/lib/auth";
import { obtenerDashboardRefugio, esDashboardRefugioVacio } from "@/services/dashboard";
import { periodoPorDefecto, etiquetaPeriodo } from "@/lib/periodo";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { DonutChart } from "@/components/dashboard/DonutChart";
import { DonacionesChart } from "@/components/dashboard/DonacionesChart";
import { PeriodoSelector } from "@/components/dashboard/PeriodoSelector";
import { ExportacionRefugio } from "@/components/dashboard/ExportacionRefugio";
import { DashboardVacio } from "@/components/dashboard/DashboardVacio";
import type { MesISO } from "@/types/dashboard";

// GUI-38 — Dashboard Refugio (HU-14.2). Contrato de API propuesto, no confirmado por spec
// (ver nota en types/dashboard.ts y services/dashboard.ts).
export default async function DashboardRefugioPage({
  searchParams,
}: {
  searchParams: Promise<{ desde?: MesISO; hasta?: MesISO }>;
}) {
  const params = await searchParams;
  const defecto = periodoPorDefecto();
  const periodo = { desde: params.desde ?? defecto.desde, hasta: params.hasta ?? defecto.hasta };

  const token = (await cookies()).get(AUTH_COOKIE)?.value ?? "";
  const dashboard = await obtenerDashboardRefugio(token, periodo);

  if (esDashboardRefugioVacio(dashboard)) return <DashboardVacio />;

  return (
    <div className="animate-dashboard-in space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">{dashboard.refugio.nombre}</h1>
          <p className="text-sm text-neutral-700">{dashboard.refugio.localidad}</p>
        </div>
        <div className="flex flex-wrap items-start gap-3">
          <PeriodoSelector periodo={periodo} />
          <ExportacionRefugio periodo={periodo} token={token} />
        </div>
      </div>

      <p className="text-xs font-medium text-neutral-600">Período: {etiquetaPeriodo(periodo.desde, periodo.hasta)}</p>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <KpiCard etiqueta="Animales adoptados" valor={dashboard.kpis.animalesAdoptados} icono={HeartHandshake} color="verde" />
        <KpiCard etiqueta="Solicitudes" valor={dashboard.kpis.solicitudesCreadas} icono={ClipboardList} color="celeste" />
        <KpiCard etiqueta="En refugio" valor={dashboard.kpis.animalesEnRefugio} icono={PawPrint} color="naranja" />
        <KpiCard
          etiqueta="Donación del período"
          valor={`$${dashboard.kpis.montoDonado.toLocaleString("es-AR")}`}
          icono={HeartHandshake}
          color="verde"
          destacado
          nota={`Objetivo: $${dashboard.kpis.objetivoDonaciones.toLocaleString("es-AR")}`}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-1">
          <DonutChart
            titulo="Solicitudes recibidas"
            items={dashboard.solicitudesPorEstado.map((s) => ({ etiqueta: s.estado, valor: s.cantidad }))}
          />
        </div>
        <div className="md:col-span-2">
          <DonacionesChart items={dashboard.donacionesPorMes} />
        </div>
      </div>
    </div>
  );
}
