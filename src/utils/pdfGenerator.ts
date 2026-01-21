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
 * Genera un PDF con los resultados de la calculadora de Indemnización
 */
export const generateIndemnizacionPDF = (data: {
  salarioMensual: number;
  fechaInicio: string;
  fechaFin: string;
  montoIndemnizacion: number;
  detalleCalculo: string;
}) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header con logo y título
  doc.setFillColor(...SECA_CONFIG.primaryColor);
  doc.rect(0, 0, pageWidth, 35, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("SECA - Servicios Contables", pageWidth / 2, 15, { align: "center" });

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
      ["Salario Mensual", `Q ${data.salarioMensual.toFixed(2)}`],
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
  doc.text(`Q ${data.montoIndemnizacion.toFixed(2)}`, pageWidth / 2, finalY + 20, {
    align: "center",
  });

  // Detalle del cálculo
  doc.setTextColor(...SECA_CONFIG.textColor);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  const splitDetail = doc.splitTextToSize(data.detalleCalculo, pageWidth - 28);
  doc.text(splitDetail, 14, finalY + 35);

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
export const generateBono14PDF = (data: {
  salarioPromedio: number;
  fechaInicio: string;
  fechaFin: string;
  montoBono14: number;
  detalleCalculo: string;
}) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFillColor(...SECA_CONFIG.primaryColor);
  doc.rect(0, 0, pageWidth, 35, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("SECA - Servicios Contables", pageWidth / 2, 15, { align: "center" });

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
      ["Salario Ordinario", `Q ${data.salarioPromedio.toFixed(2)}`],
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
  doc.text(`Q ${data.montoBono14.toFixed(2)}`, pageWidth / 2, finalY + 20, { align: "center" });

  // Detalle del cálculo
  doc.setTextColor(...SECA_CONFIG.textColor);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  const splitDetail = doc.splitTextToSize(data.detalleCalculo, pageWidth - 28);
  doc.text(splitDetail, 14, finalY + 35);

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
export const generateAguinaldoPDF = (data: {
  salarioPromedio: number;
  fechaInicio: string;
  fechaFin: string;
  montoAguinaldo: number;
  detalleCalculo: string;
}) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFillColor(...SECA_CONFIG.primaryColor);
  doc.rect(0, 0, pageWidth, 35, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("SECA - Servicios Contables", pageWidth / 2, 15, { align: "center" });

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
      ["Salario Promedio", `Q ${data.salarioPromedio.toFixed(2)}`],
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
  doc.text(`Q ${data.montoAguinaldo.toFixed(2)}`, pageWidth / 2, finalY + 20, {
    align: "center",
  });

  // Detalle del cálculo
  doc.setTextColor(...SECA_CONFIG.textColor);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  const splitDetail = doc.splitTextToSize(data.detalleCalculo, pageWidth - 28);
  doc.text(splitDetail, 14, finalY + 35);

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

// Puedes agregar más funciones para otras calculadoras siguiendo el mismo patrón