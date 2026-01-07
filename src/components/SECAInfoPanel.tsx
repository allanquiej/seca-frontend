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
    success: "#22c55e",
  };

  // ✅ BASE SOLO PARA FAMILIA TIPOGRÁFICA (sin fontSize/lineHeight) -> evita warnings
  const BASE_FONT: React.CSSProperties = {
    fontFamily:
      'system-ui, -apple-system, "Segoe UI", Roboto, Arial, "Noto Sans", "Helvetica Neue", sans-serif',
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

  const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h3
      style={{
        ...BASE_FONT,
        marginTop: 0,
        marginBottom: "0.55rem",
        fontSize: "1.22rem",
        fontWeight: 900,
        letterSpacing: "0.2px",
      }}
    >
      {children}
    </h3>
  );

  const Pill: React.FC<{ text: string }> = ({ text }) => (
    <span
      style={{
        ...BASE_FONT,
        display: "inline-flex",
        alignItems: "center",
        padding: "0.55rem 0.85rem",
        borderRadius: "999px",
        border: `1px solid ${SECA.border}`,
        background: "rgba(255,255,255,0.12)",
        color: SECA.textSoft,
        fontWeight: 800,
        fontSize: "1.02rem",
        lineHeight: 1,
      }}
    >
      {text}
    </span>
  );

  const GoalBadge: React.FC<{ text: string }> = ({ text }) => (
    <span
      style={{
        ...BASE_FONT,
        display: "inline-flex",
        alignItems: "center",
        padding: "0.55rem 0.95rem",
        borderRadius: "999px",
        background: SECA.success,
        color: SECA.white,
        fontWeight: 900,
        border: `1px solid rgba(255,255,255,0.18)`,
        boxShadow: "0 10px 18px rgba(0,0,0,0.22)",
        fontSize: "1.03rem",
        lineHeight: 1,
      }}
    >
      {text}
    </span>
  );

  const renderContenido = () => {
    switch (tabActiva) {
      case "inicio":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.05rem" }}>
            {/* ✅ LOGO: NO SE ESTIRA */}
            <img
              src="/images/logo3.png"
              alt="SECA"
              style={{
                height: 70,
                width: "auto",
                maxWidth: 260,
                display: "block",
                marginBottom: "0.25rem",
                filter: "drop-shadow(0 8px 14px rgba(0,0,0,0.35))",
                objectFit: "contain",
              }}
            />

            <h2
              style={{
                ...BASE_FONT,
                marginTop: 0,
                marginBottom: "0.2rem",
                fontSize: "1.65rem",
                fontWeight: 950 as any,
                letterSpacing: "0.2px",
                lineHeight: 1.2,
              }}
            >
              Servicios Especializados de Contabilidad y Auditoría
            </h2>

            <Card strong>
              <p
                style={{
                  ...BASE_FONT,
                  margin: 0,
                  fontWeight: 950 as any,
                  letterSpacing: "0.2px",
                  fontSize: "1.18rem",
                }}
              >
                ✨ 18 años de experiencia
              </p>

              <p style={{ ...BASE_FONT, marginTop: "0.6rem", marginBottom: 0, color: SECA.textSoft }}>
                Somos un equipo de profesionales con 18 años de experiencia en el ramo contable, fiscal y
                financiero, apoyando a empresas guatemaltecas y extranjeras en el cumplimiento de sus
                obligaciones tributarias y el logro de sus objetivos de crecimiento.
              </p>
            </Card>

            <SectionTitle>¿Quiénes somos?</SectionTitle>

            <Card>
              <p style={{ ...BASE_FONT, margin: 0, color: SECA.textSoft }}>
                Brindamos asesorías y consultorías empresariales con el acompañamiento de expertos,
                incluyendo apoyo en áreas legales, para garantizar a nuestros clientes el éxito de sus
                inversiones, ahorrándoles tiempo y dinero, protegiendo sus ganancias con soluciones claras y
                oportunas.
              </p>
            </Card>

            <SectionTitle>¿Qué hacemos?</SectionTitle>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.65rem" }}>
              <Pill text="📊 Contabilidad" />
              <Pill text="🏢 Integración Empresarial" />
              <Pill text="📋 Auditoría" />
              <Pill text="👥 Nóminas y Planilla" />
              <Pill text="🤝 Outsourcing" />
              <Pill text="🧾 Asesoría Fiscal y Tributaria" />
              <Pill text="🧩 Trámites y Gestiones" />
              <Pill text="💻 Tecnología y Sistemas" />
            </div>

            <SectionTitle>Nuestros principios</SectionTitle>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.95rem" }}>
              {[
                ["⚙️ Principios Morales", "Nuestro trabajo se hace con eficiencia y profesionalismo, aplicando las leyes tributarias para los datos financieros de cada uno de nuestros clientes."],
                ["🔒 Principios Éticos", "Manejamos su información con confidencialidad y discreción para brindar seguridad y confianza."],
                ["📅 Responsabilidad", "Comprometidos a cumplir los acuerdos pactados con nuestros clientes, según los lineamientos descritos y firmados."],
                ["🤝 Confianza", "Mantenemos discreción en el manejo de la papelería y documentos financieros; no se divulgan datos personales ni empresariales."],
                ["🎓 Profesionalismo", "Respeto por todos nuestros clientes sin importar su estatus económico o social; brindamos nuestros servicios profesionalmente por igual."],
                ["⚖️ Honestidad", "Somos claros, concisos y directos en nuestro trabajo, aplicando soluciones sin ensuciar nuestros principios."],
                ["✅ Compromiso", "Con cada cliente que confía sus tributaciones; trabajamos con exactitud y puntualidad según lo demandan las entidades públicas."],
                ["💡 Creatividad", "Presentamos soluciones prácticas, efectivas y aplicables para responder a las necesidades de nuestros clientes."],
              ].map(([t, d]) => (
                <Card key={t}>
                  <strong style={{ ...BASE_FONT, fontSize: "1.12rem" }}>{t}</strong>
                  <p style={{ ...BASE_FONT, margin: "0.5rem 0 0", color: SECA.textSoft }}>{d}</p>
                </Card>
              ))}
            </div>

            {/* ✅ sin cursiva */}
            <Card>
              <p style={{ ...BASE_FONT, margin: 0, color: SECA.textSoft }}>
                💡 <strong style={{ ...BASE_FONT, color: SECA.white }}>Nuestra misión:</strong>{" "}
                Ahorrarle tiempo y dinero, protegiendo sus ganancias con soluciones claras y oportunas.
              </p>
            </Card>

            <Card strong>
              <p style={{ ...BASE_FONT, margin: 0, fontWeight: 950 as any, fontSize: "1.22rem" }}>
                🤝 ¿Listo para ordenar tu contabilidad?
              </p>
              <p style={{ ...BASE_FONT, marginTop: "0.6rem", marginBottom: 0, color: SECA.textSoft }}>
                Podemos ayudarte a cumplir con SAT e IGSS, optimizar tu control financiero y tomar mejores
                decisiones con información clara.
              </p>

              <div style={{ marginTop: "0.9rem", display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
                <GoalBadge text="Asesoría" />
                <GoalBadge text="Cumplimiento" />
                <GoalBadge text="Orden financiero" />
              </div>
            </Card>
          </div>
        );

      case "servicios":
        return (
          <>
            <h2 style={{ ...BASE_FONT, marginTop: 0, marginBottom: "0.75rem", fontSize: "1.5rem", fontWeight: 900 }}>
              Servicios
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {[
                ["📊 Contabilidad completa", "Desde pequeño contribuyente hasta utilidades, con control y soporte profesional."],
                ["📋 Auditoría", "Interna, externa y fiscal, orientada a cumplimiento y decisiones estratégicas."],
                ["💼 Nóminas y planillas", "Gestión, prestaciones y trámites relacionados."],
                ["🎯 Asesoría empresarial", "Planificación fiscal, orden financiero y acompañamiento."],
                ["⚙️ Tecnología y sistemas", "Soluciones y automatización para procesos contables."],
              ].map(([t, d]) => (
                <Card key={t}>
                  <strong style={{ ...BASE_FONT }}>{t}</strong>
                  <p style={{ ...BASE_FONT, margin: "0.4rem 0 0", color: SECA.textSoft }}>{d}</p>
                </Card>
              ))}
            </div>
          </>
        );

      case "principios":
        return (
          <>
            <h2 style={{ ...BASE_FONT, marginTop: 0, marginBottom: "0.75rem", fontSize: "1.5rem", fontWeight: 900 }}>
              Principios
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {[
                ["🔒 Confidencialidad", "Manejamos su información con discreción y seguridad."],
                ["⚖️ Honestidad", "Claridad y transparencia en cada recomendación."],
                ["🎓 Profesionalismo", "Calidad y respeto, sin importar el tamaño del cliente."],
                ["📅 Compromiso", "Cumplimiento puntual y orden en cada proceso."],
                ["💡 Creatividad", "Soluciones prácticas y aplicables a su realidad."],
              ].map(([t, d]) => (
                <Card key={t}>
                  <strong style={{ ...BASE_FONT }}>{t}</strong>
                  <p style={{ ...BASE_FONT, margin: "0.4rem 0 0", color: SECA.textSoft }}>{d}</p>
                </Card>
              ))}
            </div>
          </>
        );

      case "contacto":
        return (
          <>
            <h2 style={{ ...BASE_FONT, marginTop: 0, marginBottom: "0.75rem", fontSize: "1.5rem", fontWeight: 900 }}>
              Contacto
            </h2>

            <Card strong>
              <p style={{ ...BASE_FONT, margin: 0, color: SECA.textSoft, lineHeight: 1.65 }}>
                <strong style={{ ...BASE_FONT, color: SECA.white }}>📧 Correo:</strong>{" "}
                <a href="mailto:info@secagt.com" style={{ color: SECA.white }}>
                  info@secagt.com
                </a>
                <br />
                <strong style={{ ...BASE_FONT, color: SECA.white }}>☎️ Teléfono:</strong> +502 0000-0000
                <br />
                <strong style={{ ...BASE_FONT, color: SECA.white }}>📍 Ubicación:</strong> Guatemala, Guatemala
              </p>
            </Card>

            <div style={{ marginTop: "1rem" }}>
              <Card>
                <p style={{ ...BASE_FONT, margin: 0, color: SECA.textMuted, fontSize: "1.02rem" }}>
                  <strong style={{ ...BASE_FONT }}>Nota:</strong> Estos datos están como ejemplo. Reemplázalos
                  por los reales.
                </p>
              </Card>
            </div>
          </>
        );
    }
  };

  const estiloTab = (activa: boolean): React.CSSProperties => ({
    ...BASE_FONT,
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
        position: "static",
        top: undefined,

        height: isMobile ? "auto" : "100%",
        minHeight: isMobile ? undefined : "100%",

        overflowY: "visible",

        marginTop: isMobile ? "1rem" : undefined,

        padding: "1.5rem",
        borderRadius: "1rem",
        color: SECA.white,

        background: `linear-gradient(135deg, ${SECA.navy2}, ${SECA.blue})`,
        boxShadow: "0 10px 40px rgba(0,0,0,0.35)",
        border: `1px solid ${SECA.border}`,

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

      {/* CONTENIDO (estandarizado) */}
      <div
        style={{
          ...BASE_FONT,
          color: SECA.white,
          fontSize: "1.18rem",
          lineHeight: 1.85,
          letterSpacing: "0.2px",
          fontStyle: "normal",
        }}
      >
        {renderContenido()}
      </div>

{!isMobile && (
  <div
    style={{
      position: "relative",
      width: "100%",
      height: 220, // ⬅️ controla qué tanto espacio ocupa
      marginTop: "1.5rem",
      borderRadius: "0.75rem",
      overflow: "hidden",
    }}
  >
    {/* IMAGEN */}
    <img
      src="/images/conta2.png"
      alt="SECA ilustración"
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover", // ⬅️ CLAVE: la hace ancha, tipo banner
      }}
    />

    {/* OVERLAY AZUL (NO OPACITY EN LA IMAGEN) */}
    {!isMobile && (
  <div
  style={{
    position: "relative",
    width: "100%",
    height: isMobile ? 140 : 220, // ✅ móvil más bajo, PC más alto
    marginTop: "1.5rem",
    borderRadius: "0.75rem",
    overflow: "hidden",
  }}
>
  <img
    src="/images/panel-illustration.png"
    alt="SECA ilustración"
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block",
    }}
  />
</div>

)}

  </div>
)}


    </div>
  );
};

export default SECAInfoPanel;
