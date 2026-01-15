// src/components/SECAInfoPanel.tsx
import { useEffect, useState } from "react";

const SECA = {
  navy: "#0F0E3B",
  navy2: "#0E234F",
  blue: "#2252EC",
  cyan: "#3EFDFD",
  cyan2: "#229EFE",
  white: "#FFFFFF",
  border: "rgba(255,255,255,0.15)",
  panelGlass: "rgba(15,14,59,0.22)",
  textSoft: "rgba(255,255,255,0.92)",
  textMuted: "rgba(255,255,255,0.78)",
  success: "#22c55e",
};

const BASE_FONT = {
  fontFamily:
    "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji'",
  fontWeight: 500,
};

type Tab = "inicio" | "servicios" | "principios" | "contacto";

const Card = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      background: "rgba(15,14,59,0.20)",
      border: `1px solid ${SECA.border}`,
      borderRadius: "0.85rem",
      padding: "0.9rem 1rem",
      boxShadow: "0 8px 22px rgba(0,0,0,0.22)",
      backdropFilter: "blur(8px)",
    }}
  >
    {children}
  </div>
);

const Pill = ({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    style={{
      ...BASE_FONT,
      cursor: "pointer",
      border: `1px solid ${active ? "rgba(255,255,255,0.40)" : SECA.border}`,
      background: active
        ? "linear-gradient(135deg, rgba(34,158,254,0.75), rgba(62,253,253,0.55))"
        : "rgba(255,255,255,0.08)",
      color: SECA.white,
      padding: "0.75rem 1.5rem",
      borderRadius: "999px",
      fontWeight: 700,
      fontSize: "1.05rem",
      boxShadow: active ? "0 10px 22px rgba(0,0,0,0.25)" : "none",
      transition: "all .15s ease",
      whiteSpace: "nowrap",
      flex: 1,
      minWidth: "fit-content",
    }}
  >
    {children}
  </button>
);

const SECAInfoPanel = () => {
  const [tabActiva, setTabActiva] = useState<Tab>("inicio");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const renderBottomImage = () => (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: 220,
        marginTop: "1.5rem",
        borderRadius: "0.75rem",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      <img
        src="/images/conta2.png"
        alt="SECA ilustración"
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  );

  const renderContenido = () => {
    switch (tabActiva) {
      case "inicio":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.05rem" }}>
            <h2 style={{ margin: 0, fontSize: "1.65rem" }}>
              Servicios Especializados de Contabilidad y Auditoría
            </h2>

            <Card>
              <strong>✨ 18 años de experiencia</strong>
              <p style={{ margin: "0.45rem 0 0", color: SECA.textSoft }}>
                Somos un equipo de profesionales con 18 años de experiencia en el ramo
                contable, fiscal y financiero, apoyando a empresas guatemaltecas y extranjeras
                en el cumplimiento de sus obligaciones tributarias y el logro de sus objetivos
                de crecimiento.
              </p>
            </Card>

            <h3 style={{ margin: "0.25rem 0 0" }}>¿Quiénes somos?</h3>
            <Card>
              <p style={{ margin: 0, color: SECA.textSoft }}>
                Brindamos asesorías y consultorías empresariales con el acompañamiento de expertos,
                incluyendo apoyo en áreas legales, para garantizar a nuestros clientes el éxito de sus
                inversiones, ahorrándoles tiempo y dinero, protegiendo sus ganancias con soluciones claras
                y oportunas.
              </p>
            </Card>

            <h3 style={{ margin: "0.25rem 0 0" }}>¿Qué hacemos?</h3>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {[
                "📊 Contabilidad",
                "🏢 Integración Empresarial",
                "📋 Auditoría",
                "👥 Nóminas y Planilla",
                "🤝 Outsourcing",
                "🧾 Asesoría Fiscal y Tributaria",
                "🧩 Trámites y Gestiones",
                "💻 Tecnología y Sistemas",
              ].map((s) => (
                <span
                  key={s}
                  style={{
                    ...BASE_FONT,
                    padding: "0.35rem 0.7rem",
                    borderRadius: "999px",
                    border: `1px solid ${SECA.border}`,
                    background: "rgba(255,255,255,0.08)",
                    color: SECA.white,
                    fontWeight: 700,
                    fontSize: "0.9rem",
                  }}
                >
                  {s}
                </span>
              ))}
            </div>

            <h3 style={{ margin: "0.25rem 0 0" }}>Nuestros principios</h3>
            <Card>
              <strong>⚙️ Principios Morales</strong>
              <p style={{ margin: "0.45rem 0 0", color: SECA.textSoft }}>
                Nuestro trabajo se hace con eficiencia y profesionalismo, aplicando las leyes
                tributarias para los datos financieros de cada uno de nuestros clientes.
              </p>
            </Card>
            <Card>
              <strong>🔒 Principios Éticos</strong>
              <p style={{ margin: "0.45rem 0 0", color: SECA.textSoft }}>
                Manejamos su información con confidencialidad y discreción para brindar seguridad y confianza.
              </p>
            </Card>

            <Card>
              <strong>💡 Creatividad</strong>
              <p style={{ margin: "0.45rem 0 0", color: SECA.textSoft }}>
                Presentamos soluciones prácticas, efectivas y aplicables para responder a las necesidades de
                nuestros clientes.
              </p>
            </Card>

            <Card>
              <strong>💡 Nuestra misión:</strong>{" "}
              <span style={{ color: SECA.textSoft }}>
                Ahorrarle tiempo y dinero, protegiendo sus ganancias con soluciones claras y oportunas.
              </span>
            </Card>

            <Card>
              <strong>🤝 ¿Listo para ordenar tu contabilidad?</strong>
              <p style={{ margin: "0.45rem 0 0", color: SECA.textSoft }}>
                Podemos ayudarte a cumplir con SAT e IGSS, optimizar tu control financiero y tomar mejores decisiones
                con información clara.
              </p>

              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.75rem" }}>
                {["Asesoría", "Cumplimiento", "Orden financiero"].map((t) => (
                  <span
                    key={t}
                    style={{
                      ...BASE_FONT,
                      padding: "0.35rem 0.7rem",
                      borderRadius: "999px",
                      border: "1px solid rgba(255,255,255,0.25)",
                      background: "rgba(34,197,94,0.65)",
                      fontWeight: 700,
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </Card>

            {!isMobile && renderBottomImage()}
          </div>
        );

      case "servicios":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
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

            <p style={{ ...BASE_FONT, margin: 0, color: SECA.textSoft }}>
              Requisitos habituales: acceso a agencia virtual, libros/boletas/formularios del último año y hoja de
              omisos o inconsistencias (si aplica). Manejamos documentación con discreción, enviamos respaldos por
              correo y conservamos copia de seguridad.
            </p>

            <ul style={{ ...BASE_FONT, margin: 0, paddingLeft: "1.25rem", color: SECA.textSoft }}>
              <li>Envío mensual de libros y boletas</li>
              <li>Monitoreo para evitar inconsistencias en SAT</li>
              <li>Control de vencimientos y orden documental</li>
            </ul>

            {!isMobile && renderBottomImage()}
          </div>
        );

      case "principios":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <p style={{ ...BASE_FONT, margin: 0, color: SECA.textSoft }}>
              En SECA trabajamos bajo principios sólidos que garantizan confianza, orden y cumplimiento.
              Nuestra forma de trabajar está orientada a brindar seguridad, claridad y acompañamiento profesional
              a cada uno de nuestros clientes.
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
                <p style={{ ...BASE_FONT, margin: "0.4rem 0 0", color: SECA.textSoft, lineHeight: 1.55 }}>
                  {d}
                </p>
              </Card>
            ))}

            <p style={{ ...BASE_FONT, margin: 0, color: SECA.textSoft }}>
              Estos principios guían cada una de nuestras acciones y decisiones, permitiéndonos brindar un servicio
              confiable, profesional y alineado con la normativa vigente, enfocado en la estabilidad y crecimiento
              de nuestros clientes.
            </p>

            {!isMobile && renderBottomImage()}
          </div>
        );

      case "contacto":
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            <Card>
              <strong>📍 Dirección</strong>
              <p style={{ margin: "0.45rem 0 0", color: SECA.textSoft }}>
                2 Calle 14-41 Zona 4 de Mixco, Colonia Montereal, Guatemala
              </p>
            </Card>

            <Card>
              <strong>📞 Teléfonos</strong>
              <p style={{ margin: "0.45rem 0 0", color: SECA.textSoft }}>
                5124-7187 • 3132-5763
              </p>
            </Card>

            <Card>
              <strong>📧 Correo</strong>
              <p style={{ margin: "0.45rem 0 0", color: SECA.textSoft }}>
                multiservicioscox@gmail.com • contadorcox@gmail.com
              </p>
            </Card>

            <Card>
              <strong>🕘 Horario</strong>
              <p style={{ margin: "0.45rem 0 0", color: SECA.textSoft }}>
                Atención y coordinación por llamada o correo. Respuesta en horario laboral.
              </p>
            </Card>

            {!isMobile && renderBottomImage()}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      style={{
        position: "static",
        height: isMobile ? "auto" : "100%",
        minHeight: isMobile ? undefined : "100%",

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
      {/* ✅ LOGO SIEMPRE (ya no solo en Inicio) */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", marginBottom: "0.65rem" }}>
        <img src="/images/logo3.png" alt="SECA" style={{ height: 38 }} />
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          flexWrap: "wrap",
          marginBottom: "1rem",
        }}
      >
        <Pill active={tabActiva === "inicio"} onClick={() => setTabActiva("inicio")}>
          Inicio
        </Pill>
        <Pill active={tabActiva === "servicios"} onClick={() => setTabActiva("servicios")}>
          Servicios
        </Pill>
        <Pill active={tabActiva === "principios"} onClick={() => setTabActiva("principios")}>
          Principios
        </Pill>
        <Pill active={tabActiva === "contacto"} onClick={() => setTabActiva("contacto")}>
          Contacto
        </Pill>
      </div>

      {/* ✅ Contenido con flex:1 para que el fondo azul sea igual en todas las tabs */}
      <div
        style={{
          ...BASE_FONT,
          color: SECA.white,
          fontSize: "1.18rem",
          lineHeight: 1.85,
          letterSpacing: "0.2px",
          fontStyle: "normal",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
          overflowY: "auto",
        }}
      >
        {renderContenido()}
      </div>
    </div>
  );
};

export default SECAInfoPanel;