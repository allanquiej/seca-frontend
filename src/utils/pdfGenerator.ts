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
      doc.text("- Servicios Contables", 52, 18);
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
  doc.text("SECA - 18 años de experiencia en servicios contables", pageWidth / 2, footerY, {
    align: "center",
  });
  doc.text("📧 info@seca.gt | ☎️ 3639-3647", pageWidth / 2, footerY + 5, {
    align: "center",
  });

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
      doc.text("- Servicios Contables", 52, 18);
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
  doc.text("SECA - 18 años de experiencia en servicios contables", pageWidth / 2, footerY, {
    align: "center",
  });
  doc.text("📧 info@seca.gt | ☎️ 3639-3647", pageWidth / 2, footerY + 5, {
    align: "center",
  });

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
      doc.text("- Servicios Contables", 52, 18);
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
  doc.text("SECA - 18 años de experiencia en servicios contables", pageWidth / 2, footerY, {
    align: "center",
  });
  doc.text("📧 info@seca.gt | ☎️ 3639-3647", pageWidth / 2, footerY + 5, {
    align: "center",
  });

  doc.save(`SECA_Aguinaldo_${new Date().getTime()}.pdf`);
};

/**
 * 🆕 Genera un PDF con el cálculo completo de prestaciones laborales
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
      doc.text("- Servicios Contables", 52, 18);
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
    doc.text("⚠ Advertencias", 18, finalY2 + 5);

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
  doc.text("📋 Notas Legales", 18, notasY + 5);

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
  doc.text("SECA - 18 años de experiencia en servicios contables", pageWidth / 2, footerY, {
    align: "center",
  });
  doc.text("📧 info@seca.gt | ☎️ 3639-3647", pageWidth / 2, footerY + 5, {
    align: "center",
  });

  // Descargar el PDF
  doc.save(`SECA_Prestaciones_Laborales_${new Date().getTime()}.pdf`);
};
/**
 * Genera un PDF con los resultados de la calculadora de IVA
 */
