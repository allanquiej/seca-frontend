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
  ISRAsalariadoRequest,
  ISRAsalariadoResponse,
  ISREmpresaMensualRequest,
  ISREmpresaMensualResponse,
  ISREmpresaMensualV2Request,
  ISREmpresaMensualV2Response,
  ISREmpresaTrimestralRequest,
  ISREmpresaTrimestralResponse,
  ISRTrimestralV2Request,
  ISRTrimestralV2Response,
  ISOTrimestralRequest,
  ISOTrimestralResponse,
  PrestacionesCompletasRequest,
  PrestacionesCompletasResponse,
  IVARequest,
  IVAResponse,
  RespuestaApi,
} from "../types/calculadoras";

/**
 * POST /api/calculadoras/indemnizacion
 */
export function calcularIndemnizacion(data: IndemnizacionRequest) {
  return apiPostJson<IndemnizacionRequest, RespuestaApi<IndemnizacionResponse>>(
    "/api/calculadoras/indemnizacion",
    data
  );
}

/**
 * POST /api/calculadoras/bono14
 */
export function calcularBono14(data: Bono14Request) {
  return apiPostJson<Bono14Request, RespuestaApi<Bono14Response>>(
    "/api/calculadoras/bono14",
    data
  );
}

/**
 * POST /api/calculadoras/aguinaldo
 */
export function calcularAguinaldo(data: AguinaldoRequest) {
  return apiPostJson<AguinaldoRequest, RespuestaApi<AguinaldoResponse>>(
    "/api/calculadoras/aguinaldo",
    data
  );
}

/**
 * POST /api/calculadoras/isr-laboral (VIEJO)
 */
export function calcularISRLaboral(data: ISRLaboralRequest) {
  return apiPostJson<ISRLaboralRequest, RespuestaApi<ISRLaboralResponse>>(
    "/api/calculadoras/isr-laboral",
    data
  );
}

/**
 * 🆕 POST /api/calculadoras/isr-asalariado (NUEVO - CORRECTO)
 */
export function calcularISRAsalariado(data: ISRAsalariadoRequest) {
  return apiPostJson<ISRAsalariadoRequest, RespuestaApi<ISRAsalariadoResponse>>(
    "/api/calculadoras/isr-asalariado",
    data
  );
}

/**
 * POST /api/calculadoras/isr-empresa-mensual (VIEJO)
 */
export function calcularISREmpresaMensual(data: ISREmpresaMensualRequest) {
  return apiPostJson<ISREmpresaMensualRequest, RespuestaApi<ISREmpresaMensualResponse>>(
    "/api/calculadoras/isr-empresa-mensual",
    data
  );
}

/**
 * 🆕 POST /api/calculadoras/isr-empresa-mensual-v2 (NUEVO - CORRECTO)
 */
export function calcularISREmpresaMensualV2(data: ISREmpresaMensualV2Request) {
  return apiPostJson<ISREmpresaMensualV2Request, RespuestaApi<ISREmpresaMensualV2Response>>(
    "/api/calculadoras/isr-empresa-mensual-v2",
    data
  );
}

/**
 * POST /api/calculadoras/isr-empresa-trimestral (VIEJO)
 */
export function calcularISREmpresaTrimestral(data: ISREmpresaTrimestralRequest) {
  return apiPostJson<ISREmpresaTrimestralRequest, RespuestaApi<ISREmpresaTrimestralResponse>>(
    "/api/calculadoras/isr-empresa-trimestral",
    data
  );
}

/**
 * 🆕 POST /api/calculadoras/isr-empresa-trimestral-v2 (NUEVO - CORRECTO)
 */
export function calcularISRTrimestralV2(data: ISRTrimestralV2Request) {
  return apiPostJson<ISRTrimestralV2Request, RespuestaApi<ISRTrimestralV2Response>>(
    "/api/calculadoras/isr-empresa-trimestral-v2",
    data
  );
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
 * POST /api/calculadoras/prestaciones-completas
 */
export function calcularPrestacionesCompletas(data: PrestacionesCompletasRequest) {
  return apiPostJson<PrestacionesCompletasRequest, RespuestaApi<PrestacionesCompletasResponse>>(
    "/api/calculadoras/prestaciones-completas",
    data
  );
}

/**
 * 🆕 POST /api/calculadoras/iva
 * Calcula el IVA según el régimen seleccionado
 */
export function calcularIVA(data: IVARequest) {
  return apiPostJson<IVARequest, RespuestaApi<IVAResponse>>(
    "/api/calculadoras/iva",
    data
  );
}