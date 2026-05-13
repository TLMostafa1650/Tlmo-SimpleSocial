import { COLORS } from "../constants/colors";
import { FONTS } from "../constants/fonts";

export default function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  multiline,
  rows = 4,
}) {
  const style = {
    width: "100%",
    padding: "10px 14px",
    border: `1.5px solid ${COLORS.border}`,
    borderRadius: 10,
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.text,
    background: COLORS.bg,
    outline: "none",
    boxSizing: "border-box",
    resize: "vertical",
  };
  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <label
          style={{
            display: "block",
            fontFamily: FONTS.body,
            fontSize: 13,
            color: COLORS.muted,
            marginBottom: 6,
            fontWeight: 500,
          }}
        >
          {label}
        </label>
      )}
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          style={style}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={style}
        />
      )}
    </div>
  );
}
