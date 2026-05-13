import { COLORS } from "../constants/colors";
import { FONTS } from "../constants/fonts";

export default function Btn({
  children,
  onClick,
  variant = "primary",
  small,
  disabled,
}) {
  const variants = {
    primary: { background: COLORS.accent, color: "#fff", border: "none" },
    ghost: {
      background: "transparent",
      color: COLORS.muted,
      border: `1.5px solid ${COLORS.border}`,
    },
    danger: {
      background: "#FEF0F0",
      color: "#C0392B",
      border: "1.5px solid #FADADD",
    },
  };
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      style={{
        ...variants[variant],
        padding: small ? "6px 14px" : "10px 20px",
        borderRadius: 10,
        fontFamily: FONTS.body,
        fontWeight: 600,
        fontSize: small ? 13 : 14,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        transition: "opacity 0.15s",
      }}
    >
      {children}
    </button>
  );
}
