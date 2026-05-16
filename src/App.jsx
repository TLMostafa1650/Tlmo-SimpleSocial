import { useReducer, useState } from "react";
import { reducer } from "./reducer/reducer";
import { INIT_POSTS } from "./data/posts";
import { INIT_USERS } from "./data/users";
import { COLORS } from "./constants/colors";
import { FONTS } from "./constants/fonts";
import { useEffect } from "react";



import Avatar from "./components/Avatar";
import ProfileView from "./components/ProfileView";
import Sidebar from "./components/Sidebar";
import PostCard from "./components/PostCard";
import Modal from "./components/Modal";
import CreatePost from "./components/CreatePost";
import Btn from "./components/Btn";


const INIT_STATE = {
  posts: INIT_POSTS,
  users: INIT_USERS,
  currentUser: INIT_USERS[0],
  following: [],
  view: localStorage.getItem("view") || "feed",
  viewData: null,
};

export default function App() {

  const [state, dispatch] = useReducer(reducer, INIT_STATE);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true",
  );
  const { posts, users, currentUser, view, viewData, following } = state;

  const filteredPosts = searchQuery
    ? posts.filter(
        (p) =>
          p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.tags.some((t) =>
            t.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      )
    : posts;

  const bookmarkedPosts = posts.filter((p) =>
    p.bookmarks.includes(currentUser.id),
  );
  const myPosts = posts.filter((p) => p.authorId === currentUser.id);

  const viewedUser = viewData ? users.find((u) => u.id === viewData) : null;

  function onProfile(user) {
    dispatch({ type: "SET_VIEW", view: "profile", data: user?.id });
  }

  const navItems = [
    { id: "feed", icon: "🏠", label: "Home" },
    { id: "explore", icon: "🔍", label: "Explore" },
    { id: "bookmarks", icon: "🔖", label: "Saved" },
    { id: "my-posts", icon: "📝", label: "My Posts" },
    { id: "people", icon: "👥", label: "People" },
  ];

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  window.addEventListener("resize", handleResize);

  return () => window.removeEventListener("resize", handleResize);
}, []);

useEffect(() => {
  localStorage.setItem("darkMode", darkMode);
}, [darkMode]);


const theme = {
  bg: darkMode ? "#0F172A" : COLORS.bg,
  card: darkMode ? "#111827" : COLORS.card,
  text: darkMode ? "#F9FAFB" : COLORS.text,
  muted: darkMode ? "#94A3B8" : COLORS.muted,
  border: darkMode ? "#1E293B" : COLORS.border,
};

