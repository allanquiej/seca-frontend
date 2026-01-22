// src/components/FloatingConsultor.tsx
// Tooltip aparece al LADO IZQUIERDO del botón GNIO (no lo tapa)

import { useState, useEffect } from "react";
import { preguntarConsultor } from "../services/consultorService";

type PreguntaRapida = {
  id: string;
  label: string;
  pregunta: string;
};

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
  const [showTooltip, setShowTooltip] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [respuesta, setRespuesta] = useState<string | null>(null);
  const [preguntaSeleccionada, setPreguntaSeleccionada] = useState<string | null>(null);

  // Tooltip aparece después de 3 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

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
      {/* Botón flotante GNIO con tooltip AL LADO */}
      <div
        style={{
          position: "fixed",
          right: "1.5rem",
          bottom: "1.5rem",
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        {/* Tooltip AL LADO IZQUIERDO - solo si el panel NO está abierto */}
        {showTooltip && !abierto && (
          <div
            style={{
              backgroundColor: "#0f172a",
              color: "white",
              padding: "0.75rem 1.25rem",
              borderRadius: "12px",
              fontSize: "0.95rem",
              fontWeight: "600",
              whiteSpace: "nowrap",
              boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
              animation: "bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
              position: "relative",
            }}
          >
            Hazme una pregunta
            
            {/* Flecha apuntando AL BOTÓN (hacia la derecha) */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                right: "-6px",
                transform: "translateY(-50%)",
                width: "0",
                height: "0",
                borderTop: "8px solid transparent",
                borderBottom: "8px solid transparent",
                borderLeft: "8px solid #0f172a",
              }}
            />
          </div>
        )}

        {/* Botón GNIO */}
        <button
          onClick={() => setAbierto((prev) => !prev)}
          style={{
            borderRadius: "999px",
            padding: "0.8rem 1.4rem",
            border: "none",
            cursor: "pointer",
            fontWeight: 700,
            letterSpacing: "0.08em",
            background: "linear-gradient(135deg, #F59E0B, #D97706)",
            color: "white",
            boxShadow: "0 10px 30px rgba(15,23,42,0.7)",
            transition: "transform 0.2s",
            flexShrink: 0,
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          GNIO
        </button>

        {/* CSS para animación bounce */}
        <style>{`
          @keyframes bounceIn {
            0% {
              opacity: 0;
              transform: scale(0.3) translateX(20px);
            }
            50% {
              opacity: 1;
              transform: scale(1.1);
            }
            70% {
              transform: scale(0.9);
            }
            100% {
              transform: scale(1);
            }
          }

          @media (max-width: 768px) {
            [style*="bounceIn"] {
              display: none !important;
            }
          }
        `}</style>
      </div>

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
            backgroundColor: "#1e293b",
            border: "1px solid rgba(59,130,246,0.5)",
            boxShadow: "0 20px 40px rgba(15,23,42,0.9)",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            zIndex: 40,
            color: "white",
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
                  backgroundColor: "#0f172a",
                  color: "white",
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
                color: "white",
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
                backgroundColor: "rgba(220, 38, 38, 0.2)",
                border: "1px solid rgba(220, 38, 38, 0.5)",
                color: "white",
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
                backgroundColor: "#0f172a",
                border: "1px solid rgba(34, 197, 94, 0.3)",
                fontSize: "0.85rem",
                color: "white",
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
