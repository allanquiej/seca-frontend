// src/App.tsx
import { useState } from "react";
import './responsive-layout.css';
import { apiGetText } from "./services/apiClient";

import IndemnizacionCalculator from "./components/IndemnizacionCalculator";
import Bono14Calculator from "./components/Bono14Calculator";
import AguinaldoCalculator from "./components/AguinaldoCalculator";
import ISRLaboralCalculator from "./components/ISRLaboralCalculator";
import ISREmpresaMensualCalculator from "./components/ISREmpresaMensualCalculator";
import ISREmpresaTrimestralCalculator from "./components/ISREmpresaTrimestralCalculator";
import ISOTrimestralCalculator from "./components/ISOTrimestralCalculator";
import FloatingConsultor from "./components/FloatingConsultor";
import SECAInfoPanel from "./components/SECAInfoPanel";

function App() {
  const [statusText, setStatusText] = useState<string | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);

  const probarStatus = async () => {
    setStatusLoading(true);
    setStatusError(null);
    setStatusText(null);

    try {
      const res = await apiGetText("/api/status");
      setStatusText(res);
    } catch (err: any) {
      setStatusError(err.message ?? "Error al consultar /api/status");
    } finally {
      setStatusLoading(false);
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "#f9fafb",
        color: "#0f172a",
      }}
    >
      {/* NAVBAR */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          backgroundColor: "#0f172a",
          boxShadow: "0 6px 20px rgba(15,23,42,0.4)",
        }}
      >
        <nav
          style={{
            maxWidth: "100%",
            margin: "0 auto",
            padding: "0.75rem 2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "white",
          }}
        >
          {/* Logo */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "999px",
                background: "linear-gradient(135deg, #1d4ed8, #38bdf8)",
              }}
            />
            <span
              style={{
                fontWeight: 800,
                letterSpacing: "0.08em",
                fontSize: "0.95rem",
                textTransform: "uppercase",
              }}
            >
              SECA
            </span>
          </div>

          {/* Menú de navegación */}
          <div
            style={{
              display: "flex",
              gap: "1rem",
              fontSize: "0.9rem",
            }}
          >
            {[
              { id: "inicio", label: "Inicio" },
              { id: "calculadoras", label: "Calculadoras" },
              { id: "seca-info", label: "Sobre SECA" },
              { id: "contacto", label: "Contáctanos" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "white",
                  cursor: "pointer",
                  padding: "0.35rem 0.8rem",
                  borderRadius: "999px",
                  transition: "background 0.2s, transform 0.1s",
                }}
                onMouseDown={(e) => {
                  e.currentTarget.style.transform = "scale(0.96)";
                }}
                onMouseUp={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </nav>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main
        style={{
          width: "100%",
          padding: "2rem 2rem 4rem",
        }}
      >
        {/* INICIO */}
        <section id="inicio" style={{ marginBottom: "2rem" }}>
          <div
            style={{
              background: "linear-gradient(135deg, #1d4ed8, #0f172a)",
              borderRadius: "1rem",
              padding: "1.8rem",
              color: "white",
              boxShadow: "0 24px 60px rgba(15,23,42,0.45)",
            }}
          >
            <h1 style={{ marginTop: 0, marginBottom: "0.75rem" }}>
              Frontend SECA
            </h1>
            <p style={{ marginTop: 0, marginBottom: "1.25rem" }}>
              Panel de herramientas para clientes SECA: calculadoras fiscales,
              consultor contable y resumen de servicios.
            </p>

            <button
              onClick={probarStatus}
              disabled={statusLoading}
              style={{
                padding: "0.55rem 1.3rem",
                borderRadius: "999px",
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
                background: "linear-gradient(135deg, #22c55e, #4ade80)",
                color: "#052e16",
              }}
            >
              {statusLoading ? "Consultando..." : "Probar /api/status"}
            </button>

            <div
              style={{
                marginTop: "1rem",
                borderRadius: "0.75rem",
                padding: "0.8rem",
                backgroundColor: "rgba(15,23,42,0.75)",
                minHeight: "2.2rem",
                fontSize: "0.9rem",
                whiteSpace: "pre-wrap",
              }}
            >
              {statusError && (
                <span>
                  <strong>Error:</strong> {statusError}
                </span>
              )}
              {statusText && !statusError && <span>{statusText}</span>}
              {!statusText && !statusError && !statusLoading && (
                <span style={{ opacity: 0.8 }}>
                  Presiona el botón para consultar el estado de la API.
                </span>
              )}
            </div>
          </div>
        </section>

        {/* CALCULADORAS + SECA INFO EN 2 COLUMNAS */}
        <section id="calculadoras" style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ marginBottom: "1rem" }}>Calculadoras SECA</h2>
          <p
            style={{
              marginTop: 0,
              marginBottom: "1.5rem",
              fontSize: "0.95rem",
              color: "#4b5563",
            }}
          >
            Utiliza las distintas calculadoras para estimar prestaciones e
            impuestos de forma rápida y didáctica.
          </p>

          {/* LAYOUT DE 2 COLUMNAS - 50/50 */}
          <div
            className="main-layout"
            style={{
              display: "flex",
              gap: "2rem",
              alignItems: "flex-start",
            }}
          >
            {/* Columna IZQUIERDA: Calculadoras - 50% */}
            <div
              className="calculators-column"
              style={{
                flex: 1, // 👈 50% del espacio
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              <IndemnizacionCalculator />
              <Bono14Calculator />
              <AguinaldoCalculator />
              <ISRLaboralCalculator />
              <ISREmpresaMensualCalculator />
              <ISREmpresaTrimestralCalculator />
              <ISOTrimestralCalculator />
            </div>

            {/* Columna DERECHA: Info de SECA - 50% */}
            <div
              id="seca-info"
              className="info-column"
              style={{
                flex: 1, // 👈 50% del espacio (antes era 0 0 380px)
                minWidth: 0,
              }}
            >
              <SECAInfoPanel />
            </div>
          </div>
        </section>

        {/* CONTACTO */}
        <section id="contacto" style={{ marginBottom: "1rem" }}>
          <h2>Contáctanos</h2>
          <p style={{ maxWidth: "640px", color: "#4b5563" }}>
            Si deseas implementar estas herramientas en tu empresa o necesitas
            asesoría personalizada, puedes comunicarte con el equipo de SECA a
            través de los canales indicados en la sección de servicios.
          </p>
        </section>
      </main>

      {/* BOTÓN FLOTANTE GNIO */}
      <FloatingConsultor />
    </div>
  );
}

export default App;