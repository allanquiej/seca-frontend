// src/types/calculadoras.ts

/**
 * Datos que el frontend envía al backend
 * para calcular la indemnización.
 */
export type IndemnizacionRequest = {
  salarioMensual: number;
  aniosTrabajados: number;
};

/**
 * Datos específicos que el backend devuelve
 * cuando el cálculo de indemnización es exitoso.
 */
export type IndemnizacionResponse = {
  montoIndemnizacion: number;
  detalleCalculo: string;
};

/**
 * Estructura general que el backend usa para responder
 * en la mayoría de las calculadoras:
 *
 * {
 *   exito: boolean;
 *   datos?: { ... };
 *   mensaje: string;
 * }
 */
export type RespuestaApi<TDatos> = {
  exito: boolean;
  datos?: TDatos;
  mensaje: string;
};
