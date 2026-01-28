// src/pages/ISRLaboralPage.tsx
import { useState } from "react";
import type { FormEvent } from "react";
import type {
  ISRAsalariadoRequest,
  ISRAsalariadoResponse,
  RespuestaApi,
} from "../types/calculadoras";
import { calcularISRAsalariado } from "../services/calculadorasService";

const ISRLaboralPage: React.FC = () => {
  const [form, setForm] = useState<ISRAsalariadoRequest>({
    salariosAnuales: 0,
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
          📊 Calculadora ISR Asalariados
        </h1>
        <p style={{ fontSize: "1.1rem", color: "#64748b", lineHeight: 1.6 }}>
          Calcula el ISR según el{" "}
          <strong>Artículo 72, Ley ISR Decreto 10-2012</strong>.
          Incluye todos tus ingresos anuales y la deducción personal de{" "}
          <strong>Q48,000</strong>.
        </p>
      </div>

      {/* Información importante */}
      <div
        style={{
          background: "#fef3c7",
          border: "2px solid #fbbf24",
          borderRadius: "1rem",
          padding: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.5rem", color: "#78350f" }}>
          ℹ️ ¿Cómo funciona este cálculo?
        </h3>
        <ul style={{ margin: 0, paddingLeft: "1.5rem", color: "#78350f", lineHeight: 1.8 }}>
          <li>Se suman <strong>todos</strong> tus ingresos anuales (salarios, bono 14, aguinaldo, otros bonos)</li>
          <li>Se resta la deducción personal de <strong>Q48,000</strong></li>
          <li>Al resultado se aplica el <strong>5%</strong></li>
          <li><strong>Proyectado:</strong> El ISR se divide entre 12 meses (descuento mensual)</li>
          <li><strong>Definitiva:</strong> El ISR se paga completo al año</li>
        </ul>
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
          {/* Salarios Anuales */}
          <div>
            <label
              style={{
                display: "block",
                fontWeight: 600,
                marginBottom: "0.5rem",
                color: "#0f172a",
              }}
            >
              Salarios Anuales (Q):
            </label>
            <input
              type="number"
              step="0.01"
              value={form.salariosAnuales}
              onChange={handleChange("salariosAnuales")}
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
              Total de salarios recibidos de enero a diciembre
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
              Bono 14 (Q):
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
              Aguinaldo (Q):
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
              Otros Bonos o Aguinaldos (Q):
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
              Tipo de Cálculo:
            </label>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                type="button"
                onClick={() => handleTipoChange(true)}
                style={{
                  flex: 1,
                  padding: "1rem",
                  borderRadius: "0.75rem",
                  border: form.esProyectado ? "3px solid #f59e0b" : "2px solid #e2e8f0",
                  background: form.esProyectado ? "#fef3c7" : "white",
                  cursor: "pointer",
                  fontWeight: 600,
                  color: form.esProyectado ? "#78350f" : "#64748b",
                  transition: "all 0.2s",
                }}
              >
                📅 Proyectado (Mensual)
              </button>
              <button
                type="button"
                onClick={() => handleTipoChange(false)}
                style={{
                  flex: 1,
                  padding: "1rem",
                  borderRadius: "0.75rem",
                  border: !form.esProyectado ? "3px solid #f59e0b" : "2px solid #e2e8f0",
                  background: !form.esProyectado ? "#fef3c7" : "white",
                  cursor: "pointer",
                  fontWeight: 600,
                  color: !form.esProyectado ? "#78350f" : "#64748b",
                  transition: "all 0.2s",
                }}
              >
                📋 Definitiva (Anual)
              </button>
            </div>
            <small style={{ color: "#64748b", fontSize: "0.9rem", display: "block", marginTop: "0.5rem" }}>
              {form.esProyectado
                ? "El ISR se dividirá entre 12 meses (descuento mensual)"
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
              background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
              color: "white",
              boxShadow: "0 4px 15px rgba(245,158,11,0.3)",
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
            background: "linear-gradient(135deg, #f59e0b, #fbbf24)",
            borderRadius: "1rem",
            padding: "2rem",
            color: "white",
            boxShadow: "0 10px 40px rgba(245,158,11,0.4)",
          }}
        >
          <h2 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "1.5rem" }}>
            ✅ Resultado del Cálculo ({resultado.datos.tipoCalculo})
          </h2>

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
                Total Ingresos:
              </p>
              <p style={{ fontSize: "1.5rem", fontWeight: 800, margin: 0 }}>
                Q {resultado.datos.totalIngresos.toFixed(2)}
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
                Deducción Personal:
              </p>
              <p style={{ fontSize: "1.5rem", fontWeight: 800, margin: 0 }}>
                - Q {resultado.datos.deduccionPersonal.toFixed(2)}
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
                Base Imponible:
              </p>
              <p style={{ fontSize: "1.5rem", fontWeight: 800, margin: 0 }}>
                Q {resultado.datos.baseImponible.toFixed(2)}
              </p>
            </div>
          </div>

          {/* ISR Total */}
          <div
            style={{
              background: "rgba(255,255,255,0.25)",
              borderRadius: "0.75rem",
              padding: "1.5rem",
              marginBottom: "1rem",
            }}
          >
            <p style={{ fontSize: "0.9rem", marginBottom: "0.5rem", opacity: 0.9 }}>
              ISR Total Anual:
            </p>
            <p style={{ fontSize: "2.5rem", fontWeight: 800, margin: 0 }}>
              Q {resultado.datos.isrTotal.toFixed(2)}
            </p>
          </div>

          {/* ISR Mensual (si es mayor a 0) */}
          {resultado.datos.isrMensual > 0 && (
            <div
              style={{
                background: "rgba(255,255,255,0.25)",
                borderRadius: "0.75rem",
                padding: "1.5rem",
                marginBottom: "1rem",
              }}
            >
              <p style={{ fontSize: "0.9rem", marginBottom: "0.5rem", opacity: 0.9 }}>
                ISR Mensual (Descuento por mes):
              </p>
              <p style={{ fontSize: "2.5rem", fontWeight: 800, margin: 0 }}>
                Q {resultado.datos.isrMensual.toFixed(2)}
              </p>
            </div>
          )}

          {/* Detalle */}
          <div
            style={{
              background: "rgba(255,255,255,0.1)",
              borderRadius: "0.75rem",
              padding: "1rem",
              fontSize: "0.95rem",
              lineHeight: 1.6,
            }}
          >
            <strong>Detalle:</strong> {resultado.datos.detalleCalculo}
          </div>
        </div>
      )}
    </div>
  );
};

export default ISRLaboralPage;