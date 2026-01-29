// src/pages/ISOTrimestralPage.tsx
import { useState } from "react";
import type { FormEvent } from "react";
import type {
  ISOTrimestralRequest,
  ISOTrimestralResponse,
  RespuestaApi,
} from "../types/calculadoras";
import { calcularISOTrimestral } from "../services/calculadorasService";
import { generateISOTrimestralPDF } from "../utils/pdfGenerator";

const ISOTrimestralPage: React.FC = () => {
  const [form, setForm] = useState<ISOTrimestralRequest>({
    ingresosBrutosAnuales: 0,
    activoTotal: 0,
    depreciacionAmortizacionAcumulada: 0,
    reservaCuentasIncobrables: 0,
    creditosReinversion: 0,
    iusiPagado: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<RespuestaApi<ISOTrimestralResponse> | null>(null);

  const handleChange = (field: keyof ISOTrimestralRequest) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseFloat(e.target.value);
    setForm((prev) => ({
      ...prev,
      [field]: isNaN(value) ? 0 : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResultado(null);

    try {
      const res = await calcularISOTrimestral(form);
      console.log('✅ Respuesta recibida del backend:', res);
      setResultado(res);
    } catch (err: any) {
      console.error('❌ Error al calcular ISO Trimestral:', err);
      setError(err.message ?? "Error al calcular el ISO trimestral.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (resultado && resultado.datos) {
      generateISOTrimestralPDF({
        ...form,
        ...resultado.datos,
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
          🏦 Calculadora ISO Trimestral
        </h1>
        <p style={{ fontSize: "1.1rem", color: "#64748b", lineHeight: 1.6 }}>
          Calcula el <strong>Impuesto de Solidaridad (ISO)</strong> según el Decreto 73-2008.
        </p>
      </div>

      {/* Información importante */}
      <div
        style={{
          background: "#dbeafe",
          border: "2px solid #3b82f6",
          borderRadius: "1rem",
          padding: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.5rem", color: "#1e3a8a" }}>
          ℹ️ Importante - Dos Métodos de Cálculo
        </h3>
        <p style={{ margin: "0.5rem 0", color: "#1e40af", lineHeight: 1.8 }}>
          La SAT requiere que calcules el ISO de <strong>DOS formas</strong> y pagues el <strong>MAYOR</strong>:
        </p>
        <ul style={{ margin: "0.5rem 0", paddingLeft: "1.5rem", color: "#1e40af", lineHeight: 1.8 }}>
          <li><strong>Método 1 - Ingresos Brutos:</strong> (Ingresos Anuales ÷ 4) × 1%</li>
          <li><strong>Método 2 - Activo Neto:</strong> ((Activo Neto ÷ 4) × 1%) - IUSI Pagado</li>
        </ul>
        <p style={{ marginTop: "1rem", color: "#1e40af", fontSize: "0.95rem" }}>
          💡 <strong>Tip:</strong> El ISO pagado puede acreditarse al ISR del mismo período.
        </p>
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
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          
          {/* SECCIÓN 1: INGRESOS BRUTOS */}
          <div>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "1rem", color: "#3b82f6" }}>
              📊 Método 1: Ingresos Brutos
            </h3>
            <div>
              <label
                style={{
                  display: "block",
                  fontWeight: 600,
                  marginBottom: "0.5rem",
                  color: "#0f172a",
                }}
              >
                Ingresos Brutos Anuales (Q):
              </label>
              <input
                type="number"
                step="0.01"
                value={form.ingresosBrutosAnuales}
                onChange={handleChange("ingresosBrutosAnuales")}
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
                Suma total de todos los ingresos del año (servicios + ventas + otros)
              </small>
            </div>
          </div>

          {/* SECCIÓN 2: ACTIVO NETO */}
          <div
            style={{
              background: "#f8fafc",
              borderRadius: "0.75rem",
              padding: "1.5rem",
            }}
          >
            <h3 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "1rem", color: "#0ea5e9" }}>
              🏢 Método 2: Activo Neto
            </h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {/* Activo Total */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontWeight: 600,
                    marginBottom: "0.5rem",
                    color: "#0f172a",
                  }}
                >
                  Activo Total (Q):
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={form.activoTotal}
                  onChange={handleChange("activoTotal")}
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
                  Suma de todos los activos de la empresa
                </small>
              </div>

              {/* Depreciación */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontWeight: 600,
                    marginBottom: "0.5rem",
                    color: "#0f172a",
                  }}
                >
                  Depreciación y Amortización Acumulada (Q):
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={form.depreciacionAmortizacionAcumulada}
                  onChange={handleChange("depreciacionAmortizacionAcumulada")}
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
                  Pérdida de valor acumulada de activos fijos e intangibles
                </small>
              </div>

              {/* Reserva Cuentas Incobrables */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontWeight: 600,
                    marginBottom: "0.5rem",
                    color: "#0f172a",
                  }}
                >
                  Reserva de Cuentas Incobrables (Q):
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={form.reservaCuentasIncobrables}
                  onChange={handleChange("reservaCuentasIncobrables")}
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
                  Provisión para cuentas de dudoso cobro (ingresar 0 si no aplica)
                </small>
              </div>

              {/* Créditos por Reinversión */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontWeight: 600,
                    marginBottom: "0.5rem",
                    color: "#0f172a",
                  }}
                >
                  Créditos por Reinversión (Q):
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={form.creditosReinversion}
                  onChange={handleChange("creditosReinversion")}
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
                  Beneficio fiscal por reinversión (ingresar 0 si no aplica)
                </small>
              </div>

              {/* IUSI Pagado */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontWeight: 600,
                    marginBottom: "0.5rem",
                    color: "#0f172a",
                  }}
                >
                  IUSI Pagado en el Trimestre (Q):
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={form.iusiPagado}
                  onChange={handleChange("iusiPagado")}
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
                  Impuesto Único Sobre Inmuebles pagado (solo deducible en Método 2)
                </small>
              </div>
            </div>
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
              background: "linear-gradient(135deg, #3b82f6, #2563eb)",
              color: "white",
              boxShadow: "0 4px 15px rgba(59,130,246,0.3)",
              transition: "transform 0.2s",
            }}
            onMouseOver={(e) =>
              !loading && (e.currentTarget.style.transform = "scale(1.02)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {loading ? "Calculando..." : "Calcular ISO Trimestral"}
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
            background: "linear-gradient(135deg, #3b82f6, #2563eb)",
            borderRadius: "1rem",
            padding: "2rem",
            color: "white",
            boxShadow: "0 10px 40px rgba(59,130,246,0.4)",
          }}
        >
          <h2 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "0.5rem" }}>
            ✅ Resultado del Cálculo
          </h2>
          <p style={{ fontSize: "1.1rem", marginBottom: "1.5rem", opacity: 0.95 }}>
            {resultado.datos.mensaje}
          </p>

          {/* Comparación de Métodos */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
            {/* Método 1: Ingresos */}
            <div
              style={{
                background: "rgba(255,255,255,0.15)",
                borderRadius: "0.75rem",
                padding: "1.25rem",
                border: resultado.datos.metodoUtilizado === "ISO sobre Ingresos Brutos" ? "3px solid #fbbf24" : "none",
              }}
            >
              <p style={{ fontSize: "0.9rem", marginBottom: "0.5rem", opacity: 0.9 }}>
                📊 Método 1: Ingresos
              </p>
              <p style={{ fontSize: "1.8rem", fontWeight: 800, margin: 0 }}>
                Q {(resultado.datos.isoSobreIngresos || 0).toFixed(2)}
              </p>
              {resultado.datos.metodoUtilizado === "ISO sobre Ingresos Brutos" && (
                <p style={{ fontSize: "0.85rem", marginTop: "0.5rem", color: "#fbbf24" }}>
                  ⭐ Método seleccionado
                </p>
              )}
            </div>

            {/* Método 2: Activo Neto */}
            <div
              style={{
                background: "rgba(255,255,255,0.15)",
                borderRadius: "0.75rem",
                padding: "1.25rem",
                border: resultado.datos.metodoUtilizado === "ISO sobre Activo Neto" ? "3px solid #fbbf24" : "none",
              }}
            >
              <p style={{ fontSize: "0.9rem", marginBottom: "0.5rem", opacity: 0.9 }}>
                🏢 Método 2: Activo Neto
              </p>
              <p style={{ fontSize: "1.8rem", fontWeight: 800, margin: 0 }}>
                Q {(resultado.datos.isoSobreActivoNetoFinal || 0).toFixed(2)}
              </p>
              {resultado.datos.metodoUtilizado === "ISO sobre Activo Neto" && (
                <p style={{ fontSize: "0.85rem", marginTop: "0.5rem", color: "#fbbf24" }}>
                  ⭐ Método seleccionado
                </p>
              )}
            </div>
          </div>

          {/* ISO a Pagar */}
          <div
            style={{
              background: "rgba(255,255,255,0.25)",
              borderRadius: "0.75rem",
              padding: "1.5rem",
              marginBottom: "1rem",
            }}
          >
            <p style={{ fontSize: "0.9rem", marginBottom: "0.5rem", opacity: 0.9 }}>
              ISO a Pagar (El mayor de ambos métodos):
            </p>
            <p style={{ fontSize: "2.5rem", fontWeight: 800, margin: 0 }}>
              Q {(resultado.datos.isoAPagar || 0).toFixed(2)}
            </p>
          </div>

          {/* Detalles */}
          <details style={{ marginBottom: "1rem" }}>
            <summary style={{ 
              cursor: "pointer", 
              fontWeight: 600, 
              padding: "0.5rem",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "0.5rem",
            }}>
              📋 Ver Detalle de Cálculos
            </summary>
            <div style={{ 
              marginTop: "1rem",
              padding: "1rem",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "0.5rem",
              fontSize: "0.9rem",
              lineHeight: 1.8
            }}>
              <p><strong>Método 1 (Ingresos):</strong></p>
              <p style={{ marginLeft: "1rem" }}>{resultado.datos.detalleCalculoIngresos}</p>
              <p style={{ marginTop: "1rem" }}><strong>Método 2 (Activo Neto):</strong></p>
              <p style={{ marginLeft: "1rem" }}>{resultado.datos.detalleCalculoActivo}</p>
            </div>
          </details>

          {/* Recomendación Legal */}
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
            <strong>ℹ️ Información Legal:</strong>
            <p style={{ marginTop: "0.5rem", marginBottom: 0 }}>
              {resultado.datos.recomendacionLegal}
            </p>
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

export default ISOTrimestralPage;