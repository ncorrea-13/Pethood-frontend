/** Estado de sesión de la app: quién está logueado y con qué rol. */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import * as authService from '../services/auth';
import {
  borrarSesion,
  esRefugio as usuarioEsRefugio,
  obtenerUsuario,
  type UsuarioSesion,
} from '../services/sesion';

interface ContextoSesion {
  usuario: UsuarioSesion | null;
  /** Mientras se lee la sesión guardada, para no parpadear entre login y home. */
  cargando: boolean;
  esRefugio: boolean;
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
  const [usuario, setUsuario] = useState<UsuarioSesion | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    obtenerUsuario()
      .then(setUsuario)
      .finally(() => setCargando(false));
  }, []);

  const iniciarSesion = useCallback(async (email: string, contrasena: string) => {
    setUsuario(await authService.login(email, contrasena));
  }, []);

  const cerrarSesion = useCallback(async () => {
    await borrarSesion();
    setUsuario(null);
  }, []);

  const valor = useMemo<ContextoSesion>(
    () => ({
      usuario,
      cargando,
      esRefugio: usuarioEsRefugio(usuario),
      iniciarSesion,
      cerrarSesion,
    }),
    [usuario, cargando, iniciarSesion, cerrarSesion],
  );

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}