useEffect(() => {
  document.body.style.background = theme.bg;
  document.body.style.color = theme.text;
  document.documentElement.style.background = theme.bg;
}, [darkMode]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: theme.bg,
        fontFamily: FONTS.body,
      }}
    >
      {/* Top nav */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: darkMode
            ? "rgba(15,23,42,0.92)"
            : "rgba(250,248,245,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${theme.border}`,
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: isMobile ? "0 4px" : "0 24px",
            height: 60,
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}
        >
          <div
            style={{
              fontFamily: FONTS.heading,
              fontSize: 15,
              fontWeight: "bold",
              color: COLORS.accent,
              letterSpacing: -0.5,
              flexShrink: 0,
            }}
          >
            TLMO
          </div>
          <div
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              gap: 2,
              flexWrap: "nowrap",
            }}
          >
            {navItems.map((item) => {
              const isActive = view === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() => dispatch({ type: "SET_VIEW", view: item.id })}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    padding: "3px 6px",
                    borderRadius: 999,
                    cursor: "pointer",
                    fontFamily: FONTS.body,
                    fontWeight: 600,
                    fontSize: 14,
                    transition: "all 0.25s ease",
                    color: isActive ? "#fff" : theme.muted,
                    background: isActive
                      ? "linear-gradient(135deg, #6366F1, #8B5CF6)"
                      : "transparent",
                    boxShadow: isActive
                      ? "0 6px 18px rgba(99,102,241,0.35)"
                      : "none",
                    minWidth: 42,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive)
                      e.currentTarget.style.background = "rgba(0,0,0,0.05)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive)
                      e.currentTarget.style.background = "transparent";
                  }}
                >
                  <span
                    style={{
                      fontSize: isMobile ? 14 : 18,
                    }}
                  >
                    {item.icon}
                  </span>

                  {!isMobile && <span className="nav-label">{item.label}</span>}
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <button
              onClick={() => setDarkMode(!darkMode)}
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                border: `1px solid ${theme.border}`,
                background: theme.card,
                color: theme.text,
                cursor: "pointer",
                fontSize: 18,
              }}
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
            {!isMobile && (
              <button
                onClick={() => setShowCreatePost(true)}
                style={{
                  background: COLORS.accent,
                  border: "none",
                  borderRadius: 10,
                  padding: "8px 18px",
                  fontFamily: FONTS.body,
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                  color: "#fff",
                }}
              >
                + Post
              </button>
            )}
            <div
              style={{ cursor: "pointer" }}
              onClick={() =>
                dispatch({
                  type: "SET_VIEW",
                  view: "profile",
                  data: currentUser.id,
                })
              }
            >
              <Avatar user={currentUser} size={34} />
            </div>
          </div>
        </div>
      </header>

      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: isMobile ? "14px" : "24px",
          paddingBottom: isMobile ? "90px" : "24px",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 320px",
          gap: 24,
          alignItems: "start",
        }}
      >
        {/* Main content */}
        <main>
          {/* Feed */}
          {(view === "feed" || view === "explore") && (
            <div>
              {view === "explore" && (
                <div style={{ marginBottom: 20 }}>
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search posts and tags…"
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      border: `1.5px solid ${theme.border}`,
                      borderRadius: 12,
                      fontFamily: FONTS.body,
                      fontSize: 15,
                      background: theme.card,
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              )}
              {view === "feed" && (
                <div
                  style={{
                    background: theme.card,
                    borderRadius: 16,
                    border: `1px solid ${theme.border}`,
                    padding: isMobile ? "16px" : "20px 24px",
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{ display: "flex", gap: 12, alignItems: "center" }}
                  >
                    <Avatar user={currentUser} size={42} />
                    <button
                      onClick={() => setShowCreatePost(true)}
                      style={{
                        flex: 1,
                        textAlign: "left",
                        padding: "12px 16px",
                        border: `1.5px solid ${theme.border}`,
                        borderRadius: 12,
                        fontFamily: FONTS.body,
                        fontSize: 15,
                        color: theme.muted,
                        background: theme.bg,
                        cursor: "pointer",
                      }}
                    >
                      What's on your mind, {currentUser.name.split(" ")[0]}?
                    </button>
                  </div>
                </div>
              )}
              {filteredPosts.length === 0 && (
                <p
                  style={{
                    fontFamily: FONTS.body,
                    color: theme.muted,
                    textAlign: "center",
                    padding: "40px 0",
                  }}
                >
                  No posts found.
                </p>
              )}
              {filteredPosts.map((p) => (
                <PostCard
                  key={p.id}
                  post={p}
                  users={users}
                  currentUser={currentUser}
                  dispatch={dispatch}
                  onProfile={onProfile}
                  theme={theme}
                />
              ))}
            </div>
          )}

          {/* Saved */}
          {view === "bookmarks" && (
            <div>
              <h2
                style={{
                  fontFamily: FONTS.heading,
                  fontSize: 24,
                  margin: "0 0 20px",
                  color: theme.text,
                }}
              >
                Saved posts
              </h2>
              {bookmarkedPosts.length === 0 && (
                <p style={{ fontFamily: FONTS.body, color: theme.muted }}>
                  No saved posts yet. Bookmark posts to find them here.
                </p>
              )}
              {bookmarkedPosts.map((p) => (
                <PostCard
                  key={p.id}
                  post={p}
                  users={users}
                  currentUser={currentUser}
                  dispatch={dispatch}
                  onProfile={onProfile}
                  theme={theme}
                />
              ))}
            </div>
          )}

          {/* My posts */}
          {view === "my-posts" && (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <h2
                  style={{
                    fontFamily: FONTS.heading,
                    fontSize: 24,
                    margin: 0,
                    color: theme.text,
                  }}
                >
                  My posts
                </h2>
                <Btn onClick={() => setShowCreatePost(true)}>+ New post</Btn>
              </div>
              {myPosts.length === 0 && (
                <p style={{ fontFamily: FONTS.body, color: theme.muted }}>
                  You haven't posted yet.
                </p>
              )}
              {myPosts.map((p) => (
                <PostCard
                  key={p.id}
                  post={p}
                  users={users}
                  currentUser={currentUser}
                  dispatch={dispatch}
                  onProfile={onProfile}
                  theme={theme}
                />
              ))}
            </div>
          )}

          {/* People */}
          {view === "people" && (
            <div>
              <h2
                style={{
                  fontFamily: FONTS.heading,
                  fontSize: 24,
                  margin: "0 0 20px",
                  color: theme.text,
                }}
              >
                People
              </h2>
              <div style={{ display: "grid", gap: 16 }}>
                {users
                  .filter((u) => u.id !== currentUser.id)
                  .map((u) => {
                    const isF = (following || []).includes(u.id);
                    return (
                      <div
                        key={u.id}
                        style={{
                          background: theme.card,
                          borderRadius: 16,
                          border: `1px solid ${theme.border}`,
                          padding: "20px 24px",
                          display: "flex",
                          gap: 16,
                          alignItems: "flex-start",
                        }}
                      >
                        <div
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            dispatch({
                              type: "SET_VIEW",
                              view: "profile",
                              data: u.id,
                            })
                          }
                        >
                          <Avatar user={u} size={52} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                            }}
                          >
                            <div>
                              <div
                                style={{
                                  fontFamily: FONTS.body,
                                  fontWeight: 700,
                                  fontSize: 17,
                                  color: theme.text,
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  dispatch({
                                    type: "SET_VIEW",
                                    view: "profile",
                                    data: u.id,
                                  })
                                }
                              >
                                {u.name}
                              </div>
                              <div
                                style={{
                                  fontFamily: FONTS.mono,
                                  fontSize: 12,
                                  color: theme.muted,
                                }}
                              >
                                @{u.handle}
                              </div>
                            </div>
                            <button
                              onClick={() =>
                                dispatch({
                                  type: isF ? "UNFOLLOW_USER" : "FOLLOW_USER",
                                  id: u.id,
                                })
                              }
                              style={{
                                background: isF ? COLORS.tag : COLORS.accent,
                                border: "none",
                                borderRadius: 8,
                                padding: "7px 16px",
                                fontFamily: FONTS.body,
                                fontSize: 13,
                                fontWeight: 600,
                                cursor: "pointer",
                                color: isF ? COLORS.tagText : "#fff",
                              }}
                            >
                              {isF ? "✓ Following" : "+ Follow"}
                            </button>
                          </div>
                          <p
                            style={{
                              fontFamily: FONTS.body,
                              fontSize: 14,
                              color: theme.text,
                              margin: "8px 0",
                              lineHeight: 1.5,
                            }}
                          >
                            {u.bio}
                          </p>
                          <div style={{ display: "flex", gap: 16 }}>
                            <span
                              style={{
                                fontFamily: FONTS.body,
                                fontSize: 13,
                                color: theme.muted,
                              }}
                            >
                              <strong style={{ color: theme.text }}>
                                {u.followers.toLocaleString()}
                              </strong>{" "}
                              followers
                            </span>
                            <span
                              style={{
                                fontFamily: FONTS.body,
                                fontSize: 13,
                                color: theme.muted,
                              }}
                            >
                              <strong style={{ color: theme.text }}>
                                {u.following}
                              </strong>{" "}
                              following
                            </span>
                            {u.location && (
                              <span
                                style={{
                                  fontFamily: FONTS.body,
                                  fontSize: 13,
                                  color: theme.muted,
                                }}
                              >
                                📍 {u.location}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Profile */}
          {view === "profile" && viewedUser && (
            <div
              style={{
                background: theme.card,
                borderRadius: 16,
                border: `1px solid ${theme.border}`,
                overflow: "hidden",
              }}
            >
              <ProfileView
                user={viewedUser}
                posts={posts}
                currentUser={currentUser}
                dispatch={dispatch}
                following={following}
                theme={theme}
              />
            </div>
          )}
        </main>

        {!isMobile && (
          <aside>
            <Sidebar
              currentUser={currentUser}
              users={users}
              dispatch={dispatch}
              view={view}
              following={following}
              theme={theme}
            />

            {/* Switch account */}
            <div
              style={{
                background: theme.card,
                borderRadius: 16,
                border: `1px solid ${theme.border}`,
                padding: 20,
                marginTop: 16,
              }}
            >
              <h3
                style={{
                  fontFamily: FONTS.heading,
                  fontSize: 15,
                  margin: "0 0 12px",
                  color: theme.text,
                }}
              >
                Switch account
              </h3>
              {users.map((u) => (
                <button
                  key={u.id}
                  onClick={() =>
                    dispatch({ type: "SET_CURRENT_USER", user: u })
                  }
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "center",
                    width: "100%",
                    background:
                      u.id === currentUser.id
                        ? COLORS.accentLight
                        : "transparent",
                    border:
                      u.id === currentUser.id
                        ? `1.5px solid ${COLORS.accentMid}`
                        : "1.5px solid transparent",
                    borderRadius: 10,
                    padding: "8px 10px",
                    cursor: "pointer",
                    marginBottom: 6,
                  }}
                >
                  <Avatar user={u} size={30} />
                  <div style={{ textAlign: "left" }}>
                    <div
                      style={{
                        fontFamily: FONTS.body,
                        fontWeight: u.id === currentUser.id ? 700 : 400,
                        fontSize: 13,
                        color:
                          u.id === currentUser.id ? COLORS.accent : theme.text,
                      }}
                    >
                      {u.name}
                    </div>
                    <div
                      style={{
                        fontFamily: FONTS.mono,
                        fontSize: 11,
                        color: theme.muted,
                      }}
                    >
                      @{u.handle}
                    </div>
                  </div>
                  {u.id === currentUser.id && (
                    <span
                      style={{
                        marginLeft: "auto",
                        fontSize: 12,
                        color: COLORS.accent,
                      }}
                    >
                      ✓
                    </span>
                  )}
                </button>
              ))}
            </div>
          </aside>
        )}
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <Modal title="Create a post" onClose={() => setShowCreatePost(false)}>
          <CreatePost
            currentUser={currentUser}
            dispatch={dispatch}
            onClose={() => setShowCreatePost(false)}
          />
        </Modal>
      )}

      {/* Floating Create Button */}
      {isMobile && (
        <button
          onClick={() => setShowCreatePost(true)}
          style={{
            position: "fixed",
            bottom: 85,
            right: 18,
            width: 58,
            height: 58,
            borderRadius: "50%",
            border: "none",
            background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
            color: "#fff",
            fontSize: 30,
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 10px 25px rgba(99,102,241,0.4)",
            zIndex: 101,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          +
        </button>
      )}

      {isMobile && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            height: 70,
            background: darkMode
              ? "rgba(15,23,42,0.92)"
              : "rgba(255,255,255,0.92)",
            backdropFilter: "blur(16px)",
            borderTop: `1px solid ${theme.border}`,
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            zIndex: 100,
          }}
        >
          {navItems.map((item) => {
            const isActive = view === item.id;

            return (
              <div
                key={item.id}
                onClick={() =>
                  dispatch({
                    type: "SET_VIEW",
                    view: item.id,
                  })
                }
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: isActive ? COLORS.accent : theme.muted,
                  fontSize: 22,
                  fontWeight: 700,
                  transition: "0.2s",
                }}
              >
                <span>{item.icon}</span>

                <span
                  style={{
                    fontSize: 11,
                    marginTop: 2,
                  }}
                >
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600;700&family=DM+Mono&display=swap');
        * { box-sizing: border-box; }
        button:hover { opacity: 0.88; }
        input:focus, textarea:focus { border-color: ${COLORS.accent} !important; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${theme.border}; border-radius: 3px; }
      `}</style>
    </div>
  );
}
