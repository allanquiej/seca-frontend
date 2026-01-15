// src/components/ConsultorContable.tsx
import { useState } from "react";
import type { FormEvent } from "react";
import type { ConsultorResponse } from "../types/calculadoras";
import { preguntarConsultor } from "../services/consultorService";

/**
 * Componente del consultor contable.
 */
const ConsultorContable: React.FC = () => {
  const [pregunta, setPregunta] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [respuesta, setRespuesta] = useState<ConsultorResponse | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!pregunta.trim()) return;

    setLoading(true);
    setError(null);
    setRespuesta(null);

    try {
      const res = await preguntarConsultor({ pregunta });
      setRespuesta(res);
    } catch (err: any) {
      setError(err.message ?? "Ocurrió un error al consultar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #1e293b, #0f172a)", // ✅ Fondo oscuro profesional
        borderRadius: "0.75rem",
        padding: "1.5rem",
        border: "1px solid rgba(59,130,246,0.3)",
        marginTop: "2rem",
        maxWidth: "720px",
        marginLeft: "auto",
        marginRight: "auto",
        color: "white", // ✅ Texto blanco por defecto
      }}
    >
      <h2 style={{ color: "white", marginTop: 0 }}>Consultor Contable</h2> {/* ✅ Encabezado blanco */}
      <p style={{ marginBottom: "1rem", color: "rgba(255,255,255,0.9)" }}>
        Escribe tu duda contable o fiscal y recibirás una respuesta automática.
      </p>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          maxWidth: 500,
        }}
      >
        <textarea
          value={pregunta}
          onChange={(e) => setPregunta(e.target.value)}
          placeholder="Ejemplo: ¿Cómo se calcula el ISR para un salario de Q5000?"
          rows={4}
          style={{
            resize: "none",
            borderRadius: "0.5rem",
            border: "1px solid rgba(59,130,246,0.4)",
            padding: "0.6rem",
            backgroundColor: "#1e293b", // ✅ Fondo oscuro pero legible
            color: "white", // ✅ Texto blanco
            fontSize: "0.95rem",
          }}
        />

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
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Consultando..." : "Preguntar"}
        </button>
      </form>

      {error && (
        <div
          style={{
            marginTop: "1rem",
            padding: "0.75rem",
            borderRadius: "0.5rem",
            backgroundColor: "rgba(220, 38, 38, 0.2)", // ✅ Rojo semitransparente
            border: "1px solid rgba(220, 38, 38, 0.5)",
            color: "white", // ✅ Texto blanco
          }}
        >
          <strong>Error:</strong> {error}
        </div>
      )}

      {respuesta && (
        <div
          style={{
            marginTop: "1rem",
            padding: "1rem",
            borderRadius: "0.5rem",
            backgroundColor: "#0f172a", // ✅ Fondo oscuro sólido
            border: "1px solid rgba(34, 197, 94, 0.3)", // ✅ Borde verde sutil
            color: "white", // ✅ Texto blanco
          }}
        >
          <p style={{ whiteSpace: "pre-line", margin: 0, lineHeight: 1.6 }}>
            <strong style={{ color: "#22c55e" }}>Respuesta:</strong> {respuesta.respuesta}
          </p>

          {respuesta.mensaje && (
            <p style={{ marginTop: "0.75rem", opacity: 0.8, fontSize: "0.9rem", margin: "0.75rem 0 0 0" }}>
              {respuesta.mensaje}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ConsultorContable;