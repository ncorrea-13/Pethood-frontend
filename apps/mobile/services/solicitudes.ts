/**
 * Bandeja de "Solicitudes recibidas" (HU-7.4 resolver, HU-7.5 listado/detalle). "Quien
 * publicó la mascota" no es siempre un refugio: un adoptante particular también puede
 * gestionar acá las solicitudes de una mascota propia. Contrato en
 * `pethood-backend/docs/specs/003-adopcion-favoritos.md`.
 */
import { get, patch } from './api';

/** Nombres reales del catálogo EstadoSolicitud (prisma/seed.ts del backend). */
export type EstadoSolicitudNombre =
  | 'Pendiente'
  | 'En_Revision'
  | 'Aprobada'
  | 'Rechazada'
  | 'Cancelada';

/** El refugio/adoptante solo puede resolver una solicitud "Pendiente" hacia uno de estos dos destinos. */
export type EstadoResolucion = Extract<EstadoSolicitudNombre, 'Aprobada' | 'Rechazada'>;

export interface SolicitudResumen {
  id: number;
  publicacionId: number;
  mascota: { id: number; nombre: string | null; imagenUrl: string | null };
  solicitante: { id: number; nombre: string; apellido: string };
  tipoSolicitud: string;
  estado: { id: number; nombre: EstadoSolicitudNombre };
  comentario: string | null;
  fechaAlta: string;
  fechaRespuesta: string | null;
}

/** Una fila del histórico, ordenado del estado más reciente al más viejo. */
export interface EstadoSolicitudHistorial {
  id: number;
  nombre: EstadoSolicitudNombre;
  fecha: string;
}

export interface SolicitudDetalle extends SolicitudResumen {
  motivacion: string;
  historial: EstadoSolicitudHistorial[];
}

export interface ListaSolicitudesRecibidas {
  /** Total que matchea el filtro, no el largo de esta página. */
  total: number;
  solicitudes: SolicitudResumen[];
}

/** Tope de página que acepta el backend (`filtrosRecibidasSchema`). */
const LIMITE_MAXIMO = 50;

/**
 * Sin paginación en la UI: una sola página al tope permitido por el backend.
 * ponytail: si algún refugio supera las 50 solicitudes recibidas en un mismo estado, sumar
 * "cargar más" acá y en la pantalla.
 */
export function listarRecibidas(estado?: EstadoSolicitudNombre): Promise<ListaSolicitudesRecibidas> {
  const query = estado ? `?estado=${estado}&limite=${LIMITE_MAXIMO}` : `?limite=${LIMITE_MAXIMO}`;
  return get(`/solicitudes/recibidas${query}`);
}

export function obtenerSolicitud(id: number): Promise<SolicitudDetalle> {
  return get(`/solicitudes/${id}`);
}

export function resolverSolicitud(
  id: number,
  estado: EstadoResolucion,
  comentario: string,
): Promise<SolicitudDetalle> {
  return patch(`/solicitudes/${id}/estado`, {
    estado,
    ...(comentario.trim() ? { comentario: comentario.trim() } : {}),
  });
}
