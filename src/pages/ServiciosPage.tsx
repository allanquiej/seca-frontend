// src/pages/ServiciosPage.tsx

const SECA = {
  navy: "#0F0E3B",
  navy2: "#0E234F",
  blue: "#2252EC",
  white: "#FFFFFF",
  border: "rgba(255,255,255,0.15)",
  textSoft: "rgba(255,255,255,0.92)",
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

const ServiciosPage: React.FC = () => {
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
          Nuestros Servicios
        </h1>
        <p style={{ fontSize: "1.1rem", marginBottom: "2rem", opacity: 0.95 }}>
          SECA ofrece una gama completa de servicios contables, fiscales y de asesoría empresarial.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {[
            [
              "📊 Contabilidad General",
              "Mantenimiento de libros contables, conciliaciones bancarias y de cuentas, preparación de estados financieros mensuales y anuales, respaldo documental en la nube (discreto).",
            ],
            [
              "📋 Auditoría y Revisión",
              "Revisión de movimientos, detección de inconsistencias, asesoría preventiva y recomendaciones de control interno.",
            ],
            [
              "🧾 Nóminas y Planillas",
              "Libro de salarios, recibos de pago, cálculo de prestaciones, y preparación de pagos a IGSS.",
            ],
            [
              "🧩 Gestiones ante SAT",
              "Solvencia fiscal, habilitación de facturación electrónica, inscripción y cambios de régimen, agencia virtual, actualización de datos.",
            ],
            [
              "🤝 Asesoría Fiscal y Empresarial",
              "Asesorías para decisiones y prevención de sanciones, coordinación de operaciones, acompañamiento ante requerimientos.",
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

export default ServiciosPage;