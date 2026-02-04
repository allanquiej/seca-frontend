// src/types/calculadoras.ts
// ✅ ARCHIVO COMPLETO - REEMPLAZAR TODO

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
// ✅ ISR ASALARIADO (ACTUALIZADO - SAT-1901 COMPLETO)
// ===============================

export type ISRAsalariadoRequest = {
  // Sección 1: Identificación
  nitEmpleado: string;
  
  // Sección 2: Período de Imposición
  anioImposicion: number;
  
  // Sección 3: Fecha Inicio de Labores
  mesInicio: number;  // 1-12
  anioInicio: number;
  esProyectado: boolean;
  
  // Sección 4: Rentas Brutas
  numeroPatronos: number;  // 1 o 2+
  
  // Si tuvo UN patrono
  nitPatronoPrincipal?: string;
  sueldoIgualDurante12Meses: boolean;
  
  // Salario ordinario mensual (SIN bonificación)
  salarioOrdinarioMensual: number;
  
  // Bonificación incentivo
  bonificacionIncentivo: number;
  
  // Salarios mensuales individuales (opcionales, si sueldoIgualDurante12Meses = false)
  salarioEnero?: number;
  salarioFebrero?: number;
  salarioMarzo?: number;
  salarioAbril?: number;
  salarioMayo?: number;
  salarioJunio?: number;
  salarioJulio?: number;
  salarioAgosto?: number;
  salarioSeptiembre?: number;
  salarioOctubre?: number;
  salarioNoviembre?: number;
  salarioDiciembre?: number;
  
  // Si tuvo DOS O MÁS patronos
  salariosPatronoPrincipal?: number;
  salariosOtrosPatronos?: number;
  
  // Otros ingresos anuales
  bono14: number;
  aguinaldo: number;
  horasExtrasAnuales: number;
  otrosBonos: number;
  
  // Sección 5: Rentas Exentas Adicionales
  indemnizacionesPorMuerteOIncapacidad: number;
  indemnizacionesPorTiempoServido: number;
  remuneracionesDiplomaticos: number;
  gastosRepresentacionYViaticos: number;
  
  // Sección 6: Deducciones Adicionales
  deduccionesPersonalesComprobadas: number;
  donaciones: number;
  primasSeguroVida: number;
};

export type ISRAsalariadoResponse = {
  // Información general
  nitEmpleado: string;
  anioImposicion: number;
  numeroPatronos: number;
  salarioOrdinarioMensual: number;
  
  // Sección 4: Renta Bruta
  salariosAnuales: number;
  bonificacionAnual: number;
  aguinaldo: number;
  bono14: number;
  horasExtras: number;
  otrosBonos: number;
  totalRentaBruta: number;
  
  // Sección 5: Rentas Exentas
  indemnizacionesPorMuerteOIncapacidad: number;
  indemnizacionesPorTiempoServido: number;
  remuneracionesDiplomaticos: number;
  gastosRepresentacionYViaticos: number;
  aguinaldoExento: number;
  bono14Exento: number;
  totalRentasExentas: number;
  
  // Renta Neta
  rentaNeta: number;
  
  // Sección 6: Deducciones
  gastosPersonales: number;
  deduccionesPersonalesComprobadas: number;
  donaciones: number;
  cuotaIGSS: number;
  primasSeguroVida: number;
  totalDeducciones: number;
  
  // Resultado
  rentaImponible: number;
  excedenteDeducciones: number;
  isrAnual: number;
  retencionMensual: number;
  
  // Metadatos
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
// ✅ ACTUALIZADO: Agregados rentasExentas, isrPagadoAnteriorTrimestre, isr25Porciento, isr8Porciento
// ===============================
export type ISRTrimestralV2Request = {
  ventasAcumuladas: number;
  gastosAcumulados: number;
  ventasTrimestre: number;
  rentasExentas: number;  // ✅ NUEVO
  isoPendiente: number;
  isrPagadoAnteriorTrimestre: number;  // ✅ NUEVO
  usarOpcionAcumulada: boolean;
};

export type ISRTrimestralV2Response = {
  opcionUtilizada: string;
  baseCalculo: number;
  isrCalculado: number;
  isr25Porciento: number;  // ✅ NUEVO - Para mostrar "Resultado x25%"
  isr8Porciento: number;   // ✅ NUEVO - Para mostrar "Resultado x8%"
  isoAcreditar: number;
  isrPagadoAnterior: number;  // ✅ NUEVO - Para mostrar "ISR pagado anterior trimestre"
  isrAPagar: number;
  detalleCalculo: string;
};

// ===============================
// ISO TRIMESTRAL - ✅ ACTUALIZADO según Video YouTube
// ===============================
export type ISOTrimestralRequest = {
  ingresosBrutosAnuales: number;
  costoDeVentas: number;  // ✅ NUEVO - Para verificar margen 4%
  activoTotal: number;
  depreciacionAmortizacionAcumulada: number;
  reservaCuentasIncobrables: number;
  creditosReinversion: number;
  iusiPagado: number;
};

export type ISOTrimestralResponse = {
  // Paso 1: Verificación margen 4%
  ingresosBrutos: number;
  costoDeVentas: number;
  resultadoBruto: number;
  margenPorcentaje: number;
  estaAfectoISO: boolean;  // ✅ NUEVO
  
  // Paso 2: Activo
  activoTotal: number;
  depreciacionAmortizacionAcumulada: number;
  reservaCuentasIncobrables: number;
  creditosReinversion: number;
  activoNeto: number;
  
  // Paso 3: Decisión del método
  comparacionActivo: number;  // 4×Ingresos
  metodoSeleccionado: string;
  razonMetodo: string;  // ✅ NUEVO
  
  // Cálculo sobre Ingresos (si aplica)
  baseTrimestralIngresos: number;
  isoSobreIngresos: number;
  
  // Cálculo sobre Activo (si aplica)
  baseTrimestralActivo: number;
  isoSobreActivoNeto: number;
  iusiPagado: number;
  isoSobreActivoNetoFinal: number;
  
  // Resultado
  isoAPagar: number;
  
  // Detalles
  detalleCalculo: string;
  mensaje: string;
  recomendacionLegal: string;
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