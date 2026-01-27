// src/pages/Bono14Page.tsx
import { useState } from "react";
import type { FormEvent } from "react";
import type { Bono14Request, Bono14Response, RespuestaApi } from "../types/calculadoras";
import { calcularBono14 } from "../services/calculadorasService";
import { generateBono14PDF } from "../utils/pdfGenerator";

const Bono14Page: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showInfo, setShowInfo] = useState(true);
  
  const [form, setForm] = useState<Bono14Request>({
    salarioPromedio: 0,
    fechaInicio: "",
    fechaFin: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<RespuestaApi<Bono14Response> | null>(null);

  const handleNumberChange =
    (field: "salarioPromedio") => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value);
      setForm((prev) => ({
        ...prev,
        [field]: isNaN(value) ? 0 : value,
      }));
    };

  const handleDateChange =
    (field: "fechaInicio" | "fechaFin") => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResultado(null);

    try {
      const res = await calcularBono14(form);
      setResultado(res);
      setCurrentStep(4); // Ir a resultado
    } catch (err: any) {
      setError(err.message ?? "Ocurrió un error al calcular el Bono 14.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (resultado && resultado.datos) {
      generateBono14PDF({
        ...form,
        montoBono14: resultado.datos.montoBono14,
        detalleCalculo: resultado.datos.detalleCalculo,
      });
    }
  };

  const handleUsarFechaHoy = () => {
    const hoy = new Date().toISOString().split("T")[0];
    setForm((prev) => ({ ...prev, fechaFin: hoy }));
  };

  const handleFinDeAnio = () => {
    const finAnio = "2025-12-31";
    setForm((prev) => ({ ...prev, fechaFin: finAnio }));
  };

  const handleNuevaConsulta = () => {
    setCurrentStep(0);
    setResultado(null);
    setError(null);
    setShowInfo(true);
    setForm({
      salarioPromedio: 0,
      fechaInicio: "",
      fechaFin: "",
    });
  };

  const canGoNext = () => {
    if (currentStep === 1) return form.fechaInicio !== "";
    if (currentStep === 2) return form.fechaFin !== "";
    if (currentStep === 3) return form.salarioPromedio > 0;
    return true;
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
      padding: "2rem 1rem"
    }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        
        {/* Header con información */}
        {showInfo && currentStep === 0 && (
          <div style={{
            background: "white",
            borderRadius: "1rem",
            padding: "2rem",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            marginBottom: "2rem",
            border: "2px solid #0E234F"
          }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: "1.5rem" }}>
              <div style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #0E234F, #2252EC)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "1rem"
              }}>
                <span style={{ fontSize: "2rem" }}>🎁</span>
              </div>
              <div>
                <h1 style={{ 
                  fontSize: "2rem", 
                  fontWeight: 800, 
                  margin: 0,
                  color: "#0E234F"
                }}>
                  Calculadora de Bono 14
                </h1>
                <p style={{ margin: 0, color: "#64748b", fontSize: "1rem" }}>
                  Calcula tu bonificación anual obligatoria
                </p>
              </div>
            </div>

            <div style={{
              background: "linear-gradient(135deg, #e0f2fe, #dbeafe)",
              borderRadius: "0.75rem",
              padding: "1.5rem",
              borderLeft: "4px solid #2252EC"
            }}>
              <h3 style={{ 
                fontSize: "1.25rem", 
                fontWeight: 700, 
                marginBottom: "0.75rem",
                color: "#0E234F"
              }}>
                ℹ️ ¿Qué es el Bono 14?
              </h3>
              <p style={{ 
                fontSize: "1rem", 
                lineHeight: 1.7, 
                color: "#334155",
                margin: 0
              }}>
                El Bono 14 es una <strong>bonificación anual obligatoria e irrenunciable</strong> para las personas trabajadoras tanto del sector privado como del público. Su importancia radica en que es una compensación económica adicional al sueldo y aguinaldo, equivalente a un <strong>salario ordinario mensual por año de servicio continuo</strong> o parte proporcional. Es importante que los empleadores cumplan con esta obligación legal.
              </p>
            </div>

            <button
              onClick={() => setShowInfo(false)}
              style={{
                marginTop: "1.5rem",
                padding: "1rem 2rem",
                borderRadius: "0.75rem",
                border: "none",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: "1rem",
                background: "linear-gradient(135deg, #0E234F, #2252EC)",
                color: "white",
                width: "100%",
                boxShadow: "0 4px 15px rgba(14,35,79,0.3)",
                transition: "transform 0.2s"
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              Comenzar Cálculo →
            </button>
          </div>
        )}

        {/* Modal paso a paso */}
        {!showInfo && currentStep < 4 && (
          <div style={{
            background: "white",
            borderRadius: "1rem",
            overflow: "hidden",
            boxShadow: "0 10px 40px rgba(0,0,0,0.15)"
          }}>
            {/* Header del paso */}
            <div style={{
              background: "linear-gradient(135deg, #0E234F, #2252EC)",
              padding: "1.5rem 2rem",
              color: "white"
            }}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "1rem",
                  fontWeight: 800,
                  fontSize: "1.25rem"
                }}>
                  {currentStep + 1}
                </div>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>
                  {currentStep === 1 && "📅 Fecha de Inicio de Labores"}
                  {currentStep === 2 && "📅 Fecha de Cálculo"}
                  {currentStep === 3 && "💰 Salario Ordinario Mensual"}
                </h2>
              </div>
            </div>

            {/* Contenido del paso */}
            <div style={{ padding: "2rem" }}>
              
              {/* Paso 1: Fecha de Inicio */}
              {currentStep === 1 && (
                <>
                  <div style={{
                    background: "#dbeafe",
                    borderRadius: "0.75rem",
                    padding: "1rem 1.25rem",
                    marginBottom: "1.5rem",
                    borderLeft: "4px solid #2252EC"
                  }}>
                    <p style={{ 
                      fontSize: "0.95rem", 
                      margin: 0, 
                      color: "#334155",
                      lineHeight: 1.6
                    }}>
                      <strong>ℹ️ ¿Qué es la fecha de inicio?</strong><br />
                      Es la fecha exacta cuando el empleado causó alta o empezó oficialmente en planilla. Esta fecha es fundamental para calcular correctamente el tiempo de servicio según el Código de Trabajo de Guatemala.
                      <br /><br />
                      <strong>📌 Nota importante:</strong> Esta calculadora es especialmente útil para empleados que llevan <strong>menos de un año laborando</strong>, ya que si ha trabajado un año completo (365 días) recibirá el 100% de su salario mensual como Bono 14, sin necesidad de cálculo proporcional.
                    </p>
                  </div>

                  <label style={{ 
                    display: "block", 
                    fontWeight: 600, 
                    marginBottom: "0.75rem", 
                    color: "#0E234F",
                    fontSize: "1.05rem"
                  }}>
                    Seleccione la fecha de inicio de labores:
                  </label>
                  <input
                    type="date"
                    value={form.fechaInicio}
                    onChange={handleDateChange("fechaInicio")}
                    style={{
                      width: "100%",
                      padding: "1rem",
                      borderRadius: "0.75rem",
                      border: "2px solid #e2e8f0",
                      fontSize: "1.1rem",
                      fontWeight: 500
                    }}
                  />
                </>
              )}

              {/* Paso 2: Fecha de Fin */}
              {currentStep === 2 && (
                <>
                  <div style={{
                    background: "#dbeafe",
                    borderRadius: "0.75rem",
                    padding: "1rem 1.25rem",
                    marginBottom: "1.5rem",
                    borderLeft: "4px solid #2252EC"
                  }}>
                    <p style={{ 
                      fontSize: "0.95rem", 
                      margin: 0, 
                      color: "#334155",
                      lineHeight: 1.6
                    }}>
                      <strong>ℹ️ ¿Qué es la fecha de cálculo?</strong><br />
                      Es la fecha hasta la cual desea calcular el Bono 14. Puede ser la fecha de hoy para conocer su Bono 14 acumulado, o el final del período (30 de junio) para el Bono 14 completo.
                    </p>
                  </div>

                  <label style={{ 
                    display: "block", 
                    fontWeight: 600, 
                    marginBottom: "0.75rem", 
                    color: "#0E234F",
                    fontSize: "1.05rem"
                  }}>
                    Seleccione la fecha de cálculo:
                  </label>
                  <input
                    type="date"
                    value={form.fechaFin}
                    onChange={handleDateChange("fechaFin")}
                    style={{
                      width: "100%",
                      padding: "1rem",
                      borderRadius: "0.75rem",
                      border: "2px solid #e2e8f0",
                      fontSize: "1.1rem",
                      fontWeight: 500,
                      marginBottom: "1rem"
                    }}
                  />

                  <div style={{ 
                    display: "grid", 
                    gridTemplateColumns: "1fr 1fr", 
                    gap: "1rem" 
                  }}>
                    <button
                      type="button"
                      onClick={handleUsarFechaHoy}
                      style={{
                        padding: "0.875rem",
                        borderRadius: "0.75rem",
                        border: "2px solid #2252EC",
                        background: "white",
                        color: "#2252EC",
                        cursor: "pointer",
                        fontWeight: 600,
                        fontSize: "0.95rem",
                        transition: "all 0.2s"
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = "#2252EC";
                        e.currentTarget.style.color = "white";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = "white";
                        e.currentTarget.style.color = "#2252EC";
                      }}
                    >
                      📅 Usar Fecha de Hoy
                    </button>

                    <button
                      type="button"
                      onClick={handleFinDeAnio}
                      style={{
                        padding: "0.875rem",
                        borderRadius: "0.75rem",
                        border: "2px solid #0E234F",
                        background: "white",
                        color: "#0E234F",
                        cursor: "pointer",
                        fontWeight: 600,
                        fontSize: "0.95rem",
                        transition: "all 0.2s"
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = "#0E234F";
                        e.currentTarget.style.color = "white";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = "white";
                        e.currentTarget.style.color = "#0E234F";
                      }}
                    >
                      📅 Fin de Año (31/12/2025)
                    </button>
                  </div>

                  {form.fechaInicio && form.fechaFin && new Date(form.fechaFin) < new Date(form.fechaInicio) && (
                    <div style={{
                      marginTop: "1rem",
                      padding: "1rem",
                      borderRadius: "0.75rem",
                      background: "#fef3c7",
                      border: "2px solid #fbbf24",
                      color: "#92400e"
                    }}>
                      <strong>⚠️ Importante:</strong> La fecha de cálculo debe ser posterior a la fecha de inicio para realizar el cálculo correctamente.
                    </div>
                  )}
                </>
              )}

              {/* Paso 3: Salario */}
              {currentStep === 3 && (
                <>
                  <div style={{
                    background: "#dbeafe",
                    borderRadius: "0.75rem",
                    padding: "1rem 1.25rem",
                    marginBottom: "1.5rem",
                    borderLeft: "4px solid #2252EC"
                  }}>
                    <p style={{ 
                      fontSize: "0.95rem", 
                      margin: 0, 
                      color: "#334155",
                      lineHeight: 1.6
                    }}>
                      <strong>ℹ️ ¿Qué salario debo ingresar?</strong><br />
                      Ingrese el <strong>salario ordinario mensual completo</strong> sin descuentos (salario bruto). Este es el salario base antes de deducciones como IGSS, ISR, etc.
                      <br /><br />
                      <strong>❌ NO incluya:</strong>
                      <br />• Bonificación incentivo (Q250.00)
                      <br />• Horas extras
                      <br />• Comisiones variables
                      <br />• Bonos de productividad
                      <br />• Otros incentivos extraordinarios
                      <br /><br />
                      <strong>✅ SÍ incluya:</strong> Solo el salario base mensual ordinario
                    </p>
                  </div>

                  <label style={{ 
                    display: "block", 
                    fontWeight: 600, 
                    marginBottom: "0.75rem", 
                    color: "#0E234F",
                    fontSize: "1.05rem"
                  }}>
                    Ingrese el salario mensual ordinario (Q):
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.salarioPromedio || ""}
                    onChange={handleNumberChange("salarioPromedio")}
                    placeholder="Ej: 7200.00"
                    style={{
                      width: "100%",
                      padding: "1rem",
                      borderRadius: "0.75rem",
                      border: "2px solid #e2e8f0",
                      fontSize: "1.25rem",
                      fontWeight: 600,
                      color: "#0E234F"
                    }}
                  />

                  {/* Tabla de salarios mínimos */}
                  <div style={{
                    marginTop: "1.5rem",
                    background: "#fef9c3",
                    borderRadius: "0.75rem",
                    padding: "1.25rem",
                    border: "2px solid #fbbf24"
                  }}>
                    <h4 style={{ 
                      fontSize: "1rem", 
                      fontWeight: 700, 
                      marginBottom: "0.5rem",
                      color: "#92400e",
                      display: "flex",
                      alignItems: "center"
                    }}>
                      💡 Salarios Mínimos Oficiales 2026 - Guatemala
                    </h4>

                    <div style={{
                      background: "#fee2e2",
                      borderRadius: "0.5rem",
                      padding: "0.75rem",
                      marginBottom: "1rem",
                      borderLeft: "4px solid #ef4444"
                    }}>
                      <p style={{ 
                        fontSize: "0.85rem", 
                        margin: 0, 
                        color: "#991b1b",
                        lineHeight: 1.5,
                        fontWeight: 600
                      }}>
                        ⚠️ IMPORTANTE: Los Q250 de bonificación incentivo <strong>NO se incluyen</strong> en el cálculo de Bono 14. Use el salario base (sin Q250) para calcular.
                      </p>
                    </div>
                    
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                      {/* Departamento de Guatemala */}
                      <div>
                        <p style={{ 
                          fontSize: "0.85rem", 
                          fontWeight: 700, 
                          color: "#2252EC",
                          marginBottom: "0.5rem"
                        }}>
                          Departamento de Guatemala (CE1):
                        </p>
                        <table style={{ 
                          width: "100%", 
                          fontSize: "0.75rem",
                          borderCollapse: "collapse"
                        }}>
                          <thead>
                            <tr style={{ background: "#2252EC", color: "white" }}>
                              <th style={{ padding: "0.4rem", textAlign: "left", fontSize: "0.7rem" }}>Actividad</th>
                              <th style={{ padding: "0.4rem", textAlign: "right", fontSize: "0.7rem" }}>Salario<br/>Base</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr style={{ background: "white" }}>
                              <td style={{ padding: "0.4rem", fontSize: "0.75rem" }}>Agrícola</td>
                              <td style={{ padding: "0.4rem", textAlign: "right", fontWeight: 700, color: "#0E234F" }}>Q3,791.20</td>
                            </tr>
                            <tr style={{ background: "#f8fafc" }}>
                              <td style={{ padding: "0.4rem", fontSize: "0.75rem" }}>No Agrícola</td>
                              <td style={{ padding: "0.4rem", textAlign: "right", fontWeight: 700, color: "#0E234F" }}>Q4,002.28</td>
                            </tr>
                            <tr style={{ background: "white" }}>
                              <td style={{ padding: "0.4rem", fontSize: "0.75rem" }}>Maquila/Export.</td>
                              <td style={{ padding: "0.4rem", textAlign: "right", fontWeight: 700, color: "#0E234F" }}>Q3,409.73</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* Otros Departamentos */}
                      <div>
                        <p style={{ 
                          fontSize: "0.85rem", 
                          fontWeight: 700, 
                          color: "#10b981",
                          marginBottom: "0.5rem"
                        }}>
                          Otros Departamentos (CE2):
                        </p>
                        <table style={{ 
                          width: "100%", 
                          fontSize: "0.75rem",
                          borderCollapse: "collapse"
                        }}>
                          <thead>
                            <tr style={{ background: "#10b981", color: "white" }}>
                              <th style={{ padding: "0.4rem", textAlign: "left", fontSize: "0.7rem" }}>Actividad</th>
                              <th style={{ padding: "0.4rem", textAlign: "right", fontSize: "0.7rem" }}>Salario<br/>Base</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr style={{ background: "white" }}>
                              <td style={{ padding: "0.4rem", fontSize: "0.75rem" }}>Agrícola</td>
                              <td style={{ padding: "0.4rem", textAlign: "right", fontWeight: 700, color: "#0E234F" }}>Q3,625.89</td>
                            </tr>
                            <tr style={{ background: "#f8fafc" }}>
                              <td style={{ padding: "0.4rem", fontSize: "0.75rem" }}>No Agrícola</td>
                              <td style={{ padding: "0.4rem", textAlign: "right", fontWeight: 700, color: "#0E234F" }}>Q3,816.90</td>
                            </tr>
                            <tr style={{ background: "white" }}>
                              <td style={{ padding: "0.4rem", fontSize: "0.75rem" }}>Maquila/Export.</td>
                              <td style={{ padding: "0.4rem", textAlign: "right", fontWeight: 700, color: "#0E234F" }}>Q3,321.10</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div style={{
                      marginTop: "0.75rem",
                      background: "#dbeafe",
                      borderRadius: "0.5rem",
                      padding: "0.75rem",
                      border: "1px solid #2252EC"
                    }}>
                      <p style={{ 
                        fontSize: "0.75rem", 
                        color: "#1e40af", 
                        margin: 0,
                        lineHeight: 1.5
                      }}>
                        <strong>📋 Nota:</strong> Los valores mostrados son el <strong>salario base (sin Q250)</strong> según Acuerdo Gubernativo 256-2025. El salario mínimo oficial incluye Q250 de bonificación incentivo, pero esta bonificación <strong>NO se toma en cuenta</strong> para calcular Bono 14 y Aguinaldo según el Decreto 78-89.
                      </p>
                    </div>
                  </div>

                  <div style={{
                    marginTop: "1rem",
                    padding: "1rem",
                    borderRadius: "0.75rem",
                    background: "#d1fae5",
                    border: "2px solid #10b981",
                    color: "#065f46"
                  }}>
                    <strong>✓ Recuerde:</strong> Ingrese el salario completo mensual antes de descuentos para obtener un cálculo preciso de las prestaciones.
                  </div>
                </>
              )}

              {/* Botones de navegación */}
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                marginTop: "2rem",
                gap: "1rem"
              }}>
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    style={{
                      padding: "1rem 2rem",
                      borderRadius: "0.75rem",
                      border: "2px solid #0E234F",
                      background: "white",
                      color: "#0E234F",
                      cursor: "pointer",
                      fontWeight: 700,
                      fontSize: "1rem",
                      flex: 1
                    }}
                  >
                    ← Anterior
                  </button>
                )}

                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(currentStep + 1)}
                    disabled={!canGoNext()}
                    style={{
                      padding: "1rem 2rem",
                      borderRadius: "0.75rem",
                      border: "none",
                      background: canGoNext() 
                        ? "linear-gradient(135deg, #0E234F, #2252EC)" 
                        : "#cbd5e1",
                      color: "white",
                      cursor: canGoNext() ? "pointer" : "not-allowed",
                      fontWeight: 700,
                      fontSize: "1rem",
                      flex: currentStep > 1 ? 1 : 2,
                      marginLeft: currentStep === 1 ? 0 : "auto"
                    }}
                  >
                    Siguiente →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading || !canGoNext()}
                    style={{
                      padding: "1rem 2rem",
                      borderRadius: "0.75rem",
                      border: "none",
                      background: loading || !canGoNext()
                        ? "#cbd5e1"
                        : "linear-gradient(135deg, #10b981, #34d399)",
                      color: "white",
                      cursor: loading || !canGoNext() ? "not-allowed" : "pointer",
                      fontWeight: 700,
                      fontSize: "1rem",
                      flex: 1
                    }}
                  >
                    {loading ? "Calculando..." : "📊 Calcular Bono 14"}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{
            padding: "1.5rem",
            borderRadius: "0.75rem",
            background: "#fee2e2",
            border: "2px solid #fca5a5",
            color: "#991b1b",
            marginTop: "1rem",
            marginBottom: "1rem"
          }}>
            <strong>❌ Error:</strong> {error}
          </div>
        )}

        {/* Resultado */}
        {resultado && resultado.datos && currentStep === 4 && (
          <div style={{
            background: "white",
            borderRadius: "1rem",
            overflow: "hidden",
            boxShadow: "0 10px 40px rgba(0,0,0,0.15)"
          }}>
            <div style={{
              background: "linear-gradient(135deg, #10b981, #34d399)",
              padding: "2rem",
              color: "white",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🎉</div>
              <h2 style={{ fontSize: "2rem", fontWeight: 800, margin: 0 }}>
                ¡Cálculo Completado!
              </h2>
              <p style={{ fontSize: "1.1rem", marginTop: "0.5rem", opacity: 0.9 }}>
                Tu Bono 14 ha sido calculado correctamente
              </p>
            </div>

            <div style={{ padding: "2rem" }}>
              <div style={{
                background: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
                borderRadius: "1rem",
                padding: "2rem",
                marginBottom: "2rem",
                border: "2px solid #10b981"
              }}>
                <p style={{ 
                  fontSize: "1rem", 
                  color: "#065f46", 
                  marginBottom: "0.5rem",
                  fontWeight: 600
                }}>
                  💰 Monto de Bono 14:
                </p>
                <p style={{ 
                  fontSize: "3.5rem", 
                  fontWeight: 800, 
                  margin: 0,
                  color: "#0E234F"
                }}>
                  Q {resultado.datos.montoBono14.toLocaleString('es-GT', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </p>
              </div>

              <div style={{
                background: "#f8fafc",
                borderRadius: "0.75rem",
                padding: "1.5rem",
                marginBottom: "2rem"
              }}>
                <h3 style={{ 
                  fontSize: "1.1rem", 
                  fontWeight: 700, 
                  marginBottom: "1rem",
                  color: "#0E234F"
                }}>
                  📋 Detalles del Cálculo:
                </h3>
                <p style={{ 
                  fontSize: "0.95rem", 
                  lineHeight: 1.7, 
                  color: "#334155",
                  margin: 0,
                  fontFamily: "monospace",
                  background: "white",
                  padding: "1rem",
                  borderRadius: "0.5rem"
                }}>
                  {resultado.datos.detalleCalculo}
                </p>
              </div>

              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "1fr 1fr", 
                gap: "1rem" 
              }}>
                <button
                  onClick={handleDownloadPDF}
                  style={{
                    padding: "1rem",
                    borderRadius: "0.75rem",
                    border: "2px solid #2252EC",
                    background: "linear-gradient(135deg, #0E234F, #2252EC)",
                    color: "white",
                    cursor: "pointer",
                    fontWeight: 700,
                    fontSize: "1rem",
                    transition: "transform 0.2s"
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                  onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  📄 Descargar PDF
                </button>

                <button
                  onClick={handleNuevaConsulta}
                  style={{
                    padding: "1rem",
                    borderRadius: "0.75rem",
                    border: "2px solid #10b981",
                    background: "white",
                    color: "#10b981",
                    cursor: "pointer",
                    fontWeight: 700,
                    fontSize: "1rem",
                    transition: "all 0.2s"
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = "#10b981";
                    e.currentTarget.style.color = "white";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = "white";
                    e.currentTarget.style.color = "#10b981";
                  }}
                >
                  🔄 Nueva Consulta
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bono14Page;