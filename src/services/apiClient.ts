// src/services/apiClient.ts

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined;

if (!API_BASE_URL) {
  console.warn(
    "⚠️ No se definió VITE_API_BASE_URL. Revisa el archivo .env en la raíz del proyecto."
  );
}

function buildUrl(path: string): string {
  if (!API_BASE_URL) {
    throw new Error(
      "La URL base de la API (VITE_API_BASE_URL) no está configurada."
    );
  }

  return `${API_BASE_URL.replace(/\/$/, "")}${path}`;
}

/**
 * GET que devuelve TEXTO (ej: /api/status)
 */
export async function apiGetText(path: string): Promise<string> {
  const url = buildUrl(path);

  const response = await fetch(url);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Error HTTP ${response.status}: ${text || response.statusText}`
    );
  }

  return await response.text();
}

/**
 * GET que devuelve JSON (lo usaremos más adelante)
 */
export async function apiGetJson<TResponse>(path: string): Promise<TResponse> {
  const url = buildUrl(path);

  const response = await fetch(url);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Error HTTP ${response.status}: ${text || response.statusText}`
    );
  }

  return (await response.json()) as TResponse;
}

/**
 * POST que envía y recibe JSON.
 * TRequest = lo que enviamos
 * TResponse = lo que esperamos recibir
 */
export async function apiPostJson<TRequest, TResponse>(
  path: string,
  body: TRequest
): Promise<TResponse> {
  const url = buildUrl(path);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Error HTTP ${response.status}: ${text || response.statusText}`
    );
  }

  return (await response.json()) as TResponse;
}
