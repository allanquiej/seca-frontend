// src/components/SECAInfoPanel.tsx
import { useEffect, useState } from "react";

type Tab = "inicio" | "servicios" | "principios" | "contacto";

const SECAInfoPanel: React.FC = () => {
  const [tabActiva, setTabActiva] = useState<Tab>("inicio");

  // ====== DETECTAR MÓVIL ======
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 900);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ====== PALETA EXACTA (MISMA QUE App.tsx) ======
  const SECA = {
    navy: "#0F0E3B",
    navy2: "#0E234F",
    blue: "#2252EC",
    accent: "#229EFE",
    cyan: "#3EFDFD",
    white: "#FFFFFF",
    border: "rgba(255,255,255,0.15)",
    panelGlass: "rgba(15,14,59,0.55)",
    cardGlass: "rgba(15,14,59,0.38)",
    cardGlassStrong: "rgba(15,14,59,0.50)",
    textSoft: "rgba(255,255,255,0.92)",
    textMuted: "rgba(255,255,255,0.78)",
  };

  const Card: React.FC<{ children: React.ReactNode; strong?: boolean }> = ({
    children,
    strong,
  }) => (
    <div
      style={{
        padding: "1rem",
        borderRadius: "0.75rem",
        background: strong ? SECA.cardGlassStrong : SECA.cardGlass,
        border: `1px solid ${SECA.border}`,
      }}
    >
      {children}
    </div>
  );

  const renderContenido = () => {
    switch (tabActiva) {
      case "inicio":
        return (
          <>
            <img
              src="/images/logo3.png"
              alt="SECA"
              style={{
                height: 64,
                width: "auto",
                display: "block",
                marginBottom: "1rem",
                filter: "drop-shadow(0 8px 14px rgba(0,0,0,0.35))",
              }}
            />

            <h2 style={{ marginTop: 0, marginBottom: "0.75rem" }}>
              Servicios Especializados de Contabilidad y Auditoría
            </h2>

            <Card strong>
              <p style={{ margin: 0, fontWeight: 800 }}>
                ✨ 18 años de experiencia
              </p>
              <p
                style={{
                  marginTop: "0.55rem",
                  marginBottom: 0,
                  color: SECA.textSoft,
                  lineHeight: 1.55,
                }}
              >
                Apoyando a empresas guatemaltecas y extranjeras en el cumplimiento
                de sus obligaciones tributarias y el logro de sus objetivos de crecimiento.
              </p>
            </Card>

            <h3 style={{ marginTop: "1.25rem", marginBottom: "0.5rem" }}>
              ¿Qué hacemos?
            </h3>

            <ul style={{ lineHeight: 1.9, marginTop: 0, color: SECA.textSoft }}>
              <li>Contabilidad y auditoría especializada</li>
              <li>Asesoría fiscal y tributaria personalizada</li>
              <li>Gestión de planillas y recursos humanos</li>
              <li>Trámites ante SAT e IGSS</li>
              <li>Desarrollo de sistemas contables</li>
            </ul>

            <div style={{ marginTop: "1.25rem" }}>
              <Card>
                <p
                  style={{
                    margin: 0,
                    fontStyle: "italic",
                    color: SECA.textSoft,
                    lineHeight: 1.55,
                  }}
                >
                  💡 <strong style={{ color: SECA.white }}>Nuestra misión:</strong>{" "}
                  Ahorrarle tiempo y dinero, protegiendo sus ganancias con soluciones claras y oportunas.
                </p>
              </Card>
            </div>
          </>
        );

      case "servicios":
        return (
          <>
            <h2 style={{ marginTop: 0, marginBottom: "0.75rem" }}>Servicios</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <Card>
                <strong>📊 Contabilidad completa</strong>
                <p style={{ margin: "0.4rem 0 0", color: SECA.textSoft, lineHeight: 1.55 }}>
                  Desde pequeño contribuyente hasta utilidades, con control y soporte profesional.
                </p>
              </Card>

              <Card>
                <strong>📋 Auditoría</strong>
                <p style={{ margin: "0.4rem 0 0", color: SECA.textSoft, lineHeight: 1.55 }}>
                  Interna, externa y fiscal, orientada a cumplimiento y decisiones estratégicas.
                </p>
              </Card>

              <Card>
                <strong>💼 Nóminas y planillas</strong>
                <p style={{ margin: "0.4rem 0 0", color: SECA.textSoft, lineHeight: 1.55 }}>
                  Gestión, prestaciones y trámites relacionados.
                </p>
              </Card>

              <Card>
                <strong>🎯 Asesoría empresarial</strong>
                <p style={{ margin: "0.4rem 0 0", color: SECA.textSoft, lineHeight: 1.55 }}>
                  Planificación fiscal, orden financiero y acompañamiento.
                </p>
              </Card>

              <Card>
                <strong>⚙️ Tecnología y sistemas</strong>
                <p style={{ margin: "0.4rem 0 0", color: SECA.textSoft, lineHeight: 1.55 }}>
                  Soluciones y automatización para procesos contables.
                </p>
              </Card>
            </div>
          </>
        );

      case "principios":
        return (
          <>
            <h2 style={{ marginTop: 0, marginBottom: "0.75rem" }}>Principios</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {[
                ["🔒 Confidencialidad", "Manejamos su información con discreción y seguridad."],
                ["⚖️ Honestidad", "Claridad y transparencia en cada recomendación."],
                ["🎓 Profesionalismo", "Calidad y respeto, sin importar el tamaño del cliente."],
                ["📅 Compromiso", "Cumplimiento puntual y orden en cada proceso."],
                ["💡 Creatividad", "Soluciones prácticas y aplicables a su realidad."],
              ].map(([t, d]) => (
                <Card key={t}>
                  <strong>{t}</strong>
                  <p style={{ margin: "0.4rem 0 0", color: SECA.textSoft, lineHeight: 1.55 }}>
                    {d}
                  </p>
                </Card>
              ))}
            </div>
          </>
        );

      case "contacto":
        return (
          <>
            <h2 style={{ marginTop: 0, marginBottom: "0.75rem" }}>Contacto</h2>

            <Card strong>
              <p style={{ margin: 0, color: SECA.textSoft, lineHeight: 1.65 }}>
                <strong style={{ color: SECA.white }}>📧 Correo:</strong>{" "}
                <a href="mailto:info@secagt.com" style={{ color: SECA.white }}>
                  info@secagt.com
                </a>
                <br />
                <strong style={{ color: SECA.white }}>☎️ Teléfono:</strong> +502 0000-0000
                <br />
                <strong style={{ color: SECA.white }}>📍 Ubicación:</strong> Guatemala, Guatemala
              </p>
            </Card>

            <div style={{ marginTop: "1rem" }}>
              <Card>
                <p style={{ margin: 0, color: SECA.textMuted, fontSize: "0.9rem", lineHeight: 1.55 }}>
                  <strong>Nota:</strong> Estos datos están como ejemplo. Reemplázalos por los reales.
                </p>
              </Card>
            </div>
          </>
        );
    }
  };

  const estiloTab = (activa: boolean): React.CSSProperties => ({
    flex: 1,
    padding: "0.7rem",
    borderRadius: "0.6rem",
    border: activa ? "none" : `1px solid ${SECA.border}`,
    cursor: "pointer",
    fontWeight: 800,
    background: activa
      ? `linear-gradient(135deg, ${SECA.accent}, ${SECA.cyan})`
      : "rgba(255,255,255,0.10)",
    color: activa ? SECA.navy : SECA.white,
    boxShadow: activa ? "0 10px 18px rgba(0,0,0,0.25)" : "none",
  });

  return (
    <div
      style={{
        // ✅ AHORA: móvil y PC se comportan igual (panel en flujo, se mueve con el scroll)
        position: "static",
        top: undefined,

        // ✅ CLAVE: en PC se estira para llenar el alto de la columna
        height: isMobile ? "auto" : "100%",
        minHeight: isMobile ? undefined : "100%",

        // ✅ nada de recortes
        overflowY: "visible",

        // separación solo cuando cae abajo en móvil
        marginTop: isMobile ? "1rem" : undefined,

        padding: "1.5rem",
        borderRadius: "1rem",
        color: SECA.white,

        background: `linear-gradient(135deg, ${SECA.navy2}, ${SECA.blue})`,
        boxShadow: "0 10px 40px rgba(0,0,0,0.35)",
        border: `1px solid ${SECA.border}`,

        // ✅ ayuda visual para que el contenido se distribuya arriba
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* TABS */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: "1.25rem",
          flexWrap: isMobile ? "wrap" : "nowrap",
        }}
      >
        <button style={estiloTab(tabActiva === "inicio")} onClick={() => setTabActiva("inicio")}>
          Inicio
        </button>
        <button style={estiloTab(tabActiva === "servicios")} onClick={() => setTabActiva("servicios")}>
          Servicios
        </button>
        <button style={estiloTab(tabActiva === "principios")} onClick={() => setTabActiva("principios")}>
          Principios
        </button>
        <button style={estiloTab(tabActiva === "contacto")} onClick={() => setTabActiva("contacto")}>
          Contacto
        </button>
      </div>

      {/* CONTENIDO */}
      <div style={{ color: SECA.white }}>{renderContenido()}</div>

      {/* ✅ “relleno” invisible para asegurar que el panel tome todo el alto cuando la columna estira */}
      {!isMobile && <div style={{ flex: 1 }} />}
    </div>
  );
};

export default SECAInfoPanel;
