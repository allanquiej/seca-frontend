// src/pages/ISREmpresaTrimestralPage.tsx
import { useState } from "react";
import type { FormEvent } from "react";
import type {
  ISRTrimestralV2Request,
  ISRTrimestralV2Response,
  RespuestaApi,
} from "../types/calculadoras";
import { calcularISRTrimestralV2 } from "../services/calculadorasService";
import { generateISRTrimestralPDF } from "../utils/pdfGenerator";

const ISREmpresaTrimestralPage: React.FC = () => {
  const [form, setForm] = useState<ISRTrimestralV2Request>({
    ventasAcumuladas: 0,
    gastosAcumulados: 0,
    ventasTrimestre: 0,
    isoPendiente: 0,
    usarOpcionAcumulada: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<RespuestaApi<ISRTrimestralV2Response> | null>(null);

  const handleChange = (field: keyof Omit<ISRTrimestralV2Request, "usarOpcionAcumulada">) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseFloat(e.target.value);
    setForm((prev) => ({
      ...prev,
      [field]: isNaN(value) ? 0 : value,
    }));
  };

  const handleOpcionChange = (usarOpcionAcumulada: boolean) => {
    setForm((prev) => ({ ...prev, usarOpcionAcumulada }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResultado(null);

    try {
      const res = await calcularISRTrimestralV2(form);
      console.log('✅ Respuesta recibida del backend:', res);
      setResultado(res);
    } catch (err: any) {
      console.error('❌ Error al calcular ISR Trimestral:', err);
      setError(err.message ?? "Error al calcular el ISR de empresa trimestral.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (resultado && resultado.datos) {
      generateISRTrimestralPDF({
        usarOpcionAcumulada: form.usarOpcionAcumulada,
        ventasAcumuladas: form.ventasAcumuladas,
        gastosAcumulados: form.gastosAcumulados,
        ventasTrimestre: form.ventasTrimestre,
        isoPendiente: form.isoPendiente,
        ...resultado.datos,
      });
    }
  };

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "1rem" }}>
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
          📈 Calculadora ISR Empresa Trimestral
        </h1>
        <p style={{ fontSize: "1.1rem", color: "#64748b", lineHeight: 1.6 }}>
          Calcula el ISR trimestral con el <strong>25%</strong> sobre la base imponible.
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
        <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.5rem", color: "#0E234F" }}>
          ℹ️ Dos opciones de cálculo disponibles
        </h3>
        <div style={{ color: "#0E234F", lineHeight: 1.8 }}>
          <strong>Opción 1 - Acumulado:</strong>
          <ul style={{ margin: "0.5rem 0", paddingLeft: "1.5rem" }}>
            <li>Suma ventas acumuladas de todos los trimestres del año</li>
            <li>Suma gastos acumulados de todos los trimestres del año</li>
            <li>ISR = (Ventas - Gastos) × 25%</li>
          </ul>
          <strong>Opción 2 - Solo Trimestre Actual:</strong>
          <ul style={{ margin: "0.5rem 0", paddingLeft: "1.5rem" }}>
            <li>Solo las ventas del trimestre que estás declarando</li>
            <li>NO sumas trimestres anteriores</li>
            <li>ISR = Ventas × 25%</li>
          </ul>
          <p style={{ marginTop: "0.5rem" }}>
            En ambas opciones puedes acreditar el ISO pendiente
          </p>
        </div>
      </div>

      {/* Selección de Opción */}
      <div
        style={{
          background: "white",
          borderRadius: "1rem",
          padding: "1.5rem",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          marginBottom: "2rem",
        }}
      >
        <label
          style={{
            display: "block",
            fontWeight: 600,
            marginBottom: "0.75rem",
            color: "#0f172a",
            fontSize: "1.1rem",
          }}
        >
          Selecciona el tipo de cálculo:
        </label>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button
            type="button"
            onClick={() => handleOpcionChange(true)}
            style={{
              flex: 1,
              padding: "1.25rem",
              borderRadius: "0.75rem",
              border: form.usarOpcionAcumulada ? "3px solid #3b82f6" : "2px solid #e2e8f0",
              background: form.usarOpcionAcumulada ? "#dbeafe" : "white",
              cursor: "pointer",
              fontWeight: 600,
              color: form.usarOpcionAcumulada ? "#0E234F" : "#64748b",
              transition: "all 0.2s",
            }}
          >
            📊 Opción 1: Acumulado
          </button>
          <button
            type="button"
            onClick={() => handleOpcionChange(false)}
            style={{
              flex: 1,
              padding: "1.25rem",
              borderRadius: "0.75rem",
              border: !form.usarOpcionAcumulada ? "3px solid #3b82f6" : "2px solid #e2e8f0",
              background: !form.usarOpcionAcumulada ? "#dbeafe" : "white",
              cursor: "pointer",
              fontWeight: 600,
              color: !form.usarOpcionAcumulada ? "#0E234F" : "#64748b",
              transition: "all 0.2s",
            }}
          >
            📅 Opción 2: Solo Trimestre
          </button>
        </div>
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
          {/* Campos Opción 1 - Acumulado */}
          {form.usarOpcionAcumulada && (
            <>
              <div>
                <label
                  style={{
                    display: "block",
                    fontWeight: 600,
                    marginBottom: "0.5rem",
                    color: "#0f172a",
                  }}
                >
                  Ventas Acumuladas (Q):
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={form.ventasAcumuladas}
                  onChange={handleChange("ventasAcumuladas")}
                  required
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "0.5rem",
                    border: "2px solid #e2e8f0",
                    fontSize: "1rem",
                  }}
                />
                <small style={{ color: "#64748b", fontSize: "0.9rem", display: "block" }}>
                  Suma de ventas de todos los trimestres del año hasta ahora
                </small>
                <small style={{ color: "#dc2626", fontSize: "0.9rem", fontWeight: 600, display: "block", marginTop: "0.25rem" }}>
                  ⚠️ Ingrese el total INCLUYENDO IVA
                </small>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontWeight: 600,
                    marginBottom: "0.5rem",
                    color: "#0f172a",
                  }}
                >
                  Gastos Acumulados (Q):
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={form.gastosAcumulados}
                  onChange={handleChange("gastosAcumulados")}
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
                  Suma de gastos de todos los trimestres del año hasta ahora
                </small>
              </div>
            </>
          )}

          {/* Campos Opción 2 - Solo Trimestre */}
          {!form.usarOpcionAcumulada && (
            <div>
              <label
                style={{
                  display: "block",
                  fontWeight: 600,
                  marginBottom: "0.5rem",
                  color: "#0f172a",
                }}
              >
                Ventas del Trimestre (Q):
              </label>
              <input
                type="number"
                step="0.01"
                value={form.ventasTrimestre}
                onChange={handleChange("ventasTrimestre")}
                required
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "0.5rem",
                  border: "2px solid #e2e8f0",
                  fontSize: "1rem",
                }}
              />
              <small style={{ color: "#64748b", fontSize: "0.9rem", display: "block" }}>
                Solo las ventas del trimestre actual (NO acumulado)
              </small>
              <small style={{ color: "#dc2626", fontSize: "0.9rem", fontWeight: 600, display: "block", marginTop: "0.25rem" }}>
                ⚠️ Ingrese el total INCLUYENDO IVA
              </small>
            </div>
          )}

          {/* ISO Pendiente - Común para ambas opciones */}
          <div>
            <label
              style={{
                display: "block",
                fontWeight: 600,
                marginBottom: "0.5rem",
                color: "#0f172a",
              }}
            >
              ISO Pendiente por Acreditar (Q):
            </label>
            <input
              type="number"
              step="0.01"
              value={form.isoPendiente}
              onChange={handleChange("isoPendiente")}
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
              Ingresar 0 si no tienes ISO pendiente
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
            {loading ? "Calculando..." : "Calcular ISR Empresa Trimestral"}
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
            ✅ Resultado del Cálculo
          </h2>
          <p style={{ fontSize: "1rem", marginBottom: "1.5rem", opacity: 0.9 }}>
            {resultado.datos.opcionUtilizada}
          </p>

          {/* Desglose */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
            <div
              style={{
                background: "rgba(255,255,255,0.15)",
                borderRadius: "0.75rem",
                padding: "1rem",
              }}
            >
              <p style={{ fontSize: "0.9rem", marginBottom: "0.5rem", opacity: 0.9 }}>
                Base de Cálculo:
              </p>
              <p style={{ fontSize: "1.5rem", fontWeight: 800, margin: 0 }}>
                Q {(resultado.datos.baseCalculo || 0).toFixed(2)}
              </p>
            </div>

            <div
              style={{
                background: "rgba(255,255,255,0.15)",
                borderRadius: "0.75rem",
                padding: "1rem",
              }}
            >
              <p style={{ fontSize: "0.9rem", marginBottom: "0.5rem", opacity: 0.9 }}>
                ISR (25%):
              </p>
              <p style={{ fontSize: "1.5rem", fontWeight: 800, margin: 0 }}>
                Q {(resultado.datos.isrCalculado || 0).toFixed(2)}
              </p>
            </div>

            <div
              style={{
                background: "rgba(255,255,255,0.15)",
                borderRadius: "0.75rem",
                padding: "1rem",
              }}
            >
              <p style={{ fontSize: "0.9rem", marginBottom: "0.5rem", opacity: 0.9 }}>
                ISO a Acreditar:
              </p>
              <p style={{ fontSize: "1.5rem", fontWeight: 800, margin: 0 }}>
                - Q {(resultado.datos.isoAcreditar || 0).toFixed(2)}
              </p>
            </div>
          </div>

          {/* ISR A Pagar */}
          <div
            style={{
              background: "rgba(255,255,255,0.25)",
              borderRadius: "0.75rem",
              padding: "1.5rem",
              marginBottom: "1rem",
            }}
          >
            <p style={{ fontSize: "0.9rem", marginBottom: "0.5rem", opacity: 0.9 }}>
              ISR a Pagar:
            </p>
            <p style={{ fontSize: "2.5rem", fontWeight: 800, margin: 0 }}>
              Q {((resultado.datos as any).israPagar || (resultado.datos as any).isrAPagar || 0).toFixed(2)}
            </p>
          </div>

          {/* Detalle */}
          <div
            style={{
              background: "rgba(255,255,255,0.1)",
              borderRadius: "0.75rem",
              padding: "1rem",
              fontSize: "0.95rem",
              lineHeight: 1.6,
              marginBottom: "1rem",
            }}
          >
            <strong>Detalle:</strong> {resultado.datos.detalleCalculo}
          </div>

          {/* Botones: Nueva Consulta + Descargar PDF */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <button
              type="button"
              onClick={() => {
                setResultado(null);
                setError(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
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
              🔄 Nueva Consulta
            </button>

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

        </div>
      )}
    </div>
  );
};

export default ISREmpresaTrimestralPage;