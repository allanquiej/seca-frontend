// src/pages/IVAPage.tsx
// ACTUALIZADO: 3 deducciones separadas (IVA Crédito, IVA Retenido, IVA Exento)

import { useState } from "react";
import type { FormEvent } from "react";
import type {
  IVARequest,
  IVAResponse,
  RegimenIVA,
  RespuestaApi,
} from "../types/calculadoras";
import { calcularIVA } from "../services/calculadorasService";
import { generateIVAPDF } from "../utils/pdfGenerator";

const IVAPage: React.FC = () => {
  const [regimen, setRegimen] = useState<RegimenIVA>("general");
  const [form, setForm] = useState<IVARequest>({
    regimen: "general",
    ventasMes: 0,
    comprasMes: 0,
    ivaCredito: 0,     // Actualizado
    ivaRetenido: 0,    // Actualizado
    ivaExento: 0,      // Actualizado
    ingresosAnuales: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<RespuestaApi<IVAResponse> | null>(null);

  const handleRegimenChange = (nuevoRegimen: RegimenIVA) => {
    setRegimen(nuevoRegimen);
    setForm((prev) => ({ ...prev, regimen: nuevoRegimen }));
    setResultado(null);
    setError(null);
  };

  const handleChange = (field: keyof IVARequest) => (
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
      const res = await calcularIVA(form);
      console.log('Respuesta recibida del backend:', res);
      setResultado(res);
    } catch (err: any) {
      console.error('Error al calcular IVA:', err);
      setError(err.message ?? "Ocurrió un error al calcular el IVA.");
    } finally {
      setLoading(false);
    }
  };

  const handleDescargarPDF = () => {
  if (resultado && resultado.datos) {
    generateIVAPDF({
      regimen: form.regimen,
      ventasMes: form.ventasMes,
      comprasMes: form.comprasMes,
      ivaCredito: form.ivaCredito,
      ivaRetenido: form.ivaRetenido,
      ivaExento: form.ivaExento,
      ingresosAnuales: form.ingresosAnuales,
      regimenNombre: resultado.datos.regimenNombre,
      baseVentas: resultado.datos.baseVentas,
      baseCompras: resultado.datos.baseCompras,
      debitoFiscal: resultado.datos.debitoFiscal,
      creditoFiscal: resultado.datos.creditoFiscal,
      ivaBruto: resultado.datos.ivaBruto,
      totalDeducciones: resultado.datos.totalDeducciones,
      ivaAPagar: resultado.datos.ivaAPagar,
      cuotaFija: resultado.datos.cuotaFija,
      aplica: resultado.datos.aplica,
      mensaje: resultado.datos.mensaje,
      detalleCalculo: resultado.datos.detalleCalculo,
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
          Calculadora de IVA
        </h1>
        <p style={{ fontSize: "1.1rem", color: "#64748b", lineHeight: 1.6 }}>
          Calcula el <strong>Impuesto al Valor Agregado</strong> según tu régimen tributario.
        </p>
      </div>

      {/* Información importante */}
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
          Regímenes de IVA en Guatemala
        </h3>
        <ul style={{ margin: 0, paddingLeft: "1.5rem", color: "#1e3a8a", lineHeight: 1.8 }}>
          <li><strong>Régimen General (12%):</strong> Débito fiscal (ventas) - Crédito fiscal (compras) - Deducciones = IVA a pagar</li>
          <li><strong>Pequeño Contribuyente:</strong> Cuota fija de Q150/mes (ingresos ≤ Q150,000/año)</li>
          <li><strong>Exento:</strong> Ciertas actividades no pagan IVA</li>
        </ul>
      </div>

      {/* Selector de Régimen */}
      <div
        style={{
          background: "white",
          borderRadius: "1rem",
          padding: "1.5rem",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          marginBottom: "2rem",
        }}
      >
        <label
          style={{
            display: "block",
            fontWeight: 600,
            marginBottom: "1rem",
            color: "#0f172a",
            fontSize: "1.1rem",
          }}
        >
          Selecciona tu régimen:
        </label>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => handleRegimenChange("general")}
            style={{
              flex: "1 1 250px",
              padding: "1.25rem",
              borderRadius: "0.75rem",
              border: regimen === "general" ? "3px solid #3b82f6" : "2px solid #e2e8f0",
              background: regimen === "general" ? "#dbeafe" : "white",
              cursor: "pointer",
              fontWeight: 600,
              color: regimen === "general" ? "#1e3a8a" : "#64748b",
              transition: "all 0.2s",
            }}
          >
            Régimen General (12%)
          </button>
          <button
            type="button"
            onClick={() => handleRegimenChange("pequeno")}
            style={{
              flex: "1 1 250px",
              padding: "1.25rem",
              borderRadius: "0.75rem",
              border: regimen === "pequeno" ? "3px solid #10b981" : "2px solid #e2e8f0",
              background: regimen === "pequeno" ? "#d1fae5" : "white",
              cursor: "pointer",
              fontWeight: 600,
              color: regimen === "pequeno" ? "#065f46" : "#64748b",
              transition: "all 0.2s",
            }}
          >
            Pequeño Contribuyente
          </button>
          <button
            type="button"
            onClick={() => handleRegimenChange("exento")}
            style={{
              flex: "1 1 250px",
              padding: "1.25rem",
              borderRadius: "0.75rem",
              border: regimen === "exento" ? "3px solid #8b5cf6" : "2px solid #e2e8f0",
              background: regimen === "exento" ? "#ede9fe" : "white",
              cursor: "pointer",
              fontWeight: 600,
              color: regimen === "exento" ? "#5b21b6" : "#64748b",
              transition: "all 0.2s",
            }}
          >
            Exento de IVA
          </button>
        </div>
      </div>

      {/* Formulario */}
      <div
        style={{
          background: "white",
          borderRadius: "1rem",
          padding: "2rem",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          marginBottom: "2rem",
        }}
      >
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Campos para Régimen General */}
          {regimen === "general" && (
            <>
              <div>
                <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem", color: "#0f172a" }}>
                  Total Ventas del Mes (Q):
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.ventasMes || ""}
                  onChange={handleChange("ventasMes")}
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
                  Total facturado con IVA incluido
                </small>
              </div>

              <div>
                <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem", color: "#0f172a" }}>
                  Total Compras del Mes (Q):
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.comprasMes || ""}
                  onChange={handleChange("comprasMes")}
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
                  Total compras con IVA incluido
                </small>
              </div>

              {/* NUEVO: 3 Deducciones Separadas */}
              <div style={{
                background: "#fef3c7",
                border: "2px solid #f59e0b",
                borderRadius: "0.75rem",
                padding: "1.5rem",
                marginTop: "1rem"
              }}>
                <h4 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem", color: "#92400e" }}>
                  Deducciones (Opcional)
                </h4>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem", color: "#0f172a" }}>
                      IVA Crédito del Mes Anterior (Q):
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={form.ivaCredito || ""}
                      onChange={handleChange("ivaCredito")}
              placeholder="0"
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        borderRadius: "0.5rem",
                        border: "2px solid #e2e8f0",
                        fontSize: "1rem",
                      }}
                    />
                    <small style={{ color: "#64748b", fontSize: "0.9rem" }}>
                      Saldo a favor del mes anterior que deseas acreditar
                    </small>
                  </div>

                  <div>
                    <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem", color: "#0f172a" }}>
                      IVA Retenido (Q):
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={form.ivaRetenido || ""}
                      onChange={handleChange("ivaRetenido")}
              placeholder="0"
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        borderRadius: "0.5rem",
                        border: "2px solid #e2e8f0",
                        fontSize: "1rem",
                      }}
                    />
                    <small style={{ color: "#64748b", fontSize: "0.9rem" }}>
                      Retenciones de IVA que te hicieron durante el mes
                    </small>
                  </div>

                  <div>
                    <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem", color: "#0f172a" }}>
                      IVA Exento (Q):
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={form.ivaExento || ""}
                      onChange={handleChange("ivaExento")}
              placeholder="0"
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        borderRadius: "0.5rem",
                        border: "2px solid #e2e8f0",
                        fontSize: "1rem",
                      }}
                    />
                    <small style={{ color: "#64748b", fontSize: "0.9rem" }}>
                      IVA de operaciones exentas del mes
                    </small>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Campos para Pequeño Contribuyente */}
          {regimen === "pequeno" && (
            <div>
              <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem", color: "#0f172a" }}>
                Ingresos Anuales (Q):
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.ingresosAnuales || ""}
                onChange={handleChange("ingresosAnuales")}
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
                Total de ingresos anuales (debe ser ≤ Q150,000)
              </small>
            </div>
          )}

          {/* Para Exento no hay campos adicionales */}
          {regimen === "exento" && (
            <div style={{ background: "#f0fdf4", padding: "1.5rem", borderRadius: "0.75rem", border: "2px solid #10b981" }}>
              <p style={{ color: "#065f46", fontSize: "1rem", margin: 0 }}>
                Las actividades exentas no requieren cálculo de IVA. Presiona "Calcular" para ver la información.
              </p>
            </div>
          )}

          {/* Botón de envío */}
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "1rem",
              borderRadius: "0.75rem",
              border: "none",
              background: loading ? "#94a3b8" : "#3b82f6",
              color: "white",
              fontWeight: 700,
              fontSize: "1.1rem",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.2s",
            }}
          >
            {loading ? "Calculando..." : "Calcular IVA"}
          </button>
        </form>
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            background: "#fee2e2",
            border: "2px solid #dc2626",
            borderRadius: "1rem",
            padding: "1.5rem",
            marginBottom: "2rem",
            color: "#991b1b",
          }}
        >
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Resultados */}
      {resultado && resultado.datos && (
        <div
          style={{
            background: "white",
            borderRadius: "1rem",
            padding: "2rem",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          <h2 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: "1.5rem", color: "#0f172a" }}>
            Resultados - {resultado.datos.regimenNombre}
          </h2>

          {resultado.datos.aplica ? (
            <>
              {regimen === "general" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  {/* Ventas y Débito Fiscal */}
                  <div style={{ padding: "1rem", background: "#f0f9ff", borderRadius: "0.5rem", border: "2px solid #3b82f6" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                      <span style={{ fontWeight: 600 }}>Ventas del Mes:</span>
                      <span>Q {form.ventasMes.toLocaleString("es-GT", { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                      <span style={{ fontWeight: 600 }}>Base (sin IVA):</span>
                      <span>Q {resultado.datos.baseVentas.toLocaleString("es-GT", { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.1rem" }}>
                      <span style={{ fontWeight: 700, color: "#1e40af" }}>Débito Fiscal (12%):</span>
                      <span style={{ fontWeight: 700, color: "#1e40af" }}>
                        Q {resultado.datos.debitoFiscal.toLocaleString("es-GT", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  {/* Compras y Crédito Fiscal */}
                  <div style={{ padding: "1rem", background: "#f0fdf4", borderRadius: "0.5rem", border: "2px solid #10b981" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                      <span style={{ fontWeight: 600 }}>Compras del Mes:</span>
                      <span>Q {form.comprasMes.toLocaleString("es-GT", { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                      <span style={{ fontWeight: 600 }}>Base (sin IVA):</span>
                      <span>Q {resultado.datos.baseCompras.toLocaleString("es-GT", { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.1rem" }}>
                      <span style={{ fontWeight: 700, color: "#065f46" }}>Crédito Fiscal (12%):</span>
                      <span style={{ fontWeight: 700, color: "#065f46" }}>
                        Q {resultado.datos.creditoFiscal.toLocaleString("es-GT", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  {/* IVA Bruto */}
                  <div style={{ padding: "1rem", background: "#fef3c7", borderRadius: "0.5rem", border: "2px solid #f59e0b" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.2rem" }}>
                      <span style={{ fontWeight: 700, color: "#92400e" }}>IVA Bruto (Débito - Crédito):</span>
                      <span style={{ fontWeight: 700, color: "#92400e" }}>
                        Q {resultado.datos.ivaBruto.toLocaleString("es-GT", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  {/* Deducciones */}
                  {(resultado.datos.ivaCredito > 0 || resultado.datos.ivaRetenido > 0 || resultado.datos.ivaExento > 0) && (
                    <div style={{ padding: "1rem", background: "#fef2f2", borderRadius: "0.5rem", border: "2px solid #dc2626" }}>
                      <h4 style={{ fontWeight: 700, marginBottom: "0.75rem", color: "#991b1b" }}>Deducciones:</h4>
                      {resultado.datos.ivaCredito > 0 && (
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                          <span>(-) IVA Crédito:</span>
                          <span>Q {resultado.datos.ivaCredito.toLocaleString("es-GT", { minimumFractionDigits: 2 })}</span>
                        </div>
                      )}
                      {resultado.datos.ivaRetenido > 0 && (
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                          <span>(-) IVA Retenido:</span>
                          <span>Q {resultado.datos.ivaRetenido.toLocaleString("es-GT", { minimumFractionDigits: 2 })}</span>
                        </div>
                      )}
                      {resultado.datos.ivaExento > 0 && (
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                          <span>(-) IVA Exento:</span>
                          <span>Q {resultado.datos.ivaExento.toLocaleString("es-GT", { minimumFractionDigits: 2 })}</span>
                        </div>
                      )}
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.1rem", marginTop: "0.5rem", paddingTop: "0.5rem", borderTop: "2px solid #dc2626" }}>
                        <span style={{ fontWeight: 700, color: "#991b1b" }}>Total Deducciones:</span>
                        <span style={{ fontWeight: 700, color: "#991b1b" }}>
                          Q {resultado.datos.totalDeducciones.toLocaleString("es-GT", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* IVA a Pagar */}
                  <div style={{ padding: "1.5rem", background: "#1e3a8a", borderRadius: "0.75rem", textAlign: "center" }}>
                    <div style={{ color: "white", fontSize: "1.1rem", marginBottom: "0.5rem" }}>
                      {resultado.datos.ivaBruto - resultado.datos.totalDeducciones < 0 ? "IVA CRÉDITO (Saldo a Favor)" : "IVA A PAGAR"}
                    </div>
                    <div style={{ color: "white", fontSize: "2.5rem", fontWeight: 800 }}>
                      Q {resultado.datos.ivaAPagar.toLocaleString("es-GT", { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              )}

              {regimen === "pequeno" && (
                <div style={{ padding: "1.5rem", background: "#d1fae5", borderRadius: "0.75rem", textAlign: "center", border: "2px solid #10b981" }}>
                  <div style={{ color: "#065f46", fontSize: "1.1rem", marginBottom: "0.5rem" }}>
                    Cuota Fija Mensual
                  </div>
                  <div style={{ color: "#065f46", fontSize: "2.5rem", fontWeight: 800 }}>
                    Q {resultado.datos.cuotaFija.toLocaleString("es-GT", { minimumFractionDigits: 2 })}
                  </div>
                </div>
              )}

              {regimen === "exento" && (
                <div style={{ padding: "1.5rem", background: "#ede9fe", borderRadius: "0.75rem", textAlign: "center", border: "2px solid #8b5cf6" }}>
                  <div style={{ color: "#5b21b6", fontSize: "1.5rem", fontWeight: 700 }}>
                    Actividad Exenta de IVA
                  </div>
                  <div style={{ color: "#5b21b6", fontSize: "1.1rem", marginTop: "0.5rem" }}>
                    Q 0.00
                  </div>
                </div>
              )}

              {/* Mensaje */}
              <div style={{ marginTop: "1.5rem", padding: "1rem", background: "#f1f5f9", borderRadius: "0.5rem" }}>
                <p style={{ margin: 0, color: "#0f172a", lineHeight: 1.6 }}>
                  {resultado.datos.mensaje}
                </p>
              </div>

              {/* Botón de descargar PDF */}
              <button
                onClick={handleDescargarPDF}
                style={{
                  marginTop: "1rem",
                  width: "100%",
                  padding: "1rem",
                  borderRadius: "0.75rem",
                  border: "none",
                  background: "#10b981",
                  color: "white",
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                Descargar PDF
              </button>
            </>
          ) : (
            <div style={{ padding: "1.5rem", background: "#fee2e2", borderRadius: "0.75rem", border: "2px solid #dc2626" }}>
              <p style={{ margin: 0, color: "#991b1b", fontSize: "1.1rem", fontWeight: 600 }}>
                {resultado.datos.mensaje}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default IVAPage;