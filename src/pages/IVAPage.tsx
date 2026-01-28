// src/pages/IVAPage.tsx
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
    retenciones: 0,
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
      setResultado(res);
    } catch (err: any) {
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
        retenciones: form.retenciones,
        ingresosAnuales: form.ingresosAnuales,
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
          🧾 Calculadora de IVA
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
          ℹ️ Regímenes de IVA en Guatemala
        </h3>
        <ul style={{ margin: 0, paddingLeft: "1.5rem", color: "#1e3a8a", lineHeight: 1.8 }}>
          <li><strong>Régimen General (12%):</strong> Débito fiscal (ventas) - Crédito fiscal (compras) = IVA a pagar</li>
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
            📊 Régimen General (12%)
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
            🏪 Pequeño Contribuyente
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
            ✅ Exento de IVA
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
                  value={form.ventasMes}
                  onChange={handleChange("ventasMes")}
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
                  value={form.comprasMes}
                  onChange={handleChange("comprasMes")}
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

              <div>
                <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem", color: "#0f172a" }}>
                  Retenciones de IVA (Q):
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={form.retenciones}
                  onChange={handleChange("retenciones")}
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
                  Ingresar 0 si no tienes retenciones
                </small>
              </div>
            </>
          )}

          {/* Campos para Pequeño Contribuyente */}
          {regimen === "pequeno" && (
            <div>
              <label style={{ display: "block", fontWeight: 600, marginBottom: "0.5rem", color: "#0f172a" }}>
                Ingresos Anuales Estimados (Q):
              </label>
              <input
                type="number"
                step="0.01"
                value={form.ingresosAnuales}
                onChange={handleChange("ingresosAnuales")}
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
                Suma de tus ingresos de todo el año (debe ser ≤ Q150,000 para aplicar)
              </small>
            </div>
          )}

          {/* Mensaje para Exento */}
          {regimen === "exento" && (
            <div
              style={{
                background: "#ede9fe",
                border: "2px solid #8b5cf6",
                borderRadius: "0.75rem",
                padding: "1.5rem",
                textAlign: "center",
              }}
            >
              <p style={{ color: "#5b21b6", fontSize: "1.1rem", fontWeight: 600, margin: 0 }}>
                Si tu actividad está exenta de IVA, no debes realizar cálculos.
              </p>
              <p style={{ color: "#7c3aed", marginTop: "0.5rem" }}>
                Haz clic en "Calcular IVA" para confirmar.
              </p>
            </div>
          )}

          {/* Botón */}
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
            onMouseOver={(e) => !loading && (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {loading ? "Calculando..." : "Calcular IVA"}
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

      {/* Resultado */}
      {resultado && resultado.datos && (
        <div
          style={{
            background: resultado.datos.aplica
              ? "linear-gradient(135deg, #3b82f6, #2563eb)"
              : "linear-gradient(135deg, #ef4444, #dc2626)",
            borderRadius: "1rem",
            padding: "2rem",
            color: "white",
            boxShadow: "0 10px 40px rgba(59,130,246,0.4)",
          }}
        >
          <h2 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "1rem" }}>
            {resultado.datos.aplica ? "✅" : "⚠️"} {resultado.datos.regimenNombre}
          </h2>

          <p style={{ fontSize: "1rem", marginBottom: "1.5rem", opacity: 0.95 }}>
            {resultado.datos.mensaje}
          </p>

          {/* Desglose para Régimen General */}
          {regimen === "general" && resultado.datos.aplica && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
              <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: "0.75rem", padding: "1rem" }}>
                <p style={{ fontSize: "0.9rem", marginBottom: "0.5rem", opacity: 0.9 }}>Débito Fiscal:</p>
                <p style={{ fontSize: "1.5rem", fontWeight: 800, margin: 0 }}>
                  Q {resultado.datos.debitoFiscal.toFixed(2)}
                </p>
              </div>
              <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: "0.75rem", padding: "1rem" }}>
                <p style={{ fontSize: "0.9rem", marginBottom: "0.5rem", opacity: 0.9 }}>Crédito Fiscal:</p>
                <p style={{ fontSize: "1.5rem", fontWeight: 800, margin: 0 }}>
                  - Q {resultado.datos.creditoFiscal.toFixed(2)}
                </p>
              </div>
              <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: "0.75rem", padding: "1rem" }}>
                <p style={{ fontSize: "0.9rem", marginBottom: "0.5rem", opacity: 0.9 }}>IVA Bruto:</p>
                <p style={{ fontSize: "1.5rem", fontWeight: 800, margin: 0 }}>
                  Q {resultado.datos.ivaBruto.toFixed(2)}
                </p>
              </div>
            </div>
          )}

          {/* IVA a Pagar o Cuota Fija */}
          <div
            style={{
              background: "rgba(255,255,255,0.25)",
              borderRadius: "0.75rem",
              padding: "1.5rem",
              marginBottom: "1rem",
            }}
          >
            <p style={{ fontSize: "0.9rem", marginBottom: "0.5rem", opacity: 0.9 }}>
              {regimen === "pequeno" ? "Cuota Fija Mensual:" : "IVA a Pagar:"}
            </p>
            <p style={{ fontSize: "2.5rem", fontWeight: 800, margin: 0 }}>
              Q {resultado.datos.ivaAPagar.toFixed(2)}
            </p>
          </div>

          {/* Detalle */}
          <div
            style={{
              background: "rgba(255,255,255,0.1)",
              borderRadius: "0.75rem",
              padding: "1rem",
              fontSize: "0.95rem",
              lineHeight: 1.6,
              marginBottom: "1rem",
            }}
          >
            <strong>Detalle:</strong> {resultado.datos.detalleCalculo}
          </div>

          {/* Botón Descargar PDF */}
          {resultado.datos.aplica && (
            <button
              onClick={handleDescargarPDF}
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
          )}
        </div>
      )}
    </div>
  );
};

export default IVAPage;