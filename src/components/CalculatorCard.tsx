// src/components/CalculatorCard.tsx
import { useNavigate } from "react-router-dom";

type CalculatorCardProps = {
  title: string;
  description: string;
  icon: string;
  route: string;
  color?: string;
};

const CalculatorCard: React.FC<CalculatorCardProps> = ({
  title,
  description,
  icon,
  route,
  color = "linear-gradient(135deg, #1d4ed8, #38bdf8)",
}) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(route)}
      style={{
        background: "rgba(255,255,255,0.95)",
        borderRadius: "1rem",
        padding: "2rem",
        border: "2px solid rgba(37,99,235,0.2)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        cursor: "pointer",
        transition: "all 0.3s ease",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        height: "100%",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "translateY(-8px)";
        e.currentTarget.style.boxShadow = "0 12px 40px rgba(37,99,235,0.25)";
        e.currentTarget.style.borderColor = "rgba(37,99,235,0.5)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)";
        e.currentTarget.style.borderColor = "rgba(37,99,235,0.2)";
      }}
    >
      {/* Ícono */}
      <div
        style={{
          width: "70px",
          height: "70px",
          borderRadius: "1rem",
          background: color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "2rem",
          boxShadow: "0 4px 15px rgba(37,99,235,0.3)",
        }}
      >
        {icon}
      </div>

      {/* Título */}
      <h3
        style={{
          margin: 0,
          fontSize: "1.5rem",
          fontWeight: 700,
          color: "#0f172a",
        }}
      >
        {title}
      </h3>

      {/* Descripción */}
      <p
        style={{
          margin: 0,
          fontSize: "1rem",
          color: "#64748b",
          lineHeight: 1.6,
          flex: 1,
        }}
      >
        {description}
      </p>

      {/* Botón de acción */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          color: "#2563eb",
          fontWeight: 600,
          fontSize: "1rem",
        }}
      >
        Calcular ahora
        <span style={{ fontSize: "1.2rem" }}>→</span>
      </div>
    </div>
  );
};

export default CalculatorCard;