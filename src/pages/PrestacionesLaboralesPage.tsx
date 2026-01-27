import { useState } from "react";
import type { FormEvent } from "react";
import type {
  PrestacionesCompletasRequest,
  PrestacionesCompletasResponse,
  RespuestaApi,
  TipoTerminacion,
} from "../types/calculadoras";
import { calcularPrestacionesCompletas } from "../services/calculadorasService";
import { generatePrestacionesCompletasPDF } from "../utils/pdfGenerator";

const PrestacionesLaboralesPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showInfo, setShowInfo] = useState(true);

  const [form, setForm] = useState<PrestacionesCompletasRequest>({
    fechaInicio: "",
    fechaFin: "",
    salarioOrdinario: 0,
    salariosUltimos6Meses: [],
    tipoTerminacion: 1, // DespidoInjustificado por defecto
    diasVacacionesPendientes: 0,
    yaRecibioAguinaldo: false,
    yaRecibiBono14: false,
    montoPensionIGSS: undefined,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<RespuestaApi<PrestacionesCompletasResponse> | null>(null);

  // Funciones auxiliares
  const handleUsarFechaHoy = () => {
    const hoy = new Date().toISOString().split("T")[0];
    setForm((prev) => ({ ...prev, fechaFin: hoy }));
  };

  const canGoNext = (): boolean => {
    if (currentStep === 1) {
      return form.fechaInicio !== "" && form.fechaFin !== "";
    }
    if (currentStep === 2) {
      return form.tipoTerminacion > 0;
    }
    if (currentStep === 3) {
      return form.salarioOrdinario > 0;
    }
    return true;
  };

  const handleNext = () => {
    if (canGoNext() && currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResultado(null);

    try {
      const res = await calcularPrestacionesCompletas(form);
      setResultado(res);
      setCurrentStep(6); // Ir a resultado
    } catch (err: any) {
      setError(err.message ?? "Ocurrió un error al calcular las prestaciones.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (resultado && resultado.datos) {
      const tipoTerminacionTexto = {
        1: "Despido injustificado",
        2: "Despido justificado",
        3: "Renuncia voluntaria",
        4: "Renuncia por causa justa",
        5: "Pensión IGSS",
      }[form.tipoTerminacion] || "No especificado";

      generatePrestacionesCompletasPDF({
        ...form,
        tipoTerminacion: tipoTerminacionTexto,
        ...resultado.datos,
      });
    }
  };

  const handleNuevaConsulta = () => {
    setForm({
      fechaInicio: "",
      fechaFin: "",
      salarioOrdinario: 0,
      salariosUltimos6Meses: [],
      tipoTerminacion: 1,
      diasVacacionesPendientes: 0,
      yaRecibioAguinaldo: false,
      yaRecibiBono14: false,
      montoPensionIGSS: undefined,
    });
    setResultado(null);
    setError(null);
    setCurrentStep(0);
    setShowInfo(true);
  };

  // ==========================================
  // PASO 0: Información
  // ==========================================
  if (showInfo) {
    return (
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "1rem", color: "#0f172a" }}>
          📋 Calculadora de Prestaciones Laborales
        </h1>

        <div
          style={{
            background: "linear-gradient(135deg, #f8fafc, #e2e8f0)",
            borderRadius: "1rem",
            padding: "2rem",
            marginBottom: "2rem",
            border: "2px solid #cbd5e1",
          }}
        >
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem", color: "#1e293b" }}>
            ¿Qué son las Prestaciones Laborales?
          </h2>

          <p style={{ fontSize: "1rem", lineHeight: 1.6, color: "#475569", marginBottom: "1.5rem" }}>
            Son todos los pagos que el empleador <strong>DEBE</strong> hacer al trabajador cuando finaliza
            la relación laboral, según el Código de Trabajo de Guatemala.
          </p>

          <div
            style={{
              background: "white",
              borderRadius: "0.75rem",
              padding: "1.5rem",
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            }}
          >
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1rem", color: "#0f172a" }}>
              Esta calculadora incluye:
            </h3>

            <ul style={{ lineHeight: 2, color: "#475569", paddingLeft: "1.5rem" }}>
              <li>
                <strong>Indemnización</strong> (en casos aplicables)
              </li>
              <li>
                <strong>Aguinaldo proporcional</strong>
              </li>
              <li>
                <strong>Bono 14 proporcional</strong>
              </li>
              <li>
                <strong>Vacaciones no gozadas</strong>
              </li>
              <li>
                <strong>Bonificación incentivo Q250</strong>
              </li>
            </ul>
          </div>

          <button
            onClick={() => {
              setShowInfo(false);
              setCurrentStep(1);
            }}
            style={{
              width: "100%",
              marginTop: "2rem",
              padding: "1rem 2rem",
              borderRadius: "0.75rem",
              border: "none",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: "1.1rem",
              background: "linear-gradient(135deg, #3b82f6, #60a5fa)",
              color: "white",
              boxShadow: "0 4px 15px rgba(59,130,246,0.3)",
            }}
          >
            Comenzar Cálculo →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem" }}>
      <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "0.5rem", color: "#0f172a" }}>
        📋 Prestaciones Laborales
      </h1>
      <p style={{ fontSize: "1rem", color: "#64748b", marginBottom: "2rem" }}>
        Paso {currentStep} de 5
      </p>

      {/* Progress Bar */}
      <div
        style={{
          width: "100%",
          height: "8px",
          background: "#e2e8f0",
          borderRadius: "9999px",
          marginBottom: "2rem",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${(currentStep / 5) * 100}%`,
            height: "100%",
            background: "linear-gradient(90deg, #3b82f6, #60a5fa)",
            transition: "width 0.3s ease",
          }}
        />
      </div>

      <form onSubmit={handleSubmit}>
        {/* PASO 1: FECHAS */}
        {currentStep === 1 && (
          <div
            style={{
              background: "white",
              borderRadius: "1rem",
              padding: "2rem",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            <h2 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: "1.5rem", color: "#0f172a" }}>
              📅 Período Laboral
            </h2>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem", color: "#0f172a" }}>
                Fecha de inicio de labores:
              </label>
              <input
                type="date"
                value={form.fechaInicio}
                onChange={(e) => setForm((prev) => ({ ...prev, fechaInicio: e.target.value }))}
                required
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "0.5rem",
                  border: "2px solid #e2e8f0",
                  fontSize: "1rem",
                }}
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem", color: "#0f172a" }}>
                Fecha de salida/cálculo:
              </label>
              <input
                type="date"
                value={form.fechaFin}
                onChange={(e) => setForm((prev) => ({ ...prev, fechaFin: e.target.value }))}
                required
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "0.5rem",
                  border: "2px solid #e2e8f0",
                  fontSize: "1rem",
                  marginBottom: "0.5rem",
                }}
              />
              <button
                type="button"
                onClick={handleUsarFechaHoy}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "0.5rem",
                  border: "2px solid #3b82f6",
                  background: "white",
                  color: "#3b82f6",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                }}
              >
                Usar fecha de hoy
              </button>
            </div>

            <button
              type="button"
              onClick={handleNext}
              disabled={!canGoNext()}
              style={{
                width: "100%",
                padding: "1rem 2rem",
                borderRadius: "0.75rem",
                border: "none",
                cursor: canGoNext() ? "pointer" : "not-allowed",
                fontWeight: 700,
                fontSize: "1.1rem",
                background: canGoNext()
                  ? "linear-gradient(135deg, #3b82f6, #60a5fa)"
                  : "#cbd5e1",
                color: "white",
                opacity: canGoNext() ? 1 : 0.6,
              }}
            >
              Siguiente →
            </button>
          </div>
        )}

        {/* PASO 2: TIPO DE TERMINACIÓN */}
        {currentStep === 2 && (
          <div
            style={{
              background: "white",
              borderRadius: "1rem",
              padding: "2rem",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            <h2 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: "1.5rem", color: "#0f172a" }}>
              ⚖️ Tipo de Terminación
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[
                { value: 1, label: "Despido sin causa justificada", desc: "Da derecho a indemnización" },
                { value: 2, label: "Despido con causa justificada", desc: "Sin indemnización" },
                { value: 3, label: "Renuncia voluntaria", desc: "Sin indemnización" },
                { value: 4, label: "Renuncia por causa justa", desc: "Con indemnización" },
                { value: 5, label: "Pensión IGSS", desc: "Casos especiales" },
              ].map((option) => (
                <label
                  key={option.value}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "1rem",
                    borderRadius: "0.5rem",
                    border:
                      form.tipoTerminacion === option.value ? "2px solid #3b82f6" : "2px solid #e2e8f0",
                    background: form.tipoTerminacion === option.value ? "#eff6ff" : "white",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="radio"
                    name="tipoTerminacion"
                    value={option.value}
                    checked={form.tipoTerminacion === option.value}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, tipoTerminacion: Number(e.target.value) as TipoTerminacion }))
                    }
                    style={{ marginRight: "1rem", width: "20px", height: "20px" }}
                  />
                  <div>
                    <div style={{ fontWeight: 600, color: "#0f172a" }}>{option.label}</div>
                    <div style={{ fontSize: "0.85rem", color: "#64748b" }}>{option.desc}</div>
                  </div>
                </label>
              ))}
            </div>

            <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
              <button
                type="button"
                onClick={handlePrev}
                style={{
                  flex: 1,
                  padding: "1rem 2rem",
                  borderRadius: "0.75rem",
                  border: "2px solid #e2e8f0",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  background: "white",
                  color: "#64748b",
                }}
              >
                ← Anterior
              </button>
              <button
                type="button"
                onClick={handleNext}
                style={{
                  flex: 1,
                  padding: "1rem 2rem",
                  borderRadius: "0.75rem",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  background: "linear-gradient(135deg, #3b82f6, #60a5fa)",
                  color: "white",
                }}
              >
                Siguiente →
              </button>
            </div>
          </div>
        )}

        {/* PASO 3: SALARIOS */}
        {currentStep === 3 && (
          <div
            style={{
              background: "white",
              borderRadius: "1rem",
              padding: "2rem",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            <h2 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: "1.5rem", color: "#0f172a" }}>
              💰 Información Salarial
            </h2>

            <div
              style={{
                background: "#fee2e2",
                borderRadius: "0.5rem",
                padding: "0.75rem",
                marginBottom: "1.5rem",
                borderLeft: "4px solid #ef4444",
              }}
            >
              <p style={{ fontSize: "0.85rem", margin: 0, color: "#991b1b", fontWeight: 600 }}>
                ⚠️ IMPORTANTE: NO incluir bonificación incentivo (Q250) en el salario
              </p>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem", color: "#0f172a" }}>
                Salario ordinario mensual (sin Q250):
              </label>
              <input
                type="number"
                step="0.01"
                value={form.salarioOrdinario}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, salarioOrdinario: parseFloat(e.target.value) || 0 }))
                }
                required
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "0.5rem",
                  border: "2px solid #e2e8f0",
                  fontSize: "1rem",
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
              <button
                type="button"
                onClick={handlePrev}
                style={{
                  flex: 1,
                  padding: "1rem 2rem",
                  borderRadius: "0.75rem",
                  border: "2px solid #e2e8f0",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  background: "white",
                  color: "#64748b",
                }}
              >
                ← Anterior
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={!canGoNext()}
                style={{
                  flex: 1,
                  padding: "1rem 2rem",
                  borderRadius: "0.75rem",
                  border: "none",
                  cursor: canGoNext() ? "pointer" : "not-allowed",
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  background: canGoNext()
                    ? "linear-gradient(135deg, #3b82f6, #60a5fa)"
                    : "#cbd5e1",
                  color: "white",
                  opacity: canGoNext() ? 1 : 0.6,
                }}
              >
                Siguiente →
              </button>
            </div>
          </div>
        )}

        {/* PASO 4: VACACIONES */}
        {currentStep === 4 && (
          <div
            style={{
              background: "white",
              borderRadius: "1rem",
              padding: "2rem",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            <h2 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: "1.5rem", color: "#0f172a" }}>
              🏖️ Vacaciones No Gozadas
            </h2>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem", color: "#0f172a" }}>
                Días de vacaciones pendientes:
              </label>
              <input
                type="number"
                value={form.diasVacacionesPendientes}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, diasVacacionesPendientes: parseInt(e.target.value) || 0 }))
                }
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "0.5rem",
                  border: "2px solid #e2e8f0",
                  fontSize: "1rem",
                }}
              />
              <p style={{ fontSize: "0.85rem", color: "#64748b", marginTop: "0.5rem" }}>
                Si no sabe, puede poner 0 (se calculará basado en años trabajados)
              </p>
            </div>

            <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
              <button
                type="button"
                onClick={handlePrev}
                style={{
                  flex: 1,
                  padding: "1rem 2rem",
                  borderRadius: "0.75rem",
                  border: "2px solid #e2e8f0",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  background: "white",
                  color: "#64748b",
                }}
              >
                ← Anterior
              </button>
              <button
                type="button"
                onClick={handleNext}
                style={{
                  flex: 1,
                  padding: "1rem 2rem",
                  borderRadius: "0.75rem",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  background: "linear-gradient(135deg, #3b82f6, #60a5fa)",
                  color: "white",
                }}
              >
                Siguiente →
              </button>
            </div>
          </div>
        )}

        {/* PASO 5: PRESTACIONES RECIBIDAS */}
        {currentStep === 5 && (
          <div
            style={{
              background: "white",
              borderRadius: "1rem",
              padding: "2rem",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            <h2 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: "1.5rem", color: "#0f172a" }}>
              ✅ Prestaciones ya Pagadas
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "1rem",
                  borderRadius: "0.5rem",
                  border: "2px solid #e2e8f0",
                  background: "white",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={form.yaRecibioAguinaldo}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, yaRecibioAguinaldo: e.target.checked }))
                  }
                  style={{ marginRight: "1rem", width: "20px", height: "20px" }}
                />
                <div>
                  <div style={{ fontWeight: 600, color: "#0f172a" }}>Ya recibí el aguinaldo del período actual</div>
                </div>
              </label>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "1rem",
                  borderRadius: "0.5rem",
                  border: "2px solid #e2e8f0",
                  background: "white",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={form.yaRecibiBono14}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, yaRecibiBono14: e.target.checked }))
                  }
                  style={{ marginRight: "1rem", width: "20px", height: "20px" }}
                />
                <div>
                  <div style={{ fontWeight: 600, color: "#0f172a" }}>Ya recibí el Bono 14 del período actual</div>
                </div>
              </label>
            </div>

            <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
              <button
                type="button"
                onClick={handlePrev}
                style={{
                  flex: 1,
                  padding: "1rem 2rem",
                  borderRadius: "0.75rem",
                  border: "2px solid #e2e8f0",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  background: "white",
                  color: "#64748b",
                }}
              >
                ← Anterior
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  flex: 1,
                  padding: "1rem 2rem",
                  borderRadius: "0.75rem",
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  background: loading
                    ? "#cbd5e1"
                    : "linear-gradient(135deg, #10b981, #34d399)",
                  color: "white",
                }}
              >
                {loading ? "Calculando..." : "✓ Calcular"}
              </button>
            </div>
          </div>
        )}

        {/* PASO 6: RESULTADO */}
        {currentStep === 6 && resultado && resultado.datos && (
          <div>
            {/* Error */}
            {error && (
              <div
                style={{
                  padding: "1rem",
                  borderRadius: "0.75rem",
                  background: "#fee2e2",
                  border: "2px solid #fca5a5",
                  color: "#991b1b",
                  marginBottom: "2rem",
                }}
              >
                <strong>Error:</strong> {error}
              </div>
            )}

            {/* Resultado */}
            <div
              style={{
                background: "linear-gradient(135deg, #1e3a8a, #3b82f6)",
                borderRadius: "1rem",
                padding: "2rem",
                color: "white",
                boxShadow: "0 10px 40px rgba(59,130,246,0.4)",
              }}
            >
              <h2 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "1.5rem", textAlign: "center" }}>
                🎉 Liquidación Completa
              </h2>

              {/* Desglose */}
              <div
                style={{
                  background: "rgba(255,255,255,0.15)",
                  borderRadius: "0.75rem",
                  padding: "1.5rem",
                  marginBottom: "1.5rem",
                }}
              >
                {[
                  { label: "1. Indemnización", data: resultado.datos.indemnizacion },
                  { label: "2. Aguinaldo", data: resultado.datos.aguinaldo },
                  { label: "3. Bono 14", data: resultado.datos.bono14 },
                  { label: "4. Vacaciones", data: resultado.datos.vacaciones },
                  { label: "5. Bonificación Q250", data: resultado.datos.bonificacion250 },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "0.75rem 0",
                      borderBottom: idx < 4 ? "1px solid rgba(255,255,255,0.2)" : "none",
                    }}
                  >
                    <span style={{ fontSize: "1rem", opacity: item.data.aplica ? 1 : 0.6 }}>
                      {item.label}
                      {!item.data.aplica && " (No aplica)"}
                    </span>
                    <span style={{ fontSize: "1rem", fontWeight: 700, opacity: item.data.aplica ? 1 : 0.6 }}>
                      Q {item.data.monto.toFixed(2)}
                    </span>
                  </div>
                ))}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "1rem 0",
                    marginTop: "1rem",
                    borderTop: "2px solid rgba(255,255,255,0.4)",
                  }}
                >
                  <span style={{ fontSize: "1.3rem", fontWeight: 700 }}>TOTAL:</span>
                  <span style={{ fontSize: "1.8rem", fontWeight: 800 }}>
                    Q {resultado.datos.totalLiquidacion.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Advertencias */}
              {resultado.datos.advertencias.length > 0 && (
                <div
                  style={{
                    background: "rgba(251, 191, 36, 0.2)",
                    borderRadius: "0.5rem",
                    padding: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  <p style={{ fontSize: "0.9rem", fontWeight: 600, marginBottom: "0.5rem" }}>⚠️ Advertencias:</p>
                  {resultado.datos.advertencias.map((adv, idx) => (
                    <p key={idx} style={{ fontSize: "0.85rem", margin: "0.25rem 0" }}>
                      • {adv}
                    </p>
                  ))}
                </div>
              )}

              {/* Botones */}
              <div style={{ display: "flex", gap: "1rem" }}>
                <button
                  onClick={handleDownloadPDF}
                  style={{
                    flex: 1,
                    padding: "0.875rem 2rem",
                    borderRadius: "0.75rem",
                    border: "2px solid white",
                    background: "white",
                    color: "#1e3a8a",
                    cursor: "pointer",
                    fontWeight: 700,
                    fontSize: "1rem",
                  }}
                >
                  📄 Descargar PDF
                </button>
                <button
                  onClick={handleNuevaConsulta}
                  style={{
                    flex: 1,
                    padding: "0.875rem 2rem",
                    borderRadius: "0.75rem",
                    border: "2px solid white",
                    background: "transparent",
                    color: "white",
                    cursor: "pointer",
                    fontWeight: 700,
                    fontSize: "1rem",
                  }}
                >
                  🔄 Nueva Consulta
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default PrestacionesLaboralesPage;
