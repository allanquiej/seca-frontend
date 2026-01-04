// src/components/AguinaldoCalculator.tsx
import { useState } from "react";
import type { FormEvent } from "react";
import type {
  AguinaldoRequest,
  AguinaldoResponse,
  RespuestaApi,
} from "../types/calculadoras";
import { calcularAguinaldo } from "../services/calculadorasService";

/**
 * Componente que muestra el formulario y el resultado
 * de la calculadora de Aguinaldo.
 */
const AguinaldoCalculator: React.FC = () => {
  // Estado para los campos del formulario
  const [form, setForm] = useState<AguinaldoRequest>({
    salarioPromedio: 0,
    fechaInicio: "",
    fechaFin: "",
  });

  // Estado para loading, error y resultado
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] =
    useState<RespuestaApi<AguinaldoResponse> | null>(null);

  /**
   * Actualiza el estado cuando el usuario escribe
   * en los inputs numéricos.
   */
  const handleNumberChange =
    (field: "salarioPromedio") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value);
      setForm((prev) => ({
        ...prev,
        [field]: isNaN(value) ? 0 : value,
      }));
    };

  /**
   * Actualiza el estado cuando el usuario selecciona fechas
   */
  const handleDateChange =
    (field: "fechaInicio" | "fechaFin") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({
        ...prev,
        [field]: e.target.value, // YYYY-MM-DD
      }));
    };

  /**
   * Maneja el envío del formulario.
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setError(null);
    setResultado(null);

    // Validación básica frontend (evita requests inválidos)
    if (!form.fechaInicio || !form.fechaFin) {
      setError("Debes seleccionar la fecha inicio y la fecha fin.");
      return;
    }
    if (form.fechaFin < form.fechaInicio) {
      setError("La fecha fin no puede ser menor que la fecha inicio.");
      return;
    }
    if (form.salarioPromedio <= 0) {
      setError("El salario promedio debe ser mayor a 0.");
      return;
    }

    setLoading(true);

    try {
      const res = await calcularAguinaldo(form);
      setResultado(res);
    } catch (err: any) {
      setError(err.message ?? "Ocurrió un error al calcular el Aguinaldo.");
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
      <h2 style={{ marginBottom: "0.5rem" }}>Calculadora de Aguinaldo</h2>
      <p style={{ marginBottom: "1rem" }}>
        Ingresa el salario promedio y el rango de fechas trabajado para estimar
        el aguinaldo.
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
        <label
          style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
        >
          Salario promedio (Q):
          <input
            type="number"
            step="0.01"
            value={form.salarioPromedio}
            onChange={handleNumberChange("salarioPromedio")}
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

        <label
          style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
        >
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

        <label
          style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
        >
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
          {loading ? "Calculando..." : "Calcular Aguinaldo"}
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
                <strong>Monto Aguinaldo:</strong> Q{" "}
                {resultado.datos.montoAguinaldo.toFixed(2)}
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

export default AguinaldoCalculator;
