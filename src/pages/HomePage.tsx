// src/pages/HomePage.tsx
import { Link } from "react-router-dom";

const HomePage = () => {
  const calculadoras = [

    {
      id: "prestaciones-laborales",
      nombre: "Prestaciones Laborales",
      descripcion: "Calcula prestaciones completas (indemnización, vacaciones, aguinaldo, bono 14 y más) según fechas y tipo de terminación.",
      icon: "🧾",
      color: "#22c55e",
      ruta: "/calculadora-prestaciones-laborales",
    },


    {
      id: "indemnizacion",
      nombre: "Indemnización",
      descripcion: "Calcula la indemnización correspondiente por despido según el salario mensual y años trabajados.",
      icon: "💼",
      color: "#3b82f6",
      ruta: "/calculadora-indemnizacion",
    },
    {
      id: "bono14",
      nombre: "Bono 14",
      descripcion: "Estima el Bono 14 basado en tu salario ordinario y tiempo trabajado durante el año.",
      icon: "🎁",
      color: "#8b5cf6",
      ruta: "/calculadora-bono14",
    },
    {
      id: "aguinaldo",
      nombre: "Aguinaldo",
      descripcion: "Calcula tu aguinaldo anual según tu salario promedio y meses laborados.",
      icon: "🎊",
      color: "#ec4899",
      ruta: "/calculadora-aguinaldo",
    },
    {
      id: "isr-laboral",
      nombre: "ISR Laboral",
      descripcion: "Determina el Impuesto Sobre la Renta que corresponde a tu sueldo mensual.",
      icon: "🏢",
      color: "#f59e0b",
      ruta: "/calculadora-isr-laboral",
    },
    {
      id: "isr-empresa-mensual",
      nombre: "ISR Empresa Mensual",
      descripcion: "Calcula el ISR mensual de tu empresa basado en ingresos y gastos.",
      icon: "📊",
      color: "#10b981",
      ruta: "/calculadora-isr-empresa-mensual",
    },
    {
      id: "isr-empresa-trimestral",
      nombre: "ISR Empresa Trimestral",
      descripcion: "Estima el ISR trimestral de tu empresa para una mejor planificación fiscal.",
      icon: "📈",
      color: "#06b6d4",
      ruta: "/calculadora-isr-empresa-trimestral",
    },
    {
      id: "iso-trimestral",
      nombre: "ISO Trimestral",
      descripcion: "Calcula el Impuesto de Solidaridad (ISO) trimestral según los ingresos de tu empresa.",
      icon: "📋",
      color: "#6366f1",
      ruta: "/calculadora-iso-trimestral",
    },
  ];

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Hero Section con Imagen de Fondo */}
      <div
        style={{
          position: "relative",
          padding: "5rem 2rem 4rem",
          textAlign: "center",
          color: "white",
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
            opacity: 0.30,
            pointerEvents: "none",
          }}
        />

        {/* Overlay para mejorar legibilidad */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, rgba(14,35,79,0.5) 0%, rgba(34,82,236,0.5) 100%)",
            pointerEvents: "none",
          }}
        />

        {/* Contenido del Hero */}
        <div
          style={{
            position: "relative",
            maxWidth: "900px",
            margin: "0 auto",
            zIndex: 1,
          }}
        >
          <h1
            style={{
              fontSize: "3rem",
              fontWeight: "800",
              marginBottom: "1.5rem",
              lineHeight: "1.2",
              textShadow: "0 4px 12px rgba(0,0,0,0.4)",
            }}
          >
            Soluciones Contables Profesionales
          </h1>
          <p
            style={{
              fontSize: "1.2rem",
              opacity: "0.95",
              marginBottom: "2rem",
              lineHeight: "1.6",
              textShadow: "0 2px 8px rgba(0,0,0,0.3)",
            }}
          >
            Expertos en contabilidad, auditoría y asesoría tributaria en Guatemala
          </p>

        </div>
      </div>

      {/* Sección de Calculadoras con Layout de 2 Columnas */}
      <div
        style={{
          backgroundColor: "#f8fafc",
          padding: "4rem 2rem 6rem",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
          }}
        >
          <h2
            style={{
              fontSize: "2.5rem",
              fontWeight: "700",
              marginBottom: "3.5rem",
              color: "#0f172a",
              textAlign: "center",
            }}
          >
            Selecciona una Calculadora
          </h2>

          {/* Layout de 2 Columnas */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "4rem",
              alignItems: "start",
            }}
            className="two-column-layout"
          >
            {/* COLUMNA 1: Calculadoras */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "2rem",
              }}
            >
              {calculadoras.map((calc) => (
                <Link
                  key={calc.id}
                  to={calc.ruta}
                  style={{
                    textDecoration: "none",
                    display: "block",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateX(8px)";
                    e.currentTarget.style.boxShadow =
                      "0 12px 30px rgba(34, 82, 236, 0.25)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateX(0)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(34, 82, 236, 0.15)";
                  }}
                >
                  <div
                    style={{
                      background: "linear-gradient(135deg, rgba(14, 35, 79, 0.08) 0%, rgba(34, 82, 236, 0.12) 100%)",
                      backdropFilter: "blur(10px)",
                      borderRadius: "16px",
                      padding: "2rem",
                      boxShadow: "0 4px 12px rgba(34, 82, 236, 0.15)",
                      display: "flex",
                      alignItems: "center",
                      gap: "1.5rem",
                      border: "1px solid rgba(34, 82, 236, 0.2)",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {/* Icono */}
                    <div
                      style={{
                        width: "70px",
                        height: "70px",
                        backgroundColor: calc.color + "20",
                        borderRadius: "16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "2.2rem",
                        flexShrink: 0,
                        border: `2px solid ${calc.color}30`,
                      }}
                    >
                      {calc.icon}
                    </div>

                    {/* Contenido */}
                    <div style={{ flex: 1 }}>
                      <h3
                        style={{
                          fontSize: "1.3rem",
                          fontWeight: "700",
                          color: "#0f172a",
                          marginBottom: "0.5rem",
                          lineHeight: "1.3",
                        }}
                      >
                        {calc.nombre}
                      </h3>
                      <p
                        style={{
                          fontSize: "0.95rem",
                          color: "#475569",
                          lineHeight: "1.5",
                        }}
                      >
                        {calc.descripcion}
                      </p>
                    </div>

                    {/* Flecha */}
                    <div
                      style={{
                        color: calc.color,
                        fontSize: "1.5rem",
                        flexShrink: 0,
                        transition: "transform 0.3s ease",
                      }}
                    >
                      →
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* COLUMNA 2: DOS IMÁGENES INFORMATIVAS */}
            <div
              style={{
                position: "sticky",
                top: "120px",
                display: "flex",
                flexDirection: "column",
                gap: "2rem",
              }}
            >
              {/* IMAGEN 1 - Superior */}
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "24px",
                  padding: "2rem",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  overflow: "hidden",
                }}
              >
                <img
                  src="/images/calculadora-info-1.png"
                  alt="Información calculadoras - Parte 1"
                  style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: "16px",
                    objectFit: "cover",
                    display: "block",
                  }}
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    const parent = target.parentElement;
                    target.style.display = "none";
                    if (parent) {
                      const placeholder = parent.querySelector('.placeholder-1') as HTMLDivElement;
                      if (placeholder) {
                        placeholder.style.display = "flex";
                      }
                    }
                  }}
                />

                {/* Placeholder Imagen 1 */}
                <div
                  className="placeholder-1"
                  style={{
                    display: "none",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "350px",
                    background: "linear-gradient(135deg, #0E234F 0%, #2252EC 100%)",
                    borderRadius: "16px",
                    color: "white",
                    textAlign: "center",
                    padding: "2.5rem",
                  }}
                >
                  <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>
                    📊
                  </div>
                  <h3
                    style={{
                      fontSize: "1.6rem",
                      fontWeight: "700",
                      marginBottom: "1rem",
                    }}
                  >
                    Imagen 1
                  </h3>
                  <p style={{ fontSize: "1rem", opacity: 0.9 }}>
                    Coloca aquí tu primera imagen en
                    <br />
                    <code
                      style={{
                        background: "rgba(255,255,255,0.2)",
                        padding: "0.2rem 0.5rem",
                        borderRadius: "4px",
                        fontSize: "0.9rem",
                      }}
                    >
                      /images/calculadora-info-1.png
                    </code>
                  </p>
                  <p style={{ fontSize: "0.85rem", opacity: 0.8, marginTop: "1rem" }}>
                    Tamaño recomendado: 600x400px
                  </p>
                </div>
              </div>

              {/* IMAGEN 2 - Inferior */}
              <div
                style={{
                  backgroundColor: "white",
                  borderRadius: "24px",
                  padding: "2rem",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  overflow: "hidden",
                }}
              >
                <img
                  src="/images/calculadora-info-2.png"
                  alt="Información calculadoras - Parte 2"
                  style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: "16px",
                    objectFit: "cover",
                    display: "block",
                  }}
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    const parent = target.parentElement;
                    target.style.display = "none";
                    if (parent) {
                      const placeholder = parent.querySelector('.placeholder-2') as HTMLDivElement;
                      if (placeholder) {
                        placeholder.style.display = "flex";
                      }
                    }
                  }}
                />

                {/* Placeholder Imagen 2 */}
                <div
                  className="placeholder-2"
                  style={{
                    display: "none",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "350px",
                    background: "linear-gradient(135deg, #2252EC 0%, #0E234F 100%)",
                    borderRadius: "16px",
                    color: "white",
                    textAlign: "center",
                    padding: "2.5rem",
                  }}
                >
                  <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>
                    📈
                  </div>
                  <h3
                    style={{
                      fontSize: "1.6rem",
                      fontWeight: "700",
                      marginBottom: "1rem",
                    }}
                  >
                    Imagen 2
                  </h3>
                  <p style={{ fontSize: "1rem", opacity: 0.9 }}>
                    Coloca aquí tu segunda imagen en
                    <br />
                    <code
                      style={{
                        background: "rgba(255,255,255,0.2)",
                        padding: "0.2rem 0.5rem",
                        borderRadius: "4px",
                        fontSize: "0.9rem",
                      }}
                    >
                      /images/calculadora-info-2.png
                    </code>
                  </p>
                  <p style={{ fontSize: "0.85rem", opacity: 0.8, marginTop: "1rem" }}>
                    Tamaño recomendado: 600x400px
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Responsive */}
      <style>{`
        @media (max-width: 1024px) {
          .two-column-layout {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default HomePage;