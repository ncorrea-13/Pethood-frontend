/**
 * Validación de texto reutilizable. Funciones puras, sin dependencias.
 * Espejo de `pethood-backend/src/shared/validation/text.ts`.
 *
 * Devuelven el mensaje de error o `null` si el valor es válido, que es lo que consume
 * directamente la prop `error` de los inputs.
 */

export function mensajeLongitud(etiqueta: string, min: number, max: number): string {
  return `${etiqueta} debe tener entre ${min} y ${max} caracteres`;
}

/** Texto con trim previo: un valor de solo espacios queda vacío y falla por `min`. */
export function validarTexto(
  valor: string,
  opciones: { min?: number; max: number; etiqueta: string; obligatorio?: boolean },
): string | null {
  const { min = 0, max, etiqueta, obligatorio = true } = opciones;
  const recortado = valor.trim();

  if (!recortado && !obligatorio) return null;
  if (!recortado && min === 0) return `${etiqueta} es obligatorio`;

  if (recortado.length < min || recortado.length > max) {
    return mensajeLongitud(etiqueta, min, max);
  }

  return null;
}
