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
        background:
          "linear-gradient(135deg, rgba(37,99,235,0.18), rgba(59,130,246,0.1))",
        borderRadius: "0.75rem",
        padding: "1.5rem",
        border: "1px solid rgba(59,130,246,0.5)",
        marginTop: "2rem",
        maxWidth: "720px",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >

      <h2>Consultor Contable</h2>
      <p style={{ marginBottom: "1rem" }}>
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
            border: "1px solid #4b5563",
            padding: "0.6rem",
            backgroundColor: "#020617",
            color: "white",
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
            background:
              "linear-gradient(135deg, #1d4ed8, #38bdf8)",
            color: "white",
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
            backgroundColor: "#7f1d1d",
          }}
        >
          <strong>Error:</strong> {error}
        </div>
      )}

      {respuesta && (
        <div
          style={{
            marginTop: "1rem",
            padding: "0.75rem",
            borderRadius: "0.5rem",
            backgroundColor: "#022c22",
          }}
        >
          <p style={{ whiteSpace: "pre-line" }}>
            <strong>Respuesta:</strong> {respuesta.respuesta}
          </p>

          <p style={{ marginTop: "0.5rem", opacity: 0.7 }}>
            {respuesta.mensaje}
          </p>
        </div>
      )}
    </div>
  );
};

export default ConsultorContable;
