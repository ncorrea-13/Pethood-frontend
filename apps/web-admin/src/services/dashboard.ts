import { apiFetch } from "./api";
import type { DashboardAdmin, EntidadExportable } from "@/types/dashboard";

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
