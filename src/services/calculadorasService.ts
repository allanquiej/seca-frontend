// src/services/calculadorasService.ts
import { apiPostJson } from "./apiClient";
import type {
  IndemnizacionRequest,
  IndemnizacionResponse,
  Bono14Request,
  Bono14Response,
  AguinaldoRequest,
  AguinaldoResponse,
  ISRLaboralRequest,
  ISRLaboralResponse,
  ISREmpresaMensualRequest,
  ISREmpresaMensualResponse,
  ISREmpresaTrimestralRequest,
  ISREmpresaTrimestralResponse,
  ISOTrimestralRequest,
  ISOTrimestralResponse,
  PrestacionesCompletasRequest,
  PrestacionesCompletasResponse,
  RespuestaApi,
} from "../types/calculadoras";

/**
 * Llama al endpoint POST /api/calculadoras/indemnizacion
 * enviando salarioMensual y aniosTrabajados.
 *
 * IMPORTANTE:
 * El endpoint del backend se llama exactamente:
 *   POST /api/calculadoras/indemnizacion
 */
export function calcularIndemnizacion(data: IndemnizacionRequest) {
  return apiPostJson<
    IndemnizacionRequest,
    RespuestaApi<IndemnizacionResponse>
  >("/api/calculadoras/indemnizacion", data);
}

/**
 * Llama al endpoint POST /api/calculadoras/bono14
 * enviando salarioPromedio y mesesTrabajados.
 *
 * IMPORTANTE:
 * El endpoint del backend se llama exactamente:
 *   POST /api/calculadoras/bono14
 */
export function calcularBono14(data: Bono14Request) {
  return apiPostJson<Bono14Request, RespuestaApi<Bono14Response>>(
    "/api/calculadoras/bono14",
    data
  );
}

/**
 * Llama al endpoint POST /api/calculadoras/aguinaldo
 * enviando salarioPromedio y mesesTrabajados.
 *
 * IMPORTANTE:
 * El endpoint del backend se llama exactamente:
 *   POST /api/calculadoras/aguinaldo
 */
export function calcularAguinaldo(data: AguinaldoRequest) {
  return apiPostJson<AguinaldoRequest, RespuestaApi<AguinaldoResponse>>(
    "/api/calculadoras/aguinaldo",
    data
  );
}

/**
 * Llama al endpoint POST /api/calculadoras/isr-laboral
 * enviando sueldoMensual.
 */
export function calcularISRLaboral(data: ISRLaboralRequest) {
  return apiPostJson<ISRLaboralRequest, RespuestaApi<ISRLaboralResponse>>(
    "/api/calculadoras/isr-laboral",
    data
  );
}


/**
 * POST /api/calculadoras/isr-empresa-mensual
 */
export function calcularISREmpresaMensual(data: ISREmpresaMensualRequest) {
  return apiPostJson<
    ISREmpresaMensualRequest,
    RespuestaApi<ISREmpresaMensualResponse>
  >("/api/calculadoras/isr-empresa-mensual", data);
}

/**
 * POST /api/calculadoras/isr-empresa-trimestral
 */
export function calcularISREmpresaTrimestral(
  data: ISREmpresaTrimestralRequest
) {
  return apiPostJson<
    ISREmpresaTrimestralRequest,
    RespuestaApi<ISREmpresaTrimestralResponse>
  >("/api/calculadoras/isr-empresa-trimestral", data);
}

/**
 * POST /api/calculadoras/iso-trimestral
 */
export function calcularISOTrimestral(data: ISOTrimestralRequest) {
  return apiPostJson<ISOTrimestralRequest, RespuestaApi<ISOTrimestralResponse>>(
    "/api/calculadoras/iso-trimestral",
    data
  );
}

/**
 * 🆕 POST /api/calculadoras/prestaciones-completas
 * Calcula todas las prestaciones laborales de una vez:
 * - Indemnización
 * - Aguinaldo proporcional
 * - Bono 14 proporcional
 * - Vacaciones no gozadas
 * - Bonificación Q250
 */
export function calcularPrestacionesCompletas(
  data: PrestacionesCompletasRequest
) {
  return apiPostJson<
    PrestacionesCompletasRequest,
    RespuestaApi<PrestacionesCompletasResponse>
  >("/api/calculadoras/prestaciones-completas", data);
}