export type RolUsuario = 'ADOPTANTE' | 'MIEMBRO_REFUGIO' | 'ADMIN';

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  roles: RolUsuario[];
  imagenUrl?: string | null;
}

export interface RespuestaAuth {
  usuario: Usuario;
  token: string;
}

export interface RegistroPayload {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  fechaNacimiento: string;
  telefono: string;
}
