import { useState, useReducer, useRef, useEffect } from "react";

const COLORS = {
  accent: "#E8442A",
  accentLight: "#FFF0ED",
  accentMid: "#F5A090",
  bg: "#FAF8F5",
  card: "#FFFFFF",
  border: "#EDEAE4",
  text: "#1A1714",
  muted: "#8A8480",
  tag: "#F0EDE8",
  tagText: "#5C5752",
  success: "#2D7A4F",
  successBg: "#EAF5EE",
  info: "#1A5FA8",
  infoBg: "#EAF2FC",
};

const FONTS = {
  heading: "'Playfair Display', Georgia, serif",
  body: "'DM Sans', sans-serif",
  mono: "'DM Mono', monospace",
};

const generateId = () => Math.random().toString(36).substr(2, 9);

const INIT_USERS = [
  { id: "u1", name: "Riya Menon", handle: "riyam", avatar: "RM", bio: "Designer & dreamer. Making things beautiful.", location: "Amsterdam", website: "riyam.design", followers: 1420, following: 312, joined: "Jan 2023", coverColor: "#E8442A" },
  { id: "u2", name: "Tobias Graf", handle: "tobgraf", avatar: "TG", bio: "Software engineer. Open source enthusiast.", location: "Berlin", website: "tobgraf.dev", followers: 892, following: 214, joined: "Mar 2022", coverColor: "#1A5FA8" },
  { id: "u3", name: "Amara Osei", handle: "amaraosei", avatar: "AO", bio: "Photographer. Visual storyteller. Coffee addict.", location: "Lagos", website: "", followers: 3211, following: 521, joined: "Sep 2021", coverColor: "#2D7A4F" },
];

const INIT_POSTS = [
  { id: "p1", authorId: "u1", content: "Just shipped the new design system! 🎨 Spent 3 months refining every component, token, and interaction. The result? A cohesive visual language that scales beautifully.", image: null, tags: ["design", "ux"], likes: ["u2", "u3"], comments: [{ id: "c1", authorId: "u2", text: "This looks incredible, Riya!", createdAt: "2h ago" }], bookmarks: ["u3"], createdAt: "3h ago", edited: false },
  { id: "p2", authorId: "u2", content: "Open source lesson of the week: write the README before you write the code. Forces you to think about the API clearly. Been doing this for 2 years and it genuinely improves architecture.", image: null, tags: ["coding", "opensource"], likes: ["u1"], comments: [], bookmarks: ["u1", "u3"], createdAt: "5h ago", edited: false },
  { id: "p3", authorId: "u3", content: "Golden hour in Lagos never disappoints. Shot this at the harbour just as the fishing boats were coming in. The light was absolutely magical.", image: "photo", tags: ["photography", "lagos"], likes: ["u1", "u2"], comments: [{ id: "c2", authorId: "u1", text: "Stunning composition! What lens did you use?", createdAt: "1h ago" }, { id: "c3", authorId: "u3", text: "Shot on 85mm f/1.4 — love the bokeh it produces!", createdAt: "45m ago" }], bookmarks: [], createdAt: "8h ago", edited: false },
  { id: "p4", authorId: "u1", content: "Hot take: dark mode is not just an aesthetic choice — it's an accessibility feature. High contrast, reduced eye strain, works better for OLED screens. Designers should default to supporting both.", image: null, tags: ["design", "accessibility"], likes: ["u3"], comments: [], bookmarks: ["u2"], createdAt: "1d ago", edited: false },
];

const PHOTO_GRADIENTS = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
];

