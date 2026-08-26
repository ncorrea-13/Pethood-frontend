// Contrato alineado a spec 009 (../../../../Pethood_Back/docs/specs/009-dashboards-reportes-admin.md).

export interface DashboardKpis {
  usuariosActivos: number;
  mascotasRegistradas: number;
  refugiosVerificados: number;
  publicacionesActivas: number;
  adopcionesConcretadas: number;
  campaniasActivas: number;
  montoDonadoDeclarado: number;
  reportesPendientes: number;
}

export interface SolicitudPorEstado {
  estado: string;
  cantidad: number;
  porcentaje: number;
}

export interface PublicacionPorMes {
  mes: string;
  publicaciones: number;
  adopciones: number;
}

export interface DashboardAdmin {
  kpis: DashboardKpis;
  usuariosPorRol: Record<string, number>;
  mascotasPorEstado: Record<string, number>;
  solicitudesPorEstado: SolicitudPorEstado[];
  publicacionesPorMes: PublicacionPorMes[];
}

export const ENTIDADES_EXPORTABLES = [
  "usuarios",
  "mascotas",
  "publicaciones",
  "solicitudes",
  "campanias",
] as const;

export type EntidadExportable = (typeof ENTIDADES_EXPORTABLES)[number];

// --- Dashboard Refugio (GUI-38, HU-14.2) --------------------------------------------------
//
// Contrato PROPUESTO, no una spec aprobada: la spec 009 (§2) deja HU-14.2 fuera a propósito
// ("dashboard de gestión interna del Refugio — spec propia a futuro, mismo patrón de
// agregación pero scopeado a refugioId"). Todavía no existe esa spec ni el endpoint en el
// backend (solo hay `src/modules/dashboard-admin`). Este shape sigue el mismo criterio que
// DashboardAdmin de arriba y suma el rango de período (desde/hasta mensual) porque la pantalla
// lo pide — ajustar cuando se apruebe la spec real.

// Mes calendario en formato "YYYY-MM", el mismo que produce <input type="month">.
export type MesISO = string;

export interface PeriodoDashboard {
  desde: MesISO;
  hasta: MesISO;
}

export interface DashboardRefugioKpis {
  animalesAdoptados: number;
  solicitudesCreadas: number;
  animalesEnRefugio: number;
  montoDonado: number;
  objetivoDonaciones: number;
}

export interface DonacionPorMes {
  mes: string;
  monto: number;
  objetivo: number;
}

export interface DashboardRefugio {
  refugio: { nombre: string; localidad: string };
  periodo: PeriodoDashboard;
  kpis: DashboardRefugioKpis;
  solicitudesPorEstado: SolicitudPorEstado[];
  donacionesPorMes: DonacionPorMes[];
}
