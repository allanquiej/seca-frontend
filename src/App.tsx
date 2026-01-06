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
          backgroundColor: "#0F0E3B",
          boxShadow: "0 6px 20px rgba(15,23,42,0.4)",
        }}
      >
        <nav
          style={{
            padding: "0.75rem 2rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "white",
          }}
        >
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("inicio");
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              textDecoration: "none",
              color: "white",
            }}
          >
            <img src="/images/logo3.png" alt="SECA" style={{ height: 34 }} />
          </a>

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
                  fontWeight: 600,
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
              background: "linear-gradient(135deg, #0E234F, #2252EC)",
              borderRadius: "1rem",
              padding: "2.2rem",
              color: "white",
            }}
          >
            <img src="/images/logo3.png" alt="SECA" style={{ height: 120 }} />

            <p style={{ maxWidth: 900, fontSize: "1.1rem", lineHeight: 1.6 }}>
              Servicios especializados de contabilidad y auditoría. Apoyamos a
              empresas guatemaltecas y extranjeras en el cumplimiento de sus
              obligaciones tributarias y el logro de sus objetivos de crecimiento.
            </p>

            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <button
                onClick={probarStatus}
                disabled={statusLoading}
                style={{
                  padding: "0.55rem 1.3rem",
                  borderRadius: "999px",
                  fontWeight: 700,
                  background: "linear-gradient(135deg, #229EFE, #3EFDFD)",
                  color: "#0F0E3B",
                  border: "none",
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
                  fontWeight: 700,
                  background: "linear-gradient(135deg, #FFFFFF, #E5E7EB)",
                  color: "#0F0E3B",
                  border: "none",
                }}
              >
                {dbTestLoading ? "Consultando..." : "Probar /api/dbtest"}
              </button>
            </div>

            <div
              style={{
                marginTop: "1rem",
                backgroundColor: "rgba(15,14,59,0.65)",
                padding: "0.8rem",
                borderRadius: "0.75rem",
              }}
            >
              {statusError && <strong>Error: {statusError}</strong>}
              {statusText && <div>{statusText}</div>}
              {dbTestResult && <div>{dbTestResult}</div>}
            </div>
          </div>
        </section>

        {/* CALCULADORAS + PANEL */}
        <section id="calculadoras" style={{ marginTop: "2rem" }}>
          <div
            className="calc-seca-layout"
            style={{
              display: "flex",
              gap: "2rem",
              alignItems: "stretch",
              paddingTop: "0.6rem",
            }}
          >
            {/* COLUMNA CALCULADORAS */}
            <div
              className="calc-col"
              style={{
                flex: 1,
                marginTop: "-14px", // tu ajuste actual (no lo toco)
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

            {/* COLUMNA PANEL SECA */}
            <div
              id="seca-info"
              className="seca-col"
              style={{
                flex: 1,
                display: "flex",
              }}
            >
              <div style={{ flex: 1 }}>
                <SECAInfoPanel />
              </div>
            </div>
          </div>
        </section>

        {/* CONTACTO */}
        <section id="contacto" style={{ marginTop: "1rem" }}>
          <h2>Contáctanos</h2>
          <p>Comunícate con SECA para asesoría personalizada.</p>
        </section>
      </main>

      <FloatingConsultor />
    </div>
  );
}

export default App;
