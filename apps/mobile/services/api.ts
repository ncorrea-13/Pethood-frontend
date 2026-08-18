import type { ApiErrorBody } from '@/types/api';

export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000/api/v1';

export class ApiError extends Error {
  codigo: string;
  status: number;
  mensaje: string;

  constructor(status: number, body: ApiErrorBody['error']) {
    super(body.mensaje);
    this.codigo = body.codigo;
    this.status = status;
    this.mensaje = body.mensaje;
  }
}

interface ApiFetchOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  token?: string;
}

function esFormData(body: unknown): body is FormData {
  return typeof FormData !== 'undefined' && body instanceof FormData;
}

export async function apiFetch<T>(ruta: string, options: ApiFetchOptions = {}): Promise<T> {
  const { body, token, headers, ...resto } = options;
  const formData = esFormData(body);

  const res = await fetch(`${API_URL}${ruta}`, {
    ...resto,
    headers: {
      ...(formData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body === undefined ? undefined : formData ? body : JSON.stringify(body),
  });

  if (!res.ok) {
    const errorBody = (await res.json().catch(() => null)) as ApiErrorBody | null;
    throw new ApiError(
      res.status,
      errorBody?.error ?? {
        codigo: 'ERROR_DESCONOCIDO',
        mensaje: 'No pudimos completar la acción. Revisá tu conexión e intentalo de nuevo.',
      },
    );
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}
