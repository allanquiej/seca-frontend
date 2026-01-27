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
// ISR LABORAL
// ===============================
export type ISRLaboralRequest = {
  sueldoMensual: number;
};

export type ISRLaboralResponse = {
  isrCalculado: number;
  detalleCalculo: string;
};

// ISR EMPRESA MENSUAL
export type ISREmpresaMensualRequest = {
  ingresosMensuales: number;
  costosMensuales?: number;  // ✅ opcional
  gastosMensuales?: number;  // ✅ opcional
};

export type ISREmpresaMensualResponse = {
  isrCalculado: number;
  detalleCalculo: string;
};

// ISR EMPRESA TRIMESTRAL
export type ISREmpresaTrimestralRequest = {
  ingresosTrimestrales: number;
  costosTrimestrales?: number; // ✅ opcional
  gastosTrimestrales?: number; // ✅ opcional
};
export type ISREmpresaTrimestralResponse = {
  isrCalculado: number;
  detalleCalculo: string;
};

// ISO TRIMESTRAL
export type ISOTrimestralRequest = {
  ingresosTrimestrales: number;
  activoNeto?: number; // ✅ opcional
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
// 🆕 PRESTACIONES LABORALES COMPLETAS
// ===============================

// ✅ SOLUCIÓN: Usar type literal en lugar de enum para evitar error de erasableSyntaxOnly
export type TipoTerminacion = 1 | 2 | 3 | 4 | 5;

// Constantes para los valores (opcional, para mayor claridad en el código)
export const TIPO_TERMINACION = {
  DespidoInjustificado: 1 as TipoTerminacion,
  DespidoJustificado: 2 as TipoTerminacion,
  RenunciaVoluntaria: 3 as TipoTerminacion,
  RenunciaCausaJusta: 4 as TipoTerminacion,
  PensionIGSS: 5 as TipoTerminacion,
} as const;

export type PrestacionesCompletasRequest = {
  // Fechas
  fechaInicio: string; // "YYYY-MM-DD"
  fechaFin: string;    // "YYYY-MM-DD"
  
  // Salarios
  salarioOrdinario: number;
  salariosUltimos6Meses: number[];
  
  // Tipo de terminación
  tipoTerminacion: TipoTerminacion;
  
  // Vacaciones
  diasVacacionesPendientes: number;
  
  // Prestaciones recibidas
  yaRecibioAguinaldo: boolean;
  yaRecibiBono14: boolean;
  
  // Pensión IGSS (opcional)
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