// src/components/SidebarInfo.tsx
import { useState } from "react";

type Seccion = "servicios" | "quienes" | "contacto";

const SidebarInfo: React.FC = () => {
  const [seccionActiva, setSeccionActiva] = useState<Seccion>("servicios");

  const renderContenido = () => {
    switch (seccionActiva) {
      case "servicios":
        return (
          <>
            <h3 style={{ marginTop: 0 }}>Servicios contables SECA</h3>
            <p>
              Acompañamos a empresas y profesionales independientes con
              soluciones contables claras, oportunas y alineadas a la
              legislación guatemalteca.
            </p>
            <ul style={{ paddingLeft: "1.2rem", lineHeight: 1.6 }}>
              <li>Asesoría fiscal y cumplimiento de obligaciones tributarias.</li>
              <li>Cálculo y revisión de ISR, IVA e ISO.</li>
              <li>Gestión de planillas laborales y prestaciones.</li>
              <li>Implementación y revisión de sistemas contables.</li>
            </ul>
          </>
        );
      case "quienes":
        return (
          <>
            <h3 style={{ marginTop: 0 }}>¿Quiénes somos?</h3>
            <p>
              SECA es una firma contable orientada a brindar acompañamiento
              práctico a pequeñas y medianas empresas, con enfoque en claridad,
              cumplimiento y responsabilidad.
            </p>
            <p>
              Nuestro equipo está conformado por profesionales con experiencia
              en contabilidad, auditoría e impuestos, listos para traducir la
              normativa en decisiones concretas para tu negocio.
            </p>
          </>
        );
      case "contacto":
        return (
          <>
            <h3 style={{ marginTop: 0 }}>Contacta al equipo SECA</h3>
            <p>
              Cuéntanos sobre tu empresa o necesidad y con gusto te
              responderemos:
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.4rem",
                marginTop: "0.5rem",
              }}
            >
              <div>
                <strong>Correo general:</strong>
                <br />
                <a href="mailto:info@seca.com.gt">info@seca.com.gt</a>
              </div>
              <div>
                <strong>Teléfono oficina:</strong>
                <br />
                <span>+502 0000-0000</span>
              </div>
              <div>
                <strong>WhatsApp atención:</strong>
                <br />
                <span>+502 0000-0000</span>
              </div>
            </div>
            <p
              style={{
                fontSize: "0.85rem",
                opacity: 0.8,
                marginTop: "0.75rem",
              }}
            >
              *Reemplaza estos datos por los reales de SECA cuando el cliente te
              los confirme.
            </p>
          </>
        );
      default:
        return null;
    }
  };

  const botonStyle = (activo: boolean): React.CSSProperties => ({
    flex: 1,
    padding: "0.45rem 0.7rem",
    borderRadius: "999px",
    border: "none",
    cursor: "pointer",
    fontSize: "0.85rem",
    fontWeight: 600,
    background: activo
      ? "linear-gradient(135deg, #1d4ed8, #38bdf8)"
      : "#0f172a",
    color: "white",
    borderInline: activo ? "none" : "1px solid rgba(148,163,184,0.5)",
  });

  return (
    <section>
      <div
        style={{
          background:
            "radial-gradient(circle at top, rgba(37,99,235,0.5), rgba(15,23,42,0.98))",
          borderRadius: "1rem",
          padding: "1.8rem",
          border: "1px solid rgba(59,130,246,0.6)",
          boxShadow: "0 24px 60px rgba(15,23,42,0.4)",
          color: "white",
        }}
      >
        <h2 style={{ marginTop: 0 }}>SECA · Servicios Contables</h2>
        <p style={{ fontSize: "0.9rem", marginBottom: "1rem" }}>
          Mientras utilizas las calculadoras, aquí puedes conocer más sobre
          cómo SECA puede apoyar a tu empresa.
        </p>

        {/* 👇 Usamos la clase "sidebar-tabs" que es responsive */}
        <div className="sidebar-tabs">
          <button
            style={botonStyle(seccionActiva === "servicios")}
            onClick={() => setSeccionActiva("servicios")}
          >
            Servicios
          </button>
          <button
            style={botonStyle(seccionActiva === "quienes")}
            onClick={() => setSeccionActiva("quienes")}
          >
            ¿Quiénes somos?
          </button>
          <button
            style={botonStyle(seccionActiva === "contacto")}
            onClick={() => setSeccionActiva("contacto")}
          >
            Contáctanos
          </button>
        </div>

        {/* 👇 Removemos la altura mínima fija, dejamos que sea flexible */}
        <div
          style={{
            fontSize: "0.9rem",
            lineHeight: 1.6,
          }}
        >
          {renderContenido()}
        </div>
      </div>
    </section>
  );
};

export default SidebarInfo;