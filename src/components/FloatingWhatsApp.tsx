// src/components/FloatingWhatsApp.tsx
// Tooltip aparece al LADO IZQUIERDO del botón (no lo tapa)

import React, { useState, useEffect } from "react";

const FloatingWhatsApp: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    window.open("https://wa.me/50236393647", "_blank");
  };

  return (
    <div
      style={{
        position: "fixed",
        right: "1.5rem",
        bottom: "5rem",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        gap: "0.75rem", // Espacio entre tooltip y botón
      }}
    >
      {/* Tooltip AL LADO IZQUIERDO con bounce effect */}
      {showTooltip && (
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
          ¿Necesitas asesoría?
          
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

      {/* Botón de WhatsApp */}
      <button
        onClick={handleClick}
        aria-label="Contactar por WhatsApp"
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          border: "none",
          cursor: "pointer",
          background: "linear-gradient(135deg, #25D366, #128C7E)",
          color: "white",
          boxShadow: "0 10px 30px rgba(37, 211, 102, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "transform 0.2s, box-shadow 0.2s",
          flexShrink: 0,
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
          e.currentTarget.style.boxShadow = "0 15px 40px rgba(37, 211, 102, 0.7)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 10px 30px rgba(37, 211, 102, 0.5)";
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>
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
  );
};

export default FloatingWhatsApp;