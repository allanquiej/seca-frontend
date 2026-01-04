// src/components/Bono14Calculator.tsx
import { useState } from "react";
import type { FormEvent } from "react";
import type {
  Bono14Request,
  Bono14Response,
  RespuestaApi,
} from "../types/calculadoras";
import { calcularBono14 } from "../services/calculadorasService";

/**
 * Componente que muestra el formulario y el resultado
 * de la calculadora de Bono 14.
 */
const Bono14Calculator: React.FC = () => {
  // Estado para los campos del formulario
  const [form, setForm] = useState<Bono14Request>({
  salarioPromedio: 0,
  fechaInicio: "",
  fechaFin: "",
});


  // Estado para loading, error y resultado
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] =
    useState<RespuestaApi<Bono14Response> | null>(null);

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

const handleDateChange =
  (field: "fechaInicio" | "fechaFin") =>
  (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value,
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
      const res = await calcularBono14(form);
      setResultado(res);
    } catch (err: any) {
      setError(err.message ?? "Ocurrió un error al calcular el Bono 14.");
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
      <h2 style={{ marginBottom: "0.5rem" }}>Calculadora de Bono 14</h2>
      <p style={{ marginBottom: "1rem" }}>
        Ingresa el salario promedio y los meses trabajados para estimar el
        Bono 14.
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
            background:
              "linear-gradient(135deg, #1d4ed8, #38bdf8)", // azules corporativos
            color: "white",
          }}
        >
          {loading ? "Calculando..." : "Calcular Bono 14"}
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
      padding: "0.9rem",
      borderRadius: "0.75rem",
      background: "linear-gradient(135deg, #1e40af, #2563eb)",
      color: "white",
      boxShadow: "0 10px 25px rgba(37, 99, 235, 0.35)",
    }}
  >

          <p>
            <strong>Mensaje:</strong> {resultado.mensaje}
          </p>

          {resultado.exito && resultado.datos && (
            <>
              <p style={{ marginTop: "0.5rem" }}>
                <strong>Monto Bono 14:</strong>{" "}
                Q {resultado.datos.montoBono14.toFixed(2)}
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

export default Bono14Calculator;
