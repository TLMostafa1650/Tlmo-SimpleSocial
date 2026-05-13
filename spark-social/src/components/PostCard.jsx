import { useState } from "react";
import { COLORS } from "../constants/colors";
import { FONTS } from "../constants/fonts";
import Avatar from "./Avatar";
import PhotoPlaceholder from "./PhotoPlaceholder";
import Input from "./Input";
import Btn from "./Btn";
import { generateId } from "../utils/generateId";
import Tag from "./Tag";

export default function PostCard({
  post,
  users,
  currentUser,
  dispatch,
  onProfile,
  theme,
}) {
  const author = users.find((u) => u.id === post.authorId);

  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [editTags, setEditTags] = useState(post.tags.join(", "));
  const [showMenu, setShowMenu] = useState(false);

  const liked = post.likes.includes(currentUser.id);
  const bookmarked = post.bookmarks.includes(currentUser.id);
  const isOwner = post.authorId === currentUser.id;

  function submitComment() {
    if (!commentText.trim()) return;

    dispatch({
      type: "ADD_COMMENT",
      postId: post.id,
      comment: {
        id: generateId(),
        authorId: currentUser.id,
        text: commentText.trim(),
        createdAt: "just now",
      },
    });

    setCommentText("");
  }

  function submitEdit() {
    dispatch({
      type: "UPDATE_POST",
      id: post.id,
      data: {
        content: editContent,
        tags: editTags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      },
    });

    setEditing(false);
  }

  return (
    <div
      style={{
        background: theme.card,
        borderRadius: 16,
        border: `1px solid ${theme.border}`,
        padding: "20px 24px",
        marginBottom: 16,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 14,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() => onProfile(author)}
        >
          <Avatar user={author} size={42} />

          <div>
            <div
              style={{
                fontFamily: FONTS.body,
                fontWeight: 700,
                fontSize: 15,
                color: theme.text,
              }}
            >
              {author?.name}
            </div>

            <div
              style={{
                fontFamily: FONTS.mono,
                fontSize: 12,
                color: theme.muted,
              }}
            >
              @{author?.handle} · {post.createdAt}
              {post.edited ? " · edited" : ""}
            </div>
          </div>
        </div>

        {isOwner && (
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: theme.muted,
                fontSize: 20,
                padding: "4px 8px",
              }}
            >
              ⋯
            </button>

            {showMenu && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "100%",
                  background: theme.card,
                  border: `1px solid ${theme.border}`,
                  borderRadius: 12,
                  overflow: "hidden",
                  zIndex: 10,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                  minWidth: 140,
                }}
              >
                <button
                  onClick={() => {
                    setEditing(true);
                    setShowMenu(false);
                  }}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "10px 16px",
                    textAlign: "left",
                    background: "none",
                    border: "none",
                    fontFamily: FONTS.body,
                    fontSize: 14,
                    cursor: "pointer",
                    color: theme.text,
                  }}
                >
                  ✏️ Edit
                </button>

                <button
                  onClick={() => {
                    dispatch({
                      type: "DELETE_POST",
                      id: post.id,
                    });

                    setShowMenu(false);
                  }}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "10px 16px",
                    textAlign: "left",
                    background: "none",
                    border: "none",
                    fontFamily: FONTS.body,
                    fontSize: 14,
                    cursor: "pointer",
                    color: "#EF4444",
                  }}
                >
                  🗑 Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      {editing ? (
        <div>
          <Input
            multiline
            value={editContent}
            onChange={setEditContent}
            rows={4}
          />

          <Input
            label="Tags (comma-separated)"
            value={editTags}
            onChange={setEditTags}
            placeholder="design, tech, life"
          />

          <div style={{ display: "flex", gap: 10 }}>
            <Btn onClick={submitEdit}>Save changes</Btn>

            <Btn variant="ghost" onClick={() => setEditing(false)}>
              Cancel
            </Btn>
          </div>
        </div>
      ) : (
        <>
          <p
            style={{
              fontFamily: FONTS.body,
              fontSize: 15,
              lineHeight: 1.65,
              color: theme.text,
              margin: "0 0 12px",
            }}
          >
            {post.content}
          </p>

          {post.image && <PhotoPlaceholder postId={post.id} />}

          {post.tags.length > 0 && (
            <div
              style={{
                display: "flex",
                gap: 6,
                flexWrap: "wrap",
                marginBottom: 14,
              }}
            >
              {post.tags.map((t) => (
                <Tag key={t} label={`#${t}`} theme={theme} />
              ))}
            </div>
          )}
        </>
      )}

      {/* Actions */}
      {!editing && (
        <div
          style={{
            display: "flex",
            gap: 6,
            borderTop: `1px solid ${theme.border}`,
            paddingTop: 14,
            marginTop: 4,
          }}
        >
          <button
            onClick={() =>
              dispatch({
                type: "TOGGLE_LIKE",
                id: post.id,
              })
            }
            style={{
              background: liked ? COLORS.accentLight : "transparent",
              border: `1.5px solid ${liked ? COLORS.accentMid : theme.border}`,
              borderRadius: 8,
              padding: "6px 14px",
              cursor: "pointer",
              fontFamily: FONTS.body,
              fontSize: 13,
              color: liked ? COLORS.accent : theme.muted,
              display: "flex",
              alignItems: "center",
              gap: 5,
              fontWeight: liked ? 700 : 400,
            }}
          >
            {liked ? "❤️" : "🤍"} {post.likes.length}
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            style={{
              background: "transparent",
              border: `1.5px solid ${theme.border}`,
              borderRadius: 8,
              padding: "6px 14px",
              cursor: "pointer",
              fontFamily: FONTS.body,
              fontSize: 13,
              color: theme.muted,
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            💬 {post.comments.length}
          </button>

          <button
            onClick={() =>
              dispatch({
                type: "TOGGLE_BOOKMARK",
                id: post.id,
              })
            }
            style={{
              background: bookmarked ? COLORS.infoBg : "transparent",
              border: `1.5px solid ${bookmarked ? "#B3D1F4" : theme.border}`,
              borderRadius: 8,
              padding: "6px 14px",
              cursor: "pointer",
              fontFamily: FONTS.body,
              fontSize: 13,
              color: bookmarked ? COLORS.info : theme.muted,
            }}
          >
            {bookmarked ? "🔖" : "📑"}
          </button>
        </div>
      )}

      {/* Comments */}
      {showComments && (
        <div
          style={{
            marginTop: 16,
            borderTop: `1px solid ${theme.border}`,
            paddingTop: 16,
          }}
        >
          {post.comments.map((c) => {
            const cAuthor = users.find((u) => u.id === c.authorId);

            const canDelete =
              c.authorId === currentUser.id || post.authorId === currentUser.id;

            return (
              <div
                key={c.id}
                style={{
                  display: "flex",
                  gap: 10,
                  marginBottom: 12,
                  alignItems: "flex-start",
                }}
              >
                <Avatar user={cAuthor} size={32} />

                <div
                  style={{
                    flex: 1,
                    background: theme.bg,
                    borderRadius: 10,
                    padding: "8px 12px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: FONTS.body,
                        fontWeight: 600,
                        fontSize: 13,
                        color: theme.text,
                      }}
                    >
                      {cAuthor?.name}
                    </span>

                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: FONTS.mono,
                          fontSize: 11,
                          color: theme.muted,
                        }}
                      >
                        {c.createdAt}
                      </span>

                      {canDelete && (
                        <button
                          onClick={() =>
                            dispatch({
                              type: "DELETE_COMMENT",
                              postId: post.id,
                              commentId: c.id,
                            })
                          }
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: theme.muted,
                            fontSize: 13,
                          }}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </div>

                  <p
                    style={{
                      fontFamily: FONTS.body,
                      fontSize: 14,
                      color: theme.text,
                      margin: "4px 0 0",
                    }}
                  >
                    {c.text}
                  </p>
                </div>
              </div>
            );
          })}

          <div
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
              marginTop: 8,
            }}
          >
            <Avatar user={currentUser} size={32} />

            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitComment()}
              placeholder="Write a comment…"
              style={{
                flex: 1,
                padding: "8px 14px",
                border: `1.5px solid ${theme.border}`,
                borderRadius: 10,
                fontFamily: FONTS.body,
                fontSize: 14,
                background: theme.bg,
                color: theme.text,
                outline: "none",
              }}
            />

            <Btn small onClick={submitComment} disabled={!commentText.trim()}>
              Post
            </Btn>
          </div>
        </div>
      )}
    </div>
  );
}
