// src/utils/pdfGenerator.ts
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Configuración de SECA para PDFs
 */
const SECA_CONFIG = {
 primaryColor: [14, 35, 79] as [number, number, number], // #0E234F
 secondaryColor: [34, 82, 236] as [number, number, number], // #2252EC
 accentColor: [56, 189, 248] as [number, number, number], // #38bdf8
 textColor: [15, 23, 42] as [number, number, number], // #0f172a
};

/**
 * Función auxiliar para cargar el logo de SECA
 */
const loadSECALogo = (): Promise<string | null> => {
 return new Promise((resolve) => {
 const img = new Image();
 img.crossOrigin = "Anonymous";
 img.onload = () => {
 const canvas = document.createElement('canvas');
 canvas.width = img.width;
 canvas.height = img.height;
 const ctx = canvas.getContext('2d');
 if (ctx) {
 ctx.drawImage(img, 0, 0);
 resolve(canvas.toDataURL('image/png'));
 } else {
 resolve(null);
 }
 };
 img.onerror = () => resolve(null);
 img.src = '/images/seca.png';
 });
};

/**
 * Función auxiliar para formatear el detalle del cálculo de manera legible
 */
const formatearDetalleCalculo = (detalleCalculo: string): string[] => {
 // Convertir el formato de código a texto legible
 const lineas: string[] = [];
 
 // Parsear el detalle (ejemplo: "SalarioMensual=7200; FechaInicio=04-04-2022; ...")
 const partes = detalleCalculo.split(';').map(p => p.trim()).filter(p => p);
 
 lineas.push("Información del cálculo:");
 lineas.push("");
 
 partes.forEach(parte => {
 if (parte.includes('=')) {
 const [clave, valor] = parte.split('=').map(s => s.trim());
 
 // Formatear las claves para que sean legibles
 let claveFormateada = clave;
 switch(clave) {
 case 'SalarioMensual':
 claveFormateada = 'Salario Mensual';
 break;
 case 'FechaInicio':
 claveFormateada = 'Fecha de Inicio';
 break;
 case 'FechaFin':
 claveFormateada = 'Fecha de Finalización';
 break;
 case 'Dias':
 claveFormateada = 'Días Trabajados';
 break;
 case 'AniosEquivalentes':
 claveFormateada = 'Años Equivalentes';
 break;
 case 'Formula':
 claveFormateada = 'Fórmula';
 break;
 case 'Meses':
 claveFormateada = 'Meses Trabajados';
 break;
 case 'SalarioPromedio':
 claveFormateada = 'Salario Promedio';
 break;
 case 'SalarioOrdinario':
 claveFormateada = 'Salario Ordinario';
 break;
 }
 
 // Formatear el valor
 let valorFormateado = valor;
 if (clave === 'Formula') {
 // Convertir fórmula de código a texto legible
 valorFormateado = valor.replace(/SalarioMensual\*/g, 'Salario Mensual × ')
 .replace(/SalarioPromedio\*/g, 'Salario Promedio × ')
 .replace(/SalarioOrdinario\*/g, 'Salario Ordinario × ')
 .replace(/AniosEquivalentes/g, 'Años Equivalentes')
 .replace(/Meses/g, 'Meses');
 } else if (!isNaN(Number(valor)) && valor.includes('.')) {
 // Formatear números decimales
 valorFormateado = parseFloat(valor).toFixed(2);
 }
 
 lineas.push(`• ${claveFormateada}: ${valorFormateado}`);
 }
 });
 
 return lineas;
};

/**
 * Genera un PDF con los resultados de la calculadora de Indemnización
 */
