// src/pages/ISRLaboralPage.tsx
// ✅ ARCHIVO COMPLETO CORREGIDO - REEMPLAZAR TODO EL CONTENIDO
import { useState } from "react";
import type { FormEvent } from "react";
import type {
  ISRAsalariadoRequest,
  ISRAsalariadoResponse,
  RespuestaApi,
} from "../types/calculadoras";
import { calcularISRAsalariado } from "../services/calculadorasService";
import { generateISRLaboralPDF } from "../utils/pdfGenerator";

const ISRLaboralPage: React.FC = () => {
  const [form, setForm] = useState<ISRAsalariadoRequest>({
    salarioOrdinarioMensual: 0,
    bonificacionIncentivo: 0,
    bono14: 0,
    aguinaldo: 0,
    otrosBonos: 0,
    esProyectado: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<RespuestaApi<ISRAsalariadoResponse> | null>(null);

  const handleChange = (field: keyof Omit<ISRAsalariadoRequest, "esProyectado">) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseFloat(e.target.value);
    setForm((prev) => ({
      ...prev,
      [field]: isNaN(value) ? 0 : value,
    }));
  };

  const handleTipoChange = (esProyectado: boolean) => {
    setForm((prev) => ({ ...prev, esProyectado }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResultado(null);

    try {
      const res = await calcularISRAsalariado(form);
      setResultado(res);
    } catch (err: any) {
      setError(err.message ?? "Ocurrió un error al calcular ISR laboral.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (resultado && resultado.datos) {
      // ✅ CORREGIDO: Pasar los datos correctamente a la función PDF
      generateISRLaboralPDF({
        // Input
        salarioOrdinarioMensual: form.salarioOrdinarioMensual,
        bonificacionIncentivo: form.bonificacionIncentivo,
        bono14: form.bono14,
        aguinaldo: form.aguinaldo,
        otrosBonos: form.otrosBonos,
        esProyectado: form.esProyectado,
        // Output
        salariosAnuales: resultado.datos.salariosAnuales,
        bonificacionAnual: resultado.datos.bonificacionAnual,
        totalRentaBruta: resultado.datos.totalRentaBruta,
        aguinaldoExento: resultado.datos.aguinaldoExento,
        bono14Exento: resultado.datos.bono14Exento,
        totalRentasExentas: resultado.datos.totalRentasExentas,
        rentaNeta: resultado.datos.rentaNeta,
        gastosPersonales: resultado.datos.gastosPersonales,
        cuotaIGSS: resultado.datos.cuotaIGSS,
        totalDeducciones: resultado.datos.totalDeducciones,
        rentaImponible: resultado.datos.rentaImponible,
        isrAnual: resultado.datos.isrAnual,
        retencionMensual: resultado.datos.retencionMensual,
        tipoCalculo: resultado.datos.tipoCalculo,
        detalleCalculo: resultado.datos.detalleCalculo,
      });
    }
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "1rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: 800,
            marginBottom: "0.5rem",
            color: "#0f172a",
          }}
        >
          📊 Calculadora ISR Asalariados
        </h1>
        <p style={{ fontSize: "1.1rem", color: "#64748b", lineHeight: 1.6 }}>
          Calcula el ISR según el{" "}
          <strong>Decreto 10-2012 (Ley ISR)</strong>.
          Incluye cálculo de rentas exentas y cuota IGSS.
        </p>
      </div>

      {/* Información importante */}
      <div
        style={{
          background: "#dbeafe",
          border: "2px solid #2252EC",
          borderRadius: "1rem",
          padding: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.5rem", color: "#0E234F" }}>
          ℹ️ Metodología según SAT
        </h3>
        <ol style={{ margin: 0, paddingLeft: "1.5rem", color: "#0E234F", lineHeight: 1.8 }}>
          <li>Se calcula la <strong>Renta Bruta</strong> (salarios + bonificación + aguinaldo + bono 14 + otros)</li>
          <li>Se restan las <strong>Rentas Exentas</strong> (aguinaldo y bono 14 hasta 100% del salario)</li>
          <li>Se obtiene la <strong>Renta Neta</strong></li>
          <li>Se restan las <strong>Deducciones</strong> (Q48,000 + IGSS 4.83%)</li>
          <li>Se aplica la <strong>Tabla Progresiva</strong> (5% hasta Q300k, luego 7%)</li>
        </ol>
      </div>

      {/* Formulario */}
      <div
        style={{
          background: "white",
          borderRadius: "1rem",
          padding: "2rem",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          marginBottom: "2rem",
        }}
      >
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          {/* Salario Ordinario Mensual */}
          <div>
            <label
              style={{
                display: "block",
                fontWeight: 600,
                marginBottom: "0.5rem",
                color: "#0f172a",
              }}
            >
              Salario Ordinario Mensual (Q):
            </label>
            <input
              type="number"
              step="0.01"
              value={form.salarioOrdinarioMensual}
              onChange={handleChange("salarioOrdinarioMensual")}
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "0.5rem",
                border: "2px solid #e2e8f0",
                fontSize: "1rem",
              }}
            />
            <small style={{ color: "#64748b", fontSize: "0.9rem" }}>
              Sueldo base mensual <strong>sin incluir</strong> bonificación incentivo
            </small>
          </div>

          {/* Bonificación Incentivo */}
          <div>
            <label
              style={{
                display: "block",
                fontWeight: 600,
                marginBottom: "0.5rem",
                color: "#0f172a",
              }}
            >
              Bonificación Incentivo Mensual (Q):
            </label>
            <input
              type="number"
              step="0.01"
              value={form.bonificacionIncentivo}
              onChange={handleChange("bonificacionIncentivo")}
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "0.5rem",
                border: "2px solid #e2e8f0",
                fontSize: "1rem",
              }}
            />
            <small style={{ color: "#64748b", fontSize: "0.9rem" }}>
              Generalmente Q 250.00 mensuales
            </small>
          </div>

          {/* Bono 14 */}
          <div>
            <label
              style={{
                display: "block",
                fontWeight: 600,
                marginBottom: "0.5rem",
                color: "#0f172a",
              }}
            >
              Bono 14 Anual (Q):
            </label>
            <input
              type="number"
              step="0.01"
              value={form.bono14}
              onChange={handleChange("bono14")}
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "0.5rem",
                border: "2px solid #e2e8f0",
                fontSize: "1rem",
              }}
            />
            <small style={{ color: "#64748b", fontSize: "0.9rem" }}>
              Exento hasta 100% del salario ordinario mensual
            </small>
          </div>

          {/* Aguinaldo */}
          <div>
            <label
              style={{
                display: "block",
                fontWeight: 600,
                marginBottom: "0.5rem",
                color: "#0f172a",
              }}
            >
              Aguinaldo Anual (Q):
            </label>
            <input
              type="number"
              step="0.01"
              value={form.aguinaldo}
              onChange={handleChange("aguinaldo")}
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "0.5rem",
                border: "2px solid #e2e8f0",
                fontSize: "1rem",
              }}
            />
            <small style={{ color: "#64748b", fontSize: "0.9rem" }}>
              Exento hasta 100% del salario ordinario mensual
            </small>
          </div>

          {/* Otros Bonos */}
          <div>
            <label
              style={{
                display: "block",
                fontWeight: 600,
                marginBottom: "0.5rem",
                color: "#0f172a",
              }}
            >
              Otros Bonos o Ingresos Anuales (Q):
            </label>
            <input
              type="number"
              step="0.01"
              value={form.otrosBonos}
              onChange={handleChange("otrosBonos")}
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "0.5rem",
                border: "2px solid #e2e8f0",
                fontSize: "1rem",
              }}
            />
            <small style={{ color: "#64748b", fontSize: "0.9rem" }}>
              Ingresar 0 si no aplica
            </small>
          </div>

          {/* Tipo de cálculo */}
          <div>
            <label
              style={{
                display: "block",
                fontWeight: 600,
                marginBottom: "0.75rem",
                color: "#0f172a",
              }}
            >
              Tipo de Declaración:
            </label>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                type="button"
                onClick={() => handleTipoChange(true)}
                style={{
                  flex: 1,
                  padding: "1rem",
                  borderRadius: "0.75rem",
                  border: form.esProyectado ? "3px solid #0E234F" : "2px solid #e2e8f0",
                  background: form.esProyectado ? "#dbeafe" : "white",
                  cursor: "pointer",
                  fontWeight: 600,
                  color: form.esProyectado ? "#0E234F" : "#64748b",
                  transition: "all 0.2s",
                }}
              >
                📅 Proyectada (Mensual)
              </button>
              <button
                type="button"
                onClick={() => handleTipoChange(false)}
                style={{
                  flex: 1,
                  padding: "1rem",
                  borderRadius: "0.75rem",
                  border: !form.esProyectado ? "3px solid #0E234F" : "2px solid #e2e8f0",
                  background: !form.esProyectado ? "#dbeafe" : "white",
                  cursor: "pointer",
                  fontWeight: 600,
                  color: !form.esProyectado ? "#0E234F" : "#64748b",
                  transition: "all 0.2s",
                }}
              >
                📋 Definitiva (Anual)
              </button>
            </div>
            <small style={{ color: "#64748b", fontSize: "0.9rem", display: "block", marginTop: "0.5rem" }}>
              {form.esProyectado
                ? "El ISR se dividirá entre 12 meses (retención mensual)"
                : "El ISR se pagará completo al final del año"}
            </small>
          </div>

          {/* Botón */}
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "1rem 2rem",
              borderRadius: "0.75rem",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: 700,
              fontSize: "1.1rem",
              background: "linear-gradient(135deg, #0E234F, #2252EC)",
              color: "white",
              boxShadow: "0 4px 15px rgba(14,35,79,0.3)",
              transition: "transform 0.2s",
            }}
            onMouseOver={(e) =>
              !loading && (e.currentTarget.style.transform = "scale(1.02)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {loading ? "Calculando..." : "Calcular ISR Asalariados"}
          </button>
        </form>
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            padding: "1rem",
            borderRadius: "0.75rem",
            background: "#fee2e2",
            border: "2px solid #fca5a5",
            color: "#991b1b",
            marginBottom: "2rem",
          }}
        >
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Resultado */}
      {resultado && resultado.datos && (
        <div
          style={{
            background: "linear-gradient(135deg, #0E234F, #2252EC)",
            borderRadius: "1rem",
            padding: "2rem",
            color: "white",
            boxShadow: "0 10px 40px rgba(14,35,79,0.4)",
          }}
        >
          <h2 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "0.5rem" }}>
            ✅ Resultado del Cálculo ({resultado.datos.tipoCalculo})
          </h2>
          <p style={{ fontSize: "1rem", marginBottom: "1.5rem", opacity: 0.95 }}>
            Cálculo según Decreto 10-2012 (Ley ISR de Guatemala)
          </p>

          {/* Sección 1: Renta Bruta */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.75rem", borderBottom: "2px solid rgba(255,255,255,0.3)", paddingBottom: "0.5rem" }}>
              1️⃣ Renta Bruta
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.75rem" }}>
              <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: "0.5rem", padding: "0.75rem" }}>
                <p style={{ fontSize: "0.85rem", marginBottom: "0.25rem", opacity: 0.8 }}>Salarios (12 meses)</p>
                <p style={{ fontSize: "1.2rem", fontWeight: 700, margin: 0 }}>Q {resultado.datos.salariosAnuales.toFixed(2)}</p>
              </div>
              <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: "0.5rem", padding: "0.75rem" }}>
                <p style={{ fontSize: "0.85rem", marginBottom: "0.25rem", opacity: 0.8 }}>Bonificación (12 meses)</p>
                <p style={{ fontSize: "1.2rem", fontWeight: 700, margin: 0 }}>Q {resultado.datos.bonificacionAnual.toFixed(2)}</p>
              </div>
              <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: "0.5rem", padding: "0.75rem" }}>
                <p style={{ fontSize: "0.85rem", marginBottom: "0.25rem", opacity: 0.8 }}>Aguinaldo</p>
                <p style={{ fontSize: "1.2rem", fontWeight: 700, margin: 0 }}>Q {resultado.datos.aguinaldo.toFixed(2)}</p>
              </div>
              <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: "0.5rem", padding: "0.75rem" }}>
                <p style={{ fontSize: "0.85rem", marginBottom: "0.25rem", opacity: 0.8 }}>Bono 14</p>
                <p style={{ fontSize: "1.2rem", fontWeight: 700, margin: 0 }}>Q {resultado.datos.bono14.toFixed(2)}</p>
              </div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.25)", borderRadius: "0.75rem", padding: "1rem", marginTop: "0.75rem" }}>
              <p style={{ fontSize: "0.9rem", marginBottom: "0.25rem", opacity: 0.9 }}>Total Renta Bruta:</p>
              <p style={{ fontSize: "2rem", fontWeight: 800, margin: 0 }}>Q {resultado.datos.totalRentaBruta.toFixed(2)}</p>
            </div>
          </div>

          {/* Sección 2: Rentas Exentas */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.75rem", borderBottom: "2px solid rgba(255,255,255,0.3)", paddingBottom: "0.5rem" }}>
              2️⃣ (-) Rentas Exentas
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.75rem" }}>
              <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: "0.5rem", padding: "0.75rem" }}>
                <p style={{ fontSize: "0.85rem", marginBottom: "0.25rem", opacity: 0.8 }}>Aguinaldo Exento</p>
                <p style={{ fontSize: "1.2rem", fontWeight: 700, margin: 0 }}>Q {resultado.datos.aguinaldoExento.toFixed(2)}</p>
              </div>
              <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: "0.5rem", padding: "0.75rem" }}>
                <p style={{ fontSize: "0.85rem", marginBottom: "0.25rem", opacity: 0.8 }}>Bono 14 Exento</p>
                <p style={{ fontSize: "1.2rem", fontWeight: 700, margin: 0 }}>Q {resultado.datos.bono14Exento.toFixed(2)}</p>
              </div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.25)", borderRadius: "0.75rem", padding: "1rem", marginTop: "0.75rem" }}>
              <p style={{ fontSize: "0.9rem", marginBottom: "0.25rem", opacity: 0.9 }}>Total Rentas Exentas:</p>
              <p style={{ fontSize: "2rem", fontWeight: 800, margin: 0 }}>- Q {resultado.datos.totalRentasExentas.toFixed(2)}</p>
            </div>
          </div>

          {/* Sección 3: Renta Neta */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.75rem", borderBottom: "2px solid rgba(255,255,255,0.3)", paddingBottom: "0.5rem" }}>
              3️⃣ (=) Renta Neta
            </h3>
            <div style={{ background: "rgba(255,255,255,0.25)", borderRadius: "0.75rem", padding: "1rem" }}>
              <p style={{ fontSize: "2rem", fontWeight: 800, margin: 0 }}>Q {resultado.datos.rentaNeta.toFixed(2)}</p>
            </div>
          </div>

          {/* Sección 4: Deducciones */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.75rem", borderBottom: "2px solid rgba(255,255,255,0.3)", paddingBottom: "0.5rem" }}>
              4️⃣ (-) Deducciones
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.75rem" }}>
              <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: "0.5rem", padding: "0.75rem" }}>
                <p style={{ fontSize: "0.85rem", marginBottom: "0.25rem", opacity: 0.8 }}>Gastos Personales</p>
                <p style={{ fontSize: "1.2rem", fontWeight: 700, margin: 0 }}>Q {resultado.datos.gastosPersonales.toFixed(2)}</p>
              </div>
              <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: "0.5rem", padding: "0.75rem" }}>
                <p style={{ fontSize: "0.85rem", marginBottom: "0.25rem", opacity: 0.8 }}>Cuota IGSS (4.83%)</p>
                <p style={{ fontSize: "1.2rem", fontWeight: 700, margin: 0 }}>Q {resultado.datos.cuotaIGSS.toFixed(2)}</p>
              </div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.25)", borderRadius: "0.75rem", padding: "1rem", marginTop: "0.75rem" }}>
              <p style={{ fontSize: "0.9rem", marginBottom: "0.25rem", opacity: 0.9 }}>Total Deducciones:</p>
              <p style={{ fontSize: "2rem", fontWeight: 800, margin: 0 }}>- Q {resultado.datos.totalDeducciones.toFixed(2)}</p>
            </div>
          </div>

          {/* Sección 5: Renta Imponible e ISR */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.75rem", borderBottom: "2px solid rgba(255,255,255,0.3)", paddingBottom: "0.5rem" }}>
              5️⃣ Cálculo de ISR
            </h3>
            <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: "0.75rem", padding: "1rem", marginBottom: "0.75rem" }}>
              <p style={{ fontSize: "0.9rem", marginBottom: "0.25rem", opacity: 0.9 }}>Renta Imponible:</p>
              <p style={{ fontSize: "1.8rem", fontWeight: 800, margin: 0 }}>Q {resultado.datos.rentaImponible.toFixed(2)}</p>
            </div>
            <div style={{ background: "rgba(255,255,255,0.3)", borderRadius: "0.75rem", padding: "1.5rem", marginBottom: "0.75rem" }}>
              <p style={{ fontSize: "0.9rem", marginBottom: "0.25rem", opacity: 0.9 }}>ISR Anual:</p>
              <p style={{ fontSize: "2.5rem", fontWeight: 800, margin: 0 }}>Q {resultado.datos.isrAnual.toFixed(2)}</p>
            </div>
            {resultado.datos.retencionMensual > 0 && (
              <div style={{ background: "rgba(255,255,255,0.3)", borderRadius: "0.75rem", padding: "1.5rem" }}>
                <p style={{ fontSize: "0.9rem", marginBottom: "0.25rem", opacity: 0.9 }}>Retención Mensual:</p>
                <p style={{ fontSize: "2.5rem", fontWeight: 800, margin: 0 }}>Q {resultado.datos.retencionMensual.toFixed(2)}</p>
              </div>
            )}
          </div>

          {/* Detalle */}
          <div
            style={{
              background: "rgba(255,255,255,0.1)",
              borderRadius: "0.75rem",
              padding: "1rem",
              fontSize: "0.9rem",
              lineHeight: 1.6,
              marginBottom: "1rem",
            }}
          >
            <strong>📋 Resumen:</strong> {resultado.datos.detalleCalculo}
          </div>

          {/* Botón Descargar PDF */}
          <button
            onClick={handleDownloadPDF}
            style={{
              width: "100%",
              padding: "1rem",
              borderRadius: "0.75rem",
              border: "2px solid white",
              background: "rgba(255,255,255,0.2)",
              color: "white",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: "1rem",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.3)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.2)";
            }}
          >
            📄 Descargar Resultado en PDF
          </button>

        </div>
      )}
    </div>
  );
};

export default ISRLaboralPage;