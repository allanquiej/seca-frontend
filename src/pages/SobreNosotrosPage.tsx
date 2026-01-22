// src/pages/SobreNosotrosPage.tsx
const SobreNosotrosPage = () => {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      {/* Hero Section */}
      <div
        style={{
          background: "linear-gradient(135deg, #0E234F 0%, #2252EC 100%)",
          padding: "5rem 2rem",
          color: "white",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h1
            style={{
              fontSize: "3rem",
              fontWeight: "800",
              marginBottom: "1rem",
              textShadow: "0 4px 12px rgba(0,0,0,0.4)",
            }}
          >
            Sobre Nosotros
          </h1>
          <p
            style={{
              fontSize: "1.3rem",
              opacity: 0.95,
              lineHeight: "1.6",
            }}
          >
            Conoce más sobre SECA y nuestro compromiso con la excelencia
          </p>
        </div>
      </div>

      {/* Contenido Principal */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "4rem 2rem",
        }}
      >
        {/* Sección: Quiénes Somos */}
        <section style={{ marginBottom: "4rem" }}>
          <h2
            style={{
              fontSize: "2.5rem",
              fontWeight: "700",
              color: "#0f172a",
              marginBottom: "1.5rem",
              textAlign: "center",
            }}
          >
            ¿Quiénes Somos?
          </h2>
          <div
            style={{
              backgroundColor: "white",
              padding: "3rem",
              borderRadius: "16px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
          >
            <p
              style={{
                fontSize: "1.1rem",
                lineHeight: "1.8",
                color: "#475569",
                marginBottom: "1.5rem",
              }}
            >
              <strong style={{ color: "#0E234F" }}>SECA</strong> es una firma de
              contabilidad y auditoría especializada en brindar servicios
              profesionales de alta calidad a empresas guatemaltecas y
              extranjeras. Con más de 18 años de experiencia en el mercado,
              nos hemos consolidado como un aliado estratégico para el
              cumplimiento de obligaciones tributarias y la optimización de
              procesos contables.
            </p>
            <p
              style={{
                fontSize: "1.1rem",
                lineHeight: "1.8",
                color: "#475569",
              }}
            >
              Nuestro equipo de profesionales altamente capacitados trabaja día
              a día para ofrecer soluciones innovadoras y personalizadas que se
              adapten a las necesidades específicas de cada cliente,
              garantizando precisión, confiabilidad y cumplimiento normativo.
            </p>
          </div>
        </section>

        {/* Sección: Nuestra Misión */}
        <section style={{ marginBottom: "4rem" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "2rem",
            }}
            className="mission-grid"
          >
            {/* Misión */}
            <div
              style={{
                background: "linear-gradient(135deg, #0E234F 0%, #2252EC 100%)",
                padding: "3rem",
                borderRadius: "16px",
                color: "white",
                boxShadow: "0 8px 24px rgba(34, 82, 236, 0.3)",
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎯</div>
              <h3
                style={{
                  fontSize: "2rem",
                  fontWeight: "700",
                  marginBottom: "1rem",
                }}
              >
                Nuestra Misión
              </h3>
              <p style={{ fontSize: "1.05rem", lineHeight: "1.7", opacity: 0.95 }}>
                Proporcionar servicios de contabilidad, auditoría y consultoría
                tributaria de la más alta calidad, ayudando a nuestros clientes a
                cumplir con sus obligaciones fiscales de manera eficiente y
                confiable, mientras contribuimos al crecimiento sostenible de sus
                negocios.
              </p>
            </div>

            {/* Visión */}
            <div
              style={{
                background: "linear-gradient(135deg, #2252EC 0%, #0E234F 100%)",
                padding: "3rem",
                borderRadius: "16px",
                color: "white",
                boxShadow: "0 8px 24px rgba(34, 82, 236, 0.3)",
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔭</div>
              <h3
                style={{
                  fontSize: "2rem",
                  fontWeight: "700",
                  marginBottom: "1rem",
                }}
              >
                Nuestra Visión
              </h3>
              <p style={{ fontSize: "1.05rem", lineHeight: "1.7", opacity: 0.95 }}>
                Ser la firma de contabilidad y auditoría líder en Guatemala,
                reconocida por nuestra excelencia profesional, integridad y
                compromiso con el éxito de nuestros clientes, siendo referentes en
                innovación y tecnología aplicada a los servicios contables.
              </p>
            </div>
          </div>
        </section>

        {/* Sección: Nuestros Valores */}
        <section style={{ marginBottom: "4rem" }}>
          <h2
            style={{
              fontSize: "2.5rem",
              fontWeight: "700",
              color: "#0f172a",
              marginBottom: "2.5rem",
              textAlign: "center",
            }}
          >
            Nuestros Valores
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "2rem",
            }}
          >
            {[
              {
                icon: "🏆",
                titulo: "Excelencia",
                descripcion:
                  "Nos esforzamos por alcanzar los más altos estándares de calidad en cada servicio que ofrecemos.",
              },
              {
                icon: "🤝",
                titulo: "Integridad",
                descripcion:
                  "Actuamos con honestidad, transparencia y ética profesional en todas nuestras operaciones.",
              },
              {
                icon: "💡",
                titulo: "Innovación",
                descripcion:
                  "Incorporamos tecnología y métodos modernos para optimizar nuestros servicios y procesos.",
              },
              {
                icon: "👥",
                titulo: "Compromiso",
                descripcion:
                  "Nos dedicamos al éxito de nuestros clientes, trabajando como verdaderos socios estratégicos.",
              },
              {
                icon: "📚",
                titulo: "Profesionalismo",
                descripcion:
                  "Mantenemos actualización constante y cumplimiento riguroso de las normas contables y tributarias.",
              },
              {
                icon: "🎯",
                titulo: "Precisión",
                descripcion:
                  "Garantizamos exactitud y confiabilidad en cada cálculo, reporte y asesoría que brindamos.",
              },
            ].map((valor, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: "white",
                  padding: "2rem",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  transition: "transform 0.3s, box-shadow 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = "0 12px 24px rgba(34, 82, 236, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
                }}
              >
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
                  {valor.icon}
                </div>
                <h3
                  style={{
                    fontSize: "1.4rem",
                    fontWeight: "700",
                    color: "#0E234F",
                    marginBottom: "0.8rem",
                  }}
                >
                  {valor.titulo}
                </h3>
                <p
                  style={{
                    fontSize: "1rem",
                    lineHeight: "1.6",
                    color: "#475569",
                  }}
                >
                  {valor.descripcion}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Sección: Por Qué Elegirnos */}
        <section>
          <h2
            style={{
              fontSize: "2.5rem",
              fontWeight: "700",
              color: "#0f172a",
              marginBottom: "2.5rem",
              textAlign: "center",
            }}
          >
            ¿Por Qué Elegirnos?
          </h2>
          <div
            style={{
              backgroundColor: "white",
              padding: "3rem",
              borderRadius: "16px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "2.5rem",
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      backgroundColor: "#0E234F",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.5rem",
                      color: "white",
                    }}
                  >
                    ✓
                  </div>
                  <h3
                    style={{
                      fontSize: "1.3rem",
                      fontWeight: "700",
                      color: "#0E234F",
                    }}
                  >
                    18+ Años de Experiencia
                  </h3>
                </div>
                <p style={{ fontSize: "1rem", lineHeight: "1.6", color: "#475569" }}>
                  Respaldamos nuestros servicios con casi dos décadas de
                  experiencia exitosa en el mercado guatemalteco.
                </p>
              </div>

              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      backgroundColor: "#2252EC",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.5rem",
                      color: "white",
                    }}
                  >
                    ✓
                  </div>
                  <h3
                    style={{
                      fontSize: "1.3rem",
                      fontWeight: "700",
                      color: "#0E234F",
                    }}
                  >
                    Equipo Profesional
                  </h3>
                </div>
                <p style={{ fontSize: "1rem", lineHeight: "1.6", color: "#475569" }}>
                  Contadores públicos certificados con especialización en
                  legislación tributaria guatemalteca.
                </p>
              </div>

              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      backgroundColor: "#0E234F",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.5rem",
                      color: "white",
                    }}
                  >
                    ✓
                  </div>
                  <h3
                    style={{
                      fontSize: "1.3rem",
                      fontWeight: "700",
                      color: "#0E234F",
                    }}
                  >
                    Herramientas Digitales
                  </h3>
                </div>
                <p style={{ fontSize: "1rem", lineHeight: "1.6", color: "#475569" }}>
                  Calculadoras profesionales y recursos en línea para facilitar
                  tus cálculos tributarios y laborales.
                </p>
              </div>

              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      backgroundColor: "#2252EC",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.5rem",
                      color: "white",
                    }}
                  >
                    ✓
                  </div>
                  <h3
                    style={{
                      fontSize: "1.3rem",
                      fontWeight: "700",
                      color: "#0E234F",
                    }}
                  >
                    Atención Personalizada
                  </h3>
                </div>
                <p style={{ fontSize: "1rem", lineHeight: "1.6", color: "#475569" }}>
                  Cada cliente recibe soluciones adaptadas a sus necesidades
                  específicas y acompañamiento continuo.
                </p>
              </div>

              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      backgroundColor: "#0E234F",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.5rem",
                      color: "white",
                    }}
                  >
                    ✓
                  </div>
                  <h3
                    style={{
                      fontSize: "1.3rem",
                      fontWeight: "700",
                      color: "#0E234F",
                    }}
                  >
                    Cumplimiento Garantizado
                  </h3>
                </div>
                <p style={{ fontSize: "1rem", lineHeight: "1.6", color: "#475569" }}>
                  Aseguramos el cumplimiento total de todas las obligaciones
                  tributarias y contables vigentes.
                </p>
              </div>

              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      backgroundColor: "#2252EC",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.5rem",
                      color: "white",
                    }}
                  >
                    ✓
                  </div>
                  <h3
                    style={{
                      fontSize: "1.3rem",
                      fontWeight: "700",
                      color: "#0E234F",
                    }}
                  >
                    Precios Competitivos
                  </h3>
                </div>
                <p style={{ fontSize: "1rem", lineHeight: "1.6", color: "#475569" }}>
                  Ofrecemos tarifas justas y transparentes sin comprometer la
                  calidad de nuestros servicios.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* CSS Responsive */}
      <style>{`
        @media (max-width: 768px) {
          .mission-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SobreNosotrosPage;