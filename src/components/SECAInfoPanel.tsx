// src/components/SECAInfoPanel.tsx
import { useState } from "react";

type Tab = "inicio" | "servicios" | "principios" | "contacto";

/**
 * Panel informativo de SECA que se muestra a la izquierda
 * mientras el usuario usa las calculadoras
 */
const SECAInfoPanel: React.FC = () => {
  const [tabActiva, setTabActiva] = useState<Tab>("inicio");

  const renderContenido = () => {
    switch (tabActiva) {
      case "inicio":
        return (
          <div>
            <div style={{ 
              width: "80px", 
              height: "80px", 
              background: "linear-gradient(135deg, #1d4ed8, #38bdf8)",
              borderRadius: "50%",
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem",
              fontWeight: "bold",
              color: "white"
            }}>
              SECA
            </div>
            
            <h2 style={{ marginTop: 0, marginBottom: "1rem", fontSize: "1.75rem" }}>
              Servicios Especializados de Contabilidad y Auditoría
            </h2>
            
            <div style={{
              padding: "1rem",
              borderRadius: "0.5rem",
              background: "rgba(29, 78, 216, 0.1)",
              marginBottom: "1rem"
            }}>
              <h3 style={{ marginTop: 0, color: "#1d4ed8" }}>
                ✨ 18 años de experiencia
              </h3>
              <p style={{ marginBottom: 0 }}>
                Apoyando a empresas guatemaltecas y extranjeras en el cumplimiento 
                de sus obligaciones tributarias y el logro de sus objetivos de crecimiento.
              </p>
            </div>

            <h3 style={{ color: "#1d4ed8" }}>¿Qué hacemos?</h3>
            <ul style={{ lineHeight: 1.8 }}>
              <li><strong>Contabilidad y auditoría</strong> especializada</li>
              <li><strong>Asesoría fiscal y tributaria</strong> personalizada</li>
              <li><strong>Gestión de planillas</strong> y recursos humanos</li>
              <li><strong>Trámites ante SAT e IGSS</strong></li>
              <li><strong>Desarrollo de sistemas</strong> contables</li>
            </ul>

            <div style={{
              padding: "1rem",
              borderRadius: "0.5rem",
              background: "linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(74, 222, 128, 0.1))",
              marginTop: "1.5rem"
            }}>
              <p style={{ margin: 0, fontStyle: "italic" }}>
                💡 <strong>Nuestra misión:</strong> Ahorrarle tiempo y dinero, 
                protegiendo sus ganancias con soluciones claras y oportunas.
              </p>
            </div>
          </div>
        );

      case "servicios":
        return (
          <div>
            <h2 style={{ marginTop: 0, marginBottom: "1rem" }}>
              Nuestros Servicios
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{
                padding: "1rem",
                borderRadius: "0.5rem",
                border: "2px solid #1d4ed8",
                background: "rgba(29, 78, 216, 0.05)"
              }}>
                <h3 style={{ margin: 0, marginBottom: "0.5rem", color: "#1d4ed8" }}>
                  📊 Contabilidad Completa
                </h3>
                <p style={{ margin: 0, fontSize: "0.9rem" }}>
                  Desde pequeño contribuyente hasta régimen de utilidades. 
                  Contabilidad externa e interna con tecnología de punta.
                </p>
              </div>

              <div style={{
                padding: "1rem",
                borderRadius: "0.5rem",
                border: "2px solid #1d4ed8",
                background: "rgba(29, 78, 216, 0.05)"
              }}>
                <h3 style={{ margin: 0, marginBottom: "0.5rem", color: "#1d4ed8" }}>
                  📋 Auditoría Profesional
                </h3>
                <p style={{ margin: 0, fontSize: "0.9rem" }}>
                  Interna, externa, fiscal y operacional. Análisis de estados 
                  financieros para toma de decisiones estratégicas.
                </p>
              </div>

              <div style={{
                padding: "1rem",
                borderRadius: "0.5rem",
                border: "2px solid #1d4ed8",
                background: "rgba(29, 78, 216, 0.05)"
              }}>
                <h3 style={{ margin: 0, marginBottom: "0.5rem", color: "#1d4ed8" }}>
                  💼 Nóminas y Planillas
                </h3>
                <p style={{ margin: 0, fontSize: "0.9rem" }}>
                  Gestión completa de planillas, cálculo de prestaciones, 
                  indemnizaciones, contratos y trámites IGSS.
                </p>
              </div>

              <div style={{
                padding: "1rem",
                borderRadius: "0.5rem",
                border: "2px solid #1d4ed8",
                background: "rgba(29, 78, 216, 0.05)"
              }}>
                <h3 style={{ margin: 0, marginBottom: "0.5rem", color: "#1d4ed8" }}>
                  🎯 Asesoría Empresarial
                </h3>
                <p style={{ margin: 0, fontSize: "0.9rem" }}>
                  Integración empresarial, coaching para emprendedores, 
                  planificación fiscal y estrategias de crecimiento.
                </p>
              </div>

              <div style={{
                padding: "1rem",
                borderRadius: "0.5rem",
                border: "2px solid #1d4ed8",
                background: "rgba(29, 78, 216, 0.05)"
              }}>
                <h3 style={{ margin: 0, marginBottom: "0.5rem", color: "#1d4ed8" }}>
                  ⚙️ Tecnología y Sistemas
                </h3>
                <p style={{ margin: 0, fontSize: "0.9rem" }}>
                  Desarrollo de software contable personalizado. Sistemas web 
                  multiplataforma con Business Intelligence.
                </p>
              </div>
            </div>

            <div style={{
              marginTop: "1.5rem",
              padding: "1rem",
              borderRadius: "0.5rem",
              background: "linear-gradient(135deg, rgba(234, 179, 8, 0.1), rgba(250, 204, 21, 0.1))",
              border: "2px solid #eab308"
            }}>
              <p style={{ margin: 0, fontSize: "0.95rem" }}>
                <strong>💰 Paquetes desde Q150/mes</strong><br />
                Contabilidad para pequeño contribuyente con todos los servicios básicos.
              </p>
            </div>
          </div>
        );

      case "principios":
        return (
          <div>
            <h2 style={{ marginTop: 0, marginBottom: "1rem" }}>
              Nuestros Principios
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{
                padding: "0.75rem",
                borderLeft: "4px solid #1d4ed8",
                background: "rgba(29, 78, 216, 0.05)"
              }}>
                <h4 style={{ margin: 0, marginBottom: "0.25rem", color: "#1d4ed8" }}>
                  🔒 Confidencialidad
                </h4>
                <p style={{ margin: 0, fontSize: "0.9rem" }}>
                  Manejamos su información con total discreción para brindar 
                  seguridad y confianza.
                </p>
              </div>

              <div style={{
                padding: "0.75rem",
                borderLeft: "4px solid #1d4ed8",
                background: "rgba(29, 78, 216, 0.05)"
              }}>
                <h4 style={{ margin: 0, marginBottom: "0.25rem", color: "#1d4ed8" }}>
                  ⚖️ Honestidad
                </h4>
                <p style={{ margin: 0, fontSize: "0.9rem" }}>
                  Claros, concisos y directos en nuestro trabajo, aplicando 
                  soluciones sin comprometer nuestros principios.
                </p>
              </div>

              <div style={{
                padding: "0.75rem",
                borderLeft: "4px solid #1d4ed8",
                background: "rgba(29, 78, 216, 0.05)"
              }}>
                <h4 style={{ margin: 0, marginBottom: "0.25rem", color: "#1d4ed8" }}>
                  🎓 Profesionalismo
                </h4>
                <p style={{ margin: 0, fontSize: "0.9rem" }}>
                  Respeto por todos nuestros clientes, sin importar su estatus. 
                  Servicios profesionales por igual.
                </p>
              </div>

              <div style={{
                padding: "0.75rem",
                borderLeft: "4px solid #1d4ed8",
                background: "rgba(29, 78, 216, 0.05)"
              }}>
                <h4 style={{ margin: 0, marginBottom: "0.25rem", color: "#1d4ed8" }}>
                  📅 Compromiso
                </h4>
                <p style={{ margin: 0, fontSize: "0.9rem" }}>
                  Cumplimos los acuerdos pactados con exactitud y puntualidad 
                  en sus tributaciones.
                </p>
              </div>

              <div style={{
                padding: "0.75rem",
                borderLeft: "4px solid #1d4ed8",
                background: "rgba(29, 78, 216, 0.05)"
              }}>
                <h4 style={{ margin: 0, marginBottom: "0.25rem", color: "#1d4ed8" }}>
                  💡 Creatividad
                </h4>
                <p style={{ margin: 0, fontSize: "0.9rem" }}>
                  Presentamos soluciones prácticas, efectivas y aplicables para 
                  responder a sus necesidades.
                </p>
              </div>
            </div>

            <div style={{
              marginTop: "1.5rem",
              padding: "1rem",
              borderRadius: "0.5rem",
              background: "linear-gradient(135deg, rgba(29, 78, 216, 0.1), rgba(56, 189, 248, 0.1))"
            }}>
              <p style={{ margin: 0, fontWeight: "bold", textAlign: "center" }}>
                "Protegemos sus finanzas con eficiencia y profesionalismo"
              </p>
            </div>
          </div>
        );

      case "contacto":
        return (
          <div>
            <h2 style={{ marginTop: 0, marginBottom: "1rem" }}>
              Contáctanos
            </h2>

            <div style={{
              padding: "1.5rem",
              borderRadius: "0.75rem",
              background: "linear-gradient(135deg, rgba(29, 78, 216, 0.1), rgba(56, 189, 248, 0.1))",
              marginBottom: "1rem"
            }}>
              <h3 style={{ marginTop: 0, marginBottom: "1rem", color: "#1d4ed8" }}>
                📞 Información de Contacto
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <strong style={{ color: "#1d4ed8" }}>📧 Correo Electrónico:</strong><br />
                  <a href="mailto:info@secagt.com" style={{ color: "#1d4ed8" }}>
                    info@secagt.com
                  </a>
                </div>

                <div>
                  <strong style={{ color: "#1d4ed8" }}>☎️ Teléfono:</strong><br />
                  <span>+502 0000-0000</span>
                </div>

                <div>
                  <strong style={{ color: "#1d4ed8" }}>📱 WhatsApp:</strong><br />
                  <span>+502 0000-0000</span>
                </div>

                <div>
                  <strong style={{ color: "#1d4ed8" }}>📍 Ubicación:</strong><br />
                  <span>Guatemala, Guatemala</span>
                </div>
              </div>
            </div>

            <div style={{
              padding: "1rem",
              borderRadius: "0.5rem",
              background: "rgba(34, 197, 94, 0.1)",
              border: "2px solid #22c55e"
            }}>
              <h3 style={{ marginTop: 0, marginBottom: "0.75rem", color: "#15803d" }}>
                🎁 Oferta Especial
              </h3>
              <p style={{ margin: 0, fontSize: "0.9rem" }}>
                <strong>Primera consulta GRATIS</strong><br />
                Contáctanos y recibe asesoría sin compromiso sobre tus 
                necesidades contables y fiscales.
              </p>
            </div>

            <div style={{
              marginTop: "1.5rem",
              padding: "0.75rem",
              borderRadius: "0.5rem",
              background: "rgba(239, 68, 68, 0.1)",
              fontSize: "0.85rem",
              color: "#7f1d1d"
            }}>
              <strong>Nota:</strong> Los datos de contacto mostrados son de ejemplo. 
              Actualiza con la información real de SECA.
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const estiloBoton = (activo: boolean): React.CSSProperties => ({
    flex: 1,
    padding: "0.75rem 1rem",
    borderRadius: "0.5rem",
    border: "none",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: 600,
    background: activo
      ? "linear-gradient(135deg, #1d4ed8, #38bdf8)"
      : "#e5e7eb",
    color: activo ? "white" : "#4b5563",
    transition: "all 0.2s",
  });

  return (
    <div
      style={{
        position: "sticky",
        top: "80px", // Se queda pegado al hacer scroll
        height: "calc(100vh - 100px)",
        overflowY: "auto",
        background: "white",
        borderRadius: "1rem",
        padding: "1.5rem",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
      }}
    >
      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
        }}
      >
        <button
          style={estiloBoton(tabActiva === "inicio")}
          onClick={() => setTabActiva("inicio")}
        >
          Inicio
        </button>
        <button
          style={estiloBoton(tabActiva === "servicios")}
          onClick={() => setTabActiva("servicios")}
        >
          Servicios
        </button>
        <button
          style={estiloBoton(tabActiva === "principios")}
          onClick={() => setTabActiva("principios")}
        >
          Principios
        </button>
        <button
          style={estiloBoton(tabActiva === "contacto")}
          onClick={() => setTabActiva("contacto")}
        >
          Contacto
        </button>
      </div>

      {/* Contenido */}
      <div style={{ color: "#0f172a" }}>{renderContenido()}</div>
    </div>
  );
};

export default SECAInfoPanel;