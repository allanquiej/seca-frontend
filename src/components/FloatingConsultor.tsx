// src/components/FloatingConsultor.tsx
import { useState } from "react";
import { preguntarConsultor } from "../services/consultorService";

type PreguntaRapida = {
  id: string;
  label: string;    // lo que ve el usuario
  pregunta: string; // lo que se envía al backend
};

// Preguntas que el backend reconoce por palabras clave
const PREGUNTAS_RAPIDAS: PreguntaRapida[] = [
  {
    id: "iva",
    label: "¿Qué es el IVA?",
    pregunta: "que es iva",
  },
  {
    id: "isr-empleado",
    label: "¿Cómo se calcula el ISR de mi salario?",
    pregunta: "como se calcula el isr de un salario",
  },
  {
    id: "pequeno-contribuyente",
    label: "Obligaciones de pequeño contribuyente",
    pregunta: "obligaciones tributarias pequeño contribuyente",
  },
  {
    id: "iso",
    label: "¿Qué es el ISO?",
    pregunta: "que es iso",
  },
];

const FloatingConsultor: React.FC = () => {
  const [abierto, setAbierto] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [respuesta, setRespuesta] = useState<string | null>(null);
  const [preguntaSeleccionada, setPreguntaSeleccionada] =
    useState<string | null>(null);

  const manejarClickPregunta = async (pregunta: PreguntaRapida) => {
    setLoading(true);
    setError(null);
    setRespuesta(null);
    setPreguntaSeleccionada(pregunta.label);

    try {
      const res = await preguntarConsultor({ pregunta: pregunta.pregunta });
      setRespuesta(res.respuesta);
    } catch (err: any) {
      setError(err.message ?? "Ocurrió un error al consultar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Botón flotante GNIO */}
      <button
        onClick={() => setAbierto((prev) => !prev)}
        style={{
          position: "fixed",
          right: "1.5rem",
          bottom: "1.5rem",
          zIndex: 50,
          borderRadius: "999px",
          padding: "0.8rem 1.4rem",
          border: "none",
          cursor: "pointer",
          fontWeight: 700,
          letterSpacing: "0.08em",
          background:
            "linear-gradient(135deg, #F59E0B, #D97706)", // color del boton flotante
          color: "white",
          boxShadow: "0 10px 30px rgba(15,23,42,0.7)",
          transition: "transform 0.2s",
        }}
        onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
        onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        GNIO
      </button>

      {/* Panel flotante (solo si está abierto) */}
      {abierto && (
        <div
          style={{
            position: "fixed",
            right: "1.5rem",
            bottom: "4.5rem",
            width: "320px",
            maxHeight: "70vh",
            padding: "1rem",
            borderRadius: "0.75rem",
            backgroundColor: "#1e293b", // ✅ Fondo oscuro pero legible (antes era #020617)
            border: "1px solid rgba(59,130,246,0.5)",
            boxShadow: "0 20px 40px rgba(15,23,42,0.9)",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            zIndex: 40,
            color: "white", // ✅ Texto blanco por defecto
            overflowY: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <h3 style={{ margin: 0, fontSize: "0.95rem", color: "white", fontWeight: 700 }}>
              Consultor rápido SECA
            </h3>
            <span style={{ fontSize: "0.7rem", opacity: 0.8, color: "white" }}>
              Haz clic en una pregunta
            </span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            }}
          >
            {PREGUNTAS_RAPIDAS.map((p) => (
              <button
                key={p.id}
                onClick={() => manejarClickPregunta(p)}
                disabled={loading}
                style={{
                  textAlign: "left",
                  width: "100%",
                  borderRadius: "0.5rem",
                  border: "1px solid rgba(148,163,184,0.4)",
                  backgroundColor: "#0f172a", // ✅ Fondo más oscuro para botones
                  color: "white", // ✅ Texto blanco
                  padding: "0.5rem 0.7rem",
                  fontSize: "0.85rem",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.6 : 1,
                  transition: "all 0.2s",
                }}
                onMouseOver={(e) => {
                  if (!loading) {
                    e.currentTarget.style.backgroundColor = "#1e293b";
                    e.currentTarget.style.borderColor = "rgba(59,130,246,0.6)";
                  }
                }}
                onMouseOut={(e) => {
                  if (!loading) {
                    e.currentTarget.style.backgroundColor = "#0f172a";
                    e.currentTarget.style.borderColor = "rgba(148,163,184,0.4)";
                  }
                }}
              >
                {p.label}
              </button>
            ))}
          </div>

          {loading && (
            <div
              style={{
                marginTop: "0.5rem",
                fontSize: "0.85rem",
                color: "white", // ✅ Texto blanco
                opacity: 0.9,
                textAlign: "center",
              }}
            >
              Consultando...
            </div>
          )}

          {error && (
            <div
              style={{
                marginTop: "0.5rem",
                fontSize: "0.85rem",
                padding: "0.6rem",
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
                marginTop: "0.5rem",
                padding: "0.75rem",
                borderRadius: "0.5rem",
                backgroundColor: "#0f172a", // ✅ Fondo oscuro profesional (antes era #022c22)
                border: "1px solid rgba(34, 197, 94, 0.3)", // ✅ Borde verde sutil
                fontSize: "0.85rem",
                color: "white", // ✅ Texto blanco
                lineHeight: 1.5,
              }}
            >
              {preguntaSeleccionada && (
                <p style={{ margin: "0 0 0.5rem 0", color: "white" }}>
                  <strong style={{ color: "#60a5fa" }}>Pregunta:</strong> {preguntaSeleccionada}
                </p>
              )}
              <p style={{ margin: 0, color: "white" }}>
                <strong style={{ color: "#22c55e" }}>Respuesta:</strong> {respuesta}
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default FloatingConsultor;