export const generateIVAPDF = async (data: {
  regimen: string;
  ventasMes: number;
  comprasMes: number;
  retenciones: number;
  ingresosAnuales: number;
  regimenNombre: string;
  debitoFiscal: number;
  creditoFiscal: number;
  ivaBruto: number;
  ivaAPagar: number;
  cuotaFija: number;
  aplica: boolean;
  mensaje: string;
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
      doc.text("- Servicios Contables", 52, 18);
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
  doc.text("Cálculo de IVA", pageWidth / 2, 25, { align: "center" });

  // Información general
  doc.setTextColor(...SECA_CONFIG.textColor);
  doc.setFontSize(10);
  doc.text(`Fecha de emisión: ${new Date().toLocaleDateString("es-GT")}`, 14, 45);
  doc.text(`Régimen: ${data.regimenNombre}`, 14, 51);

  let finalY = 55;

  // Tabla de datos según régimen
  if (data.regimen === "general") {
    autoTable(doc, {
      startY: finalY,
      head: [["Datos Ingresados", "Valor"]],
      body: [
        ["Total Ventas del Mes", `Q ${data.ventasMes.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
        ["Total Compras del Mes", `Q ${data.comprasMes.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
        ["Retenciones de IVA", `Q ${data.retenciones.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
      ],
      headStyles: {
        fillColor: SECA_CONFIG.primaryColor,
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      styles: { fontSize: 11 },
    });

    finalY = (doc as any).lastAutoTable.finalY + 10;

    // Desglose del cálculo
    autoTable(doc, {
      startY: finalY,
      head: [["Concepto", "Monto"]],
      body: [
        ["Débito Fiscal (IVA en ventas)", `Q ${data.debitoFiscal.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
        ["Crédito Fiscal (IVA en compras)", `- Q ${data.creditoFiscal.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
        ["IVA Bruto", `Q ${data.ivaBruto.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
        ["Retenciones", `- Q ${data.retenciones.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
      ],
      headStyles: {
        fillColor: SECA_CONFIG.secondaryColor,
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      styles: { fontSize: 11 },
    });

    finalY = (doc as any).lastAutoTable.finalY + 10;
  } else if (data.regimen === "pequeno") {
    autoTable(doc, {
      startY: finalY,
      head: [["Datos Ingresados", "Valor"]],
      body: [
        ["Ingresos Anuales", `Q ${data.ingresosAnuales.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
        ["Límite para Pequeño Contribuyente", "Q 150,000.00"],
      ],
      headStyles: {
        fillColor: SECA_CONFIG.primaryColor,
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      styles: { fontSize: 11 },
    });

    finalY = (doc as any).lastAutoTable.finalY + 10;
  }

  // Resultado
  doc.setFillColor(...SECA_CONFIG.secondaryColor);
  doc.rect(14, finalY, pageWidth - 28, 25, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(
    data.regimen === "pequeno" ? "Cuota Fija Mensual" : "IVA a Pagar",
    pageWidth / 2,
    finalY + 10,
    { align: "center" }
  );

  doc.setFontSize(20);
  doc.text(
    `Q ${data.ivaAPagar.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`,
    pageWidth / 2,
    finalY + 20,
    { align: "center" }
  );

  // Mensaje
  if (data.mensaje) {
    doc.setTextColor(...SECA_CONFIG.textColor);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    
    const mensajeLines = doc.splitTextToSize(data.mensaje, pageWidth - 28);
    let yPos = finalY + 35;
    
    mensajeLines.forEach((line: string) => {
      doc.text(line, 14, yPos);
      yPos += 5;
    });
  }

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 20;
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text("SECA - 18 años de experiencia en servicios contables", pageWidth / 2, footerY, {
    align: "center",
  });
  doc.text("📧 info@seca.gt | ☎️ 3639-3647", pageWidth / 2, footerY + 5, {
    align: "center",
  });

  // Descargar el PDF
  doc.save(`SECA_IVA_${data.regimenNombre.replace(/\s/g, '_')}_${new Date().getTime()}.pdf`);
};
/**
 * Genera un PDF con los resultados de la calculadora de ISR Laboral (Asalariados)
 */
export const generateISRLaboralPDF = async (data: {
  salariosAnuales: number;
  bono14: number;
  aguinaldo: number;
  otrosBonos: number;
  esProyectado: boolean;
  totalIngresos: number;
  deduccionPersonal: number;
  baseImponible: number;
  isrTotal: number;
  isrMensual: number;
  tipoCalculo: string;
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
      doc.text("- Servicios Contables", 52, 18);
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

  doc.setTextColor(...SECA_CONFIG.textColor);
  doc.setFontSize(10);
  doc.text(`Fecha de emisión: ${new Date().toLocaleDateString("es-GT")}`, 14, 45);
  doc.text(`Tipo de cálculo: ${data.tipoCalculo}`, 14, 51);

  autoTable(doc, {
    startY: 60,
    head: [["Concepto", "Monto"]],
    body: [
      ["Salarios Anuales", `Q ${data.salariosAnuales.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
      ["Bono 14", `Q ${data.bono14.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
      ["Aguinaldo", `Q ${data.aguinaldo.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
      ["Otros Bonos", `Q ${data.otrosBonos.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
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
    head: [["Descripción", "Valor"]],
    body: [
      ["Total Ingresos", `Q ${data.totalIngresos.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
      ["Deducción Personal (Art. 72)", `- Q ${data.deduccionPersonal.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
      ["Base Imponible", `Q ${data.baseImponible.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
      ["ISR (5%)", `Q ${data.isrTotal.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
    ],
    headStyles: {
      fillColor: SECA_CONFIG.secondaryColor,
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    styles: { fontSize: 11 },
  });

  finalY = (doc as any).lastAutoTable.finalY + 10;

  doc.setFillColor(...SECA_CONFIG.accentColor);
  doc.rect(14, finalY, pageWidth - 28, 25, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("ISR Total Anual", pageWidth / 2, finalY + 10, { align: "center" });

  doc.setFontSize(20);
  doc.text(`Q ${data.isrTotal.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, pageWidth / 2, finalY + 20, { align: "center" });

  finalY += 30;

  if (data.esProyectado && data.isrMensual > 0) {
    doc.setFillColor(245, 158, 11);
    doc.rect(14, finalY, pageWidth - 28, 20, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("ISR Mensual (Descuento por mes)", pageWidth / 2, finalY + 8, { align: "center" });

    doc.setFontSize(18);
    doc.text(`Q ${data.isrMensual.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, pageWidth / 2, finalY + 16, { align: "center" });
  }

  const footerY = doc.internal.pageSize.getHeight() - 20;
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text("SECA - 18 años de experiencia en servicios contables", pageWidth / 2, footerY, {
    align: "center",
  });
  doc.text("📧 info@seca.gt | ☎️ 3639-3647", pageWidth / 2, footerY + 5, {
    align: "center",
  });

  doc.save(`SECA_ISR_Laboral_${data.tipoCalculo}_${new Date().getTime()}.pdf`);
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
      doc.text("- Servicios Contables", 52, 18);
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
  doc.text("SECA - 18 años de experiencia en servicios contables", pageWidth / 2, footerY, {
    align: "center",
  });
  doc.text("📧 info@seca.gt | ☎️ 3639-3647", pageWidth / 2, footerY + 5, {
    align: "center",
  });

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
  isoPendiente: number;
  opcionUtilizada: string;
  baseCalculo: number;
  isrCalculado: number;
  isoAcreditar: number;
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
      doc.text("- Servicios Contables", 52, 18);
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

  let bodyData: string[][];
  if (data.usarOpcionAcumulada) {
    bodyData = [
      ["Ventas Acumuladas", `Q ${data.ventasAcumuladas.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
      ["Gastos Acumulados", `Q ${data.gastosAcumulados.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
      ["ISO Pendiente", `Q ${data.isoPendiente.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
    ];
  } else {
    bodyData = [
      ["Ventas del Trimestre", `Q ${data.ventasTrimestre.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
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

  autoTable(doc, {
    startY: finalY,
    head: [["Concepto", "Monto"]],
    body: [
      ["Base de Cálculo", `Q ${data.baseCalculo.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
      ["ISR (25%)", `Q ${data.isrCalculado.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
      ["ISO a Acreditar", `- Q ${data.isoAcreditar.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`],
    ],
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
  doc.text("ISR a Pagar", pageWidth / 2, finalY + 10, { align: "center" });

  doc.setFontSize(20);
  doc.text(`Q ${data.isrAPagar.toLocaleString('es-GT', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, pageWidth / 2, finalY + 20, { align: "center" });

  const footerY = doc.internal.pageSize.getHeight() - 20;
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text("SECA - 18 años de experiencia en servicios contables", pageWidth / 2, footerY, {
    align: "center",
  });
  doc.text("📧 info@seca.gt | ☎️ 3639-3647", pageWidth / 2, footerY + 5, {
    align: "center",
  });

  doc.save(`SECA_ISR_Empresa_Trimestral_${data.opcionUtilizada.replace(/\s/g, '_')}_${new Date().getTime()}.pdf`);
};