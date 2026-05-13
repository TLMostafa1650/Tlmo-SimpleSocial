import Avatar from "./Avatar";
import { COLORS } from "../constants/colors";
import { FONTS } from "../constants/fonts";

export default function Sidebar({
  currentUser,
  users,
  dispatch,
  following,
  theme,
}) {
  const suggestions = users.filter(
    (u) => u.id !== currentUser.id && !(following || []).includes(u.id),
  );

  const cardStyle = {
    background: theme.card,
    borderRadius: 20,
    border: `1px solid ${theme.border}`,
    padding: "22px",
    marginBottom: 20,
    boxShadow: "0 10px 35px rgba(0,0,0,0.12)",
    transition: "all 0.3s ease",
    color: theme.text,
  };

  const hoverItem = (e, active = true) => {
    e.currentTarget.style.background = active ? theme.border : "transparent";
  };

  return (
    <div
      style={{
        padding: 12,
        background: theme.bg,
        borderRadius: 24,
      }}
    >
      {/* Profile Card */}
      <div style={cardStyle}>
        <div
          style={{
            display: "flex",
            gap: 14,
            alignItems: "center",
            marginBottom: 18,
            cursor: "pointer",
            padding: 10,
            borderRadius: 14,
            transition: "all 0.25s ease",
          }}
          onMouseEnter={(e) => hoverItem(e, true)}
          onMouseLeave={(e) => hoverItem(e, false)}
          onClick={() =>
            dispatch({
              type: "SET_VIEW",
              view: "profile",
              data: currentUser.id,
            })
          }
        >
          <Avatar user={currentUser} size={48} />

          <div>
            <div
              style={{
                fontFamily: FONTS.body,
                fontWeight: 800,
                fontSize: 16,
                letterSpacing: 0.3,
                color: theme.text,
              }}
            >
              {currentUser.name}
            </div>

            <div
              style={{
                fontFamily: FONTS.mono,
                fontSize: 12,
                color: theme.muted,
                marginTop: 2,
              }}
            >
              @{currentUser.handle}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            borderTop: `1px solid ${theme.border}`,
            paddingTop: 16,
          }}
        >
          {[
            ["Posts", "p-count"],
            ["Followers", "followers"],
            ["Following", "following"],
          ].map(([label, key]) => (
            <div
              key={key}
              style={{
                textAlign: "center",
                cursor: "pointer",
                padding: "8px 14px",
                borderRadius: 12,
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) => hoverItem(e, true)}
              onMouseLeave={(e) => hoverItem(e, false)}
            >
              <div
                style={{
                  fontFamily: FONTS.body,
                  fontWeight: 800,
                  fontSize: 20,
                  color: theme.text,
                }}
              >
                {key === "p-count" ? 0 : currentUser[key]}
              </div>

              <div
                style={{
                  fontFamily: FONTS.body,
                  fontSize: 12,
                  color: theme.muted,
                  marginTop: 2,
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div style={cardStyle}>
          <h3
            style={{
              fontFamily: FONTS.heading,
              fontSize: 17,
              margin: 0,
              color: theme.text,
              fontWeight: 700,
            }}
          >
            People to follow
          </h3>

          <div
            style={{
              width: 45,
              height: 4,
              background: COLORS.accent,
              borderRadius: 6,
              margin: "8px 0 18px",
            }}
          />

          {suggestions.map((u) => (
            <div
              key={u.id}
              style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
                marginBottom: 16,
                padding: 8,
                borderRadius: 14,
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) => hoverItem(e, true)}
              onMouseLeave={(e) => hoverItem(e, false)}
            >
              <Avatar user={u} size={40} />

              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: FONTS.body,
                    fontWeight: 600,
                    fontSize: 14,
                    color: theme.text,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {u.name}
                </div>

                <div
                  style={{
                    fontFamily: FONTS.mono,
                    fontSize: 11,
                    color: theme.muted,
                    marginTop: 2,
                  }}
                >
                  @{u.handle}
                </div>
              </div>

              <button
                onClick={() =>
                  dispatch({
                    type: "FOLLOW_USER",
                    id: u.id,
                  })
                }
                style={{
                  background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
                  border: "none",
                  borderRadius: 999,
                  padding: "7px 16px",
                  fontFamily: FONTS.body,
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  color: "#fff",
                  transition: "all 0.25s ease",
                  boxShadow: "0 6px 18px rgba(99,102,241,0.35)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.06)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                Follow
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
