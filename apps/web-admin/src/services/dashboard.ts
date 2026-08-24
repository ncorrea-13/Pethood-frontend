import { apiFetch } from "./api";
import type { DashboardAdmin, DashboardRefugio, EntidadExportable, PeriodoDashboard } from "@/types/dashboard";

export function obtenerDashboard(token: string): Promise<DashboardAdmin> {
  return apiFetch<DashboardAdmin>("/admin/dashboard", { token });
}

export function esDashboardVacio(dashboard: DashboardAdmin): boolean {
  return Object.values(dashboard.kpis).every((valor) => valor === 0);
}

// GET exportar/:entidad no devuelve JSON — se usa aparte de apiFetch (que siempre parsea JSON).
export async function descargarExportacion(entidad: EntidadExportable, token: string): Promise<Blob> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api/v1";
  const res = await fetch(`${API_URL}/admin/dashboard/exportar/${entidad}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error?.mensaje ?? "No se pudo generar la exportación.");
  }

  return res.blob();
}

// --- Dashboard Refugio (GUI-38, HU-14.2) --------------------------------------------------
// Endpoints propuestos, no confirmados por spec (ver nota en types/dashboard.ts): el back
// scopea por refugioId a partir del JWT, así que solo viajan desde/hasta como query params.

export function obtenerDashboardRefugio(token: string, periodo: PeriodoDashboard): Promise<DashboardRefugio> {
  return apiFetch<DashboardRefugio>(`/refugio/dashboard?desde=${periodo.desde}&hasta=${periodo.hasta}`, { token });
}

export function esDashboardRefugioVacio(dashboard: DashboardRefugio): boolean {
  return (
    dashboard.kpis.animalesAdoptados === 0 &&
    dashboard.kpis.solicitudesCreadas === 0 &&
    dashboard.kpis.animalesEnRefugio === 0 &&
    dashboard.kpis.montoDonado === 0
  );
}

// Igual que descargarExportacion: no pasa por apiFetch porque la respuesta no es JSON.
export async function descargarExportacionRefugio(periodo: PeriodoDashboard, token: string): Promise<Blob> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api/v1";
  const res = await fetch(`${API_URL}/refugio/dashboard/exportar?desde=${periodo.desde}&hasta=${periodo.hasta}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error?.mensaje ?? "No se pudo generar la exportación.");
  }

  return res.blob();
}
