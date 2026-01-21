// src/components/Layout.tsx
import { useNavigate, useLocation } from "react-router-dom";
import FloatingConsultor from "./FloatingConsultor";
import FloatingWhatsApp from "./FloatingWhatsApp";
import { useState } from "react";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isHomePage = location.pathname === "/";

  // Determinar qué página está activa
  const isActive = (path: string) => location.pathname === path;

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "#f9fafb",
        color: "#0f172a",
      }}
    >
      {/* NAVBAR MEJORADO */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          backgroundColor: "#0F0E3B",
          boxShadow: "0 8px 24px rgba(15,14,59,0.5)",
          borderBottom: "2px solid rgba(34, 82, 236, 0.3)",
        }}
      >
        <nav
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "1rem 2rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "white",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          {/* Logo SOLO - SIN TEXTO */}
          <button
            onClick={() => navigate("/")}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              padding: 0,
              transition: "opacity 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            <img
              src="/images/logo3.png"
              alt="SECA"
              style={{
                height: 48,
                filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))",
              }}
            />
          </button>

          {/* Navegación Desktop */}
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              flexWrap: "wrap",
              alignItems: "center",
            }}
            className="desktop-nav"
          >
            {[
              { label: "Inicio", path: "/" },
              { label: "Servicios", path: "/servicios" },
              { label: "Principios", path: "/principios" },
              { label: "Contacto", path: "/contacto" },
            ].map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  background: isActive(item.path)
                    ? "rgba(34, 82, 236, 0.3)"
                    : "transparent",
                  border: isActive(item.path)
                    ? "1px solid rgba(34, 82, 236, 0.5)"
                    : "1px solid transparent",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: isActive(item.path) ? 700 : 600,
                  fontSize: "0.95rem",
                  padding: "0.7rem 1.5rem",
                  borderRadius: "10px",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  if (!isActive(item.path)) {
                    e.currentTarget.style.backgroundColor =
                      "rgba(255,255,255,0.08)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(item.path)) {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Menú Hamburguesa para Móvil */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: "none",
              background: "transparent",
              border: "2px solid rgba(255,255,255,0.3)",
              borderRadius: "8px",
              padding: "0.5rem",
              cursor: "pointer",
              color: "white",
            }}
            className="hamburger-btn"
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <div
                style={{
                  width: "24px",
                  height: "2px",
                  backgroundColor: "white",
                  transition: "all 0.3s",
                }}
              />
              <div
                style={{
                  width: "24px",
                  height: "2px",
                  backgroundColor: "white",
                  transition: "all 0.3s",
                }}
              />
              <div
                style={{
                  width: "24px",
                  height: "2px",
                  backgroundColor: "white",
                  transition: "all 0.3s",
                }}
              />
            </div>
          </button>
        </nav>

        {/* Botones de navegación (solo en páginas que no son inicio) */}
        {!isHomePage && (
          <div
            style={{
              maxWidth: "1400px",
              margin: "0 auto",
              padding: "0.75rem 2rem",
              display: "flex",
              gap: "1rem",
              borderTop: "1px solid rgba(255,255,255,0.1)",
              backgroundColor: "rgba(255,255,255,0.03)",
            }}
          >
            <button
              onClick={() => window.history.back()}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.7rem 1.5rem",
                borderRadius: "10px",
                border: "1px solid rgba(255,255,255,0.25)",
                background: "rgba(255,255,255,0.08)",
                color: "white",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.95rem",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.15)";
                e.currentTarget.style.transform = "translateX(-3px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)";
                e.currentTarget.style.transform = "translateX(0)";
              }}
            >
              <span style={{ fontSize: "1.1rem" }}>←</span>
              <span>Regresar</span>
            </button>

            <button
              onClick={() => navigate("/")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.7rem 1.5rem",
                borderRadius: "10px",
                border: "1px solid rgba(34, 82, 236, 0.5)",
                background: "rgba(34, 82, 236, 0.3)",
                color: "white",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.95rem",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(34, 82, 236, 0.5)";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 6px 15px rgba(34, 82, 236, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(34, 82, 236, 0.3)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <span style={{ fontSize: "1.1rem" }}>🏠</span>
              <span>Volver al Inicio</span>
            </button>
          </div>
        )}

        {/* Menú Móvil Desplegable */}
        {menuOpen && (
          <div
            style={{
              backgroundColor: "#0A0B2E",
              borderTop: "1px solid rgba(255,255,255,0.1)",
              padding: "1rem 2rem",
            }}
            className="mobile-menu"
          >
            {[
              { label: "Inicio", path: "/" },
              { label: "Servicios", path: "/servicios" },
              { label: "Principios", path: "/principios" },
              { label: "Contacto", path: "/contacto" },
            ].map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setMenuOpen(false);
                }}
                style={{
                  width: "100%",
                  textAlign: "left",
                  background: isActive(item.path)
                    ? "rgba(34, 82, 236, 0.2)"
                    : "transparent",
                  border: "none",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "1rem",
                  padding: "1rem",
                  borderRadius: "8px",
                  marginBottom: "0.5rem",
                  transition: "all 0.3s ease",
                }}
              >
                {item.label}
              </button>
            ))}

            {!isHomePage && (
              <>
                <button
                  onClick={() => {
                    window.history.back();
                    setMenuOpen(false);
                  }}
                  style={{
                    width: "100%",
                    padding: "1rem",
                    borderRadius: "8px",
                    border: "1px solid rgba(255,255,255,0.25)",
                    background: "rgba(255,255,255,0.08)",
                    color: "white",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: "1rem",
                    marginTop: "1rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  ← Regresar
                </button>

                <button
                  onClick={() => {
                    navigate("/");
                    setMenuOpen(false);
                  }}
                  style={{
                    width: "100%",
                    padding: "1rem",
                    borderRadius: "8px",
                    border: "1px solid rgba(34, 82, 236, 0.5)",
                    background: "rgba(34, 82, 236, 0.3)",
                    color: "white",
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: "1rem",
                  }}
                >
                  🏠 Volver al Inicio
                </button>
              </>
            )}
          </div>
        )}
      </header>

      {/* CONTENIDO */}
      <main style={{ minHeight: "calc(100vh - 400px)" }}>{children}</main>

      {/* FOOTER - CON LOS MISMOS TONOS AZULES DEL HEADER */}
      <footer
        style={{
          position: "relative",
          color: "white",
          marginTop: "4rem",
        }}
      >
        <div
          style={{
            position: "relative",
            padding: "3rem 2rem 2rem",
            // MISMOS COLORES DEL HEADER
            background: "linear-gradient(135deg, #0E234F 0%, #2252EC 100%)",
            overflow: "hidden",
          }}
        >
          {/* Imagen de fondo */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: "url('/images/hero-banner.png')",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundSize: "cover",
              opacity: 0.1,
              pointerEvents: "none",
            }}
          />

          {/* Overlay sutil */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(14,35,79,0.7)",
              pointerEvents: "none",
            }}
          />

          {/* Contenido del footer */}
          <div
            style={{
              position: "relative",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "2.5rem",
              maxWidth: "1200px",
              margin: "0 auto",
              padding: "1.5rem 0.8rem",
            }}
          >
            {/* Sobre Nosotros */}
            <div>
              <h3
                style={{
                  margin: "0 0 1rem",
                  fontSize: "1.4rem",
                  fontWeight: 700,
                }}
              >
                Sobre Nosotros
              </h3>
              <p
                style={{
                  margin: 0,
                  lineHeight: 1.6,
                  fontSize: "1rem",
                  opacity: 0.95,
                }}
              >
                SECA brinda servicios especializados de contabilidad y auditoría,
                apoyando a empresas guatemaltecas y extranjeras en el cumplimiento
                de sus obligaciones tributarias con 18 años de experiencia.
              </p>
            </div>

            {/* Contacto */}
            <div>
              <h3
                style={{
                  margin: "0 0 1rem",
                  fontSize: "1.4rem",
                  fontWeight: 700,
                }}
              >
                Contacto
              </h3>
              <div style={{ fontSize: "1rem", lineHeight: 1.7, opacity: 0.95 }}>
                <div style={{ marginBottom: "0.6rem" }}>
                  <strong>📧 Correo:</strong>
                  <div style={{ paddingLeft: "1.5rem" }}>
                    info@seca.gt
                    <br />
                    corporacionseca@gmail.com
                  </div>
                </div>
                <div style={{ marginBottom: "0.6rem" }}>
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
              <h3
                style={{
                  margin: "0 0 1rem",
                  fontSize: "1.4rem",
                  fontWeight: 700,
                }}
              >
                Redes Sociales
              </h3>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                {/* Facebook */}
                <a
                  href="https://www.facebook.com/secagt"
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
                  onMouseOver={(e) =>
                    (e.currentTarget.style.transform = "scale(1.1)")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
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
                  href="https://www.instagram.com/corporacionseca/"
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
                  onMouseOver={(e) =>
                    (e.currentTarget.style.transform = "scale(1.1)")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
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
                  onMouseOver={(e) =>
                    (e.currentTarget.style.transform = "scale(1.1)")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
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
            paddingTop: "1.5rem",
            paddingBottom: "1.5rem",
            borderTop: "1px solid rgba(255,255,255,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            flexWrap: "wrap",
            // MISMO TONO AZUL OSCURO DEL HEADER
            background: "#0F0E3B",
          }}
        >
          <img src="/images/logo3.png" alt="SECA" style={{ height: 40 }} />
          <p
            style={{
              margin: 0,
              fontSize: "0.95rem",
              opacity: 0.95,
              color: "white",
            }}
          >
            Copyright 2026 © SECA, S.A. Todos los derechos reservados.
          </p>
        </div>
      </footer>

      {/* Botones flotantes */}
      <FloatingWhatsApp />
      <FloatingConsultor />

      {/* CSS Responsive */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }

          .hamburger-btn {
            display: block !important;
          }
        }

        @media (min-width: 769px) {
          .mobile-menu {
            display: none !important;
          }

          .hamburger-btn {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Layout;