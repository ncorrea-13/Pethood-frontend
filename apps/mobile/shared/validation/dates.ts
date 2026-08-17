/**
 * Utilidades de fecha reutilizables. Funciones puras, sin dependencias.
 * Espejo de `pethood-backend/src/shared/validation/dates.ts`.
 */
import { LIMITES } from './limits';

const SOLO_FECHA = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * Parsea texto ISO o Date. Devuelve null si no es una fecha real.
 * Un `AAAA-MM-DD` se arma como medianoche local: interpretarlo como UTC corre el día.
 */
export function parsearFecha(valor: string | Date | null | undefined): Date | null {
  if (valor === null || valor === undefined || valor === '') return null;
  if (valor instanceof Date) return Number.isNaN(valor.getTime()) ? null : valor;

  const partes = SOLO_FECHA.exec(valor);
  const fecha = partes
    ? new Date(Number(partes[1]), Number(partes[2]) - 1, Number(partes[3]))
    : new Date(valor);

  return Number.isNaN(fecha.getTime()) ? null : fecha;
}

export function finDelDia(fecha: Date): Date {
  const copia = new Date(fecha);
  copia.setHours(23, 59, 59, 999);
  return copia;
}

export function inicioDelDia(fecha: Date): Date {
  const copia = new Date(fecha);
  copia.setHours(0, 0, 0, 0);
  return copia;
}

/** Compara contra el fin del día de hoy, así una fecha de hoy nunca cuenta como futura. */
export function esFutura(fecha: Date, hoy: Date = new Date()): boolean {
  return fecha.getTime() > finDelDia(hoy).getTime();
}

export function esAnteriorAlAnioMinimo(
  fecha: Date,
  anioMinimo: number = LIMITES.fecha.anioMinimo,
): boolean {
  return fecha.getFullYear() < anioMinimo;
}

/** Formatea a `AAAA-MM-DD` en hora local — `toISOString` corre el día según timezone. */
export function aFechaISO(fecha: Date): string {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
}

/** Edad en texto a partir de la fecha de nacimiento: "3 años", "5 meses", "recién nacido". */
export function edadEnTexto(fechaNacimiento: Date, hoy: Date = new Date()): string {
  const meses =
    (hoy.getFullYear() - fechaNacimiento.getFullYear()) * 12 +
    (hoy.getMonth() - fechaNacimiento.getMonth()) -
    (hoy.getDate() < fechaNacimiento.getDate() ? 1 : 0);

  if (meses < 1) return 'Recién nacido';
  if (meses < 12) return `${meses} ${meses === 1 ? 'mes' : 'meses'}`;

  const anios = Math.floor(meses / 12);
  return `${anios} ${anios === 1 ? 'año' : 'años'}`;
}

/** Formato para mostrar al usuario. */
export function aFechaVisible(fecha: Date): string {
  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  return `${dia}/${mes}/${fecha.getFullYear()}`;
}

/** Fecha de algo que ya pasó: existente, no futura y ≥ al año mínimo. */
export function validarFechaPasada(
  valor: string | Date | null | undefined,
  etiqueta: string,
): string | null {
  const fecha = parsearFecha(valor);

  if (!fecha) return `${etiqueta} es obligatoria`;
  if (esFutura(fecha)) return `${etiqueta} no puede ser futura`;
  if (esAnteriorAlAnioMinimo(fecha)) {
    return `${etiqueta} no puede ser anterior a ${LIMITES.fecha.anioMinimo}`;
  }

  return null;
}
