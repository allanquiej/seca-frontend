// src/pages/ISOTrimestralPage.tsx
import { useState } from "react";
import type { FormEvent } from "react";
import type { ISOTrimestralRequest, ISOTrimestralResponse, RespuestaApi } from "../types/calculadoras";
import { calcularISOTrimestral } from "../services/calculadorasService";

const ISOTrimestralPage: React.FC = () => {
  const [form, setForm] = useState<ISOTrimestralRequest>({
    ingresosTrimestrales: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<RespuestaApi<ISOTrimestralResponse> | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setForm({ ingresosTrimestrales: isNaN(value) ? 0 : value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResultado(null);

    try {
      const res = await calcularISOTrimestral(form);
      setResultado(res);
    } catch (err: any) {
      setError(err.message ?? "Error al calcular ISO trimestral.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "1rem", color: "#0f172a" }}>
        🧾 Calculadora ISO Trimestral
      </h1>
      <p style={{ fontSize: "1.1rem", color: "#64748b", marginBottom: "2rem" }}>
        Calcula el Impuesto de Solidaridad (ISO) trimestral según los ingresos de tu empresa.
      </p>

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
          <div>
            <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem", color: "#0f172a" }}>
              Ingresos Trimestrales (Q):
            </label>
            <input
              type="number"
              step="0.01"
              value={form.ingresosTrimestrales}
              onChange={handleChange}
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
              background: "linear-gradient(135deg, #6366f1, #818cf8)",
              color: "white",
              boxShadow: "0 4px 15px rgba(99,102,241,0.3)",
              transition: "transform 0.2s",
            }}
            onMouseOver={(e) => !loading && (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {loading ? "Calculando..." : "Calcular ISO Trimestral"}
          </button>
        </form>
      </div>

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

      {resultado && resultado.datos && (
        <div
          style={{
            background: "linear-gradient(135deg, #6366f1, #818cf8)",
            borderRadius: "1rem",
            padding: "2rem",
            color: "white",
            boxShadow: "0 10px 40px rgba(99,102,241,0.4)",
          }}
        >
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem" }}>
            ✅ Resultado del Cálculo
          </h2>

          <div
            style={{
              background: "rgba(255,255,255,0.15)",
              borderRadius: "0.75rem",
              padding: "1.5rem",
              marginBottom: "1.5rem",
            }}
          >
            <p style={{ fontSize: "0.9rem", marginBottom: "0.5rem", opacity: 0.9 }}>
              ISO Calculado:
            </p>
            <p style={{ fontSize: "2.5rem", fontWeight: 800, margin: 0 }}>
              Q {resultado.datos.isoCalculado.toFixed(2)}
            </p>
          </div>

          <p style={{ fontSize: "1rem", lineHeight: 1.6 }}>
            <strong>Detalle:</strong> {resultado.datos.detalleCalculo}
          </p>
        </div>
      )}
    </div>
  );
};

export default ISOTrimestralPage;