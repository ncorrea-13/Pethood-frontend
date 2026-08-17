import type { ApiErrorBody } from "@/types/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api/v1";

export class ApiError extends Error {
  codigo: string;
  status: number;

  constructor(status: number, body: ApiErrorBody["error"]) {
    super(body.mensaje);
    this.codigo = body.codigo;
    this.status = status;
  }
}

interface ApiFetchOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  token?: string;
}

// Cliente fetch tipado a /api/v1 — usar desde services/*, nunca desde componentes directamente.
export async function apiFetch<T>(ruta: string, options: ApiFetchOptions = {}): Promise<T> {
  const { body, token, headers, ...resto } = options;

  const res = await fetch(`${API_URL}${ruta}`, {
    ...resto,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const errorBody = (await res.json().catch(() => null)) as ApiErrorBody | null;
    throw new ApiError(
      res.status,
      errorBody?.error ?? { codigo: "ERROR_DESCONOCIDO", mensaje: "Ocurrió un error inesperado." },
    );
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}