function reducer(state, action) {
  switch (action.type) {
    case "ADD_POST": return { ...state, posts: [action.post, ...state.posts] };
    case "UPDATE_POST": return { ...state, posts: state.posts.map(p => p.id === action.id ? { ...p, ...action.data, edited: true } : p) };
    case "DELETE_POST": return { ...state, posts: state.posts.filter(p => p.id !== action.id) };
    case "TOGGLE_LIKE": {
      const uid = state.currentUser.id;
      return { ...state, posts: state.posts.map(p => p.id === action.id ? { ...p, likes: p.likes.includes(uid) ? p.likes.filter(x => x !== uid) : [...p.likes, uid] } : p) };
    }
    case "TOGGLE_BOOKMARK": {
      const uid = state.currentUser.id;
      return { ...state, posts: state.posts.map(p => p.id === action.id ? { ...p, bookmarks: p.bookmarks.includes(uid) ? p.bookmarks.filter(x => x !== uid) : [...p.bookmarks, uid] } : p) };
    }
    case "ADD_COMMENT": return { ...state, posts: state.posts.map(p => p.id === action.postId ? { ...p, comments: [...p.comments, action.comment] } : p) };
    case "DELETE_COMMENT": return { ...state, posts: state.posts.map(p => p.id === action.postId ? { ...p, comments: p.comments.filter(c => c.id !== action.commentId) } : p) };
    case "UPDATE_PROFILE": return { ...state, users: state.users.map(u => u.id === action.id ? { ...u, ...action.data } : u), currentUser: state.currentUser.id === action.id ? { ...state.currentUser, ...action.data } : state.currentUser };
    case "SET_VIEW": return { ...state, view: action.view, viewData: action.data || null };
    case "SET_CURRENT_USER": return { ...state, currentUser: action.user };
    case "FOLLOW_USER": {
      const uid = state.currentUser.id;
      return { ...state, users: state.users.map(u => { if (u.id === action.id) return { ...u, followers: u.followers + 1 }; if (u.id === uid) return { ...u, following: u.following + 1 }; return u; }), following: [...(state.following || []), action.id] };
    }
    case "UNFOLLOW_USER": {
      const uid = state.currentUser.id;
      return { ...state, users: state.users.map(u => { if (u.id === action.id) return { ...u, followers: Math.max(0, u.followers - 1) }; if (u.id === uid) return { ...u, following: Math.max(0, u.following - 1) }; return u; }), following: (state.following || []).filter(id => id !== action.id) };
    }
    default: return state;
  }
}

const INIT_STATE = { posts: INIT_POSTS, users: INIT_USERS, currentUser: INIT_USERS[0], view: "feed", viewData: null, following: ["u2"] };

// ── Avatar ──
function Avatar({ user, size = 40 }) {
  const colors = { "RM": "#E8442A", "TG": "#1A5FA8", "AO": "#2D7A4F" };
  const bg = colors[user?.avatar] || "#8A8480";
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: bg, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: FONTS.body, fontWeight: 600, fontSize: size * 0.35, flexShrink: 0 }}>
      {user?.avatar || "?"}
    </div>
  );
}

// ── Tag Pill ──
function Tag({ label }) {
  return <span style={{ background: COLORS.tag, color: COLORS.tagText, padding: "2px 10px", borderRadius: 20, fontSize: 12, fontFamily: FONTS.body }}>{label}</span>;
}

// ── Photo Placeholder ──
function PhotoPlaceholder({ postId }) {
  const idx = postId ? postId.charCodeAt(1) % PHOTO_GRADIENTS.length : 0;
  return (
    <div style={{ width: "100%", height: 240, borderRadius: 12, background: PHOTO_GRADIENTS[idx], margin: "12px 0", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ color: "rgba(255,255,255,0.7)", fontFamily: FONTS.body, fontSize: 14 }}>📷 Photo</span>
    </div>
  );
}

// ── Modal ──
function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div style={{ background: COLORS.card, borderRadius: 16, padding: "28px 32px", maxWidth: 540, width: "90%", maxHeight: "85vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontFamily: FONTS.heading, fontSize: 22, margin: 0, color: COLORS.text }}>{title}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: COLORS.muted, lineHeight: 1 }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Input ──
function Input({ label, value, onChange, placeholder, type = "text", multiline, rows = 4 }) {
  const style = { width: "100%", padding: "10px 14px", border: `1.5px solid ${COLORS.border}`, borderRadius: 10, fontFamily: FONTS.body, fontSize: 14, color: COLORS.text, background: COLORS.bg, outline: "none", boxSizing: "border-box", resize: "vertical" };
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ display: "block", fontFamily: FONTS.body, fontSize: 13, color: COLORS.muted, marginBottom: 6, fontWeight: 500 }}>{label}</label>}
      {multiline ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} style={style} /> : <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={style} />}
    </div>
  );
}

