import { FONTS } from "../constants/fonts";

export default function Avatar({ user, size = 40 }) {
  const colors = { MO: "#E8442A", RO: "#1A5FA8", AO: "#2D7A4F" };
  const bg = colors[user?.avatar] || "#8A8480";
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontFamily: FONTS.body,
        fontWeight: 600,
        fontSize: size * 0.35,
        flexShrink: 0,
      }}
    >
      {user?.avatar || "?"}
    </div>
  );
}
