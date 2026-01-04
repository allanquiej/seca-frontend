// src/components/IndemnizacionCalculator.tsx
import { useState } from "react";
import type { FormEvent } from "react";
import type {
  IndemnizacionRequest,
  IndemnizacionResponse,
  RespuestaApi,
} from "../types/calculadoras";
import { calcularIndemnizacion } from "../services/calculadorasService";

/**
 * Componente que muestra el formulario y el resultado
 * de la calculadora de indemnización.
 */
const IndemnizacionCalculator: React.FC = () => {
  // Estado para los campos del formulario
 const [form, setForm] = useState<IndemnizacionRequest>({
  salarioMensual: 0,
  fechaInicio: "",
  fechaFin: "",
});


  // Estado para loading, error y resultado
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] =
    useState<RespuestaApi<IndemnizacionResponse> | null>(null);

  /**
   * Actualiza el estado cuando el usuario escribe
   * en los inputs numéricos.
   */
const handleNumberChange =
  (field: "salarioMensual") =>
  (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setForm((prev) => ({
      ...prev,
      [field]: isNaN(value) ? 0 : value,
    }));
  };

const handleDateChange =
  (field: "fechaInicio" | "fechaFin") =>
  (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value; // YYYY-MM-DD
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };


  /**
   * Maneja el envío del formulario.
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError(null);
    setResultado(null);

    try {
      const res = await calcularIndemnizacion(form);
      setResultado(res);
    } catch (err: any) {
      setError(err.message ?? "Ocurrió un error al calcular la indemnización.");
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
      <h2 style={{ marginBottom: "0.5rem" }}>Calculadora de Indemnización</h2>
      <p style={{ marginBottom: "1rem" }}>
        Ingresa el salario mensual y los años trabajados para estimar la
        indemnización.
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
        <label style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          Salario mensual (Q):
          <input
            type="number"
            step="0.01"
            value={form.salarioMensual}
            onChange={handleNumberChange("salarioMensual")}
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

        <label style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
  Fecha inicio:
  <input
    type="date"
    value={form.fechaInicio}
    onChange={handleDateChange("fechaInicio")}
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

<label style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
  Fecha fin:
  <input
    type="date"
    value={form.fechaFin}
    onChange={handleDateChange("fechaFin")}
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
            background: "linear-gradient(135deg, #1d4ed8, #38bdf8)",
            color: "white",
          }}
        >
          {loading ? "Calculando..." : "Calcular indemnización"}
        </button>
      </form>

      {/* Mensaje de error */}
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

      {/* Resultado devuelto por la API */}
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
              <p style={{ marginTop: "0.5rem" }}>
                <strong>Monto indemnización:</strong>{" "}
                Q {resultado.datos.montoIndemnizacion.toFixed(2)}
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

export default IndemnizacionCalculator;
