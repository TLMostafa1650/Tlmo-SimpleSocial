import { useState } from "react";
import { COLORS } from "../constants/colors";
import { FONTS } from "../constants/fonts";
import Input from "./Input";
import Btn from "./Btn";
import PostCard from "./PostCard";

export default function ProfileView({
  user,
  posts,
  currentUser,
  dispatch,
  following,
  theme,
}) {
  const [editing, setEditing] = useState(false);

  const [editData, setEditData] = useState({
    name: user.name,
    bio: user.bio,
    location: user.location,
    website: user.website,
  });

  const isOwn = user.id === currentUser.id;
  const isFollowing = (following || []).includes(user.id);

  const userPosts = posts.filter((p) => p.authorId === user.id);

  function saveProfile() {
    dispatch({
      type: "UPDATE_PROFILE",
      id: user.id,
      data: editData,
    });

    setEditing(false);
  }

  return (
    <div
      style={{
        background: theme.card,
      }}
    >
      {/* Cover */}
      <div
        style={{
          height: 140,
          background: `linear-gradient(135deg, ${user.coverColor}CC, ${user.coverColor}55)`,
          borderRadius: 16,
          marginBottom: -50,
          position: "relative",
        }}
      >
        {isOwn && (
          <button
            onClick={() => setEditing(!editing)}
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              background: theme.card,
              border: `1px solid ${theme.border}`,
              borderRadius: 8,
              padding: "7px 16px",
              fontFamily: FONTS.body,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              color: theme.text,
            }}
          >
            {editing ? "Cancel" : "✏️ Edit profile"}
          </button>
        )}

        {!isOwn && (
          <button
            onClick={() =>
              dispatch({
                type: isFollowing ? "UNFOLLOW_USER" : "FOLLOW_USER",
                id: user.id,
              })
            }
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              background: isFollowing ? theme.card : COLORS.accent,
              border: "none",
              borderRadius: 8,
              padding: "7px 16px",
              fontFamily: FONTS.body,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              color: isFollowing ? theme.text : "#fff",
            }}
          >
            {isFollowing ? "✓ Following" : "+ Follow"}
          </button>
        )}
      </div>

      <div style={{ padding: "0 24px 24px" }}>
        {/* Avatar */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 16,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: user.coverColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontFamily: FONTS.body,
              fontWeight: 700,
              fontSize: 28,
              border: `4px solid ${theme.card}`,
              flexShrink: 0,
              marginTop: -10,
              boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
            }}
          >
            {user.avatar}
          </div>
        </div>

        {/* Edit Mode */}
        {editing ? (
          <div>
            <Input
              label="Name"
              value={editData.name}
              onChange={(v) =>
                setEditData({
                  ...editData,
                  name: v,
                })
              }
            />

            <Input
              label="Bio"
              multiline
              value={editData.bio}
              onChange={(v) =>
                setEditData({
                  ...editData,
                  bio: v,
                })
              }
              rows={2}
            />

            <Input
              label="Location"
              value={editData.location}
              onChange={(v) =>
                setEditData({
                  ...editData,
                  location: v,
                })
              }
              placeholder="City, Country"
            />

            <Input
              label="Website"
              value={editData.website}
              onChange={(v) =>
                setEditData({
                  ...editData,
                  website: v,
                })
              }
              placeholder="yoursite.com"
            />

            <div style={{ display: "flex", gap: 10 }}>
              <Btn onClick={saveProfile}>Save profile</Btn>

              <Btn variant="ghost" onClick={() => setEditing(false)}>
                Cancel
              </Btn>
            </div>
          </div>
        ) : (
          <div>
            {/* Name */}
            <h1
              style={{
                fontFamily: FONTS.heading,
                fontSize: 26,
                margin: "0 0 4px",
                color: theme.text,
              }}
            >
              {user.name}
            </h1>

            {/* Username */}
            <div
              style={{
                fontFamily: FONTS.mono,
                fontSize: 13,
                color: theme.muted,
                marginBottom: 10,
              }}
            >
              @{user.handle} · joined {user.joined}
            </div>

            {/* Bio */}
            <p
              style={{
                fontFamily: FONTS.body,
                fontSize: 15,
                color: theme.text,
                margin: "0 0 12px",
                lineHeight: 1.6,
              }}
            >
              {user.bio}
            </p>

            {/* Info */}
            <div
              style={{
                display: "flex",
                gap: 16,
                flexWrap: "wrap",
                marginBottom: 16,
              }}
            >
              {user.location && (
                <span
                  style={{
                    fontFamily: FONTS.body,
                    fontSize: 13,
                    color: theme.muted,
                  }}
                >
                  📍 {user.location}
                </span>
              )}

              {user.website && (
                <span
                  style={{
                    fontFamily: FONTS.body,
                    fontSize: 13,
                    color: COLORS.info,
                  }}
                >
                  🔗 {user.website}
                </span>
              )}
            </div>

            {/* Stats */}
            <div
              style={{
                display: "flex",
                gap: 24,
                flexWrap: "wrap",
              }}
            >
              <div>
                <span
                  style={{
                    fontFamily: FONTS.body,
                    fontWeight: 700,
                    fontSize: 18,
                    color: theme.text,
                  }}
                >
                  {user.followers.toLocaleString()}
                </span>

                <span
                  style={{
                    fontFamily: FONTS.body,
                    fontSize: 13,
                    color: theme.muted,
                    marginLeft: 4,
                  }}
                >
                  followers
                </span>
              </div>

              <div>
                <span
                  style={{
                    fontFamily: FONTS.body,
                    fontWeight: 700,
                    fontSize: 18,
                    color: theme.text,
                  }}
                >
                  {user.following}
                </span>

                <span
                  style={{
                    fontFamily: FONTS.body,
                    fontSize: 13,
                    color: theme.muted,
                    marginLeft: 4,
                  }}
                >
                  following
                </span>
              </div>

              <div>
                <span
                  style={{
                    fontFamily: FONTS.body,
                    fontWeight: 700,
                    fontSize: 18,
                    color: theme.text,
                  }}
                >
                  {userPosts.length}
                </span>

                <span
                  style={{
                    fontFamily: FONTS.body,
                    fontSize: 13,
                    color: theme.muted,
                    marginLeft: 4,
                  }}
                >
                  posts
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Posts */}
        <div
          style={{
            borderTop: `1px solid ${theme.border}`,
            marginTop: 24,
            paddingTop: 24,
          }}
        >
          <h2
            style={{
              fontFamily: FONTS.heading,
              fontSize: 20,
              margin: "0 0 16px",
              color: theme.text,
            }}
          >
            Posts
          </h2>

          {userPosts.length === 0 && (
            <p
              style={{
                fontFamily: FONTS.body,
                color: theme.muted,
                fontSize: 15,
              }}
            >
              No posts yet.
            </p>
          )}

          {userPosts.map((p) => (
            <PostCard
              key={p.id}
              post={p}
              users={[user]}
              currentUser={currentUser}
              dispatch={dispatch}
              onProfile={() => {}}
              theme={theme}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
