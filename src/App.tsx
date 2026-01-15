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
import FloatingWhatsApp from "./components/FloatingWhatsApp";
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
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: "url('/images/hero-banner.png')",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover",
                opacity: 0.62,
                filter: "contrast(1.02) saturate(1.05)",
                pointerEvents: "none",
              }}
            />

            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(90deg, rgba(14,35,79,0.72) 0%, rgba(14,35,79,0.52) 55%, rgba(14,35,79,0.28) 100%)",
                pointerEvents: "none",
              }}
            />

            <div style={{ position: "relative" }}>
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

              <p
                style={{
                  maxWidth: "none",
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

              {SHOW_DEV_BUTTONS && (
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "0.8rem" }}>
                  <button
                    onClick={probarStatus}
                    disabled={statusLoading}
                    style={{
                      padding: "0.5rem 1rem",
                      backgroundColor: "#10b981",
                      color: "white",
                      border: "none",
                      borderRadius: "0.375rem",
                      cursor: "pointer",
                    }}
                  >
                    {statusLoading ? "Cargando..." : "Probar /api/status"}
                  </button>
                  <button
                    onClick={probarDbTest}
                    disabled={dbTestLoading}
                    style={{
                      padding: "0.5rem 1rem",
                      backgroundColor: "#3b82f6",
                      color: "white",
                      border: "none",
                      borderRadius: "0.375rem",
                      cursor: "pointer",
                    }}
                  >
                    {dbTestLoading ? "Cargando..." : "Probar /api/dbtest"}
                  </button>
                </div>
              )}

              {statusText && (
                <p style={{ marginTop: "1rem", fontStyle: "italic" }}>
                  <strong>Status:</strong> {statusText}
                </p>
              )}
              {statusError && (
                <p style={{ marginTop: "1rem", color: "#ef4444" }}>
                  <strong>Error Status:</strong> {statusError}
                </p>
              )}
              {dbTestResult && (
                <p style={{ marginTop: "1rem", fontStyle: "italic" }}>
                  <strong>dbTest:</strong> {dbTestResult}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* CALCULADORAS - ✅ ORDEN MODIFICADO */}
        <section id="calculadoras" style={{ marginTop: "2rem" }}>
          <div
            className="calc-seca-layout"
            style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}
          >
            {/* COLUMNA CALCULADORAS: Ajustada a 55% */}
            <div className="calc-col" style={{ flex: "1 1 55%" }}>
              {/* ✅ 1. INDEMNIZACIÓN - Primera */}
              <IndemnizacionCalculator />
              
              {/* ✅ 2. BONO 14 */}
              <div style={{ marginTop: "1.75rem" }}>
                <Bono14Calculator />
              </div>
              
              {/* ✅ 3. AGUINALDO */}
              <div style={{ marginTop: "1.75rem" }}>
                <AguinaldoCalculator />
              </div>
              
              {/* ✅ 4. ISR LABORAL */}
              <div style={{ marginTop: "1.75rem" }}>
                <ISRLaboralCalculator />
              </div>
              
              {/* ✅ 5. ISR EMPRESA MENSUAL */}
              <div style={{ marginTop: "1.75rem" }}>
                <ISREmpresaMensualCalculator />
              </div>
              
              {/* ✅ 6. ISR EMPRESA TRIMESTRAL */}
              <div style={{ marginTop: "1.75rem" }}>
                <ISREmpresaTrimestralCalculator />
              </div>
              
              {/* ✅ 7. ISO TRIMESTRAL - Última */}
              <div style={{ marginTop: "1.75rem" }}>
                <ISOTrimestralCalculator />
              </div>
            </div>

            {/* COLUMNA SECA INFO: Ajustada a 45% */}
            <div
              className="seca-col"
              style={{ flex: "1 1 45%", display: "flex", alignItems: "stretch" }}
            >
              <div style={{ flex: 1 }}>
                <SECAInfoPanel />
              </div>
            </div>
          </div>
        </section>

        {/* SOBRE SECA */}
        <section id="seca-info" style={{ marginTop: "2rem" }}>
          {/* tu contenido si aplica */}
        </section>
      </main>

      {/* ✅ BOTONES FLOTANTES */}
      <FloatingConsultor />
      <FloatingWhatsApp />

      {/* FOOTER - MÁS COMPACTO */}
      <footer
        id="contacto"
        style={{
          background: "linear-gradient(135deg, #0E234F, #2252EC)",
          color: "white",
          padding: "1.5rem 2rem 1rem",
          marginTop: "0.5rem",
          boxShadow: "0 -4px 20px rgba(0,0,0,0.2)",
        }}
      >
        {/* CONTENEDOR CON IMAGEN DE FONDO Y OVERLAY */}
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: "0.5rem",
          }}
        >
          {/* Imagen de fondo */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: "url('/images/footerseca.png')",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundSize: "cover",
              opacity: 0.35,
              pointerEvents: "none",
            }}
          />

          {/* Overlay oscuro (similar al header) */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(90deg, rgba(14,35,79,0.85) 0%, rgba(14,35,79,0.75) 50%, rgba(14,35,79,0.85) 100%)",
              pointerEvents: "none",
            }}
          />

          {/* Contenido del footer */}
          <div
            style={{
              position: "relative",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1.5rem",
              maxWidth: "1200px",
              margin: "0 auto",
              padding: "1.2rem 0.8rem",
            }}
          >
            {/* Sobre Nosotros */}
            <div>
              <h3 style={{ margin: "0 0 0.7rem", fontSize: "1.35rem", fontWeight: 700 }}>
                Sobre Nosotros
              </h3>
              <p style={{ margin: 0, lineHeight: 1.5, fontSize: "0.98rem", opacity: 0.95 }}>
                SECA brinda servicios especializados de contabilidad y auditoría, apoyando a empresas
                guatemaltecas y extranjeras en el cumplimiento de sus obligaciones tributarias con 18
                años de experiencia.
              </p>
            </div>

            {/* Contacto */}
            <div>
              <h3 style={{ margin: "0 0 0.7rem", fontSize: "1.35rem", fontWeight: 700 }}>
                Contacto
              </h3>
              <div style={{ fontSize: "0.98rem", lineHeight: 1.6, opacity: 0.95 }}>
                <div style={{ marginBottom: "0.4rem" }}>
                  <strong>📧 Correo:</strong>
                  <div style={{ paddingLeft: "1.5rem" }}>
                    info@seca.gt<br />
                    corporacionseca@gmail.com
                  </div>
                </div>
                <div style={{ marginBottom: "0.4rem" }}>
                  <strong>☎️ Teléfono:</strong> 3639-3647
                </div>
                <div>
                  <strong>📍 Ubicación:</strong>
                  <div style={{ paddingLeft: "1.5rem" }}>
                    Edificio Plaza Kalu, zona 4 de Mixco, Boulevard Naranjo.
                  </div>
                </div>
              </div>
            </div>

            {/* Redes Sociales */}
            <div>
              <h3 style={{ margin: "0 0 0.7rem", fontSize: "1.35rem", fontWeight: 700 }}>
                Redes Sociales
              </h3>
              <div style={{ display: "flex", gap: "1rem" }}>
                {/* Facebook */}
                <a
                  href="https://www.facebook.com/tuPaginaDeFacebook"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    backgroundColor: "white",
                    color: "#0E234F",
                    textDecoration: "none",
                    transition: "transform 0.2s",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                  onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="26"
                    height="26"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/tuInstagram"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    backgroundColor: "white",
                    color: "#0E234F",
                    textDecoration: "none",
                    transition: "transform 0.2s",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                  onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="26"
                    height="26"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/50236393647"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    backgroundColor: "white",
                    color: "#0E234F",
                    textDecoration: "none",
                    transition: "transform 0.2s",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                  onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="26"
                    height="26"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div
          style={{
            marginTop: "1.5rem",
            paddingTop: "1rem",
            borderTop: "1px solid rgba(255,255,255,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <img src="/images/logo3.png" alt="SECA" style={{ height: 40 }} />
          <p style={{ margin: 0, fontSize: "0.95rem", opacity: 0.95 }}>
            Copyright 2026 © SECA, S.A. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;