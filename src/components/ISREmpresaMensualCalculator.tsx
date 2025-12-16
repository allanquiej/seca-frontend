// src/components/ISREmpresaMensualCalculator.tsx
import { useState } from "react";
import type { FormEvent } from "react";
import type {
  ISREmpresaMensualRequest,
  ISREmpresaMensualResponse,
  RespuestaApi,
} from "../types/calculadoras";
import { calcularISREmpresaMensual } from "../services/calculadorasService";

/**
 * Calculadora de ISR Empresa Mensual.
 */
const ISREmpresaMensualCalculator: React.FC = () => {
  const [form, setForm] = useState<ISREmpresaMensualRequest>({
    ingresosMensuales: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] =
    useState<RespuestaApi<ISREmpresaMensualResponse> | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setForm({
      ingresosMensuales: isNaN(value) ? 0 : value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResultado(null);

    try {
      const res = await calcularISREmpresaMensual(form);
      setResultado(res);
    } catch (err: any) {
      setError(err.message ?? "Error al calcular ISR de empresa mensual.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background:
          "linear-gradient(135deg, rgba(37,99,235,0.18), rgba(59,130,246,0.1))",
        borderRadius: "0.75rem",
        padding: "1.5rem",
        border: "1px solid rgba(59,130,246,0.5)",
        marginTop: "2rem",
      }}
    >
      <h2 style={{ marginBottom: "0.5rem" }}>
        Calculadora ISR Empresa (Mensual)
      </h2>
      <p style={{ marginBottom: "1rem" }}>
        Ingresa los ingresos mensuales de la empresa.
      </p>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          maxWidth: 400,
        }}
      >
        <label>
          Ingresos mensuales (Q):
          <input
            type="number"
            step="0.01"
            value={form.ingresosMensuales}
            onChange={handleChange}
            required
            style={{
              borderRadius: "0.5rem",
              border: "1px solid #4b5563",
              padding: "0.4rem 0.6rem",
              backgroundColor: "#020617",
              color: "white",
            }}
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: "0.5rem",
            padding: "0.6rem 1.2rem",
            borderRadius: "999px",
            border: "none",
            cursor: "pointer",
            fontWeight: 600,
            background:
              "linear-gradient(135deg, #1d4ed8, #38bdf8)", // azules corporativos
            color: "white",
          }}
        >
          {loading ? "Calculando..." : "Calcular ISR Empresa Mensual"}
        </button>
      </form>

      {error && (
        <div
          style={{
            marginTop: "1rem",
            padding: "0.75rem",
            borderRadius: "0.5rem",
            backgroundColor: "#7f1d1d",
          }}
        >
          <strong>Error:</strong> {error}
        </div>
      )}

      {resultado && (
        <div
          style={{
            marginTop: "1rem",
            padding: "0.75rem",
            borderRadius: "0.5rem",
            backgroundColor: "#022c22",
          }}
        >
          <p>
            <strong>Mensaje:</strong> {resultado.mensaje}
          </p>

          {resultado.exito && resultado.datos && (
            <>
              <p>
                <strong>ISR Calculado:</strong>{" "}
                Q {resultado.datos.isrCalculado.toFixed(2)}
              </p>
              <p>
                <strong>Detalle:</strong> {resultado.datos.detalleCalculo}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ISREmpresaMensualCalculator;
