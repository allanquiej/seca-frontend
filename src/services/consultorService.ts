// src/services/consultorService.ts
import { apiPostJson } from "./apiClient";
import type { ConsultorRequest, ConsultorResponse } from "../types/calculadoras";

/**
 * Envía la pregunta al backend para obtener una respuesta contable.
 */
export function preguntarConsultor(data: ConsultorRequest) {
  return apiPostJson<ConsultorRequest, ConsultorResponse>(
    "/api/consultor/preguntar",
    data
  );
}
