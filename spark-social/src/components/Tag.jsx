import { COLORS } from "../constants/colors";
import { FONTS } from "../constants/fonts";

export default function Tag({ label, theme }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "6px 12px",
        borderRadius: 999,
        fontFamily: FONTS.body,
        fontSize: 12,
        fontWeight: 600,

        background: theme ? "rgba(99,102,241,0.15)" : COLORS.tag,

        color: theme ? "#7e7b39" : COLORS.tagText,

        border: theme ? `1px solid ${theme.border}` : "none",
      }}
    >
      {label}
    </span>
  );
}
