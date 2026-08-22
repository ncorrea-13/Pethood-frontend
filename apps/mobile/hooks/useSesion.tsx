/** Estado de sesión de la app: quién está logueado y con qué rol. */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

import * as authService from '@/services/auth';
import {
  borrarSesion,
  esMiembroDeRefugio,
  guardarSesion,
  guardarUsuario,
  obtenerToken,
  obtenerUsuario,
} from '@/services/sesion';
import type { Usuario } from '@/types/auth';

interface ContextoSesion {
  usuario: Usuario | null;
  /** JWT de login con email/contraseña o de OAuth 2.0 (Google). */
  token: string | null;
  autenticado: boolean;
  /** Mientras se lee la sesión guardada, para no parpadear entre login y home. */
  cargando: boolean;
  esRefugio: boolean;
  establecerSesion: (token: string, usuario: Usuario) => Promise<void>;
  actualizarUsuario: (usuario: Usuario) => Promise<void>;
  iniciarSesion: (email: string, contrasena: string) => Promise<void>;
  cerrarSesion: () => Promise<void>;
}

const Contexto = createContext<ContextoSesion | null>(null);

export function useSesion(): ContextoSesion {
  const contexto = useContext(Contexto);

  if (!contexto) {
    throw new Error('useSesion necesita estar dentro de <SesionProvider>');
  }

  return contexto;
}

export function SesionProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    void Promise.all([obtenerToken(), obtenerUsuario()])
      .then(([tokenGuardado, usuarioGuardado]) => {
        setToken(tokenGuardado);
        setUsuario(usuarioGuardado);
      })
      .finally(() => setCargando(false));
  }, []);

  const establecerSesion = useCallback(async (nuevoToken: string, nuevoUsuario: Usuario) => {
    setToken(nuevoToken);
    setUsuario(nuevoUsuario);
    await guardarSesion(nuevoToken, nuevoUsuario);
  }, []);

  const actualizarUsuario = useCallback(async (nuevoUsuario: Usuario) => {
    setUsuario(nuevoUsuario);
    await guardarUsuario(nuevoUsuario);
  }, []);

  const iniciarSesion = useCallback(
    async (email: string, contrasena: string) => {
      const respuesta = await authService.login(email, contrasena);
      await establecerSesion(respuesta.token, respuesta.usuario);
    },
    [establecerSesion],
  );

  const cerrarSesion = useCallback(async () => {
    const tokenActual = token;
    setToken(null);
    setUsuario(null);
    await borrarSesion();
    if (tokenActual) {
      await authService.logout(tokenActual).catch(() => undefined);
    }
  }, [token]);

  const valor = useMemo<ContextoSesion>(
    () => ({
      usuario,
      token,
      autenticado: Boolean(token),
      cargando,
      esRefugio: esMiembroDeRefugio(usuario),
      establecerSesion,
      actualizarUsuario,
      iniciarSesion,
      cerrarSesion,
    }),
    [usuario, token, cargando, establecerSesion, actualizarUsuario, iniciarSesion, cerrarSesion],
  );

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}
