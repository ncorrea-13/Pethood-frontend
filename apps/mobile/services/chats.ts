/**
 * Chat (HU-5.1 listado de conversaciones). Contrato en
 * `pethood-backend/docs/api-chats.md`.
 */
import { get } from './api';

/**
 * El otro lado de la conversación, ya resuelto por el backend: el cliente no tiene que
 * averiguar cuál de los dos participantes es "el otro" ni si es una persona o un refugio.
 */
export interface ContactoChat {
  /** Derivado por el backend a partir de si el chat tiene refugio; no es `chat_tipo`. */
  tipo: 'USUARIO' | 'REFUGIO';
  /** Id del usuario o del refugio, según `tipo`. **No** es el `chatId`. */
  id: number;
  nombre: string;
  /** Ruta relativa: pasarla por `urlAbsoluta` antes de renderizarla. */
  imagenUrl: string | null;
  /** `false` si la cuenta del contacto está dada de baja. El chat se muestra igual. */
  activo: boolean;
}

export interface UltimoMensaje {
  /** Sin truncar: el recorte es visual, con `numberOfLines`. */
  contenido: string;
  /** ISO 8601 crudo. El texto relativo lo arma `tiempoRelativo`. */
  fecha: string;
  esMio: boolean;
  /** Con `contenido` vacío significa mensaje de sólo foto. */
  tieneImagen: boolean;
}

export interface Conversacion {
  chatId: number;
  contacto: ContactoChat;
  /** `null` cuando la sala se creó pero todavía nadie escribió. */
  ultimoMensaje: UltimoMensaje | null;
  /** Mensajes del otro que el usuario no leyó. Absoluto, no un delta. */
  noLeidos: number;
  /** Clave de orden, nunca null: fecha del último mensaje o de creación del chat. */
  fechaUltimaActividad: string;
}

export interface ListaChats {
  /** Siempre coincide con `chats.length`. */
  total: number;
  chats: Conversacion[];
}

/**
 * La lista viene completa (no pagina) y **ya ordenada** por `fechaUltimaActividad`
 * descendente: no reordenar en el cliente.
 */
export function listarChats(): Promise<ListaChats> {
  return get('/chats');
}
