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
          backgroundColor: "#0F0E3B", // SECA navy (oficial)
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
          {/* LOGO (blanco) */}
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
            <img
              src="/images/logo3.png"
              alt="SECA"
              style={{
                height: 34,
                width: "auto",
                display: "block",
              }}
            />
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
    padding: "2.2rem",      // un poco más de aire
    color: "white",
  }}
>

<img
  src="/images/logo3.png"
  alt="SECA"
  style={{
    height: 120,          // 👈 MUCHO más visible
    maxWidth: "100%",
    marginBottom: "1rem",
    display: "block",
  }}
/>


            <p
  style={{
    marginBottom: "1.4rem",
    maxWidth: 900,
    fontSize: "1.1rem",     // 👈 más grande
    lineHeight: 1.6,        // 👈 más aire
    opacity: 0.95,
  }}
>
  Servicios especializados de contabilidad y auditoría. Apoyamos a
  empresas guatemaltecas y extranjeras en el cumplimiento de sus
  obligaciones tributarias y el logro de sus objetivos de crecimiento.
</p>


            {/* BOTONES */}
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <button
                onClick={probarStatus}
                disabled={statusLoading}
                style={{
                  padding: "0.55rem 1.3rem",
                  borderRadius: "999px",
                  border: "none",
                  fontWeight: 700,
                  background: "linear-gradient(135deg, #229EFE, #3EFDFD)", // SECA accent -> cyan (oficial)
                  color: "#0F0E3B",
                  cursor: statusLoading ? "not-allowed" : "pointer",
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
                  fontWeight: 700,
                  background: "linear-gradient(135deg, #FFFFFF, #E5E7EB)",
                  color: "#0F0E3B",
                  cursor: dbTestLoading ? "not-allowed" : "pointer",
                }}
              >
                {dbTestLoading ? "Consultando..." : "Probar /api/dbtest"}
              </button>
            </div>

            {/* RESULTADOS */}
            <div
              style={{
                marginTop: "1rem",
                backgroundColor: "rgba(15,14,59,0.65)", // navy con alpha
                padding: "0.8rem",
                borderRadius: "0.75rem",
                whiteSpace: "pre-wrap",
                border: "1px solid rgba(255,255,255,0.15)",
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
