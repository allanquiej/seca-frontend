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
  fechaInicio: string;
  fechaFin: string;
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
// ISR LABORAL (VIEJO - mantener)
// ===============================
export type ISRLaboralRequest = {
  sueldoMensual: number;
};

export type ISRLaboralResponse = {
  isrCalculado: number;
  detalleCalculo: string;
};

// ===============================
// ISR ASALARIADO (NUEVO - CORRECTO)
// ===============================
export type ISRAsalariadoRequest = {
  salariosAnuales: number;
  bono14: number;
  aguinaldo: number;
  otrosBonos: number;
  esProyectado: boolean;
};

export type ISRAsalariadoResponse = {
  totalIngresos: number;
  deduccionPersonal: number;
  baseImponible: number;
  isrTotal: number;
  isrMensual: number;
  tipoCalculo: string;
  detalleCalculo: string;
};

// ===============================
// ISR EMPRESA MENSUAL (VIEJO - mantener)
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
// ISR EMPRESA MENSUAL V2 (NUEVO - CORRECTO)
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
// ISR EMPRESA TRIMESTRAL (VIEJO - mantener)
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
// ISR TRIMESTRAL V2 (NUEVO - CORRECTO)
// ===============================
export type ISRTrimestralV2Request = {
  ventasAcumuladas: number;
  gastosAcumulados: number;
  ventasTrimestre: number;
  isoPendiente: number;
  usarOpcionAcumulada: boolean;
};

export type ISRTrimestralV2Response = {
  opcionUtilizada: string;
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

// ===============================
// 🆕 IVA (Impuesto al Valor Agregado)
// ===============================

export type RegimenIVA = "general" | "pequeno" | "exento";

export type IVARequest = {
  regimen: RegimenIVA;
  // Para Régimen General
  ventasMes: number;
  comprasMes: number;
  retenciones: number;
  // Para Pequeño Contribuyente
  ingresosAnuales: number;
};

export type IVAResponse = {
  regimenNombre: string;
  // Para Régimen General
  debitoFiscal: number;
  creditoFiscal: number;
  ivaBruto: number;
  ivaAPagar: number;
  // Para Pequeño Contribuyente
  cuotaFija: number;
  // Para todos
  aplica: boolean;
  mensaje: string;
  detalleCalculo: string;
};