export const generateIndemnizacionPDF = async (data: {
 salarioMensual: number;
 fechaInicio: string;
 fechaFin: string;
 montoIndemnizacion: number;
 detalleCalculo: string;
}) => {
 const doc = new jsPDF();
 const pageWidth = doc.internal.pageSize.getWidth();

 // Intentar cargar el logo
 const logoData = await loadSECALogo();

 // Header con logo y título
 doc.setFillColor(...SECA_CONFIG.primaryColor);
 doc.rect(0, 0, pageWidth, 35, "F");

 // Logo o texto SECA
 if (logoData) {
 try {
 doc.addImage(logoData, 'PNG', 14, 8, 35, 13);
 // Texto al lado del logo
 doc.setTextColor(255, 255, 255);
 doc.setFontSize(14);
 doc.setFont("helvetica", "normal");
 doc.text("Servicios Contables", pageWidth / 2, 18, { align: "center" });
 } catch (error) {
 // Fallback a texto si falla
 doc.setTextColor(255, 255, 255);
 doc.setFontSize(22);
 doc.setFont("helvetica", "bold");
 doc.text("SECA - Servicios Contables", pageWidth / 2, 15, { align: "center" });
 }
 } else {
 // Sin logo, usar texto centrado
 doc.setTextColor(255, 255, 255);
 doc.setFontSize(22);
 doc.setFont("helvetica", "bold");
 doc.text("SECA - Servicios Contables", pageWidth / 2, 15, { align: "center" });
 }

 doc.setFontSize(14);
 doc.setFont("helvetica", "normal");
 doc.text("Cálculo de Indemnización", pageWidth / 2, 25, { align: "center" });

 // Información general
 doc.setTextColor(...SECA_CONFIG.textColor);
 doc.setFontSize(10);
 doc.text(`Fecha de emisión: ${new Date().toLocaleDateString("es-GT")}`, 14, 45);

 // Tabla de datos ingresados
 autoTable(doc, {
 startY: 55,
 head: [["Datos Ingresados", "Valor"]],
 body: [
 ["Salario Mensual", `Q ${data.salarioMensual.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
 ["Fecha de Inicio", data.fechaInicio],
 ["Fecha de Finalización", data.fechaFin],
 ],
 headStyles: {
 fillColor: SECA_CONFIG.primaryColor,
 textColor: [255, 255, 255],
 fontStyle: "bold",
 },
 styles: { fontSize: 11 },
 });

 // Resultado
 const finalY = (doc as any).lastAutoTable.finalY + 10;

 doc.setFillColor(...SECA_CONFIG.secondaryColor);
 doc.rect(14, finalY, pageWidth - 28, 25, "F");

 doc.setTextColor(255, 255, 255);
 doc.setFontSize(16);
 doc.setFont("helvetica", "bold");
 doc.text("Monto de Indemnización", pageWidth / 2, finalY + 10, { align: "center" });

 doc.setFontSize(20);
 doc.text(`Q ${data.montoIndemnizacion.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, pageWidth / 2, finalY + 20, {
 align: "center",
 });

 // Detalle del cálculo (MEJORADO - MÁS LEGIBLE)
 doc.setTextColor(...SECA_CONFIG.textColor);
 doc.setFontSize(12);
 doc.setFont("helvetica", "bold");
 doc.text("Detalles del Cálculo", 14, finalY + 35);

 // Formatear el detalle para que sea legible
 const detallesFormateados = formatearDetalleCalculo(data.detalleCalculo);
 
 doc.setFontSize(10);
 doc.setFont("helvetica", "normal");
 let yPos = finalY + 42;
 
 detallesFormateados.forEach((linea) => {
 if (linea === "") {
 yPos += 3;
 } else {
 doc.text(linea, 14, yPos);
 yPos += 5;
 }
 });

 // Footer
 const footerY = doc.internal.pageSize.getHeight() - 20;
 doc.setFontSize(9);
 doc.setTextColor(100, 100, 100);
 doc.text("SECA - 18 años de experiencia en servicios contables", pageWidth / 2, footerY, { align: "center" });
 doc.text("Email.: info@seca.gt | Telefono.: 3639 - 3647", pageWidth / 2, footerY + 5, { align: "center" });

 // Descargar el PDF
 doc.save(`SECA_Indemnizacion_${new Date().getTime()}.pdf`);
};

/**
 * Genera un PDF con los resultados de la calculadora de Bono 14
 */
export const generateBono14PDF = async (data: {
 salarioPromedio: number;
 fechaInicio: string;
 fechaFin: string;
 montoBono14: number;
 detalleCalculo: string;
}) => {
 const doc = new jsPDF();
 const pageWidth = doc.internal.pageSize.getWidth();

 // Intentar cargar el logo
 const logoData = await loadSECALogo();

 // Header con logo y título
 doc.setFillColor(...SECA_CONFIG.primaryColor);
 doc.rect(0, 0, pageWidth, 35, "F");

 // Logo o texto SECA
 if (logoData) {
 try {
 doc.addImage(logoData, 'PNG', 14, 8, 35, 13);
 doc.setTextColor(255, 255, 255);
 doc.setFontSize(14);
 doc.setFont("helvetica", "normal");
 doc.text("Servicios Contables", pageWidth / 2, 18, { align: "center" });
 } catch (error) {
 doc.setTextColor(255, 255, 255);
 doc.setFontSize(22);
 doc.setFont("helvetica", "bold");
 doc.text("SECA - Servicios Contables", pageWidth / 2, 15, { align: "center" });
 }
 } else {
 doc.setTextColor(255, 255, 255);
 doc.setFontSize(22);
 doc.setFont("helvetica", "bold");
 doc.text("SECA - Servicios Contables", pageWidth / 2, 15, { align: "center" });
 }

 doc.setFontSize(14);
 doc.setFont("helvetica", "normal");
 doc.text("Cálculo de Bono 14", pageWidth / 2, 25, { align: "center" });

 // Información general
 doc.setTextColor(...SECA_CONFIG.textColor);
 doc.setFontSize(10);
 doc.text(`Fecha de emisión: ${new Date().toLocaleDateString("es-GT")}`, 14, 45);

 // Tabla de datos ingresados
 autoTable(doc, {
 startY: 55,
 head: [["Datos Ingresados", "Valor"]],
 body: [
 ["Salario Ordinario", `Q ${data.salarioPromedio.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
 ["Fecha de Inicio", data.fechaInicio],
 ["Fecha de Finalización", data.fechaFin],
 ],
 headStyles: {
 fillColor: SECA_CONFIG.primaryColor,
 textColor: [255, 255, 255],
 fontStyle: "bold",
 },
 styles: { fontSize: 11 },
 });

 // Resultado
 const finalY = (doc as any).lastAutoTable.finalY + 10;

 doc.setFillColor(...SECA_CONFIG.secondaryColor);
 doc.rect(14, finalY, pageWidth - 28, 25, "F");

 doc.setTextColor(255, 255, 255);
 doc.setFontSize(16);
 doc.setFont("helvetica", "bold");
 doc.text("Monto de Bono 14", pageWidth / 2, finalY + 10, { align: "center" });

 doc.setFontSize(20);
 doc.text(`Q ${data.montoBono14.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, pageWidth / 2, finalY + 20, { align: "center" });

 // Detalle del cálculo (MEJORADO)
 doc.setTextColor(...SECA_CONFIG.textColor);
 doc.setFontSize(12);
 doc.setFont("helvetica", "bold");
 doc.text("Detalles del Cálculo", 14, finalY + 35);

 const detallesFormateados = formatearDetalleCalculo(data.detalleCalculo);
 
 doc.setFontSize(10);
 doc.setFont("helvetica", "normal");
 let yPos = finalY + 42;
 
 detallesFormateados.forEach((linea) => {
 if (linea === "") {
 yPos += 3;
 } else {
 doc.text(linea, 14, yPos);
 yPos += 5;
 }
 });

 // Footer
 const footerY = doc.internal.pageSize.getHeight() - 20;
 doc.setFontSize(9);
 doc.setTextColor(100, 100, 100);
 doc.text("SECA - 18 años de experiencia en servicios contables", pageWidth / 2, footerY, { align: "center" });
 doc.text("Email.: info@seca.gt | Telefono.: 3639 - 3647", pageWidth / 2, footerY + 5, { align: "center" });

 doc.save(`SECA_Bono14_${new Date().getTime()}.pdf`);
};

/**
 * Genera un PDF con los resultados de la calculadora de Aguinaldo
 */
export const generateAguinaldoPDF = async (data: {
 salarioPromedio: number;
 fechaInicio: string;
 fechaFin: string;
 montoAguinaldo: number;
 detalleCalculo: string;
}) => {
 const doc = new jsPDF();
 const pageWidth = doc.internal.pageSize.getWidth();

 // Intentar cargar el logo
 const logoData = await loadSECALogo();

 // Header con logo y título
 doc.setFillColor(...SECA_CONFIG.primaryColor);
 doc.rect(0, 0, pageWidth, 35, "F");

 // Logo o texto SECA
 if (logoData) {
 try {
 doc.addImage(logoData, 'PNG', 14, 8, 35, 13);
 doc.setTextColor(255, 255, 255);
 doc.setFontSize(14);
 doc.setFont("helvetica", "normal");
 doc.text("Servicios Contables", pageWidth / 2, 18, { align: "center" });
 } catch (error) {
 doc.setTextColor(255, 255, 255);
 doc.setFontSize(22);
 doc.setFont("helvetica", "bold");
 doc.text("SECA - Servicios Contables", pageWidth / 2, 15, { align: "center" });
 }
 } else {
 doc.setTextColor(255, 255, 255);
 doc.setFontSize(22);
 doc.setFont("helvetica", "bold");
 doc.text("SECA - Servicios Contables", pageWidth / 2, 15, { align: "center" });
 }

 doc.setFontSize(14);
 doc.setFont("helvetica", "normal");
 doc.text("Cálculo de Aguinaldo", pageWidth / 2, 25, { align: "center" });

 // Información general
 doc.setTextColor(...SECA_CONFIG.textColor);
 doc.setFontSize(10);
 doc.text(`Fecha de emisión: ${new Date().toLocaleDateString("es-GT")}`, 14, 45);

 // Tabla de datos ingresados
 autoTable(doc, {
 startY: 55,
 head: [["Datos Ingresados", "Valor"]],
 body: [
 ["Salario Promedio", `Q ${data.salarioPromedio.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
 ["Fecha de Inicio", data.fechaInicio],
 ["Fecha de Finalización", data.fechaFin],
 ],
 headStyles: {
 fillColor: SECA_CONFIG.primaryColor,
 textColor: [255, 255, 255],
 fontStyle: "bold",
 },
 styles: { fontSize: 11 },
 });

 // Resultado
 const finalY = (doc as any).lastAutoTable.finalY + 10;

 doc.setFillColor(...SECA_CONFIG.secondaryColor);
 doc.rect(14, finalY, pageWidth - 28, 25, "F");

 doc.setTextColor(255, 255, 255);
 doc.setFontSize(16);
 doc.setFont("helvetica", "bold");
 doc.text("Monto de Aguinaldo", pageWidth / 2, finalY + 10, { align: "center" });

 doc.setFontSize(20);
 doc.text(`Q ${data.montoAguinaldo.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, pageWidth / 2, finalY + 20, {
 align: "center",
 });

 // Detalle del cálculo (MEJORADO)
 doc.setTextColor(...SECA_CONFIG.textColor);
 doc.setFontSize(12);
 doc.setFont("helvetica", "bold");
 doc.text("Detalles del Cálculo", 14, finalY + 35);

 const detallesFormateados = formatearDetalleCalculo(data.detalleCalculo);
 
 doc.setFontSize(10);
 doc.setFont("helvetica", "normal");
 let yPos = finalY + 42;
 
 detallesFormateados.forEach((linea) => {
 if (linea === "") {
 yPos += 3;
 } else {
 doc.text(linea, 14, yPos);
 yPos += 5;
 }
 });

 // Footer
 const footerY = doc.internal.pageSize.getHeight() - 20;
 doc.setFontSize(9);
 doc.setTextColor(100, 100, 100);
 doc.text("SECA - 18 años de experiencia en servicios contables", pageWidth / 2, footerY, { align: "center" });
 doc.text("Email.: info@seca.gt | Telefono.: 3639 - 3647", pageWidth / 2, footerY + 5, { align: "center" });

 doc.save(`SECA_Aguinaldo_${new Date().getTime()}.pdf`);
};

/**
 * NUEVO: Genera un PDF con el cálculo completo de prestaciones laborales
 */
export const generatePrestacionesCompletasPDF = async (data: {
 fechaInicio: string;
 fechaFin: string;
 salarioOrdinario: number;
 tipoTerminacion: string;
 indemnizacion: { aplica: boolean; monto: number; detalle: string };
 aguinaldo: { aplica: boolean; monto: number; detalle: string };
 bono14: { aplica: boolean; monto: number; detalle: string };
 vacaciones: { aplica: boolean; monto: number; detalle: string };
 bonificacion250: { aplica: boolean; monto: number; detalle: string };
 totalLiquidacion: number;
 advertencias: string[];
 notasLegales: string[];
}) => {
 const doc = new jsPDF();
 const pageWidth = doc.internal.pageSize.getWidth();

 // Intentar cargar el logo
 const logoData = await loadSECALogo();

 // Header con logo y título
 doc.setFillColor(...SECA_CONFIG.primaryColor);
 doc.rect(0, 0, pageWidth, 35, "F");

 // Logo o texto SECA
 if (logoData) {
 try {
 doc.addImage(logoData, 'PNG', 14, 8, 35, 13);
 doc.setTextColor(255, 255, 255);
 doc.setFontSize(14);
 doc.setFont("helvetica", "normal");
 doc.text("Servicios Contables", pageWidth / 2, 18, { align: "center" });
 } catch (error) {
 doc.setTextColor(255, 255, 255);
 doc.setFontSize(22);
 doc.setFont("helvetica", "bold");
 doc.text("SECA - Servicios Contables", pageWidth / 2, 15, { align: "center" });
 }
 } else {
 doc.setTextColor(255, 255, 255);
 doc.setFontSize(22);
 doc.setFont("helvetica", "bold");
 doc.text("SECA - Servicios Contables", pageWidth / 2, 15, { align: "center" });
 }

 doc.setFontSize(14);
 doc.setFont("helvetica", "normal");
 doc.text("Liquidación de Prestaciones Laborales", pageWidth / 2, 25, { align: "center" });

 // Información general
 doc.setTextColor(...SECA_CONFIG.textColor);
 doc.setFontSize(10);
 doc.text(`Fecha de emisión: ${new Date().toLocaleDateString("es-GT")}`, 14, 45);

 // Tabla de datos generales
 autoTable(doc, {
 startY: 55,
 head: [["Datos del Empleado", "Valor"]],
 body: [
 ["Fecha de Inicio", data.fechaInicio],
 ["Fecha de Salida", data.fechaFin],
 ["Salario Ordinario", `Q ${data.salarioOrdinario.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
 ["Tipo de Terminación", data.tipoTerminacion],
 ],
 headStyles: {
 fillColor: SECA_CONFIG.primaryColor,
 textColor: [255, 255, 255],
 fontStyle: "bold",
 },
 styles: { fontSize: 10 },
 });

 // Tabla de prestaciones
 const finalY1 = (doc as any).lastAutoTable.finalY + 10;

 doc.setFontSize(12);
 doc.setFont("helvetica", "bold");
 doc.setTextColor(...SECA_CONFIG.textColor);
 doc.text("Desglose de Prestaciones", 14, finalY1);

 const prestacionesData = [
 ["1. Indemnización", data.indemnizacion.aplica ? "Sí" : "No", `Q ${data.indemnizacion.monto.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
 ["2. Aguinaldo Proporcional", data.aguinaldo.aplica ? "Sí" : "No", `Q ${data.aguinaldo.monto.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
 ["3. Bono 14 Proporcional", data.bono14.aplica ? "Sí" : "No", `Q ${data.bono14.monto.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
 ["4. Vacaciones No Gozadas", data.vacaciones.aplica ? "Sí" : "No", `Q ${data.vacaciones.monto.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
 ["5. Bonificación Q250", data.bonificacion250.aplica ? "Sí" : "No", `Q ${data.bonificacion250.monto.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
 ];

 autoTable(doc, {
 startY: finalY1 + 5,
 head: [["Concepto", "Aplica", "Monto"]],
 body: prestacionesData,
 foot: [["TOTAL LIQUIDACIÓN", "", `Q ${data.totalLiquidacion.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`]],
 headStyles: {
 fillColor: SECA_CONFIG.secondaryColor,
 textColor: [255, 255, 255],
 fontStyle: "bold",
 },
 footStyles: {
 fillColor: SECA_CONFIG.primaryColor,
 textColor: [255, 255, 255],
 fontStyle: "bold",
 fontSize: 11,
 },
 styles: { fontSize: 10 },
 });

 // Advertencias (si hay)
 const finalY2 = (doc as any).lastAutoTable.finalY + 10;

 if (data.advertencias.length > 0) {
 doc.setFillColor(251, 191, 36);
 doc.rect(14, finalY2, pageWidth - 28, 8, "F");

 doc.setTextColor(255, 255, 255);
 doc.setFontSize(10);
 doc.setFont("helvetica", "bold");
 doc.text("Advertencias", 18, finalY2 + 5);

 doc.setTextColor(...SECA_CONFIG.textColor);
 doc.setFont("helvetica", "normal");
 doc.setFontSize(9);

 let yPos = finalY2 + 12;
 data.advertencias.forEach((adv) => {
 doc.text(`• ${adv}`, 18, yPos);
 yPos += 5;
 });
 }

 // Notas legales
 let notasY = data.advertencias.length > 0 ? finalY2 + 12 + (data.advertencias.length * 5) + 5 : finalY2;

 // Verificar si necesitamos nueva página
 if (notasY > doc.internal.pageSize.getHeight() - 60) {
 doc.addPage();
 notasY = 20;
 }

 doc.setFillColor(...SECA_CONFIG.accentColor);
 doc.rect(14, notasY, pageWidth - 28, 8, "F");

 doc.setTextColor(255, 255, 255);
 doc.setFontSize(10);
 doc.setFont("helvetica", "bold");
 doc.text("Notas Legales", 18, notasY + 5);

 doc.setTextColor(...SECA_CONFIG.textColor);
 doc.setFont("helvetica", "normal");
 doc.setFontSize(8);

 let yPosNotas = notasY + 12;
 data.notasLegales.forEach((nota) => {
 const lines = doc.splitTextToSize(`• ${nota}`, pageWidth - 40);
 doc.text(lines, 18, yPosNotas);
 yPosNotas += lines.length * 4;
 });

 // Footer
 const footerY = doc.internal.pageSize.getHeight() - 20;
 doc.setFontSize(9);
 doc.setTextColor(100, 100, 100);
 doc.text("SECA - 18 años de experiencia en servicios contables", pageWidth / 2, footerY, { align: "center" });
 doc.text("Email.: info@seca.gt | Telefono.: 3639 - 3647", pageWidth / 2, footerY + 5, { align: "center" });

 // Descargar el PDF
 doc.save(`SECA_Prestaciones_Laborales_${new Date().getTime()}.pdf`);
};
/**
/**
/**
/**
 * Genera PDF con cálculo de IVA - SIN ERRORES TYPESCRIPT
 * Versión simplificada y funcional
 */
export const generateIVAPDF = async (data: {
  regimen: string;
  ventasMes: number;
  comprasMes: number;
  ivaCredito: number;
  ivaRetenido: number;
  ivaExento: number;
  ingresosAnuales: number;
  regimenNombre: string;
  baseVentas: number;
  baseCompras: number;
  debitoFiscal: number;
  creditoFiscal: number;
  ivaBruto: number;
  totalDeducciones: number;
  ivaAPagar: number;
  cuotaFija: number;
  aplica: boolean;
  mensaje: string;
  detalleCalculo: string;
}) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Convertir colores a tuplas
  const primaryColor = SECA_CONFIG.primaryColor as [number, number, number];
  const textColor = SECA_CONFIG.textColor as [number, number, number];

  // Intentar cargar el logo
  const logoData = await loadSECALogo();

  // Header
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 35, "F");

  if (logoData) {
    try {
      doc.addImage(logoData, 'PNG', 14, 8, 35, 13);
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont("helvetica", "normal");
      doc.text("Servicios Contables", pageWidth / 2, 18, { align: "center" });
    } catch (error) {
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("SECA - Servicios Contables", pageWidth / 2, 15, { align: "center" });
    }
  } else {
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("SECA - Servicios Contables", pageWidth / 2, 15, { align: "center" });
  }

  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.text("Calculo de IVA", pageWidth / 2, 25, { align: "center" });

  // Información general
  doc.setTextColor(...textColor);
  doc.setFontSize(10);
  doc.text(`Fecha de emision: ${new Date().toLocaleDateString("es-GT")}`, 14, 45);
  doc.text(`Regimen: ${data.regimenNombre}`, 14, 52);

  let startY = 60;

  // Régimen General
  if (data.regimen === "general") {
    // Título
    autoTable(doc, {
      startY: startY,
      head: [["SEGUN EL MAYOR ENTRE EL DEBITO Y CREDITO"]],
      body: [],
      headStyles: {
        fillColor: [30, 58, 138],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 11,
        halign: "center",
      },
      margin: { left: 14, right: 14 },
    });

    startY = (doc as any).lastAutoTable.finalY + 5;

    // Tabla principal simplificada
    const tableData: string[][] = [
      ["", "TOTAL", "BASE", "IVA"],
      ["", "/1.12", "*0.12", ""],
      [
        "VENTAS", 
        `Q ${data.ventasMes.toLocaleString('es-GT', {minimumFractionDigits: 2})}`,
        `Q ${data.baseVentas.toLocaleString('es-GT', {minimumFractionDigits: 2})}`,
        `Q ${data.debitoFiscal.toLocaleString('es-GT', {minimumFractionDigits: 2})}`
      ],
      [
        "COMPRAS",
        `Q ${data.comprasMes.toLocaleString('es-GT', {minimumFractionDigits: 2})}`,
        `Q ${data.baseCompras.toLocaleString('es-GT', {minimumFractionDigits: 2})}`,
        `Q ${data.creditoFiscal.toLocaleString('es-GT', {minimumFractionDigits: 2})}`
      ],
      ["", "", "", ""],
      ["", "", "Debito - Credito", `Q ${data.ivaBruto.toLocaleString('es-GT', {minimumFractionDigits: 2})}`]
    ];

    // Agregar deducciones
    if (data.ivaCredito > 0) {
      tableData.push(["", "", "(-) IVA Credito", `Q ${data.ivaCredito.toLocaleString('es-GT', {minimumFractionDigits: 2})}`]);
    }
    if (data.ivaRetenido > 0) {
      tableData.push(["", "", "(-) IVA Retenido", `Q ${data.ivaRetenido.toLocaleString('es-GT', {minimumFractionDigits: 2})}`]);
    }
    if (data.ivaExento > 0) {
      tableData.push(["", "", "(-) IVA Exento", `Q ${data.ivaExento.toLocaleString('es-GT', {minimumFractionDigits: 2})}`]);
    }

    // Calcular resultado
    const resultadoFinal = data.ivaBruto - data.totalDeducciones;
    
    // Fila de resultado
    tableData.push(["", "", "", ""]);
    tableData.push(["", "", "RESULTADO:", `Q ${Math.abs(resultadoFinal).toLocaleString('es-GT', {minimumFractionDigits: 2})}`]);

    autoTable(doc, {
      startY: startY,
      body: tableData,
      styles: { 
        fontSize: 10, 
        cellPadding: 4,
        halign: 'right'
      },
      columnStyles: {
        0: { halign: 'left', fontStyle: 'bold', cellWidth: 30 },
        1: { halign: 'right', cellWidth: 45 },
        2: { halign: 'right', fontStyle: 'bold', cellWidth: 50 },
        3: { halign: 'right', fontStyle: 'bold', cellWidth: 45 }
      },
      margin: { left: 14, right: 14 },
      theme: 'grid',
      didParseCell: function(data) {
        // Fila de headers (0 y 1)
        if (data.row.index === 0) {
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.halign = 'center';
          data.cell.styles.fillColor = [240, 240, 240];
        }
        if (data.row.index === 1) {
          data.cell.styles.fontSize = 8;
          data.cell.styles.textColor = [100, 100, 100];
          data.cell.styles.halign = 'center';
        }
        // Fila de separador
        if (data.row.index === 4) {
          data.cell.styles.minCellHeight = 2;
          data.cell.styles.fillColor = [200, 200, 200];
        }
        // IVA Bruto
        if (data.row.index === 5 && data.column.index === 3) {
          data.cell.styles.fillColor = [255, 250, 205];
        }
        // Deducciones en rojo
        if (data.row.index >= 6 && data.row.index <= 8 && data.column.index === 3) {
          data.cell.styles.textColor = [185, 28, 28];
        }
        // Resultado final
        const lastIndex = tableData.length - 1;
        if (data.row.index === lastIndex && data.column.index === 3) {
          data.cell.styles.fillColor = [220, 252, 231];
          data.cell.styles.fontSize = 12;
          data.cell.styles.fontStyle = 'bold';
        }
      }
    });

    startY = (doc as any).lastAutoTable.finalY + 10;

    // Caja de resultado final
    const esPorPagar = resultadoFinal >= 0;
    const tipoResultado = esPorPagar ? "IVA POR PAGAR" : "IVA CREDITO";
    const colorResultado: [number, number, number] = esPorPagar ? [30, 58, 138] : [16, 185, 129];
    const textoExplicacion = esPorPagar 
      ? "SI DEBITO MAYOR QUE CREDITO ES IVA POR PAGAR" 
      : "SI CREDITO ES MAYOR QUE DEBITO ES IVA CREDITO";

    autoTable(doc, {
      startY: startY,
      head: [[tipoResultado, ""]],
      body: [
        [textoExplicacion, `Q ${Math.abs(resultadoFinal).toLocaleString('es-GT', {minimumFractionDigits: 2})}`]
      ],
      headStyles: {
        fillColor: colorResultado,
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 12,
        halign: "center",
        cellPadding: 5
      },
      bodyStyles: {
        fillColor: [245, 245, 245],
        cellPadding: 8
      },
      columnStyles: {
        0: { cellWidth: 120, fontSize: 9 },
        1: { cellWidth: 60, halign: 'right', fontStyle: 'bold', fontSize: 14 }
      },
      margin: { left: 14, right: 14 }
    });

  } else if (data.regimen === "pequeno") {
    // Pequeño Contribuyente
    autoTable(doc, {
      startY: startY,
      head: [["Concepto", "Valor"]],
      body: [
        ["Ingresos Anuales", `Q ${data.ingresosAnuales.toLocaleString('es-GT', {minimumFractionDigits: 2})}`],
        ["Cuota Fija Mensual", `Q ${data.cuotaFija.toLocaleString('es-GT', {minimumFractionDigits: 2})}`],
      ],
      headStyles: {
        fillColor: [16, 185, 129],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 11,
      },
      styles: { fontSize: 10, cellPadding: 4 },
      columnStyles: {
        0: { cellWidth: 100 },
        1: { halign: 'right', fontStyle: 'bold' }
      },
      margin: { left: 14, right: 14 }
    });

  } else {
    // Exento
    autoTable(doc, {
      startY: startY,
      head: [["Estado", "Valor"]],
      body: [
        ["IVA a Pagar", "Q 0.00"],
      ],
      headStyles: {
        fillColor: [139, 92, 246],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 11,
      },
      styles: { fontSize: 10, cellPadding: 4 },
      columnStyles: {
        0: { cellWidth: 100 },
        1: { halign: 'right', fontStyle: 'bold' }
      },
      margin: { left: 14, right: 14 }
    });
  }

  startY = (doc as any).lastAutoTable.finalY + 15;

  // Mensaje
  doc.setTextColor(...textColor);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Informacion:", 14, startY);
  startY += 5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  const mensajeLineas = doc.splitTextToSize(data.mensaje, pageWidth - 28);
  doc.text(mensajeLineas, 14, startY);

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 20;
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text("SECA - 18 anos de experiencia en servicios contables", pageWidth / 2, footerY, { align: "center" });
  doc.text("Email: info@seca.gt | Telefono: 3639 - 3647", pageWidth / 2, footerY + 5, { align: "center" });

  doc.save(`SECA_IVA_${new Date().getTime()}.pdf`);
};

/**
 * Genera un PDF con los resultados de la calculadora de ISR Laboral (Asalariados)
 */
export const generateISRLaboralPDF = async (data: {
 // Input
 salarioOrdinarioMensual: number;
 bonificacionIncentivo: number;
 bono14: number;
 aguinaldo: number;
 otrosBonos: number;
 esProyectado: boolean;
 // Output
 salariosAnuales: number;
 bonificacionAnual: number;
 totalRentaBruta: number;
 aguinaldoExento: number;
 bono14Exento: number;
 totalRentasExentas: number;
 rentaNeta: number;
 gastosPersonales: number;
 cuotaIGSS: number;
 totalDeducciones: number;
 rentaImponible: number;
 isrAnual: number;
 retencionMensual: number;
 tipoCalculo: string;
 detalleCalculo: string;
}) => {
 const doc = new jsPDF();
 const pageWidth = doc.internal.pageSize.getWidth();

 // Intentar cargar el logo
 const logoData = await loadSECALogo();

 // Header con logo y título
 doc.setFillColor(...SECA_CONFIG.primaryColor);
 doc.rect(0, 0, pageWidth, 35, "F");

 // Logo o texto SECA
 if (logoData) {
 try {
 doc.addImage(logoData, 'PNG', 14, 8, 35, 13);
 doc.setTextColor(255, 255, 255);
 doc.setFontSize(14);
 doc.setFont("helvetica", "normal");
 doc.text("Servicios Contables", pageWidth / 2, 18, { align: "center" });
 } catch (error) {
 doc.setTextColor(255, 255, 255);
 doc.setFontSize(22);
 doc.setFont("helvetica", "bold");
 doc.text("SECA - Servicios Contables", pageWidth / 2, 15, { align: "center" });
 }
 } else {
 doc.setTextColor(255, 255, 255);
 doc.setFontSize(22);
 doc.setFont("helvetica", "bold");
 doc.text("SECA - Servicios Contables", pageWidth / 2, 15, { align: "center" });
 }

 doc.setFontSize(14);
 doc.setFont("helvetica", "normal");
 doc.text("Cálculo de ISR Asalariados", pageWidth / 2, 25, { align: "center" });

 // Información general
 doc.setTextColor(...SECA_CONFIG.textColor);
 doc.setFontSize(10);
 doc.text(`Fecha de emisión: ${new Date().toLocaleDateString("es-GT")}`, 14, 45);
 doc.text(`Tipo de cálculo: ${data.tipoCalculo}`, 14, 51);

 // Tabla 1: Renta Bruta
 autoTable(doc, {
 startY: 58,
 head: [["1. Renta Bruta", "Valor"]],
 body: [
 ["Salarios Anuales (12 meses)", `Q ${data.salariosAnuales.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
 ["Bonificación Anual (12 meses)", `Q ${data.bonificacionAnual.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
 ["Aguinaldo", `Q ${data.aguinaldo.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
 ["Bono 14", `Q ${data.bono14.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
 ["Otros Bonos", `Q ${data.otrosBonos.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
 ["TOTAL RENTA BRUTA", `Q ${data.totalRentaBruta.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
 ],
 headStyles: {
 fillColor: [14, 35, 79],
 textColor: [255, 255, 255],
 fontStyle: "bold",
 },
 styles: { fontSize: 10 },
 columnStyles: {
 0: { cellWidth: 120 },
 1: { halign: 'right', cellWidth: 60 }
 }
 });

 // Tabla 2: Rentas Exentas
 const finalY1 = (doc as any).lastAutoTable.finalY + 5;
 
 autoTable(doc, {
 startY: finalY1,
 head: [["2. (-) Rentas Exentas", "Valor"]],
 body: [
 ["Aguinaldo Exento", `Q ${data.aguinaldoExento.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
 ["Bono 14 Exento", `Q ${data.bono14Exento.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
 ["TOTAL RENTAS EXENTAS", `Q ${data.totalRentasExentas.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
 ],
 headStyles: {
 fillColor: [14, 35, 79],
 textColor: [255, 255, 255],
 fontStyle: "bold",
 },
 styles: { fontSize: 10 },
 columnStyles: {
 0: { cellWidth: 120 },
 1: { halign: 'right', cellWidth: 60 }
 }
 });

 // Tabla 3: Renta Neta
 const finalY2 = (doc as any).lastAutoTable.finalY + 5;
 
 autoTable(doc, {
 startY: finalY2,
 head: [["3. (=) Renta Neta", "Valor"]],
 body: [
 ["RENTA NETA", `Q ${data.rentaNeta.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
 ],
 headStyles: {
 fillColor: [14, 35, 79],
 textColor: [255, 255, 255],
 fontStyle: "bold",
 },
 styles: { fontSize: 10 },
 columnStyles: {
 0: { cellWidth: 120 },
 1: { halign: 'right', cellWidth: 60 }
 }
 });

 // Tabla 4: Deducciones
 const finalY3 = (doc as any).lastAutoTable.finalY + 5;
 
 autoTable(doc, {
 startY: finalY3,
 head: [["4. (-) Deducciones", "Valor"]],
 body: [
 ["Gastos Personales (Art. 72)", `Q ${data.gastosPersonales.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
 ["Cuota IGSS (4.83%)", `Q ${data.cuotaIGSS.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
 ["TOTAL DEDUCCIONES", `Q ${data.totalDeducciones.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
 ],
 headStyles: {
 fillColor: [14, 35, 79],
 textColor: [255, 255, 255],
 fontStyle: "bold",
 },
 styles: { fontSize: 10 },
 columnStyles: {
 0: { cellWidth: 120 },
 1: { halign: 'right', cellWidth: 60 }
 }
 });

 // Tabla 5: ISR
 const finalY4 = (doc as any).lastAutoTable.finalY + 5;
 
 autoTable(doc, {
 startY: finalY4,
 head: [["5. Cálculo de ISR", "Valor"]],
 body: [
 ["Renta Imponible", `Q ${data.rentaImponible.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
 ["ISR Anual", `Q ${data.isrAnual.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
 ...(data.retencionMensual > 0 ? [["Retención Mensual", `Q ${data.retencionMensual.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`]] : []),
 ],
 headStyles: {
 fillColor: [14, 35, 79],
 textColor: [255, 255, 255],
 fontStyle: "bold",
 },
 styles: { fontSize: 10 },
 columnStyles: {
 0: { cellWidth: 120 },
 1: { halign: 'right', cellWidth: 60 }
 }
 });

 // Resultado Final destacado
 const finalY5 = (doc as any).lastAutoTable.finalY + 10;

 doc.setFillColor(14, 35, 79);
 doc.rect(14, finalY5, pageWidth - 28, 30, "F");

 doc.setTextColor(255, 255, 255);
 doc.setFontSize(12);
 doc.setFont("helvetica", "normal");
 doc.text("ISR Anual a Pagar:", pageWidth / 2, finalY5 + 10, { align: "center" });

 doc.setFontSize(22);
 doc.setFont("helvetica", "bold");
 doc.text(`Q ${data.isrAnual.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, pageWidth / 2, finalY5 + 22, {
 align: "center",
 });

 // Nota legal
 const yNote = finalY5 + 38;
 doc.setTextColor(...SECA_CONFIG.textColor);
 doc.setFontSize(9);
 doc.setFont("helvetica", "normal");
 const nota = "Cálculo según Decreto 10-2012 (Ley del Impuesto Sobre la Renta). Incluye rentas exentas, cuota IGSS y tabla progresiva.";
 const lineasNota = doc.splitTextToSize(nota, pageWidth - 28);
 doc.text(lineasNota, 14, yNote);

 // Footer
 const footerY = doc.internal.pageSize.getHeight() - 20;
 doc.setFontSize(9);
 doc.setTextColor(100, 100, 100);
 doc.text("SECA - 18 años de experiencia en servicios contables", pageWidth / 2, footerY, { align: "center" });
 doc.text("Email: info@seca.gt | Teléfono: 3639 - 3647", pageWidth / 2, footerY + 5, { align: "center" });

 // Descargar el PDF
 doc.save(`SECA_ISR_Asalariados_${new Date().getTime()}.pdf`);
};


/**
 * Genera un PDF con los resultados de la calculadora de ISR Empresa Mensual
 */
export const generateISREmpresaMensualPDF = async (data: {
 totalFacturacionMes: number;
 totalRetenciones: number;
 base: number;
 iva: number;
 isrPrimerosTreintaMil: number;
 isrExcedente: number;
 isrTotal: number;
 isrAPagar: number;
 detalleCalculo: string;
}) => {
 const doc = new jsPDF();
 const pageWidth = doc.internal.pageSize.getWidth();

 const logoData = await loadSECALogo();

 doc.setFillColor(...SECA_CONFIG.primaryColor);
 doc.rect(0, 0, pageWidth, 35, "F");

 if (logoData) {
 try {
 doc.addImage(logoData, 'PNG', 14, 8, 35, 13);
 doc.setTextColor(255, 255, 255);
 doc.setFontSize(14);
 doc.setFont("helvetica", "normal");
 doc.text("Servicios Contables", pageWidth / 2, 18, { align: "center" });
 } catch (error) {
 doc.setTextColor(255, 255, 255);
 doc.setFontSize(22);
 doc.setFont("helvetica", "bold");
 doc.text("SECA - Servicios Contables", pageWidth / 2, 15, { align: "center" });
 }
 } else {
 doc.setTextColor(255, 255, 255);
 doc.setFontSize(22);
 doc.setFont("helvetica", "bold");
 doc.text("SECA - Servicios Contables", pageWidth / 2, 15, { align: "center" });
 }

 doc.setFontSize(14);
 doc.setFont("helvetica", "normal");
 doc.text("Cálculo de ISR Empresa Mensual", pageWidth / 2, 25, { align: "center" });

 doc.setTextColor(...SECA_CONFIG.textColor);
 doc.setFontSize(10);
 doc.text(`Fecha de emisión: ${new Date().toLocaleDateString("es-GT")}`, 14, 45);
 doc.text("Régimen Opcional Simplificado sobre Ingresos", 14, 51);

 autoTable(doc, {
 startY: 60,
 head: [["Datos Ingresados", "Valor"]],
 body: [
 ["Total Facturación del Mes", `Q ${data.totalFacturacionMes.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
 ["Total Retenciones", `Q ${data.totalRetenciones.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
 ],
 headStyles: {
 fillColor: SECA_CONFIG.primaryColor,
 textColor: [255, 255, 255],
 fontStyle: "bold",
 },
 styles: { fontSize: 11 },
 });

 let finalY = (doc as any).lastAutoTable.finalY + 10;

 autoTable(doc, {
 startY: finalY,
 head: [["Concepto", "Monto"]],
 body: [
 ["Base (÷ 1.12)", `Q ${data.base.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
 ["IVA (12%)", `Q ${data.iva.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
 ["ISR Primeros Q30,000 (5%)", `Q ${data.isrPrimerosTreintaMil.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
 ["ISR Excedente (7%)", `Q ${data.isrExcedente.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
 ["ISR Total", `Q ${data.isrTotal.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
 ["Retenciones", `- Q ${data.totalRetenciones.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
 ],
 headStyles: {
 fillColor: SECA_CONFIG.secondaryColor,
 textColor: [255, 255, 255],
 fontStyle: "bold",
 },
 styles: { fontSize: 11 },
 });

 finalY = (doc as any).lastAutoTable.finalY + 10;

 doc.setFillColor(16, 185, 129);
 doc.rect(14, finalY, pageWidth - 28, 25, "F");

 doc.setTextColor(255, 255, 255);
 doc.setFontSize(16);
 doc.setFont("helvetica", "bold");
 doc.text("ISR a Pagar", pageWidth / 2, finalY + 10, { align: "center" });

 doc.setFontSize(20);
 doc.text(`Q ${data.isrAPagar.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, pageWidth / 2, finalY + 20, { align: "center" });

 const footerY = doc.internal.pageSize.getHeight() - 20;
 doc.setFontSize(9);
 doc.setTextColor(100, 100, 100);
 doc.text("SECA - 18 años de experiencia en servicios contables", pageWidth / 2, footerY, { align: "center" });
 doc.text("Email.: info@seca.gt | Telefono.: 3639 - 3647", pageWidth / 2, footerY + 5, { align: "center" });

 doc.save(`SECA_ISR_Empresa_Mensual_${new Date().getTime()}.pdf`);
};

/**
 * Genera un PDF con los resultados de la calculadora de ISR Empresa Trimestral
 */
export const generateISRTrimestralPDF = async (data: {
 usarOpcionAcumulada: boolean;
 ventasAcumuladas: number;
 gastosAcumulados: number;
 ventasTrimestre: number;
 rentasExentas: number; // NUEVO
 isoPendiente: number;
 isrPagadoAnteriorTrimestre: number; // NUEVO
 opcionUtilizada: string;
 baseCalculo: number;
 isr25Porciento: number; // NUEVO
 isr8Porciento: number; // NUEVO
 isrCalculado: number;
 isoAcreditar: number;
 isrPagadoAnterior: number; // NUEVO
 isrAPagar: number;
 detalleCalculo: string;
}) => {
 const doc = new jsPDF();
 const pageWidth = doc.internal.pageSize.getWidth();

 const logoData = await loadSECALogo();

 doc.setFillColor(...SECA_CONFIG.primaryColor);
 doc.rect(0, 0, pageWidth, 35, "F");

 if (logoData) {
 try {
 doc.addImage(logoData, 'PNG', 14, 8, 35, 13);
 doc.setTextColor(255, 255, 255);
 doc.setFontSize(14);
 doc.setFont("helvetica", "normal");
 doc.text("Servicios Contables", pageWidth / 2, 18, { align: "center" });
 } catch (error) {
 doc.setTextColor(255, 255, 255);
 doc.setFontSize(22);
 doc.setFont("helvetica", "bold");
 doc.text("SECA - Servicios Contables", pageWidth / 2, 15, { align: "center" });
 }
 } else {
 doc.setTextColor(255, 255, 255);
 doc.setFontSize(22);
 doc.setFont("helvetica", "bold");
 doc.text("SECA - Servicios Contables", pageWidth / 2, 15, { align: "center" });
 }

 doc.setFontSize(14);
 doc.setFont("helvetica", "normal");
 doc.text("Cálculo de ISR Empresa Trimestral", pageWidth / 2, 25, { align: "center" });

 doc.setTextColor(...SECA_CONFIG.textColor);
 doc.setFontSize(10);
 doc.text(`Fecha de emisión: ${new Date().toLocaleDateString("es-GT")}`, 14, 45);
 doc.text(`Método: ${data.opcionUtilizada}`, 14, 51);

 // ACTUALIZADO: Agregar Rentas Exentas e ISR Pagado Anterior
 let bodyData: string[][];
 if (data.usarOpcionAcumulada) {
 bodyData = [
 ["Ventas Acumuladas", `Q ${data.ventasAcumuladas.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
 ["Rentas Exentas", `Q ${data.rentasExentas.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
 ["Gastos Acumulados", `Q ${data.gastosAcumulados.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
 ["ISO Pendiente", `Q ${data.isoPendiente.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
 ["ISR Pagado Anterior Trimestre", `Q ${data.isrPagadoAnteriorTrimestre.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
 ];
 } else {
 bodyData = [
 ["Ventas del Trimestre", `Q ${data.ventasTrimestre.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
 ["Rentas Exentas", `Q ${data.rentasExentas.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
 ["ISO Pendiente", `Q ${data.isoPendiente.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
 ];
 }

 autoTable(doc, {
 startY: 60,
 head: [["Datos Ingresados", "Valor"]],
 body: bodyData,
 headStyles: {
 fillColor: SECA_CONFIG.primaryColor,
 textColor: [255, 255, 255],
 fontStyle: "bold",
 },
 styles: { fontSize: 11 },
 });

 let finalY = (doc as any).lastAutoTable.finalY + 10;

 // ACTUALIZADO: Tabla de resultados con ISR 25%, ISR 8%, e ISR Pagado Anterior
 let resultadosBody: string[][];
 if (data.usarOpcionAcumulada) {
 // Opción 1 - Cierres Parciales
 resultadosBody = [
 ["Base de Cálculo (Resultado)", `Q ${data.baseCalculo.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
 ["Resultado x 25%", `Q ${data.isr25Porciento > 0 ? data.isr25Porciento.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2}) : data.isrCalculado.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
 ["ISO por Acreditar", `- Q ${data.isoAcreditar.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
 ["ISR Pagado Anterior Trimestre", `- Q ${data.isrPagadoAnterior.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
 ];
 } else {
 // Opción 2 - Trimestre Directo
 resultadosBody = [
 ["Base de Cálculo (Resultado)", `Q ${data.baseCalculo.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
 ["Resultado x 25%", `Q ${data.isr25Porciento.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
 ["Resultado x 8%", `Q ${data.isr8Porciento.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
 ["ISO por Acreditar", `- Q ${data.isoAcreditar.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
 ];
 }

 autoTable(doc, {
 startY: finalY,
 head: [["Concepto", "Monto"]],
 body: resultadosBody,
 headStyles: {
 fillColor: SECA_CONFIG.secondaryColor,
 textColor: [255, 255, 255],
 fontStyle: "bold",
 },
 styles: { fontSize: 11 },
 });

 finalY = (doc as any).lastAutoTable.finalY + 10;

 doc.setFillColor(6, 182, 212);
 doc.rect(14, finalY, pageWidth - 28, 25, "F");

 doc.setTextColor(255, 255, 255);
 doc.setFontSize(16);
 doc.setFont("helvetica", "bold");
 doc.text("ISR x Pagar Trimestre", pageWidth / 2, finalY + 10, { align: "center" });

 doc.setFontSize(20);
 doc.text(`Q ${data.isrAPagar.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, pageWidth / 2, finalY + 20, { align: "center" });

 const footerY = doc.internal.pageSize.getHeight() - 20;
 doc.setFontSize(9);
 doc.setTextColor(100, 100, 100);
 doc.text("SECA - 18 años de experiencia en servicios contables", pageWidth / 2, footerY, { align: "center" });
 doc.text("Email.: info@seca.gt | Telefono.: 3639 - 3647", pageWidth / 2, footerY + 5, { align: "center" });

 doc.save(`SECA_ISR_Empresa_Trimestral_${data.opcionUtilizada.replace(/\s/g, '_')}_${new Date().getTime()}.pdf`);
};

/**
 * Genera un PDF con los resultados de la calculadora de ISO Trimestral
 * MEJORADO: Mejor formato visual y sin emojis
 */
/**
 * Genera un PDF con los resultados de la calculadora de ISO Trimestral
 * VERSION 2 PAGINAS: Diseño espacioso y profesional
 */
export const generateISOTrimestralPDF = async (data: {
  // Datos ingresados
  ingresosBrutosAnuales: number;
  costoDeVentas: number;
  activoTotal: number;
  depreciacionAmortizacionAcumulada: number;
  reservaCuentasIncobrables: number;
  creditosReinversion: number;
  iusiPagado: number;
  
  // Resultados
  ingresosBrutos: number;
  resultadoBruto: number;
  margenPorcentaje: number;
  estaAfectoISO: boolean;
  activoNeto: number;
  comparacionActivo: number;
  metodoSeleccionado: string;
  razonMetodo: string;
  baseTrimestralIngresos: number;
  isoSobreIngresos: number;
  baseTrimestralActivo: number;
  isoSobreActivoNeto: number;
  isoSobreActivoNetoFinal: number;
  isoAPagar: number;
  detalleCalculo: string;
  mensaje: string;
  recomendacionLegal: string;
}) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Intentar cargar el logo
  const logoData = await loadSECALogo();

  // Header con logo y título
  doc.setFillColor(...SECA_CONFIG.primaryColor);
  doc.rect(0, 0, pageWidth, 35, "F");

  // Logo o texto SECA
  if (logoData) {
    try {
      doc.addImage(logoData, 'PNG', 14, 8, 35, 13);
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(14);
      doc.setFont("helvetica", "normal");
      doc.text("Servicios Contables", pageWidth / 2, 18, { align: "center" });
    } catch (error) {
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("SECA - Servicios Contables", pageWidth / 2, 15, { align: "center" });
    }
  } else {
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("SECA - Servicios Contables", pageWidth / 2, 15, { align: "center" });
  }

  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.text("Calculo de ISO Trimestral", pageWidth / 2, 25, { align: "center" });

  // Información general
  doc.setTextColor(...SECA_CONFIG.textColor);
  doc.setFontSize(10);
  doc.text(`Fecha de emision: ${new Date().toLocaleDateString("es-GT")}`, 14, 45);

  // Valores con fallback a 0
  const ingresos = data.ingresosBrutos || 0;
  const costos = data.costoDeVentas || 0;
  const resultado = data.resultadoBruto || 0;
  const margen = data.margenPorcentaje || 0;
  const activoNet = data.activoNeto || 0;
  const cuatroIngresos = data.comparacionActivo || 0;
  const isoPagar = data.isoAPagar || 0;

  // ============================================
  // PASO 1: VERIFICACIÓN MARGEN 4%
  // ============================================
  let startY = 55;
  
  autoTable(doc, {
    startY: startY,
    head: [["PASO 1: Verificacion de Margen 4%", "Valor"]],
    body: [
      ["Ingresos Brutos Anuales", `Q ${ingresos.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
      ["(-) Costo de Ventas", `Q ${costos.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
      ["(=) Resultado", `Q ${resultado.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
      ["Margen", `${margen.toFixed(2)}%`],
      ["Estado", data.estaAfectoISO ? "SI esta afecto (Margen >= 4%)" : "NO esta afecto (Margen < 4%)"],
    ],
    headStyles: {
      fillColor: data.estaAfectoISO ? [59, 130, 246] : [16, 185, 129],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 11,
    },
    styles: { 
      fontSize: 10, 
      cellPadding: 4,
      minCellHeight: 8
    },
    columnStyles: {
      0: { cellWidth: 100 },
      1: { cellWidth: 'auto', halign: 'right' }
    }
  });

  let finalY = (doc as any).lastAutoTable.finalY + 15;

  // Si NO está afecto, mostrar mensaje y terminar
  if (!data.estaAfectoISO) {
    // Mensaje en caja verde
    doc.setFillColor(240, 253, 244);
    doc.rect(14, finalY, pageWidth - 28, 30, "F");
    doc.setDrawColor(34, 197, 94);
    doc.setLineWidth(0.5);
    doc.rect(14, finalY, pageWidth - 28, 30, "S");
    
    doc.setTextColor(22, 101, 52);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Resultado:", 18, finalY + 10);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    const mensajeLineas = doc.splitTextToSize(data.mensaje, pageWidth - 36);
    doc.text(mensajeLineas, 18, finalY + 18);
    
    finalY += 40;

    // Recomendación legal
    doc.setTextColor(...SECA_CONFIG.textColor);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Informacion Legal:", 14, finalY);
    finalY += 7;
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const legalLineas = doc.splitTextToSize(data.recomendacionLegal, pageWidth - 28);
    doc.text(legalLineas, 14, finalY);

    // Footer
    const footerY = pageHeight - 20;
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text("SECA - 18 anos de experiencia en servicios contables", pageWidth / 2, footerY, { align: "center" });
    doc.text("Email.: info@seca.gt | Telefono.: 3639 - 3647", pageWidth / 2, footerY + 5, { align: "center" });

    doc.save(`SECA_ISO_Trimestral_NO_AFECTO_${new Date().getTime()}.pdf`);
    return;
  }

  // ============================================
  // PASO 2: DETERMINACIÓN DEL MÉTODO
  // ============================================
  autoTable(doc, {
    startY: finalY,
    head: [["PASO 2: Determinacion del Metodo", "Valor"]],
    body: [
      ["Activo Neto", `Q ${activoNet.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
      ["4 x Ingresos Brutos", `Q ${cuatroIngresos.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
      ["Metodo Seleccionado", data.metodoSeleccionado || "No especificado"],
    ],
    headStyles: {
      fillColor: [251, 191, 36],
      textColor: [30, 41, 59],
      fontStyle: "bold",
      fontSize: 11,
    },
    styles: { 
      fontSize: 10, 
      cellPadding: 4,
      minCellHeight: 8
    },
    columnStyles: {
      0: { cellWidth: 100 },
      1: { cellWidth: 'auto', halign: 'right' }
    }
  });

  finalY = (doc as any).lastAutoTable.finalY + 10;

  // Razón del método en caja
  doc.setFillColor(254, 252, 232);
  const razonHeight = 20;
  doc.rect(14, finalY, pageWidth - 28, razonHeight, "F");
  doc.setDrawColor(251, 191, 36);
  doc.setLineWidth(0.3);
  doc.rect(14, finalY, pageWidth - 28, razonHeight, "S");
  
  doc.setTextColor(120, 53, 15);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("Razon:", 18, finalY + 7);
  
  doc.setFont("helvetica", "normal");
  const razonLineas = doc.splitTextToSize(data.razonMetodo || "", pageWidth - 36);
  doc.text(razonLineas, 18, finalY + 14);
  
  finalY += razonHeight + 15;

  // Verificar si necesitamos nueva página
  if (finalY > pageHeight - 100) {
    doc.addPage();
    finalY = 20;
  }

  // ============================================
  // PASO 3: CÁLCULO DEL ISO
  // ============================================
  
  // Determinar qué método se usó
  const usaMetodoIngresos = data.metodoSeleccionado?.includes("Ingresos");
  
  let calculoBody: string[][];
  
  if (usaMetodoIngresos) {
    // Método Ingresos
    const baseAnual = ingresos;
    const baseTrim = data.baseTrimestralIngresos || (baseAnual / 4);
    const iso = data.isoSobreIngresos || (baseTrim * 0.01);
    
    calculoBody = [
      ["Ingresos Brutos Anuales", `Q ${baseAnual.toLocaleString('es-GT', {minimumFractionDigits: 2})}`],
      ["Base Trimestral (/ 4)", `Q ${baseTrim.toLocaleString('es-GT', {minimumFractionDigits: 2})}`],
      ["ISO 1%", `Q ${iso.toLocaleString('es-GT', {minimumFractionDigits: 2})}`],
      ["(-) IUSI Pagado", "Q 0.00"],
      ["ISO a Pagar", `Q ${iso.toLocaleString('es-GT', {minimumFractionDigits: 2})}`],
    ];
  } else {
    // Método Activo Neto
    const baseAnual = activoNet;
    const baseTrim = data.baseTrimestralActivo || (baseAnual / 4);
    const iso = data.isoSobreActivoNeto || (baseTrim * 0.01);
    const iusi = data.iusiPagado || 0;
    const isoFinal = data.isoSobreActivoNetoFinal || Math.max(0, iso - iusi);
    
    calculoBody = [
      ["Activo Neto", `Q ${baseAnual.toLocaleString('es-GT', {minimumFractionDigits: 2})}`],
      ["Base Trimestral (/ 4)", `Q ${baseTrim.toLocaleString('es-GT', {minimumFractionDigits: 2})}`],
      ["ISO 1%", `Q ${iso.toLocaleString('es-GT', {minimumFractionDigits: 2})}`],
      ["(-) IUSI Pagado", `Q ${iusi.toLocaleString('es-GT', {minimumFractionDigits: 2})}`],
      ["ISO a Pagar", `Q ${isoFinal.toLocaleString('es-GT', {minimumFractionDigits: 2})}`],
    ];
  }

  autoTable(doc, {
    startY: finalY,
    head: [["PASO 3: Calculo del ISO", "Monto"]],
    body: calculoBody,
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 11,
    },
    styles: { 
      fontSize: 10, 
      cellPadding: 4,
      minCellHeight: 8
    },
    columnStyles: {
      0: { cellWidth: 100 },
      1: { cellWidth: 'auto', halign: 'right' }
    }
  });

  finalY = (doc as any).lastAutoTable.finalY + 15;

  // ============================================
  // ISO A PAGAR (DESTACADO)
  // ============================================
  doc.setFillColor(59, 130, 246);
  doc.rect(14, finalY, pageWidth - 28, 35, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("ISO a Pagar (Trimestral):", pageWidth / 2, finalY + 12, { align: "center" });

  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text(`Q ${isoPagar.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, pageWidth / 2, finalY + 26, {
    align: "center",
  });

  finalY += 45;

  // ============================================
  // INFORMACIÓN LEGAL
  // ============================================
  
  // Verificar si necesitamos nueva página para info legal
  if (finalY > pageHeight - 60) {
    doc.addPage();
    finalY = 20;
  }
  
  doc.setTextColor(...SECA_CONFIG.textColor);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Informacion Legal:", 14, finalY);
  finalY += 7;
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  const lineasLegal = doc.splitTextToSize(data.recomendacionLegal, pageWidth - 28);
  doc.text(lineasLegal, 14, finalY);

  // Footer en la última página
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    const footerY = pageHeight - 20;
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text("SECA - 18 anos de experiencia en servicios contables", pageWidth / 2, footerY, { align: "center" });
    doc.text("Email.: info@seca.gt | Telefono.: 3639 - 3647", pageWidth / 2, footerY + 5, { align: "center" });
    doc.text(`Pagina ${i} de ${totalPages}`, pageWidth - 20, footerY, { align: "right" });
  }

  // Descargar el PDF
  doc.save(`SECA_ISO_Trimestral_${new Date().getTime()}.pdf`);
};