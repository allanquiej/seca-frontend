// src/components/IndemnizacionCalculator.tsx
import { useState } from "react";
import type { FormEvent } from "react";
import { calcularIndemnizacion } from "../services/calculadorasService";
import type { 
  IndemnizacionResponse, 
  RespuestaApi 
} from "../types/calculadoras";

function IndemnizacionCalculator() {
  const [salario, setSalario] = useState(0);
  const [anios, setAnios] = useState(0);
  const [resultado, setResultado] = useState<IndemnizacionResponse | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCalcular = async (e: FormEvent) => {
    e.preventDefault();

    if (salario <= 0 || anios <= 0) {
      setError("Por favor ingresa valores válidos");
      return;
    }

    setCargando(true);
    setError(null);
    setResultado(null);

    try {
      const respuesta: RespuestaApi<IndemnizacionResponse> = await calcularIndemnizacion({
        salarioMensual: salario,
        aniosTrabajados: anios,
      });

      if (respuesta.exito && respuesta.datos) {
        setResultado(respuesta.datos);
      } else {
        setError(respuesta.mensaje || "Error en el cálculo");
      }
    } catch (err: any) {
      setError(err.message || "Error al conectar con el servidor");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div
      style={{
        background: "white",
        padding: "1.5rem",
        borderRadius: "1rem",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
      }}
    >
      <h3 style={{ marginTop: 0, marginBottom: "0.5rem" }}>
        Calculadora de Indemnización
      </h3>
      <p style={{ marginTop: 0, marginBottom: "1rem", fontSize: "0.9rem", color: "#4b5563" }}>
        Ingresa el salario mensual y los años trabajados para estimar la indemnización.
      </p>

      <form
        onSubmit={handleCalcular}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <div>
          <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.9rem" }}>
            Salario mensual (Q):
          </label>
          <input
            type="number"
            value={salario}
            onChange={(e) => setSalario(Number(e.target.value))}
            min="0"
            step="0.01"
            style={{
              width: "100%",
              padding: "0.5rem",
              borderRadius: "0.5rem",
              border: "1px solid #d1d5db",
              fontSize: "1rem",
            }}
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.9rem" }}>
            Años trabajados:
          </label>
          <input
            type="number"
            value={anios}
            onChange={(e) => setAnios(Number(e.target.value))}
            min="0"
            style={{
              width: "100%",
              padding: "0.5rem",
              borderRadius: "0.5rem",
              border: "1px solid #d1d5db",
              fontSize: "1rem",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={cargando}
          style={{
            padding: "0.6rem",
            borderRadius: "999px",
            border: "none",
            cursor: cargando ? "not-allowed" : "pointer",
            fontWeight: 600,
            background: cargando
              ? "#9ca3af"
              : "linear-gradient(135deg, #1d4ed8, #38bdf8)",
            color: "white",
            fontSize: "1rem",
          }}
        >
          {cargando ? "Calculando..." : "Calcular indemnización"}
        </button>
      </form>

      {resultado && (
        <div
          style={{
            marginTop: "1rem",
            padding: "1rem",
            borderRadius: "0.5rem",
            background: "rgba(34, 197, 94, 0.1)",
          }}
        >
          <p style={{ marginTop: "0.5rem" }}>
            <strong>Monto Indemnización:</strong>{" "}
            Q{resultado.montoIndemnizacion.toFixed(2)}
          </p>
          <p>
            <strong>Detalle:</strong> {resultado.detalleCalculo}
          </p>
        </div>
      )}

      {error && (
        <div
          style={{
            marginTop: "1rem",
            padding: "1rem",
            borderRadius: "0.5rem",
            background: "rgba(239, 68, 68, 0.1)",
            color: "#991b1b",
          }}
        >
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
}

export default IndemnizacionCalculator;