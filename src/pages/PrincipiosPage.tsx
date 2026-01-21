// src/pages/PrincipiosPage.tsx

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

const PrincipiosPage: React.FC = () => {
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
          Nuestros Principios
        </h1>
        <p style={{ fontSize: "1.1rem", marginBottom: "2rem", opacity: 0.95 }}>
          En SECA trabajamos bajo principios sólidos que garantizan confianza, orden y cumplimiento.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {[
            [
              "⚙️ Principios Morales",
              "Nuestro trabajo se realiza con eficiencia y profesionalismo, aplicando correctamente la legislación tributaria y contable.",
            ],
            [
              "🔒 Principios Éticos",
              "Manejamos la información con confidencialidad y discreción, brindando seguridad en cada proceso.",
            ],
            [
              "📅 Responsabilidad",
              "Cumplimos con los acuerdos establecidos, respetando plazos y obligaciones.",
            ],
            [
              "🤝 Confianza",
              "Toda la documentación es tratada de forma reservada, fortaleciendo relaciones a largo plazo.",
            ],
            [
              "🎓 Profesionalismo",
              "Atendemos a cada cliente con respeto, compromiso y calidad.",
            ],
            [
              "⚖️ Honestidad",
              "Somos claros y transparentes, proponiendo soluciones reales y legales.",
            ],
            [
              "✅ Compromiso",
              "Trabajamos con exactitud y puntualidad para minimizar riesgos.",
            ],
            [
              "💡 Creatividad",
              "Buscamos soluciones prácticas y efectivas, optimizando recursos.",
            ],
          ].map(([titulo, descripcion]) => (
            <Card key={titulo}>
              <h3 style={{ margin: "0 0 0.5rem", fontSize: "1.25rem" }}>{titulo}</h3>
              <p style={{ margin: 0, opacity: 0.9, lineHeight: 1.6 }}>{descripcion}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrincipiosPage;