// src/App.tsx
import { useState } from "react";
import "./responsive-layout.css";
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
  // ====== ESTADOS API STATUS ======
  const [statusText, setStatusText] = useState<string | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);

  // ====== ESTADOS DB TEST ======
  const [dbTestResult, setDbTestResult] = useState<string>("");
  const [dbTestLoading, setDbTestLoading] = useState(false);

  // ====== PROBAR /api/status ======
  const probarStatus = async () => {
    setStatusLoading(true);
    setStatusError(null);
    setStatusText(null);

    try {
      const res = await apiGetText("/api/status");
      setStatusText(res);
    } catch (err: any) {
      setStatusError(err?.message ?? "Error al consultar /api/status");
    } finally {
      setStatusLoading(false);
    }
  };

  // ====== PROBAR /api/dbtest ======
  const probarDbTest = async () => {
    setDbTestLoading(true);
    setDbTestResult("");

    try {
      const res = await apiGetText("/api/dbtest");
      setDbTestResult(res);
    } catch (err: any) {
      setDbTestResult(err?.message ?? "Error al consultar /api/dbtest");
    } finally {
      setDbTestLoading(false);
    }
  };

  // ====== SCROLL NAV ======
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
            padding: "0.75rem 2rem",
            display: "flex",
            justifyContent: "space-between",
            color: "white",
          }}
        >
          <strong>SECA</strong>

          <div style={{ display: "flex", gap: "1rem" }}>
            {[
              { id: "inicio", label: "Inicio" },
              { id: "calculadoras", label: "Calculadoras" },
              { id: "seca-info", label: "Sobre SECA" },
              { id: "contacto", label: "Contacto" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </nav>
      </header>

      {/* CONTENIDO */}
      <main style={{ padding: "2rem" }}>
        {/* INICIO */}
        <section id="inicio">
          <div
            style={{
              background: "linear-gradient(135deg, #1d4ed8, #0f172a)",
              borderRadius: "1rem",
              padding: "1.8rem",
              color: "white",
            }}
          >
            <h1>Frontend SECA</h1>
            <p>
              Panel de herramientas para clientes SECA: calculadoras fiscales,
              consultor contable y resumen de servicios.
            </p>

            {/* BOTONES */}
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button
                onClick={probarStatus}
                disabled={statusLoading}
                style={{
                  padding: "0.55rem 1.3rem",
                  borderRadius: "999px",
                  border: "none",
                  fontWeight: 600,
                  background: "linear-gradient(135deg, #22c55e, #4ade80)",
                  color: "#052e16",
                }}
              >
                {statusLoading ? "Consultando..." : "Probar /api/status"}
              </button>

              <button
                onClick={probarDbTest}
                disabled={dbTestLoading}
                style={{
                  padding: "0.55rem 1.3rem",
                  borderRadius: "999px",
                  border: "none",
                  fontWeight: 600,
                  background: "linear-gradient(135deg, #60a5fa, #93c5fd)",
                  color: "#0b1220",
                }}
              >
                {dbTestLoading ? "Consultando..." : "Probar /api/dbtest"}
              </button>
            </div>

            {/* RESULTADOS */}
            <div
              style={{
                marginTop: "1rem",
                backgroundColor: "rgba(15,23,42,0.75)",
                padding: "0.8rem",
                borderRadius: "0.75rem",
                whiteSpace: "pre-wrap",
              }}
            >
              {statusError && <strong>Error: {statusError}</strong>}
              {statusText && <div>{statusText}</div>}
              {dbTestResult && <div>{dbTestResult}</div>}
            </div>
          </div>
        </section>

        {/* CALCULADORAS */}
        <section id="calculadoras" style={{ marginTop: "2rem" }}>
          <div style={{ display: "flex", gap: "2rem" }}>
            <div style={{ flex: 1 }}>
              <IndemnizacionCalculator />
              <Bono14Calculator />
              <AguinaldoCalculator />
              <ISRLaboralCalculator />
              <ISREmpresaMensualCalculator />
              <ISREmpresaTrimestralCalculator />
              <ISOTrimestralCalculator />
            </div>

            <div id="seca-info" style={{ flex: 1 }}>
              <SECAInfoPanel />
            </div>
          </div>
        </section>

        {/* CONTACTO */}
        <section id="contacto" style={{ marginTop: "2rem" }}>
          <h2>Contáctanos</h2>
          <p>
            Para implementar estas herramientas o recibir asesoría personalizada,
            comunícate con SECA.
          </p>
        </section>
      </main>

      <FloatingConsultor />
    </div>
  );
}

export default App;
