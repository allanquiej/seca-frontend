// src/pages/ISREmpresaMensualPage.tsx
import { useState } from "react";
import type { FormEvent } from "react";
import type {
  ISREmpresaMensualV2Request,
  ISREmpresaMensualV2Response,
  RespuestaApi,
} from "../types/calculadoras";
import { calcularISREmpresaMensualV2 } from "../services/calculadorasService";

const ISREmpresaMensualPage: React.FC = () => {
  const [form, setForm] = useState<ISREmpresaMensualV2Request>({
    totalFacturacionMes: 0,
    totalRetenciones: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<RespuestaApi<ISREmpresaMensualV2Response> | null>(null);

  const handleChange = (field: keyof ISREmpresaMensualV2Request) => (
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
      const res = await calcularISREmpresaMensualV2(form);
      setResultado(res);
    } catch (err: any) {
      setError(err.message ?? "Error al calcular ISR de empresa mensual.");
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
          🏢 Calculadora ISR Empresa Mensual
        </h1>
        <p style={{ fontSize: "1.1rem", color: "#64748b", lineHeight: 1.6 }}>
          Calcula el ISR mensual bajo el{" "}
          <strong>Régimen Opcional Simplificado sobre Ingresos</strong>.
        </p>
      </div>

      {/* Información importante */}
      <div
        style={{
          background: "#d1fae5",
          border: "2px solid #10b981",
          borderRadius: "1rem",
          padding: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.5rem", color: "#065f46" }}>
          ℹ️ Régimen Opcional Simplificado
        </h3>
        <ul style={{ margin: 0, paddingLeft: "1.5rem", color: "#065f46", lineHeight: 1.8 }}>
          <li>
            <strong>Primeros Q30,000:</strong> Se paga el <strong>5%</strong>
          </li>
          <li>
            <strong>Excedente sobre Q30,000:</strong> Se paga el <strong>7%</strong>
          </li>
          <li>Se calcula la base dividiendo la facturación total entre <strong>1.12</strong></li>
          <li>Si tienes retenciones, se restan del ISR total</li>
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
          {/* Total Facturación */}
          <div>
            <label
              style={{
                display: "block",
                fontWeight: 600,
                marginBottom: "0.5rem",
                color: "#0f172a",
              }}
            >
              Total Facturación del Mes (Q):
            </label>
            <input
              type="number"
              step="0.01"
              value={form.totalFacturacionMes}
              onChange={handleChange("totalFacturacionMes")}
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
              Total de ingresos facturados en el mes (incluye IVA)
            </small>
          </div>

          {/* Total Retenciones */}
          <div>
            <label
              style={{
                display: "block",
                fontWeight: 600,
                marginBottom: "0.5rem",
                color: "#0f172a",
              }}
            >
              Total Retenciones (Q):
            </label>
            <input
              type="number"
              step="0.01"
              value={form.totalRetenciones}
              onChange={handleChange("totalRetenciones")}
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
              Ingresar 0 si no tuviste retenciones en el mes
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
              background: "linear-gradient(135deg, #10b981, #34d399)",
              color: "white",
              boxShadow: "0 4px 15px rgba(16,185,129,0.3)",
              transition: "transform 0.2s",
            }}
            onMouseOver={(e) =>
              !loading && (e.currentTarget.style.transform = "scale(1.02)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {loading ? "Calculando..." : "Calcular ISR Empresa Mensual"}
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
            background: "linear-gradient(135deg, #10b981, #34d399)",
            borderRadius: "1rem",
            padding: "2rem",
            color: "white",
            boxShadow: "0 10px 40px rgba(16,185,129,0.4)",
          }}
        >
          <h2 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "1.5rem" }}>
            ✅ Resultado del Cálculo
          </h2>

          {/* Desglose Base e IVA */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
            <div
              style={{
                background: "rgba(255,255,255,0.15)",
                borderRadius: "0.75rem",
                padding: "1rem",
              }}
            >
              <p style={{ fontSize: "0.9rem", marginBottom: "0.5rem", opacity: 0.9 }}>
                Base (÷ 1.12):
              </p>
              <p style={{ fontSize: "1.5rem", fontWeight: 800, margin: 0 }}>
                Q {resultado.datos.base.toFixed(2)}
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
                IVA (12%):
              </p>
              <p style={{ fontSize: "1.5rem", fontWeight: 800, margin: 0 }}>
                Q {resultado.datos.iva.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Desglose ISR */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
            <div
              style={{
                background: "rgba(255,255,255,0.15)",
                borderRadius: "0.75rem",
                padding: "1rem",
              }}
            >
              <p style={{ fontSize: "0.9rem", marginBottom: "0.5rem", opacity: 0.9 }}>
                ISR Primeros Q30k (5%):
              </p>
              <p style={{ fontSize: "1.5rem", fontWeight: 800, margin: 0 }}>
                Q {resultado.datos.isrPrimerosTreintaMil.toFixed(2)}
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
                ISR Excedente (7%):
              </p>
              <p style={{ fontSize: "1.5rem", fontWeight: 800, margin: 0 }}>
                Q {resultado.datos.isrExcedente.toFixed(2)}
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
              ISR Total:
            </p>
            <p style={{ fontSize: "2.5rem", fontWeight: 800, margin: 0 }}>
              Q {resultado.datos.isrTotal.toFixed(2)}
            </p>
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
              ISR a Pagar (Después de retenciones):
            </p>
            <p style={{ fontSize: "2.5rem", fontWeight: 800, margin: 0 }}>
              Q {resultado.datos.isrAPagar.toFixed(2)}
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
            }}
          >
            <strong>Detalle:</strong> {resultado.datos.detalleCalculo}
          </div>
        </div>
      )}
    </div>
  );
};

export default ISREmpresaMensualPage;