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
    img.src = '/images/logo3.png';
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

// Puedes agregar más funciones para otras calculadoras siguiendo el mismo patrón