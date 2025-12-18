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
  aniosTrabajados: number;
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
  mesesTrabajados: number;
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
  mesesTrabajados: number;
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
