import { post } from './api';
import { guardarSesion, type UsuarioSesion } from './sesion';

interface RespuestaLogin {
  token: string;
  usuario: UsuarioSesion;
}

export async function login(email: string, contrasena: string): Promise<UsuarioSesion> {
  const { token, usuario } = await post<RespuestaLogin>('/auth/login', { email, contrasena });

  await guardarSesion(token, usuario);
  return usuario;
}
