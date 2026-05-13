import { FONTS } from "../constants/fonts";


const PHOTO_GRADIENTS = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
];

export default function PhotoPlaceholder({ postId }) {
  const idx = postId ? postId.charCodeAt(1) % PHOTO_GRADIENTS.length : 0;
  return (
    <div
      style={{
        width: "100%",
        height: 240,
        borderRadius: 12,
        background: PHOTO_GRADIENTS[idx],
        margin: "12px 0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span
        style={{
          color: "rgba(255,255,255,0.7)",
          fontFamily: FONTS.body,
          fontSize: 14,
        }}
      >
        📷 Photo
      </span>
    </div>
  );
}