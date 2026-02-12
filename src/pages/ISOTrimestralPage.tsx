// src/pages/ISOTrimestralPage.tsx
// ✅ ACTUALIZADO según Video YouTube - Nueva lógica margen 4% + regla activos
import { useState } from "react";
import type { FormEvent } from "react";
import type {
  ISOTrimestralRequest,
  ISOTrimestralResponse,
  RespuestaApi,
} from "../types/calculadoras";
import { calcularISOTrimestral } from "../services/calculadorasService";
import { generateISOTrimestralPDF } from "../utils/pdfGenerator";

const ISOTrimestralPage: React.FC = () => {
  const [form, setForm] = useState<ISOTrimestralRequest>({
    ingresosBrutosAnuales: 0,
    costoDeVentas: 0,  // ✅ NUEVO
    activoTotal: 0,
    depreciacionAmortizacionAcumulada: 0,
    reservaCuentasIncobrables: 0,
    creditosReinversion: 0,
    iusiPagado: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<RespuestaApi<ISOTrimestralResponse> | null>(null);

  const handleChange = (field: keyof ISOTrimestralRequest) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseFloat(e.target.value);
    setForm((prev) => ({
      ...prev,
      [field]: isNaN(value) ? 0 : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResultado(null);

    try {
      const res = await calcularISOTrimestral(form);
      console.log('✅ Respuesta recibida del backend:', res);
      setResultado(res);
    } catch (err: any) {
      console.error('❌ Error al calcular ISO Trimestral:', err);
      setError(err.message ?? "Error al calcular el ISO trimestral.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (resultado && resultado.datos) {
      generateISOTrimestralPDF({
        ...form,
        ...resultado.datos,
      });
    }
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "1rem" }}>
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
          🏦 Calculadora ISO Trimestral
        </h1>
        <p style={{ fontSize: "1.1rem", color: "#64748b", lineHeight: 1.6 }}>
          Calcula el <strong>Impuesto de Solidaridad (ISO)</strong> según el Decreto 73-2008.
        </p>
      </div>

      {/* Información importante - ✅ ACTUALIZADA */}
      <div
        style={{
          background: "#dbeafe",
          border: "2px solid #3b82f6",
          borderRadius: "1rem",
          padding: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.5rem", color: "#1e3a8a" }}>
          ℹ️ Cálculo ISO
        </h3>
        
        {/* PASO 1 */}
        <div style={{ marginBottom: "1rem" }}>
          <p style={{ margin: "0.5rem 0", color: "#1e40af", fontWeight: 600 }}>
            📌 Paso 1: Verificar si está afecto al ISO
          </p>
          <p style={{ margin: "0.25rem 0 0.25rem 1rem", color: "#1e40af", fontSize: "0.95rem" }}>
            Margen = (Ingresos - Costo de Ventas) / Ingresos
          </p>
          <p style={{ margin: "0.25rem 0 0.5rem 1rem", color: "#dc2626", fontWeight: 600, fontSize: "0.95rem" }}>
            ⚠️ Si Margen {'<'} 4% → NO paga ISO
          </p>
        </div>

        {/* PASO 2 */}
        <div>
          <p style={{ margin: "0.5rem 0", color: "#1e40af", fontWeight: 600 }}>
            📌 Paso 2: Si está afecto, determinar el método:
          </p>
          <ul style={{ margin: "0.25rem 0", paddingLeft: "2rem", color: "#1e40af", fontSize: "0.95rem", lineHeight: 1.6 }}>
            <li>Si <strong>Activo Neto {'>'} 4×Ingresos</strong> → Calcular sobre <strong>Ingresos</strong></li>
            <li>Si <strong>Activo Neto ≤ 4×Ingresos</strong> → Calcular sobre <strong>1/4 del Activo Neto</strong></li>
          </ul>
        </div>

        <p style={{ marginTop: "1rem", color: "#1e40af", fontSize: "0.9rem", fontStyle: "italic" }}>
          💡 La tasa del ISO es del <strong>1%</strong> sobre la base calculada
        </p>
      </div>
      {/* Formulario - ✅ ACTUALIZADO con Costo de Ventas */}
      <div
        style={{
          background: "white",
          borderRadius: "1rem",
          padding: "2rem",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          marginBottom: "2rem",
        }}
      >
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          
          {/* SECCIÓN 1: INGRESOS Y COSTOS (para margen 4%) */}
          <div>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "1rem", color: "#3b82f6" }}>
              📊 Paso 1: Verificación de Margen 4%
            </h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {/* Ingresos Brutos */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontWeight: 600,
                    marginBottom: "0.5rem",
                    color: "#0f172a",
                  }}
                >
                  Ingresos Brutos Anuales (Q):
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={form.ingresosBrutosAnuales || ""}
                  onChange={handleChange("ingresosBrutosAnuales")}
              placeholder="0"
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
                  Total de ingresos anuales (servicios prestados + ventas)
                </small>
              </div>

              {/* ✅ NUEVO: Costo de Ventas */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontWeight: 600,
                    marginBottom: "0.5rem",
                    color: "#0f172a",
                  }}
                >
                  Costo de Ventas Anual (Q):
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={form.costoDeVentas || ""}
                  onChange={handleChange("costoDeVentas")}
              placeholder="0"
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
                  Costo total de ventas del año (necesario para verificar margen 4%)
                </small>
              </div>
            </div>
          </div>

          {/* SECCIÓN 2: ACTIVO NETO */}
          <div
            style={{
              background: "#f8fafc",
              borderRadius: "0.75rem",
              padding: "1.5rem",
            }}
          >
            <h3 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "1rem", color: "#0ea5e9" }}>
              🏢 Paso 2: Componentes del Activo Neto
            </h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {/* Activo Total */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontWeight: 600,
                    marginBottom: "0.5rem",
                    color: "#0f172a",
                  }}
                >
                  Activo Total (Q):
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={form.activoTotal || ""}
                  onChange={handleChange("activoTotal")}
              placeholder="0"
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
                  Suma de todos los activos de la empresa
                </small>
              </div>

              {/* Depreciación */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontWeight: 600,
                    marginBottom: "0.5rem",
                    color: "#0f172a",
                  }}
                >
                  (-) Depreciación y Amortización Acumulada (Q):
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={form.depreciacionAmortizacionAcumulada || ""}
                  onChange={handleChange("depreciacionAmortizacionAcumulada")}
              placeholder="0"
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
                  Pérdida de valor acumulada de activos fijos e intangibles
                </small>
              </div>

              {/* Reserva Cuentas Incobrables */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontWeight: 600,
                    marginBottom: "0.5rem",
                    color: "#0f172a",
                  }}
                >
                  (-) Reserva de Cuentas Incobrables (Q):
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={form.reservaCuentasIncobrables || ""}
                  onChange={handleChange("reservaCuentasIncobrables")}
              placeholder="0"
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
                  Provisión para cuentas por cobrar de dudoso recaudo
                </small>
              </div>

              {/* Créditos por Reinversión */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontWeight: 600,
                    marginBottom: "0.5rem",
                    color: "#0f172a",
                  }}
                >
                  (-) Créditos por Reinversión (Q):
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={form.creditosReinversion || ""}
                  onChange={handleChange("creditosReinversion")}
              placeholder="0"
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
                  Beneficios fiscales por inversión en activos productivos
                </small>
              </div>

              {/* IUSI Pagado */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontWeight: 600,
                    marginBottom: "0.5rem",
                    color: "#0f172a",
                  }}
                >
                  IUSI Pagado en el Trimestre (Q):
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={form.iusiPagado || ""}
                  onChange={handleChange("iusiPagado")}
              placeholder="0"
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
                  Impuesto Único Sobre Inmuebles pagado (se acredita al ISO sobre Activo)
                </small>
              </div>
            </div>
          </div>

          {/* Botón de Cálculo */}
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "1rem 2rem",
              borderRadius: "0.75rem",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: 700,
              fontSize: "1.1rem",
              background: "linear-gradient(135deg, #3b82f6, #2563eb)",
              color: "white",
              boxShadow: "0 4px 15px rgba(59,130,246,0.3)",
              transition: "transform 0.2s",
            }}
            onMouseOver={(e) =>
              !loading && (e.currentTarget.style.transform = "scale(1.02)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {loading ? "Calculando..." : "Calcular ISO Trimestral"}
          </button>
        </form>
      </div>
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

      {/* Resultado - ✅ ACTUALIZADO con nueva lógica */}
      {resultado && resultado.datos && (
        <div
          style={{
            background: resultado.datos.estaAfectoISO 
              ? "linear-gradient(135deg, #3b82f6, #2563eb)"
              : "linear-gradient(135deg, #10b981, #059669)",
            borderRadius: "1rem",
            padding: "2rem",
            color: "white",
            boxShadow: resultado.datos.estaAfectoISO
              ? "0 10px 40px rgba(59,130,246,0.4)"
              : "0 10px 40px rgba(16,185,129,0.4)",
          }}
        >
          <h2 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "0.5rem" }}>
            {resultado.datos.estaAfectoISO ? "✅ Resultado del Cálculo" : "✅ NO Afecto al ISO"}
          </h2>
          
          {/* PASO 1: Verificación Margen 4% */}
          <div
            style={{
              background: "rgba(255,255,255,0.15)",
              borderRadius: "0.75rem",
              padding: "1.5rem",
              marginBottom: "1.5rem",
            }}
          >
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1rem" }}>
              📊 Paso 1: Verificación de Margen
            </h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
              <div>
                <p style={{ fontSize: "0.85rem", opacity: 0.9, marginBottom: "0.25rem" }}>Ingresos Brutos</p>
                <p style={{ fontSize: "1.3rem", fontWeight: 700, margin: 0 }}>
                  Q {(resultado.datos.ingresosBrutos || 0).toLocaleString('es-GT', {minimumFractionDigits: 2})}
                </p>
              </div>
              
              <div>
                <p style={{ fontSize: "0.85rem", opacity: 0.9, marginBottom: "0.25rem" }}>(-) Costo de Ventas</p>
                <p style={{ fontSize: "1.3rem", fontWeight: 700, margin: 0 }}>
                  Q {(resultado.datos.costoDeVentas || 0).toLocaleString('es-GT', {minimumFractionDigits: 2})}
                </p>
              </div>
              
              <div>
                <p style={{ fontSize: "0.85rem", opacity: 0.9, marginBottom: "0.25rem" }}>(=) Resultado</p>
                <p style={{ fontSize: "1.3rem", fontWeight: 700, margin: 0 }}>
                  Q {(resultado.datos.resultadoBruto || 0).toLocaleString('es-GT', {minimumFractionDigits: 2})}
                </p>
              </div>
              
              <div>
                <p style={{ fontSize: "0.85rem", opacity: 0.9, marginBottom: "0.25rem" }}>Margen</p>
                <p style={{ 
                  fontSize: "1.5rem", 
                  fontWeight: 800, 
                  margin: 0,
                  color: resultado.datos.estaAfectoISO ? "#fbbf24" : "#4ade80"
                }}>
                  {(resultado.datos.margenPorcentaje || 0).toFixed(2)}%
                </p>
              </div>
            </div>

            <div
              style={{
                background: resultado.datos.estaAfectoISO 
                  ? "rgba(251,191,36,0.2)" 
                  : "rgba(74,222,128,0.2)",
                borderRadius: "0.5rem",
                padding: "0.75rem",
                border: resultado.datos.estaAfectoISO
                  ? "2px solid #fbbf24"
                  : "2px solid #4ade80",
              }}
            >
              <p style={{ fontSize: "1rem", fontWeight: 600, margin: 0 }}>
                {resultado.datos.estaAfectoISO 
                  ? `✅ Margen ≥ 4% → SÍ está afecto al ISO`
                  : `❌ Margen < 4% → NO está afecto al ISO`
                }
              </p>
            </div>
          </div>

          {/* Si NO está afecto, mostrar solo el mensaje */}
          {!resultado.datos.estaAfectoISO && (
            <>
              <div
                style={{
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: "0.75rem",
                  padding: "1rem",
                  fontSize: "1.05rem",
                  lineHeight: 1.6,
                  marginBottom: "1rem",
                }}
              >
                {resultado.datos.mensaje}
              </div>

              <div
                style={{
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: "0.75rem",
                  padding: "1rem",
                  fontSize: "0.95rem",
                  lineHeight: 1.6,
                }}
              >
                <strong>ℹ️ Información Legal:</strong>
                <p style={{ marginTop: "0.5rem", marginBottom: 0 }}>
                  {resultado.datos.recomendacionLegal}
                </p>
              </div>
            </>
          )}

          {/* Si SÍ está afecto, mostrar PASO 2 y cálculo */}
          {resultado.datos.estaAfectoISO && (
            <>
              {/* PASO 2: Decisión del Método */}
              <div
                style={{
                  background: "rgba(255,255,255,0.15)",
                  borderRadius: "0.75rem",
                  padding: "1.5rem",
                  marginBottom: "1.5rem",
                }}
              >
                <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1rem" }}>
                  🎯 Paso 2: Determinación del Método
                </h3>
                
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
                  <div>
                    <p style={{ fontSize: "0.85rem", opacity: 0.9, marginBottom: "0.25rem" }}>Activo Neto</p>
                    <p style={{ fontSize: "1.3rem", fontWeight: 700, margin: 0 }}>
                      Q {(resultado.datos.activoNeto || 0).toLocaleString('es-GT', {minimumFractionDigits: 2})}
                    </p>
                  </div>
                  
                  <div>
                    <p style={{ fontSize: "0.85rem", opacity: 0.9, marginBottom: "0.25rem" }}>4 × Ingresos</p>
                    <p style={{ fontSize: "1.3rem", fontWeight: 700, margin: 0 }}>
                      Q {(resultado.datos.comparacionActivo || 0).toLocaleString('es-GT', {minimumFractionDigits: 2})}
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    background: "rgba(251,191,36,0.2)",
                    borderRadius: "0.5rem",
                    padding: "0.75rem",
                    border: "2px solid #fbbf24",
                  }}
                >
                  <p style={{ fontSize: "0.95rem", fontWeight: 600, margin: 0, marginBottom: "0.25rem" }}>
                    ⭐ Método Seleccionado: {resultado.datos.metodoSeleccionado}
                  </p>
                  <p style={{ fontSize: "0.85rem", margin: 0, opacity: 0.9 }}>
                    {resultado.datos.razonMetodo}
                  </p>
                </div>
              </div>

              {/* PASO 3: Cálculo del ISO */}
              <div
                style={{
                  background: "rgba(255,255,255,0.15)",
                  borderRadius: "0.75rem",
                  padding: "1.5rem",
                  marginBottom: "1.5rem",
                }}
              >
                <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1rem" }}>
                  📝 Paso 3: Cálculo del ISO
                </h3>
                
                <div style={{ fontSize: "1rem", lineHeight: 1.8 }}>
                  {resultado.datos.detalleCalculo}
                </div>
              </div>

              {/* ISO a Pagar */}
              <div
                style={{
                  background: "rgba(255,255,255,0.25)",
                  borderRadius: "0.75rem",
                  padding: "1.5rem",
                  marginBottom: "1rem",
                }}
              >
                <p style={{ fontSize: "1rem", marginBottom: "0.5rem", opacity: 0.9 }}>
                  ISO a Pagar (Trimestral):
                </p>
                <p style={{ fontSize: "3rem", fontWeight: 800, margin: 0 }}>
                  Q {(resultado.datos.isoAPagar || 0).toLocaleString('es-GT', {minimumFractionDigits: 2})}
                </p>
              </div>

              {/* Información Legal */}
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
                <strong>ℹ️ Información Legal:</strong>
                <p style={{ marginTop: "0.5rem", marginBottom: 0 }}>
                  {resultado.datos.recomendacionLegal}
                </p>
              </div>
            </>
          )}

          {/* Botón Nueva Consulta + Descargar PDF */}
          <div style={{ display: "grid", gridTemplateColumns: resultado.datos.estaAfectoISO ? "1fr 1fr" : "1fr", gap: "1rem" }}>
            <button
              type="button"
              onClick={() => {
                setResultado(null);
                setError(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
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
              🔄 Nueva Consulta
            </button>

            {resultado.datos.estaAfectoISO && (
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
                📄 Descargar PDF
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ISOTrimestralPage;