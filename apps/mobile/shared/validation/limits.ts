/**
 * Límites de longitud y rango de los campos del dominio, en un solo lugar.
 *
 * ⚠️ ESPEJO MANUAL de `pethood-backend/src/shared/validation/limits.ts`.
 * Son repos separados: si cambiás un número acá, cambialo allá. Si divergen, el input
 * corta a una longitud y el server valida otra.
 */
export const LIMITES = {
  mascota: {
    nombre: { min: 2, max: 25 },
    peso: { min: 0.1, max: 999.9, decimales: 1 },
    /** Opcional. No confundir con la descripción de la publicación, que va aparte y es ≤50. */
    descripcion: { max: 2000 },
  },

  publicacion: {
    descripcion: { max: 50 },
    requisito: { max: 25 },
    ubicacion: { max: 50 },
    personalidad: { max: 25 },
    vacunas: { max: 200 },
    imagenes: { max: 5 },
  },

  fecha: { anioMinimo: 1900 },

  imagen: {
    tamanioMaximoBytes: 5 * 1024 * 1024,
    formatos: ['image/jpeg', 'image/png', 'image/webp'],
  },
} as const;
