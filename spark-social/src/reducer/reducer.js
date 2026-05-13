



export function reducer(state, action) {
  switch (action.type) {
    case "ADD_POST":
      return { ...state, posts: [action.post, ...state.posts] };
    case "UPDATE_POST":
      return {
        ...state,
        posts: state.posts.map((p) =>
          p.id === action.id ? { ...p, ...action.data, edited: true } : p,
        ),
      };
    case "DELETE_POST":
      return { ...state, posts: state.posts.filter((p) => p.id !== action.id) };
    case "TOGGLE_LIKE": {
      const uid = state.currentUser.id;
      return {
        ...state,
        posts: state.posts.map((p) =>
          p.id === action.id
            ? {
                ...p,
                likes: p.likes.includes(uid)
                  ? p.likes.filter((x) => x !== uid)
                  : [...p.likes, uid],
              }
            : p,
        ),
      };
    }
    case "TOGGLE_BOOKMARK": {
      const uid = state.currentUser.id;
      return {
        ...state,
        posts: state.posts.map((p) =>
          p.id === action.id
            ? {
                ...p,
                bookmarks: p.bookmarks.includes(uid)
                  ? p.bookmarks.filter((x) => x !== uid)
                  : [...p.bookmarks, uid],
              }
            : p,
        ),
      };
    }
    case "ADD_COMMENT":
      return {
        ...state,
        posts: state.posts.map((p) =>
          p.id === action.postId
            ? { ...p, comments: [...p.comments, action.comment] }
            : p,
        ),
      };
    case "DELETE_COMMENT":
      return {
        ...state,
        posts: state.posts.map((p) =>
          p.id === action.postId
            ? {
                ...p,
                comments: p.comments.filter((c) => c.id !== action.commentId),
              }
            : p,
        ),
      };
    case "UPDATE_PROFILE":
      return {
        ...state,
        users: state.users.map((u) =>
          u.id === action.id ? { ...u, ...action.data } : u,
        ),
        currentUser:
          state.currentUser.id === action.id
            ? { ...state.currentUser, ...action.data }
            : state.currentUser,
      };
    case "SET_VIEW":
      return { ...state, view: action.view, viewData: action.data || null };
    case "SET_CURRENT_USER":
      return { ...state, currentUser: action.user };
    case "FOLLOW_USER": {
      const uid = state.currentUser.id;
      return {
        ...state,
        users: state.users.map((u) => {
          if (u.id === action.id) return { ...u, followers: u.followers + 1 };
          if (u.id === uid) return { ...u, following: u.following + 1 };
          return u;
        }),
        following: [...(state.following || []), action.id],
      };
    }
    case "UNFOLLOW_USER": {
      const uid = state.currentUser.id;
      return {
        ...state,
        users: state.users.map((u) => {
          if (u.id === action.id)
            return { ...u, followers: Math.max(0, u.followers - 1) };
          if (u.id === uid)
            return { ...u, following: Math.max(0, u.following - 1) };
          return u;
        }),
        following: (state.following || []).filter((id) => id !== action.id),
      };
    }
    default:
      return state;
  }
}
