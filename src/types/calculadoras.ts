// src/types/calculadoras.ts

// Respuesta genérica de la API
export type RespuestaApi<TDatos> = {
  exito: boolean;
  datos?: TDatos;
  mensaje: string;
};

// ===============================
// INDEMNIZACIÓN
// ===============================
export type IndemnizacionRequest = {
  salarioMensual: number;
  fechaInicio: string; // "YYYY-MM-DD"
  fechaFin: string;    // "YYYY-MM-DD"
};

export type IndemnizacionResponse = {
  montoIndemnizacion: number;
  detalleCalculo: string;
};

// ===============================
// BONO 14
// ===============================
export type Bono14Request = {
  salarioPromedio: number;
  fechaInicio: string;
  fechaFin: string;
};

export type Bono14Response = {
  montoBono14: number;
  detalleCalculo: string;
};

// ===============================
// AGUINALDO
// ===============================
export type AguinaldoRequest = {
  salarioPromedio: number;
  fechaInicio: string;
  fechaFin: string;
};

export type AguinaldoResponse = {
  montoAguinaldo: number;
  detalleCalculo: string;
};

// ===============================
// ISR LABORAL (VIEJO)
// ===============================
export type ISRLaboralRequest = {
  sueldoMensual: number;
};

export type ISRLaboralResponse = {
  isrCalculado: number;
  detalleCalculo: string;
};

// ===============================
// 🆕 ISR ASALARIADO (NUEVO - CORREGIDO)
// ===============================
export type ISRAsalariadoRequest = {
  salariosAnuales: number;
  bono14: number;
  aguinaldo: number;
  otrosBonos: number;
  esProyectado: boolean; // true = mensual, false = definitiva anual
};

export type ISRAsalariadoResponse = {
  totalIngresos: number;
  deduccionPersonal: number; // Q48,000
  baseImponible: number;
  isrTotal: number;
  isrMensual: number; // Solo si es proyectado
  tipoCalculo: string; // "Proyectado" o "Definitiva"
  detalleCalculo: string;
};

// ===============================
// ISR EMPRESA MENSUAL (VIEJO)
// ===============================
export type ISREmpresaMensualRequest = {
  ingresosMensuales: number;
  costosMensuales?: number;
  gastosMensuales?: number;
};

export type ISREmpresaMensualResponse = {
  isrCalculado: number;
  detalleCalculo: string;
};

// ===============================
// 🆕 ISR EMPRESA MENSUAL V2 (NUEVO - CORREGIDO)
// ===============================
export type ISREmpresaMensualV2Request = {
  totalFacturacionMes: number;
  totalRetenciones: number;
};

export type ISREmpresaMensualV2Response = {
  base: number;
  iva: number;
  isrPrimerosTreintaMil: number;
  isrExcedente: number;
  isrTotal: number;
  isrAPagar: number;
  detalleCalculo: string;
};

// ===============================
// ISR EMPRESA TRIMESTRAL (VIEJO)
// ===============================
export type ISREmpresaTrimestralRequest = {
  ingresosTrimestrales: number;
  costosTrimestrales?: number;
  gastosTrimestrales?: number;
};

export type ISREmpresaTrimestralResponse = {
  isrCalculado: number;
  detalleCalculo: string;
};

// ===============================
// 🆕 ISR TRIMESTRAL V2 (NUEVO - CORREGIDO)
// ===============================
export type ISRTrimestralV2Request = {
  // Para Opción 1 (Acumulado)
  ventasAcumuladas: number;
  gastosAcumulados: number;
  
  // Para Opción 2 (Solo trimestre)
  ventasTrimestre: number;
  
  // Común para ambas opciones
  isoPendiente: number;
  
  // Tipo de cálculo
  usarOpcionAcumulada: boolean; // true = Opción 1, false = Opción 2
};

export type ISRTrimestralV2Response = {
  opcionUtilizada: string; // "Opción 1 - Acumulado" o "Opción 2 - Trimestre"
  baseCalculo: number;
  isrCalculado: number;
  isoAcreditar: number;
  isrAPagar: number;
  detalleCalculo: string;
};

// ===============================
// ISO TRIMESTRAL
// ===============================
export type ISOTrimestralRequest = {
  ingresosTrimestrales: number;
  activoNeto?: number;
};

export type ISOTrimestralResponse = {
  isoCalculado: number;
  detalleCalculo: string;
};

// ===============================
// CONSULTOR
// ===============================
export type ConsultorRequest = {
  pregunta: string;
};

export type ConsultorResponse = {
  preguntaOriginal: string;
  respuesta: string;
  mensaje?: string;
};

// ===============================
// PRESTACIONES LABORALES COMPLETAS
// ===============================
export type TipoTerminacion = 1 | 2 | 3 | 4 | 5;

export const TIPO_TERMINACION = {
  DespidoInjustificado: 1 as TipoTerminacion,
  DespidoJustificado: 2 as TipoTerminacion,
  RenunciaVoluntaria: 3 as TipoTerminacion,
  RenunciaCausaJusta: 4 as TipoTerminacion,
  PensionIGSS: 5 as TipoTerminacion,
} as const;

export type PrestacionesCompletasRequest = {
  fechaInicio: string;
  fechaFin: string;
  salarioOrdinario: number;
  salariosUltimos6Meses: number[];
  tipoTerminacion: TipoTerminacion;
  diasVacacionesPendientes: number;
  yaRecibioAguinaldo: boolean;
  yaRecibiBono14: boolean;
  montoPensionIGSS?: number;
};

export type ComponentePrestacion = {
  aplica: boolean;
  monto: number;
  detalle: string;
};

export type PrestacionesCompletasResponse = {
  indemnizacion: ComponentePrestacion;
  aguinaldo: ComponentePrestacion;
  bono14: ComponentePrestacion;
  vacaciones: ComponentePrestacion;
  bonificacion250: ComponentePrestacion;
  totalLiquidacion: number;
  advertencias: string[];
  notasLegales: string[];
};