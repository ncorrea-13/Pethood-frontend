import { get, postFormData } from './api';

export type Tamanio = 'PEQUENO' | 'MEDIANO' | 'GRANDE';
export type Genero = 'MACHO' | 'HEMBRA';
export type Destino = 'PROPIA' | 'ADOPCION';

export interface Mascota {
  id: number;
  nombre: string | null;
  fechaNacimiento: string | null;
  genero: Genero;
  peso: number | null;
  tamanio: Tamanio | null;
  imagenUrl: string | null;
  especie: { id: number; nombre: string };
  raza: { id: number; nombre: string };
  estado: { id: number; nombre: string };
  refugioId: number | null;
  usuarioId: number;
  habilitaPublicacion: boolean;
}

export interface DatosNuevaMascota {
  nombre: string;
  fechaNacimiento: string;
  genero: Genero;
  peso: string;
  tamanio: Tamanio;
  especieId: number;
  razaId: number;
  /** Solo el adoptante lo manda: indica si la mascota es propia o para adopción. */
  destino?: Destino;
  /** Solo el refugio lo manda. */
  estadoMascotaId?: number;
  foto: { uri: string; nombre: string; tipo: string };
}

export function crearMascota(datos: DatosNuevaMascota): Promise<Mascota> {
  const formData = new FormData();

  formData.append('nombre', datos.nombre);
  formData.append('fechaNacimiento', datos.fechaNacimiento);
  formData.append('genero', datos.genero);
  formData.append('peso', datos.peso);
  formData.append('tamanio', datos.tamanio);
  formData.append('especieId', String(datos.especieId));
  formData.append('razaId', String(datos.razaId));

  if (datos.destino) formData.append('destino', datos.destino);
  if (datos.estadoMascotaId) formData.append('estadoMascotaId', String(datos.estadoMascotaId));

  formData.append('foto', {
    uri: datos.foto.uri,
    name: datos.foto.nombre,
    type: datos.foto.tipo,
  } as unknown as Blob);

  return postFormData('/mascotas', formData);
}

export function listarMisMascotas(): Promise<Mascota[]> {
  return get('/mascotas/mias');
}