// ── Button ──
function Btn({ children, onClick, variant = "primary", small, disabled }) {
  const variants = {
    primary: { background: COLORS.accent, color: "#fff", border: "none" },
    ghost: { background: "transparent", color: COLORS.muted, border: `1.5px solid ${COLORS.border}` },
    danger: { background: "#FEF0F0", color: "#C0392B", border: "1.5px solid #FADADD" },
  };
  return (
    <button disabled={disabled} onClick={onClick} style={{ ...variants[variant], padding: small ? "6px 14px" : "10px 20px", borderRadius: 10, fontFamily: FONTS.body, fontWeight: 600, fontSize: small ? 13 : 14, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1, display: "inline-flex", alignItems: "center", gap: 6, transition: "opacity 0.15s" }}>
      {children}
    </button>
  );
}

// ── Post Card ──
function PostCard({ post, users, currentUser, dispatch, onProfile }) {
  const author = users.find(u => u.id === post.authorId);
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
    dispatch({ type: "ADD_COMMENT", postId: post.id, comment: { id: generateId(), authorId: currentUser.id, text: commentText.trim(), createdAt: "just now" } });
    setCommentText("");
  }

  function submitEdit() {
    dispatch({ type: "UPDATE_POST", id: post.id, data: { content: editContent, tags: editTags.split(",").map(t => t.trim()).filter(Boolean) } });
    setEditing(false);
  }

  return (
    <div style={{ background: COLORS.card, borderRadius: 16, border: `1px solid ${COLORS.border}`, padding: "20px 24px", marginBottom: 16 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center", cursor: "pointer" }} onClick={() => onProfile(author)}>
          <Avatar user={author} size={42} />
          <div>
            <div style={{ fontFamily: FONTS.body, fontWeight: 700, fontSize: 15, color: COLORS.text }}>{author?.name}</div>
            <div style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.muted }}>@{author?.handle} · {post.createdAt}{post.edited ? " · edited" : ""}</div>
          </div>
        </div>
        {isOwner && (
          <div style={{ position: "relative" }}>
            <button onClick={() => setShowMenu(!showMenu)} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.muted, fontSize: 20, padding: "4px 8px" }}>⋯</button>
            {showMenu && (
              <div style={{ position: "absolute", right: 0, top: "100%", background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12, overflow: "hidden", zIndex: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.1)", minWidth: 140 }}>
                <button onClick={() => { setEditing(true); setShowMenu(false); }} style={{ display: "block", width: "100%", padding: "10px 16px", textAlign: "left", background: "none", border: "none", fontFamily: FONTS.body, fontSize: 14, cursor: "pointer", color: COLORS.text }}>✏️ Edit</button>
                <button onClick={() => { dispatch({ type: "DELETE_POST", id: post.id }); setShowMenu(false); }} style={{ display: "block", width: "100%", padding: "10px 16px", textAlign: "left", background: "none", border: "none", fontFamily: FONTS.body, fontSize: 14, cursor: "pointer", color: "#C0392B" }}>🗑 Delete</button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      {editing ? (
        <div>
          <Input multiline value={editContent} onChange={setEditContent} rows={4} />
          <Input label="Tags (comma-separated)" value={editTags} onChange={setEditTags} placeholder="design, tech, life" />
          <div style={{ display: "flex", gap: 10 }}>
            <Btn onClick={submitEdit}>Save changes</Btn>
            <Btn variant="ghost" onClick={() => setEditing(false)}>Cancel</Btn>
          </div>
        </div>
      ) : (
        <>
          <p style={{ fontFamily: FONTS.body, fontSize: 15, lineHeight: 1.65, color: COLORS.text, margin: "0 0 12px" }}>{post.content}</p>
          {post.image && <PhotoPlaceholder postId={post.id} />}
          {post.tags.length > 0 && <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>{post.tags.map(t => <Tag key={t} label={`#${t}`} />)}</div>}
        </>
      )}

      {/* Actions */}
      {!editing && (
        <div style={{ display: "flex", gap: 6, borderTop: `1px solid ${COLORS.border}`, paddingTop: 14, marginTop: 4 }}>
          <button onClick={() => dispatch({ type: "TOGGLE_LIKE", id: post.id })} style={{ background: liked ? COLORS.accentLight : "transparent", border: `1.5px solid ${liked ? COLORS.accentMid : COLORS.border}`, borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontFamily: FONTS.body, fontSize: 13, color: liked ? COLORS.accent : COLORS.muted, display: "flex", alignItems: "center", gap: 5, fontWeight: liked ? 700 : 400 }}>
            {liked ? "❤️" : "🤍"} {post.likes.length}
          </button>
          <button onClick={() => setShowComments(!showComments)} style={{ background: "transparent", border: `1.5px solid ${COLORS.border}`, borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontFamily: FONTS.body, fontSize: 13, color: COLORS.muted, display: "flex", alignItems: "center", gap: 5 }}>
            💬 {post.comments.length}
          </button>
          <button onClick={() => dispatch({ type: "TOGGLE_BOOKMARK", id: post.id })} style={{ background: bookmarked ? COLORS.infoBg : "transparent", border: `1.5px solid ${bookmarked ? "#B3D1F4" : COLORS.border}`, borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontFamily: FONTS.body, fontSize: 13, color: bookmarked ? COLORS.info : COLORS.muted }}>
            {bookmarked ? "🔖" : "📑"}
          </button>
        </div>
      )}

      {/* Comments */}
      {showComments && (
        <div style={{ marginTop: 16, borderTop: `1px solid ${COLORS.border}`, paddingTop: 16 }}>
          {post.comments.map(c => {
            const cAuthor = users.find(u => u.id === c.authorId);
            const canDelete = c.authorId === currentUser.id || post.authorId === currentUser.id;
            return (
              <div key={c.id} style={{ display: "flex", gap: 10, marginBottom: 12, alignItems: "flex-start" }}>
                <Avatar user={cAuthor} size={32} />
                <div style={{ flex: 1, background: COLORS.bg, borderRadius: 10, padding: "8px 12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontFamily: FONTS.body, fontWeight: 600, fontSize: 13, color: COLORS.text }}>{cAuthor?.name}</span>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.muted }}>{c.createdAt}</span>
                      {canDelete && <button onClick={() => dispatch({ type: "DELETE_COMMENT", postId: post.id, commentId: c.id })} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.muted, fontSize: 13 }}>×</button>}
                    </div>
                  </div>
                  <p style={{ fontFamily: FONTS.body, fontSize: 14, color: COLORS.text, margin: "4px 0 0" }}>{c.text}</p>
                </div>
              </div>
            );
          })}
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 8 }}>
            <Avatar user={currentUser} size={32} />
            <input value={commentText} onChange={e => setCommentText(e.target.value)} onKeyDown={e => e.key === "Enter" && submitComment()} placeholder="Write a comment…" style={{ flex: 1, padding: "8px 14px", border: `1.5px solid ${COLORS.border}`, borderRadius: 10, fontFamily: FONTS.body, fontSize: 14, background: COLORS.bg, outline: "none" }} />
            <Btn small onClick={submitComment} disabled={!commentText.trim()}>Post</Btn>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Create Post ──
function CreatePost({ currentUser, dispatch, onClose }) {
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [hasImage, setHasImage] = useState(false);

  function submit() {
    if (!content.trim()) return;
    dispatch({ type: "ADD_POST", post: { id: generateId(), authorId: currentUser.id, content: content.trim(), image: hasImage ? "photo" : null, tags: tags.split(",").map(t => t.trim()).filter(Boolean), likes: [], comments: [], bookmarks: [], createdAt: "just now", edited: false } });
    if (onClose) onClose();
  }

  return (
    <div>
      <Input multiline value={content} onChange={setContent} placeholder="What's on your mind?" rows={4} />
      <Input label="Tags (comma-separated)" value={tags} onChange={setTags} placeholder="design, tech, life" />
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontFamily: FONTS.body, fontSize: 14, color: COLORS.muted }}>
          <input type="checkbox" checked={hasImage} onChange={e => setHasImage(e.target.checked)} /> 📷 Add photo
        </label>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
        {onClose && <Btn variant="ghost" onClick={onClose}>Cancel</Btn>}
        <Btn onClick={submit} disabled={!content.trim()}>Publish post</Btn>
      </div>
    </div>
  );
}

// ── Profile View ──
function ProfileView({ user, posts, currentUser, dispatch, following }) {
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({ name: user.name, bio: user.bio, location: user.location, website: user.website });
  const isOwn = user.id === currentUser.id;
  const isFollowing = (following || []).includes(user.id);
  const userPosts = posts.filter(p => p.authorId === user.id);

  function saveProfile() {
    dispatch({ type: "UPDATE_PROFILE", id: user.id, data: editData });
    setEditing(false);
  }

  return (
    <div>
      {/* Cover */}
      <div style={{ height: 140, background: `linear-gradient(135deg, ${user.coverColor}CC, ${user.coverColor}55)`, borderRadius: 16, marginBottom: -50, position: "relative" }}>
        {isOwn && (
          <button onClick={() => setEditing(!editing)} style={{ position: "absolute", top: 16, right: 16, background: "rgba(255,255,255,0.85)", border: "none", borderRadius: 8, padding: "7px 16px", fontFamily: FONTS.body, fontSize: 13, fontWeight: 600, cursor: "pointer", color: COLORS.text }}>
            {editing ? "Cancel" : "✏️ Edit profile"}
          </button>
        )}
        {!isOwn && (
          <button onClick={() => dispatch({ type: isFollowing ? "UNFOLLOW_USER" : "FOLLOW_USER", id: user.id })} style={{ position: "absolute", top: 16, right: 16, background: isFollowing ? "rgba(255,255,255,0.85)" : COLORS.accent, border: "none", borderRadius: 8, padding: "7px 16px", fontFamily: FONTS.body, fontSize: 13, fontWeight: 600, cursor: "pointer", color: isFollowing ? COLORS.text : "#fff" }}>
            {isFollowing ? "✓ Following" : "+ Follow"}
          </button>
        )}
      </div>

      <div style={{ padding: "0 24px 24px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 16, marginBottom: 16 }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: user.coverColor, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: FONTS.body, fontWeight: 700, fontSize: 28, border: "4px solid #fff", flexShrink: 0, marginTop: -10 }}>
            {user.avatar}
          </div>
        </div>

        {editing ? (
          <div>
            <Input label="Name" value={editData.name} onChange={v => setEditData({ ...editData, name: v })} />
            <Input label="Bio" multiline value={editData.bio} onChange={v => setEditData({ ...editData, bio: v })} rows={2} />
            <Input label="Location" value={editData.location} onChange={v => setEditData({ ...editData, location: v })} placeholder="City, Country" />
            <Input label="Website" value={editData.website} onChange={v => setEditData({ ...editData, website: v })} placeholder="yoursite.com" />
            <div style={{ display: "flex", gap: 10 }}>
              <Btn onClick={saveProfile}>Save profile</Btn>
              <Btn variant="ghost" onClick={() => setEditing(false)}>Cancel</Btn>
            </div>
          </div>
        ) : (
          <div>
            <h1 style={{ fontFamily: FONTS.heading, fontSize: 26, margin: "0 0 4px", color: COLORS.text }}>{user.name}</h1>
            <div style={{ fontFamily: FONTS.mono, fontSize: 13, color: COLORS.muted, marginBottom: 10 }}>@{user.handle} · joined {user.joined}</div>
            <p style={{ fontFamily: FONTS.body, fontSize: 15, color: COLORS.text, margin: "0 0 12px", lineHeight: 1.6 }}>{user.bio}</p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 16 }}>
              {user.location && <span style={{ fontFamily: FONTS.body, fontSize: 13, color: COLORS.muted }}>📍 {user.location}</span>}
              {user.website && <span style={{ fontFamily: FONTS.body, fontSize: 13, color: COLORS.info }}>🔗 {user.website}</span>}
            </div>
            <div style={{ display: "flex", gap: 24 }}>
              <div><span style={{ fontFamily: FONTS.body, fontWeight: 700, fontSize: 18, color: COLORS.text }}>{user.followers.toLocaleString()}</span><span style={{ fontFamily: FONTS.body, fontSize: 13, color: COLORS.muted, marginLeft: 4 }}>followers</span></div>
              <div><span style={{ fontFamily: FONTS.body, fontWeight: 700, fontSize: 18, color: COLORS.text }}>{user.following}</span><span style={{ fontFamily: FONTS.body, fontSize: 13, color: COLORS.muted, marginLeft: 4 }}>following</span></div>
              <div><span style={{ fontFamily: FONTS.body, fontWeight: 700, fontSize: 18, color: COLORS.text }}>{userPosts.length}</span><span style={{ fontFamily: FONTS.body, fontSize: 13, color: COLORS.muted, marginLeft: 4 }}>posts</span></div>
            </div>
          </div>
        )}

        <div style={{ borderTop: `1px solid ${COLORS.border}`, marginTop: 24, paddingTop: 24 }}>
          <h2 style={{ fontFamily: FONTS.heading, fontSize: 20, margin: "0 0 16px", color: COLORS.text }}>Posts</h2>
          {userPosts.length === 0 && <p style={{ fontFamily: FONTS.body, color: COLORS.muted, fontSize: 15 }}>No posts yet.</p>}
          {userPosts.map(p => (
            <PostCard key={p.id} post={p} users={[user]} currentUser={currentUser} dispatch={dispatch} onProfile={() => {}} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Sidebar ──
function Sidebar({ currentUser, users, dispatch, view, following }) {
  const suggestions = users.filter(u => u.id !== currentUser.id && !(following || []).includes(u.id));
  return (
    <div>
      {/* My profile card */}
      <div style={{ background: COLORS.card, borderRadius: 16, border: `1px solid ${COLORS.border}`, padding: "20px", marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14, cursor: "pointer" }} onClick={() => dispatch({ type: "SET_VIEW", view: "profile", data: currentUser.id })}>
          <Avatar user={currentUser} size={44} />
          <div>
            <div style={{ fontFamily: FONTS.body, fontWeight: 700, fontSize: 15, color: COLORS.text }}>{currentUser.name}</div>
            <div style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.muted }}>@{currentUser.handle}</div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-around", borderTop: `1px solid ${COLORS.border}`, paddingTop: 14 }}>
          {[["Posts", "p-count"], ["Followers", "followers"], ["Following", "following"]].map(([label, key]) => (
            <div key={key} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: FONTS.body, fontWeight: 700, fontSize: 17, color: COLORS.text }}>
                {key === "p-count" ? 0 : currentUser[key]}
              </div>
              <div style={{ fontFamily: FONTS.body, fontSize: 12, color: COLORS.muted }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div style={{ background: COLORS.card, borderRadius: 16, border: `1px solid ${COLORS.border}`, padding: "20px" }}>
          <h3 style={{ fontFamily: FONTS.heading, fontSize: 16, margin: "0 0 14px", color: COLORS.text }}>People to follow</h3>
          {suggestions.map(u => (
            <div key={u.id} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
              <Avatar user={u} size={36} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: FONTS.body, fontWeight: 600, fontSize: 14, color: COLORS.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.name}</div>
                <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.muted }}>@{u.handle}</div>
              </div>
              <button onClick={() => dispatch({ type: "FOLLOW_USER", id: u.id })} style={{ background: COLORS.accent, border: "none", borderRadius: 8, padding: "5px 12px", fontFamily: FONTS.body, fontSize: 12, fontWeight: 600, cursor: "pointer", color: "#fff", flexShrink: 0 }}>Follow</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main App ──
export default function App() {
  const [state, dispatch] = useReducer(reducer, INIT_STATE);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { posts, users, currentUser, view, viewData, following } = state;

  const filteredPosts = searchQuery
    ? posts.filter(p => p.content.toLowerCase().includes(searchQuery.toLowerCase()) || p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())))
    : posts;

  const bookmarkedPosts = posts.filter(p => p.bookmarks.includes(currentUser.id));
  const myPosts = posts.filter(p => p.authorId === currentUser.id);

  const viewedUser = viewData ? users.find(u => u.id === viewData) : null;

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

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, fontFamily: FONTS.body }}>
      {/* Top nav */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(250,248,245,0.92)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${COLORS.border}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", height: 60, display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ fontFamily: FONTS.heading, fontSize: 22, fontWeight: 700, color: COLORS.accent, letterSpacing: -0.5, flexShrink: 0 }}>Spark</div>
          <div style={{ flex: 1, display: "flex", gap: 4 }}>
            {navItems.map(item => (
              <button key={item.id} onClick={() => dispatch({ type: "SET_VIEW", view: item.id })} style={{ background: view === item.id ? COLORS.accentLight : "transparent", border: "none", borderRadius: 8, padding: "7px 14px", fontFamily: FONTS.body, fontSize: 14, fontWeight: view === item.id ? 700 : 400, cursor: "pointer", color: view === item.id ? COLORS.accent : COLORS.muted, display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
                <span>{item.icon}</span><span style={{ display: window.innerWidth > 600 ? "inline" : "none" }}>{item.label}</span>
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button onClick={() => setShowCreatePost(true)} style={{ background: COLORS.accent, border: "none", borderRadius: 10, padding: "8px 18px", fontFamily: FONTS.body, fontSize: 14, fontWeight: 700, cursor: "pointer", color: "#fff" }}>+ Post</button>
            <div style={{ cursor: "pointer" }} onClick={() => dispatch({ type: "SET_VIEW", view: "profile", data: currentUser.id })}>
              <Avatar user={currentUser} size={34} />
            </div>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px", display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, alignItems: "start" }}>
        {/* Main content */}
        <main>
          {/* Feed */}
          {(view === "feed" || view === "explore") && (
            <div>
              {view === "explore" && (
                <div style={{ marginBottom: 20 }}>
                  <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search posts and tags…" style={{ width: "100%", padding: "12px 16px", border: `1.5px solid ${COLORS.border}`, borderRadius: 12, fontFamily: FONTS.body, fontSize: 15, background: COLORS.card, outline: "none", boxSizing: "border-box" }} />
                </div>
              )}
              {view === "feed" && (
                <div style={{ background: COLORS.card, borderRadius: 16, border: `1px solid ${COLORS.border}`, padding: "20px 24px", marginBottom: 16 }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <Avatar user={currentUser} size={42} />
                    <button onClick={() => setShowCreatePost(true)} style={{ flex: 1, textAlign: "left", padding: "12px 16px", border: `1.5px solid ${COLORS.border}`, borderRadius: 12, fontFamily: FONTS.body, fontSize: 15, color: COLORS.muted, background: COLORS.bg, cursor: "pointer" }}>
                      What's on your mind, {currentUser.name.split(" ")[0]}?
                    </button>
                  </div>
                </div>
              )}
              {filteredPosts.length === 0 && <p style={{ fontFamily: FONTS.body, color: COLORS.muted, textAlign: "center", padding: "40px 0" }}>No posts found.</p>}
              {filteredPosts.map(p => <PostCard key={p.id} post={p} users={users} currentUser={currentUser} dispatch={dispatch} onProfile={onProfile} />)}
            </div>
          )}

          {/* Saved */}
          {view === "bookmarks" && (
            <div>
              <h2 style={{ fontFamily: FONTS.heading, fontSize: 24, margin: "0 0 20px", color: COLORS.text }}>Saved posts</h2>
              {bookmarkedPosts.length === 0 && <p style={{ fontFamily: FONTS.body, color: COLORS.muted }}>No saved posts yet. Bookmark posts to find them here.</p>}
              {bookmarkedPosts.map(p => <PostCard key={p.id} post={p} users={users} currentUser={currentUser} dispatch={dispatch} onProfile={onProfile} />)}
            </div>
          )}

          {/* My posts */}
          {view === "my-posts" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h2 style={{ fontFamily: FONTS.heading, fontSize: 24, margin: 0, color: COLORS.text }}>My posts</h2>
                <Btn onClick={() => setShowCreatePost(true)}>+ New post</Btn>
              </div>
              {myPosts.length === 0 && <p style={{ fontFamily: FONTS.body, color: COLORS.muted }}>You haven't posted yet.</p>}
              {myPosts.map(p => <PostCard key={p.id} post={p} users={users} currentUser={currentUser} dispatch={dispatch} onProfile={onProfile} />)}
            </div>
          )}

          {/* People */}
          {view === "people" && (
            <div>
              <h2 style={{ fontFamily: FONTS.heading, fontSize: 24, margin: "0 0 20px", color: COLORS.text }}>People</h2>
              <div style={{ display: "grid", gap: 16 }}>
                {users.filter(u => u.id !== currentUser.id).map(u => {
                  const isF = (following || []).includes(u.id);
                  return (
                    <div key={u.id} style={{ background: COLORS.card, borderRadius: 16, border: `1px solid ${COLORS.border}`, padding: "20px 24px", display: "flex", gap: 16, alignItems: "flex-start" }}>
                      <div style={{ cursor: "pointer" }} onClick={() => dispatch({ type: "SET_VIEW", view: "profile", data: u.id })}>
                        <Avatar user={u} size={52} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <div>
                            <div style={{ fontFamily: FONTS.body, fontWeight: 700, fontSize: 17, color: COLORS.text, cursor: "pointer" }} onClick={() => dispatch({ type: "SET_VIEW", view: "profile", data: u.id })}>{u.name}</div>
                            <div style={{ fontFamily: FONTS.mono, fontSize: 12, color: COLORS.muted }}>@{u.handle}</div>
                          </div>
                          <button onClick={() => dispatch({ type: isF ? "UNFOLLOW_USER" : "FOLLOW_USER", id: u.id })} style={{ background: isF ? COLORS.tag : COLORS.accent, border: "none", borderRadius: 8, padding: "7px 16px", fontFamily: FONTS.body, fontSize: 13, fontWeight: 600, cursor: "pointer", color: isF ? COLORS.tagText : "#fff" }}>
                            {isF ? "✓ Following" : "+ Follow"}
                          </button>
                        </div>
                        <p style={{ fontFamily: FONTS.body, fontSize: 14, color: COLORS.text, margin: "8px 0", lineHeight: 1.5 }}>{u.bio}</p>
                        <div style={{ display: "flex", gap: 16 }}>
                          <span style={{ fontFamily: FONTS.body, fontSize: 13, color: COLORS.muted }}><strong style={{ color: COLORS.text }}>{u.followers.toLocaleString()}</strong> followers</span>
                          <span style={{ fontFamily: FONTS.body, fontSize: 13, color: COLORS.muted }}><strong style={{ color: COLORS.text }}>{u.following}</strong> following</span>
                          {u.location && <span style={{ fontFamily: FONTS.body, fontSize: 13, color: COLORS.muted }}>📍 {u.location}</span>}
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
            <div style={{ background: COLORS.card, borderRadius: 16, border: `1px solid ${COLORS.border}`, overflow: "hidden" }}>
              <ProfileView user={viewedUser} posts={posts} currentUser={currentUser} dispatch={dispatch} following={following} />
            </div>
          )}
        </main>

        {/* Sidebar */}
        <aside>
          <Sidebar currentUser={currentUser} users={users} dispatch={dispatch} view={view} following={following} />

          {/* Switch account */}
          <div style={{ background: COLORS.card, borderRadius: 16, border: `1px solid ${COLORS.border}`, padding: 20, marginTop: 16 }}>
            <h3 style={{ fontFamily: FONTS.heading, fontSize: 15, margin: "0 0 12px", color: COLORS.text }}>Switch account</h3>
            {users.map(u => (
              <button key={u.id} onClick={() => dispatch({ type: "SET_CURRENT_USER", user: u })} style={{ display: "flex", gap: 10, alignItems: "center", width: "100%", background: u.id === currentUser.id ? COLORS.accentLight : "transparent", border: u.id === currentUser.id ? `1.5px solid ${COLORS.accentMid}` : "1.5px solid transparent", borderRadius: 10, padding: "8px 10px", cursor: "pointer", marginBottom: 6 }}>
                <Avatar user={u} size={30} />
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontFamily: FONTS.body, fontWeight: u.id === currentUser.id ? 700 : 400, fontSize: 13, color: u.id === currentUser.id ? COLORS.accent : COLORS.text }}>{u.name}</div>
                  <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: COLORS.muted }}>@{u.handle}</div>
                </div>
                {u.id === currentUser.id && <span style={{ marginLeft: "auto", fontSize: 12, color: COLORS.accent }}>✓</span>}
              </button>
            ))}
          </div>
        </aside>
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <Modal title="Create a post" onClose={() => setShowCreatePost(false)}>
          <CreatePost currentUser={currentUser} dispatch={dispatch} onClose={() => setShowCreatePost(false)} />
        </Modal>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600;700&family=DM+Mono&display=swap');
        * { box-sizing: border-box; }
        button:hover { opacity: 0.88; }
        input:focus, textarea:focus { border-color: ${COLORS.accent} !important; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius: 3px; }
      `}</style>
    </div>
  );
}
