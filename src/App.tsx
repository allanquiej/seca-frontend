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
  // ✅ Cambiá a true SOLO cuando quieras ver los botones de prueba
  const SHOW_DEV_BUTTONS = false;

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
            {/* Logo navbar (lo cambias aquí) */}
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
              position: "relative",
              background: "linear-gradient(135deg, #0E234F, #2252EC)",
              borderRadius: "1rem",
              padding: "2.2rem",
              color: "white",
              overflow: "hidden",
            }}
          >
            {/* ✅ Fondo decorativo del banner (cambiá la imagen aquí)
                PONE TU ARCHIVO EN: public/images/hero-banner.png (o .jpg)
            */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: "url('/images/hero-banner.png')",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
                opacity: 0.62, // ✅ MÁS CLARA (antes 0.18)
                filter: "contrast(1.02) saturate(1.05)",
                pointerEvents: "none",
              }}
            />

            {/* ✅ Capa de contraste (más suave, deja ver más la imagen) */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(90deg, rgba(14,35,79,0.72) 0%, rgba(14,35,79,0.52) 55%, rgba(14,35,79,0.28) 100%)",
                pointerEvents: "none",
              }}
            />

            {/* ✅ Contenido del banner (SIN cuadro derecho) */}
            <div style={{ position: "relative" }}>
              {/* Logo del banner (lo cambias aquí) */}
              <img
                src="/images/seca.png"
                alt="SECA"
                style={{
                  height: 120,
                  width: "auto",
                  maxWidth: 360,
                  objectFit: "contain",
                  display: "block",
                }}
              />

              {/* ✅ Texto ocupa TODA la línea */}
              <p
                style={{
                  maxWidth: "none", // ✅ antes 900
                  width: "100%",
                  fontSize: "1.15rem",
                  lineHeight: 1.7,
                  marginTop: "1.2rem",
                }}
              >
                Servicios especializados de contabilidad y auditoría. Apoyamos a empresas guatemaltecas y
                extranjeras en el cumplimiento de sus obligaciones tributarias y el logro de sus objetivos
                de crecimiento.
              </p>

              {/* ✅ Botones de prueba (apagados por defecto) */}
              {SHOW_DEV_BUTTONS && (
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "0.8rem" }}>
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
              )}

              <div
                style={{
                  marginTop: "1rem",
                  backgroundColor: "rgba(15,14,59,0.55)", // ✅ un poquito menos oscuro
                  padding: "0.8rem",
                  borderRadius: "0.75rem",
                  maxWidth: 980, // ✅ opcional: evita que quede demasiado ancho si hay mensajes largos
                }}
              >
                {statusError && <strong>Error: {statusError}</strong>}
                {statusText && <div>{statusText}</div>}
                {dbTestResult && <div>{dbTestResult}</div>}
              </div>
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
            <div className="calc-col" style={{ flex: 1 }}>
              <IndemnizacionCalculator />
              <Bono14Calculator />
              <AguinaldoCalculator />
              <ISRLaboralCalculator />
              <ISREmpresaMensualCalculator />
              <ISREmpresaTrimestralCalculator />
              <ISOTrimestralCalculator />
            </div>

            {/* COLUMNA PANEL SECA */}
            <div id="seca-info" className="seca-col" style={{ flex: 1, display: "flex" }}>
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
