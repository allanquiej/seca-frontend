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
  {/* Texto introductorio (NO es tarjeta) */}
  <p style={{ ...BASE_FONT, margin: 0, color: SECA.textSoft }}>
    Atendemos Pequeño Contribuyente, Régimen Opcional Simplificado y Actividades Lucrativas, además de
    contabilidad administrativa y gestiones ante SAT. Nuestro enfoque es cumplimiento, orden y soporte
    para la toma de decisiones, con envío mensual de entregables.
  </p>

  {[
    [
      "📊 Contabilidad Pequeño Contribuyente",
      "Modalidad básica y premium: recepción y registro de documentos, contabilidad computarizada, libro electrónico de compras/ventas, preparación de IVA mensual y envío de boleta para pago. Incluye control de vencimientos y actualización RTU (según paquete).",
    ],
    [
      "🏢 Régimen Opcional Simplificado (ROS)",
      "Paquetes Básico/Media/Premium: libros electrónicos (compras/ventas y mayores), IVA e ISR mensual, ISR anual, envío de boletas/formularios, monitoreo de pagos para evitar inconsistencias y apoyo SAT en línea. Puede incluir estados financieros fiscales, conciliaciones y facturación electrónica (según paquete).",
    ],
    [
      "🏭 Régimen Actividades Lucrativas (RTO)",
      "Paquetes Básico/Media/Premium: IVA mensual, ISR e ISO trimestral, ISR anual, envío de boletas, proyecciones de impuestos e inventarios (si aplica). Incluye libros electrónicos, control de vencimientos, actualización RTU, y puede incorporar estados financieros, análisis y conciliaciones (según paquete).",
    ],
    [
      "📑 Contabilidad Administrativa",
      "Modalidad básica y completa: implementación de métodos contables, análisis de situación financiera y contable, control de libros, impuestos y seguimiento de pagos/presentaciones. Puede incluir visitas del asesor, digitación periódica, conciliaciones, planillas e IGSS, y reunión anual de resultados (según contratación).",
    ],
    [
      "👤 Profesionales e Independientes",
      "Servicio contable para profesionales por régimen: operación de documentación, libro electrónico de compras/ventas, preparación de impuestos y envío de boletas. Ideal para facturación mensual controlada.",
    ],
    [
      "🧾 Nóminas y Planillas",
      "Libro de salarios, recibos de pago, cálculo de prestaciones, y preparación de pagos a IGSS (el cliente envía la información con anticipación según vencimientos).",
    ],
    [
      "🧩 Gestiones ante SAT",
      "Solvencia fiscal, habilitación de facturación electrónica, inscripción y cambios de régimen (PC/ROS), agencia virtual sin ir a SAT, actualización de datos/RTU y patente de comercio (según requisitos).",
    ],
    [
      "🤝 Asesoría Fiscal y Empresarial",
      "Asesorías para decisiones y prevención de sanciones: revisión de estatus, coordinación de operaciones, sugerencias y acompañamiento ante requerimientos. También apoyamos con trámites y representación según necesidad.",
    ],
  ].map(([t, d]) => (
    <Card key={t}>
      <strong style={{ ...BASE_FONT }}>{t}</strong>
      <p style={{ ...BASE_FONT, margin: "0.4rem 0 0", color: SECA.textSoft }}>
        {d}
      </p>
    </Card>
  ))}

  {/* Texto final (NO es tarjeta) */}
  <p style={{ ...BASE_FONT, margin: 0, color: SECA.textSoft }}>
    Requisitos habituales: acceso a agencia virtual, libros/boletas/formularios del último año y hoja de omisos o inconsistencias (si aplica).
    Manejamos documentación con discreción, enviamos respaldos por correo y conservamos copia de seguridad.
  </p>

  {/* Lista final (NO es tarjeta) */}
  <ul style={{ ...BASE_FONT, margin: 0, paddingLeft: "1.25rem", color: SECA.textSoft }}>
    <li>Envío mensual de libros y boletas</li>
    <li>Monitoreo para evitar inconsistencias en SAT</li>
    <li>Control de vencimientos y orden documental</li>
  </ul>
</div>

          </>
        );

      case "principios":
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {/* Texto introductorio (NO es tarjeta) */}
      <p style={{ ...BASE_FONT, margin: 0, color: SECA.textSoft }}>
        En SECA trabajamos bajo principios sólidos que garantizan confianza, orden y
        cumplimiento. Nuestra forma de trabajar está orientada a brindar seguridad,
        claridad y acompañamiento profesional a cada uno de nuestros clientes.
      </p>

      {[
        [
          "⚙️ Principios Morales",
          "Nuestro trabajo se realiza con eficiencia y profesionalismo, aplicando correctamente la legislación tributaria y contable en cada operación financiera, priorizando el orden y la responsabilidad.",
        ],
        [
          "🔒 Principios Éticos",
          "Manejamos la información de nuestros clientes con confidencialidad y discreción, brindando seguridad en cada proceso y protegiendo los datos financieros y fiscales.",
        ],
        [
          "📅 Responsabilidad",
          "Cumplimos con los acuerdos y lineamientos establecidos, respetando plazos y obligaciones ante las entidades correspondientes, garantizando continuidad y seriedad en el servicio.",
        ],
        [
          "🤝 Confianza",
          "Toda la documentación es tratada de forma reservada. No divulgamos información y mantenemos comunicación clara, fortaleciendo relaciones profesionales a largo plazo.",
        ],
        [
          "🎓 Profesionalismo",
          "Atendemos a cada cliente con respeto, compromiso y calidad, sin distinción, ofreciendo soluciones adecuadas según su régimen y situación empresarial.",
        ],
        [
          "⚖️ Honestidad",
          "Somos claros y transparentes en cada asesoría, proponiendo soluciones reales y legales, siempre alineadas con los intereses y el cumplimiento del cliente.",
        ],
        [
          "✅ Compromiso",
          "Trabajamos con exactitud y puntualidad para cumplir obligaciones fiscales, contables y administrativas, minimizando riesgos y evitando sanciones.",
        ],
        [
          "💡 Creatividad",
          "Buscamos soluciones prácticas, efectivas y aplicables, adaptadas a la realidad de cada empresa o profesional, optimizando recursos y resultados.",
        ],
      ].map(([t, d]) => (
        <Card key={t}>
          <strong style={{ ...BASE_FONT }}>{t}</strong>
          <p
            style={{
              ...BASE_FONT,
              margin: "0.4rem 0 0",
              color: SECA.textSoft,
              lineHeight: 1.55,
            }}
          >
            {d}
          </p>
        </Card>
      ))}

      {/* Texto final (NO es tarjeta) */}
      <p style={{ ...BASE_FONT, margin: 0, color: SECA.textSoft }}>
        Estos principios guían cada una de nuestras acciones y decisiones, permitiéndonos
        brindar un servicio confiable, profesional y alineado con la normativa vigente,
        enfocado en la estabilidad y crecimiento de nuestros clientes.
      </p>
    </div>
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
