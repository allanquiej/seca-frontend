// src/pages/AguinaldoPage.tsx
import { useState } from "react";
import type { FormEvent } from "react";
import type { AguinaldoRequest, AguinaldoResponse, RespuestaApi } from "../types/calculadoras";
import { calcularAguinaldo } from "../services/calculadorasService";
import { generateAguinaldoPDF } from "../utils/pdfGenerator";

const AguinaldoPage: React.FC = () => {
  const [form, setForm] = useState<AguinaldoRequest>({
    salarioPromedio: 0,
    fechaInicio: "",
    fechaFin: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<RespuestaApi<AguinaldoResponse> | null>(null);

  const handleNumberChange =
    (field: "salarioPromedio") => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value);
      setForm((prev) => ({
        ...prev,
        [field]: isNaN(value) ? 0 : value,
      }));
    };

  const handleDateChange =
    (field: "fechaInicio" | "fechaFin") => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResultado(null);

    try {
      const res = await calcularAguinaldo(form);
      setResultado(res);
    } catch (err: any) {
      setError(err.message ?? "Ocurrió un error al calcular el Aguinaldo.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (resultado && resultado.datos) {
      generateAguinaldoPDF({
        ...form,
        montoAguinaldo: resultado.datos.montoAguinaldo,
        detalleCalculo: resultado.datos.detalleCalculo,
      });
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "1rem", color: "#0f172a" }}>
        🎊 Calculadora de Aguinaldo
      </h1>
      <p style={{ fontSize: "1.1rem", color: "#64748b", marginBottom: "2rem" }}>
        Calcula tu aguinaldo anual según tu salario promedio y meses laborados.
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
              Salario Promedio (Q):
            </label>
            <input
              type="number"
              step="0.01"
              value={form.salarioPromedio}
              onChange={handleNumberChange("salarioPromedio")}
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

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem", color: "#0f172a" }}>
                Fecha de Inicio:
              </label>
              <input
                type="date"
                value={form.fechaInicio}
                onChange={handleDateChange("fechaInicio")}
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

            <div>
              <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem", color: "#0f172a" }}>
                Fecha de Finalización:
              </label>
              <input
                type="date"
                value={form.fechaFin}
                onChange={handleDateChange("fechaFin")}
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
              background: "linear-gradient(135deg, #ec4899, #f472b6)",
              color: "white",
              boxShadow: "0 4px 15px rgba(236,72,153,0.3)",
              transition: "transform 0.2s",
            }}
            onMouseOver={(e) => !loading && (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {loading ? "Calculando..." : "Calcular Aguinaldo"}
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
            background: "linear-gradient(135deg, #ec4899, #f472b6)",
            borderRadius: "1rem",
            padding: "2rem",
            color: "white",
            boxShadow: "0 10px 40px rgba(236,72,153,0.4)",
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
              Monto de Aguinaldo:
            </p>
            <p style={{ fontSize: "2.5rem", fontWeight: 800, margin: 0 }}>
              Q {resultado.datos.montoAguinaldo.toFixed(2)}
            </p>
          </div>

          <p style={{ fontSize: "1rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
            <strong>Detalle:</strong> {resultado.datos.detalleCalculo}
          </p>

          <button
            onClick={handleDownloadPDF}
            style={{
              padding: "0.875rem 2rem",
              borderRadius: "0.75rem",
              border: "2px solid white",
              background: "white",
              color: "#ec4899",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: "1rem",
              transition: "transform 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            📄 Descargar PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default AguinaldoPage;