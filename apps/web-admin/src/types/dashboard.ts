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
