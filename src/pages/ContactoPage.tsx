// src/pages/ContactoPage.tsx

const SECA = {
  navy: "#0F0E3B",
  navy2: "#0E234F",
  blue: "#2252EC",
  white: "#FFFFFF",
  border: "rgba(255,255,255,0.15)",
};

const Card = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      background: "rgba(15,14,59,0.20)",
      border: `1px solid ${SECA.border}`,
      borderRadius: "0.85rem",
      padding: "1rem",
      boxShadow: "0 8px 22px rgba(0,0,0,0.22)",
    }}
  >
    {children}
  </div>
);

const ContactoPage: React.FC = () => {
  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
      <div
        style={{
          background: `linear-gradient(135deg, ${SECA.navy2}, ${SECA.blue})`,
          borderRadius: "1rem",
          padding: "2rem",
          color: SECA.white,
        }}
      >
        <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "1rem" }}>
          Contacto
        </h1>
        <p style={{ fontSize: "1.1rem", marginBottom: "2rem", opacity: 0.95 }}>
          ¿Tienes preguntas? Estamos aquí para ayudarte.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Card>
            <h3 style={{ margin: "0 0 0.5rem" }}>📍 Dirección</h3>
            <p style={{ margin: 0, opacity: 0.9 }}>
              Edificio Plaza Kalu, zona 4 de Mixco, Boulevard Naranjo
            </p>
          </Card>

          <Card>
            <h3 style={{ margin: "0 0 0.5rem" }}>📞 Teléfono</h3>
            <p style={{ margin: 0, opacity: 0.9 }}>3639-3647</p>
          </Card>

          <Card>
            <h3 style={{ margin: "0 0 0.5rem" }}>📧 Correo Electrónico</h3>
            <p style={{ margin: 0, opacity: 0.9 }}>
              info@seca.gt<br />
              corporacionseca@gmail.com
            </p>
          </Card>

          <Card>
            <h3 style={{ margin: "0 0 0.5rem" }}>🕘 Horario de Atención</h3>
            <p style={{ margin: 0, opacity: 0.9 }}>
              Lunes a Viernes: 8:00 AM - 5:00 PM<br />
              Sábados: 8:00 AM - 12:00 PM
            </p>
          </Card>

          <div style={{ marginTop: "1rem", textAlign: "center" }}>
            <a
              href="https://wa.me/50236393647"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                padding: "1rem 2.5rem",
                background: "white",
                color: SECA.navy2,
                borderRadius: "999px",
                fontWeight: 700,
                fontSize: "1.1rem",
                textDecoration: "none",
                boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                transition: "transform 0.2s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              📱 Escríbenos por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactoPage;