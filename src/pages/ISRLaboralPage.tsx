// src/pages/ISRLaboralPage.tsx
// ✅ ACTUALIZADO CON CAMPOS SAT-1901 COMPLETO
import { useState } from "react";
import type { FormEvent } from "react";
import type {
  ISRAsalariadoRequest,
  ISRAsalariadoResponse,
  RespuestaApi,
} from "../types/calculadoras";
import { calcularISRAsalariado } from "../services/calculadorasService";
import { generateISRLaboralPDF } from "../utils/pdfGenerator";

const ISRLaboralPage: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  const [form, setForm] = useState<ISRAsalariadoRequest>({
    // Sección 1: Identificación
    nitEmpleado: "",
    
    // Sección 2: Período
    anioImposicion: currentYear,
    
    // Sección 3: Fecha inicio
    mesInicio: 1,
    anioInicio: currentYear,
    esProyectado: true,
    
    // Sección 4: Rentas Brutas
    numeroPatronos: 1,
    nitPatronoPrincipal: "",
    sueldoIgualDurante12Meses: true,
    
    salarioOrdinarioMensual: 0,
    bonificacionIncentivo: 250,
    
    // Salarios mensuales (opcionales)
    salarioEnero: 0,
    salarioFebrero: 0,
    salarioMarzo: 0,
    salarioAbril: 0,
    salarioMayo: 0,
    salarioJunio: 0,
    salarioJulio: 0,
    salarioAgosto: 0,
    salarioSeptiembre: 0,
    salarioOctubre: 0,
    salarioNoviembre: 0,
    salarioDiciembre: 0,
    
    salariosPatronoPrincipal: 0,
    salariosOtrosPatronos: 0,
    
    bono14: 0,
    aguinaldo: 0,
    horasExtrasAnuales: 0,
    otrosBonos: 0,
    
    // Sección 5: Rentas Exentas Adicionales
    indemnizacionesPorMuerteOIncapacidad: 0,
    indemnizacionesPorTiempoServido: 0,
    remuneracionesDiplomaticos: 0,
    gastosRepresentacionYViaticos: 0,
    
    // Sección 6: Deducciones Adicionales
    deduccionesPersonalesComprobadas: 0,
    donaciones: 0,
    primasSeguroVida: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<RespuestaApi<ISRAsalariadoResponse> | null>(null);
  const [mostrarCamposAvanzados, setMostrarCamposAvanzados] = useState(false);

  const handleChange = (field: keyof ISRAsalariadoRequest) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value = e.target.type === "number" ? parseFloat(e.target.value) : e.target.value;
    setForm((prev) => ({
      ...prev,
      [field]: e.target.type === "number" && isNaN(value as number) ? 0 : value,
    }));
  };

  const handleCheckboxChange = (field: keyof ISRAsalariadoRequest) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: e.target.checked,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResultado(null);

    try {
      const res = await calcularISRAsalariado(form);
      setResultado(res);
    } catch (err: any) {
      setError(err.message ?? "Ocurrió un error al calcular ISR laboral.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (resultado && resultado.datos) {
      generateISRLaboralPDF({
        ...form,
        ...resultado.datos,
      } as any);
    }
  };

  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "1rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: 800,
            marginBottom: "0.5rem",
            color: "#0f172a",
          }}
        >
          📊 Calculadora ISR Asalariados (SAT-1901)
        </h1>
        <p style={{ fontSize: "1.1rem", color: "#64748b", lineHeight: 1.6 }}>
          Calcula el ISR según el{" "}
          <strong>Decreto 10-2012 (Ley ISR)</strong> - Formulario oficial SAT
        </p>
      </div>

      {/* Información importante */}
      <div
        style={{
          background: "#dbeafe",
          border: "2px solid #2252EC",
          borderRadius: "1rem",
          padding: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.5rem", color: "#0E234F" }}>
          ℹ️ Metodología según SAT-1901
        </h3>
        <ol style={{ margin: 0, paddingLeft: "1.5rem", color: "#0E234F", lineHeight: 1.8 }}>
          <li>Se calcula la <strong>Renta Bruta</strong> (salarios + bonificación + aguinaldo + bono 14 + otros)</li>
          <li>Se restan las <strong>Rentas Exentas</strong> (aguinaldo y bono 14 hasta 100% del salario ordinario)</li>
          <li>Se obtiene la <strong>Renta Neta</strong></li>
          <li>Se restan las <strong>Deducciones</strong> (Q48,000 + IGSS 4.83% + opcionales)</li>
          <li>Se aplica la <strong>Tabla Progresiva</strong> (5% hasta Q300k, luego Q15k + 7%)</li>
        </ol>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        
        {/* ===== SECCIÓN 1: NIT ===== */}
        <div
          style={{
            background: "white",
            borderRadius: "1rem",
            padding: "2rem",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem", color: "#0E234F" }}>
            1. NIT del Empleado
          </h2>
          
          <div>
            <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem", color: "#0f172a" }}>
              NIT *
            </label>
            <input
              type="text"
              value={form.nitEmpleado}
              onChange={handleChange("nitEmpleado")}
              placeholder="Ej: 12345678"
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "0.5rem",
                border: "2px solid #e2e8f0",
                fontSize: "1rem",
              }}
            />
            <small style={{ color: "#64748b", fontSize: "0.9rem", display: "block", marginTop: "0.5rem" }}>
              Número de Identificación Tributaria
            </small>
          </div>
        </div>

        {/* ===== SECCIÓN 2: PERÍODO ===== */}
        <div
          style={{
            background: "white",
            borderRadius: "1rem",
            padding: "2rem",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem", color: "#0E234F" }}>
            2. Período de Imposición
          </h2>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem", color: "#0f172a" }}>
                Año *
              </label>
              <select
                value={form.anioImposicion}
                onChange={handleChange("anioImposicion")}
                required
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "0.5rem",
                  border: "2px solid #e2e8f0",
                  fontSize: "1rem",
                }}
              >
                {[currentYear - 1, currentYear, currentYear + 1].map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem", color: "#0f172a" }}>
                Tipo de Declaración *
              </label>
              <div style={{ display: "flex", gap: "2rem", paddingTop: "0.5rem" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                  <input
                    type="radio"
                    checked={form.esProyectado}
                    onChange={() => setForm(prev => ({ ...prev, esProyectado: true }))}
                    style={{ width: "1.25rem", height: "1.25rem" }}
                  />
                  <span>Proyectada</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                  <input
                    type="radio"
                    checked={!form.esProyectado}
                    onChange={() => setForm(prev => ({ ...prev, esProyectado: false }))}
                    style={{ width: "1.25rem", height: "1.25rem" }}
                  />
                  <span>Definitiva</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* ===== SECCIÓN 3: FECHA INICIO ===== */}
        <div
          style={{
            background: "white",
            borderRadius: "1rem",
            padding: "2rem",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem", color: "#0E234F" }}>
            3. Fecha Inicio de Labores
          </h2>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem", color: "#0f172a" }}>
                Mes *
              </label>
              <select
                value={form.mesInicio}
                onChange={handleChange("mesInicio")}
                required
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "0.5rem",
                  border: "2px solid #e2e8f0",
                  fontSize: "1rem",
                }}
              >
                {meses.map((mes, idx) => (
                  <option key={idx} value={idx + 1}>
                    {mes}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem", color: "#0f172a" }}>
                Año *
              </label>
              <select
                value={form.anioInicio}
                onChange={handleChange("anioInicio")}
                required
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "0.5rem",
                  border: "2px solid #e2e8f0",
                  fontSize: "1rem",
                }}
              >
                {Array.from({ length: 10 }, (_, i) => currentYear - i).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ===== SECCIÓN 4: RENTAS BRUTAS ===== */}
        <div
          style={{
            background: "white",
            borderRadius: "1rem",
            padding: "2rem",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem", color: "#0E234F" }}>
            4. Rentas Brutas
          </h2>

          {/* ¿Cuántos patronos? */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", fontWeight: 600, marginBottom: "0.75rem", color: "#0f172a" }}>
              ¿Cuántos patronos tuvo en este período? *
            </label>
            <div style={{ display: "flex", gap: "2rem" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                <input
                  type="radio"
                  checked={form.numeroPatronos === 1}
                  onChange={() => setForm(prev => ({ ...prev, numeroPatronos: 1 }))}
                  style={{ width: "1.25rem", height: "1.25rem" }}
                />
                <span>Uno</span>
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                <input
                  type="radio"
                  checked={form.numeroPatronos >= 2}
                  onChange={() => setForm(prev => ({ ...prev, numeroPatronos: 2 }))}
                  style={{ width: "1.25rem", height: "1.25rem" }}
                />
                <span>Dos o más</span>
              </label>
            </div>
          </div>

          {/* SI TUVO UN PATRONO */}
          {form.numeroPatronos === 1 && (
            <>
              {/* Checkbox: Sueldo igual 12 meses */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={form.sueldoIgualDurante12Meses}
                    onChange={handleCheckboxChange("sueldoIgualDurante12Meses")}
                    style={{ width: "1.25rem", height: "1.25rem" }}
                  />
                  <span style={{ fontWeight: 600 }}>
                    Sueldo igual durante 12 Meses
                  </span>
                </label>
                <small style={{ color: "#64748b", fontSize: "0.9rem", display: "block", marginTop: "0.5rem", marginLeft: "2rem" }}>
                  Marcar si su salario fue el mismo todos los meses
                </small>
              </div>

              {/* OPCIÓN A: Sueldo igual (2 campos) */}
              {form.sueldoIgualDurante12Meses ? (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                  <div>
                    <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem", color: "#0f172a" }}>
                      Salario Ordinario Mensual (Q) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={form.salarioOrdinarioMensual}
                      onChange={handleChange("salarioOrdinarioMensual")}
                      required
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        borderRadius: "0.5rem",
                        border: "2px solid #e2e8f0",
                        fontSize: "1rem",
                      }}
                    />
                    <small style={{ color: "#64748b", fontSize: "0.9rem" }}>
                      Sin incluir bonificación
                    </small>
                  </div>

                  <div>
                    <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem", color: "#0f172a" }}>
                      Bonificación Incentivo Mensual (Q)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={form.bonificacionIncentivo}
                      onChange={handleChange("bonificacionIncentivo")}
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        borderRadius: "0.5rem",
                        border: "2px solid #e2e8f0",
                        fontSize: "1rem",
                      }}
                    />
                    <small style={{ color: "#64748b", fontSize: "0.9rem" }}>
                      Usualmente Q250
                    </small>
                  </div>
                </div>
              ) : (
                /* OPCIÓN B: 12 campos separados */
                <>
                  <div
                    style={{
                      background: "#fef3c7",
                      border: "2px solid #f59e0b",
                      borderRadius: "0.75rem",
                      padding: "1rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <strong style={{ color: "#92400e" }}>💡 Salarios mensuales</strong>
                    <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.9rem", color: "#92400e" }}>
                      Ingrese el salario completo de cada mes (ordinario + bonificación)
                    </p>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
                    {meses.map((mes) => {
                      const fieldName = `salario${mes}` as keyof ISRAsalariadoRequest;
                      return (
                        <div key={mes}>
                          <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem", color: "#0f172a", fontSize: "0.9rem" }}>
                            {mes}
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={(form[fieldName] as number) || 0}
                            onChange={handleChange(fieldName)}
                            style={{
                              width: "100%",
                              padding: "0.5rem",
                              borderRadius: "0.5rem",
                              border: "2px solid #e2e8f0",
                              fontSize: "0.9rem",
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>

                  <div>
                    <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem", color: "#0f172a" }}>
                      Bonificación Incentivo Mensual (Q)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={form.bonificacionIncentivo}
                      onChange={handleChange("bonificacionIncentivo")}
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        borderRadius: "0.5rem",
                        border: "2px solid #e2e8f0",
                        fontSize: "1rem",
                      }}
                    />
                    <small style={{ color: "#64748b", fontSize: "0.9rem" }}>
                      Si fue igual todos los meses
                    </small>
                  </div>
                </>
              )}
            </>
          )}

          {/* SI TUVO DOS O MÁS PATRONOS */}
          {form.numeroPatronos >= 2 && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
              <div>
                <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem", color: "#0f172a" }}>
                  Salarios Patrono Principal (Q) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={form.salariosPatronoPrincipal || 0}
                  onChange={handleChange("salariosPatronoPrincipal")}
                  required
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "0.5rem",
                    border: "2px solid #e2e8f0",
                    fontSize: "1rem",
                  }}
                />
                <small style={{ color: "#64748b", fontSize: "0.9rem" }}>
                  Total anual del patrono principal
                </small>
              </div>

              <div>
                <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem", color: "#0f172a" }}>
                  Salarios Otros Patronos (Q)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={form.salariosOtrosPatronos || 0}
                  onChange={handleChange("salariosOtrosPatronos")}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "0.5rem",
                    border: "2px solid #e2e8f0",
                    fontSize: "1rem",
                  }}
                />
                <small style={{ color: "#64748b", fontSize: "0.9rem" }}>
                  Suma de otros patronos
                </small>
              </div>
            </div>
          )}

          {/* OTROS INGRESOS ANUALES */}
          <div
            style={{
              background: "#f0f9ff",
              borderRadius: "0.75rem",
              padding: "1.5rem",
              marginTop: "1.5rem",
            }}
          >
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem", color: "#0E234F" }}>
              Otros Ingresos Anuales
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem", color: "#0f172a" }}>
                  Bono 14 (Q)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={form.bono14}
                  onChange={handleChange("bono14")}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "0.5rem",
                    border: "2px solid #e2e8f0",
                    fontSize: "1rem",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem", color: "#0f172a" }}>
                  Aguinaldo (Q)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={form.aguinaldo}
                  onChange={handleChange("aguinaldo")}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "0.5rem",
                    border: "2px solid #e2e8f0",
                    fontSize: "1rem",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem", color: "#0f172a" }}>
                  Horas Extras Anuales (Q)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={form.horasExtrasAnuales}
                  onChange={handleChange("horasExtrasAnuales")}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "0.5rem",
                    border: "2px solid #e2e8f0",
                    fontSize: "1rem",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem", color: "#0f172a" }}>
                  Otros Bonos / Comisiones (Q)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={form.otrosBonos}
                  onChange={handleChange("otrosBonos")}
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "0.5rem",
                    border: "2px solid #e2e8f0",
                    fontSize: "1rem",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ===== CAMPOS AVANZADOS (OPCIONALES) ===== */}
        <div
          style={{
            background: "white",
            borderRadius: "1rem",
            padding: "2rem",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          <button
            type="button"
            onClick={() => setMostrarCamposAvanzados(!mostrarCamposAvanzados)}
            style={{
              width: "100%",
              padding: "1rem",
              background: mostrarCamposAvanzados ? "#f0f9ff" : "#f8fafc",
              border: "2px solid #e2e8f0",
              borderRadius: "0.75rem",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "1.1rem",
              color: "#0f172a",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              transition: "all 0.2s",
            }}
          >
            <span>⚙️ Campos Avanzados (Opcional)</span>
            <span style={{ fontSize: "1.5rem" }}>{mostrarCamposAvanzados ? "−" : "+"}</span>
          </button>

          {mostrarCamposAvanzados && (
            <div style={{ marginTop: "1.5rem" }}>
              <p style={{ color: "#64748b", marginBottom: "1.5rem", fontSize: "0.95rem" }}>
                Estos campos son opcionales y solo deben llenarse si aplican a tu situación específica.
              </p>

              {/* Rentas Exentas Adicionales */}
              <div style={{ marginBottom: "1.5rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem", color: "#0E234F" }}>
                  Rentas Exentas Adicionales
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem", color: "#0f172a", fontSize: "0.9rem" }}>
                      Indemnizaciones por Muerte/Incapacidad (Q)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={form.indemnizacionesPorMuerteOIncapacidad}
                      onChange={handleChange("indemnizacionesPorMuerteOIncapacidad")}
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        borderRadius: "0.5rem",
                        border: "2px solid #e2e8f0",
                        fontSize: "1rem",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem", color: "#0f172a", fontSize: "0.9rem" }}>
                      Indemnizaciones por Tiempo Servido (Q)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={form.indemnizacionesPorTiempoServido}
                      onChange={handleChange("indemnizacionesPorTiempoServido")}
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        borderRadius: "0.5rem",
                        border: "2px solid #e2e8f0",
                        fontSize: "1rem",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem", color: "#0f172a", fontSize: "0.9rem" }}>
                      Remuneraciones Diplomáticos (Q)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={form.remuneracionesDiplomaticos}
                      onChange={handleChange("remuneracionesDiplomaticos")}
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        borderRadius: "0.5rem",
                        border: "2px solid #e2e8f0",
                        fontSize: "1rem",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem", color: "#0f172a", fontSize: "0.9rem" }}>
                      Gastos de Representación y Viáticos (Q)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={form.gastosRepresentacionYViaticos}
                      onChange={handleChange("gastosRepresentacionYViaticos")}
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        borderRadius: "0.5rem",
                        border: "2px solid #e2e8f0",
                        fontSize: "1rem",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Deducciones Adicionales */}
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem", color: "#0E234F" }}>
                  Deducciones Adicionales
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem", color: "#0f172a", fontSize: "0.9rem" }}>
                      Deducciones Comprobadas (Q)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={form.deduccionesPersonalesComprobadas}
                      onChange={handleChange("deduccionesPersonalesComprobadas")}
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        borderRadius: "0.5rem",
                        border: "2px solid #e2e8f0",
                        fontSize: "1rem",
                      }}
                    />
                    <small style={{ color: "#64748b", fontSize: "0.85rem" }}>
                      Con facturas (Art. 72)
                    </small>
                  </div>

                  <div>
                    <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem", color: "#0f172a", fontSize: "0.9rem" }}>
                      Donaciones (Q)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={form.donaciones}
                      onChange={handleChange("donaciones")}
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        borderRadius: "0.5rem",
                        border: "2px solid #e2e8f0",
                        fontSize: "1rem",
                      }}
                    />
                    <small style={{ color: "#64748b", fontSize: "0.85rem" }}>
                      Máximo 5% renta bruta
                    </small>
                  </div>

                  <div>
                    <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem", color: "#0f172a", fontSize: "0.9rem" }}>
                      Primas Seguro de Vida (Q)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={form.primasSeguroVida}
                      onChange={handleChange("primasSeguroVida")}
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        borderRadius: "0.5rem",
                        border: "2px solid #e2e8f0",
                        fontSize: "1rem",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Botón Calcular */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "1.25rem",
            background: loading ? "#94a3b8" : "linear-gradient(135deg, #0E234F, #2252EC)",
            color: "white",
            border: "none",
            borderRadius: "0.75rem",
            fontSize: "1.2rem",
            fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: "0 4px 20px rgba(14,35,79,0.3)",
            transition: "all 0.2s",
          }}
        >
          {loading ? "Calculando..." : "🧮 Calcular ISR"}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div
          style={{
            background: "#fee2e2",
            border: "2px solid #ef4444",
            borderRadius: "1rem",
            padding: "1rem",
            marginTop: "1.5rem",
            color: "#991b1b",
          }}
        >
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Resultado */}
      {resultado && resultado.datos && (
        <div
          style={{
            background: "linear-gradient(135deg, #0E234F, #2252EC)",
            borderRadius: "1rem",
            padding: "2rem",
            color: "white",
            boxShadow: "0 10px 40px rgba(14,35,79,0.4)",
            marginTop: "2rem",
          }}
        >
          <h2 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "0.5rem" }}>
            ✅ Resultado del Cálculo ({resultado.datos.tipoCalculo})
          </h2>
          <p style={{ fontSize: "1rem", marginBottom: "1.5rem", opacity: 0.95 }}>
            Cálculo según Decreto 10-2012 (Ley ISR de Guatemala)
          </p>

          {/* Sección 1: Renta Bruta */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.75rem", borderBottom: "2px solid rgba(255,255,255,0.3)", paddingBottom: "0.5rem" }}>
              1️⃣ Renta Bruta
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.75rem" }}>
              <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: "0.5rem", padding: "0.75rem" }}>
                <p style={{ fontSize: "0.85rem", marginBottom: "0.25rem", opacity: 0.8 }}>Salarios Anuales</p>
                <p style={{ fontSize: "1.2rem", fontWeight: 700, margin: 0 }}>Q {resultado.datos.salariosAnuales.toFixed(2)}</p>
              </div>
              <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: "0.5rem", padding: "0.75rem" }}>
                <p style={{ fontSize: "0.85rem", marginBottom: "0.25rem", opacity: 0.8 }}>Bonificación Anual</p>
                <p style={{ fontSize: "1.2rem", fontWeight: 700, margin: 0 }}>Q {resultado.datos.bonificacionAnual.toFixed(2)}</p>
              </div>
              <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: "0.5rem", padding: "0.75rem" }}>
                <p style={{ fontSize: "0.85rem", marginBottom: "0.25rem", opacity: 0.8 }}>Aguinaldo</p>
                <p style={{ fontSize: "1.2rem", fontWeight: 700, margin: 0 }}>Q {resultado.datos.aguinaldo.toFixed(2)}</p>
              </div>
              <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: "0.5rem", padding: "0.75rem" }}>
                <p style={{ fontSize: "0.85rem", marginBottom: "0.25rem", opacity: 0.8 }}>Bono 14</p>
                <p style={{ fontSize: "1.2rem", fontWeight: 700, margin: 0 }}>Q {resultado.datos.bono14.toFixed(2)}</p>
              </div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.25)", borderRadius: "0.75rem", padding: "1rem", marginTop: "0.75rem" }}>
              <p style={{ fontSize: "0.9rem", marginBottom: "0.25rem", opacity: 0.9 }}>Total Renta Bruta:</p>
              <p style={{ fontSize: "2rem", fontWeight: 800, margin: 0 }}>Q {resultado.datos.totalRentaBruta.toFixed(2)}</p>
            </div>
          </div>

          {/* Sección 2: Rentas Exentas */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.75rem", borderBottom: "2px solid rgba(255,255,255,0.3)", paddingBottom: "0.5rem" }}>
              2️⃣ (-) Rentas Exentas
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.75rem" }}>
              <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: "0.5rem", padding: "0.75rem" }}>
                <p style={{ fontSize: "0.85rem", marginBottom: "0.25rem", opacity: 0.8 }}>Aguinaldo Exento</p>
                <p style={{ fontSize: "1.2rem", fontWeight: 700, margin: 0 }}>Q {resultado.datos.aguinaldoExento.toFixed(2)}</p>
              </div>
              <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: "0.5rem", padding: "0.75rem" }}>
                <p style={{ fontSize: "0.85rem", marginBottom: "0.25rem", opacity: 0.8 }}>Bono 14 Exento</p>
                <p style={{ fontSize: "1.2rem", fontWeight: 700, margin: 0 }}>Q {resultado.datos.bono14Exento.toFixed(2)}</p>
              </div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.25)", borderRadius: "0.75rem", padding: "1rem", marginTop: "0.75rem" }}>
              <p style={{ fontSize: "0.9rem", marginBottom: "0.25rem", opacity: 0.9 }}>Total Rentas Exentas:</p>
              <p style={{ fontSize: "2rem", fontWeight: 800, margin: 0 }}>- Q {resultado.datos.totalRentasExentas.toFixed(2)}</p>
            </div>
          </div>

          {/* Sección 3: Renta Neta */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.75rem", borderBottom: "2px solid rgba(255,255,255,0.3)", paddingBottom: "0.5rem" }}>
              3️⃣ (=) Renta Neta
            </h3>
            <div style={{ background: "rgba(255,255,255,0.25)", borderRadius: "0.75rem", padding: "1rem" }}>
              <p style={{ fontSize: "2rem", fontWeight: 800, margin: 0 }}>Q {resultado.datos.rentaNeta.toFixed(2)}</p>
            </div>
          </div>

          {/* Sección 4: Deducciones */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.75rem", borderBottom: "2px solid rgba(255,255,255,0.3)", paddingBottom: "0.5rem" }}>
              4️⃣ (-) Deducciones
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.75rem" }}>
              <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: "0.5rem", padding: "0.75rem" }}>
                <p style={{ fontSize: "0.85rem", marginBottom: "0.25rem", opacity: 0.8 }}>Gastos Personales</p>
                <p style={{ fontSize: "1.2rem", fontWeight: 700, margin: 0 }}>Q {resultado.datos.gastosPersonales.toFixed(2)}</p>
              </div>
              <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: "0.5rem", padding: "0.75rem" }}>
                <p style={{ fontSize: "0.85rem", marginBottom: "0.25rem", opacity: 0.8 }}>Cuota IGSS (4.83%)</p>
                <p style={{ fontSize: "1.2rem", fontWeight: 700, margin: 0 }}>Q {resultado.datos.cuotaIGSS.toFixed(2)}</p>
              </div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.25)", borderRadius: "0.75rem", padding: "1rem", marginTop: "0.75rem" }}>
              <p style={{ fontSize: "0.9rem", marginBottom: "0.25rem", opacity: 0.9 }}>Total Deducciones:</p>
              <p style={{ fontSize: "2rem", fontWeight: 800, margin: 0 }}>- Q {resultado.datos.totalDeducciones.toFixed(2)}</p>
            </div>
          </div>

          {/* Sección 5: Renta Imponible e ISR */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.75rem", borderBottom: "2px solid rgba(255,255,255,0.3)", paddingBottom: "0.5rem" }}>
              5️⃣ Cálculo de ISR
            </h3>
            <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: "0.75rem", padding: "1rem", marginBottom: "0.75rem" }}>
              <p style={{ fontSize: "0.9rem", marginBottom: "0.25rem", opacity: 0.9 }}>Renta Imponible:</p>
              <p style={{ fontSize: "1.8rem", fontWeight: 800, margin: 0 }}>Q {resultado.datos.rentaImponible.toFixed(2)}</p>
            </div>
            <div style={{ background: "rgba(255,255,255,0.3)", borderRadius: "0.75rem", padding: "1.5rem", marginBottom: "0.75rem" }}>
              <p style={{ fontSize: "0.9rem", marginBottom: "0.25rem", opacity: 0.9 }}>ISR Anual:</p>
              <p style={{ fontSize: "2.5rem", fontWeight: 800, margin: 0 }}>Q {resultado.datos.isrAnual.toFixed(2)}</p>
            </div>
            {resultado.datos.retencionMensual > 0 && (
              <div style={{ background: "rgba(255,255,255,0.3)", borderRadius: "0.75rem", padding: "1.5rem" }}>
                <p style={{ fontSize: "0.9rem", marginBottom: "0.25rem", opacity: 0.9 }}>Retención Mensual:</p>
                <p style={{ fontSize: "2.5rem", fontWeight: 800, margin: 0 }}>Q {resultado.datos.retencionMensual.toFixed(2)}</p>
              </div>
            )}
          </div>

          {/* Detalle */}
          <div
            style={{
              background: "rgba(255,255,255,0.1)",
              borderRadius: "0.75rem",
              padding: "1rem",
              fontSize: "0.9rem",
              lineHeight: 1.6,
              marginBottom: "1rem",
            }}
          >
            <strong>📋 Resumen:</strong> {resultado.datos.detalleCalculo}
          </div>

          {/* Botón Descargar PDF */}
          <button
            onClick={handleDownloadPDF}
            style={{
              width: "100%",
              padding: "1rem",
              borderRadius: "0.75rem",
              border: "2px solid white",
              background: "rgba(255,255,255,0.2)",
              color: "white",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: "1rem",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.3)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.2)";
            }}
          >
            📄 Descargar Resultado en PDF
          </button>

        </div>
      )}
    </div>
  );
};

export default ISRLaboralPage;