import { useReducer, useState } from "react";

import { reducer } from "./reducer/reducer";

import { INIT_POSTS } from "./data/posts";
import { INIT_USERS } from "./data/users";

import Sidebar from "./components/Sidebar";
import PostCard from "./components/PostCard";
import Modal from "./components/Modal";
import CreatePost from "./components/CreatePost";
import Btn from "./components/Btn";

import { COLORS } from "./constants/colors";

const INIT_STATE = {
  posts: INIT_POSTS,
  users: INIT_USERS,
  currentUser: INIT_USERS[0],
  following: [],
};

export default function App() {
  const [state, dispatch] = useReducer(reducer, INIT_STATE);

  const [showCreatePost, setShowCreatePost] = useState(false);

  const { posts, users, currentUser, following } = state;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: COLORS.bg,
        padding: 24,
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <h1>Spark</h1>

        <Btn onClick={() => setShowCreatePost(true)}>+ Post</Btn>
      </div>

      {/* MAIN LAYOUT */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 300px",
          gap: 24,
        }}
      >
        {/* POSTS */}
        <main>
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              users={users}
              currentUser={currentUser}
              dispatch={dispatch}
              onProfile={() => {}}
            />
          ))}
        </main>

        {/* SIDEBAR */}
        <aside>
          <Sidebar
            currentUser={currentUser}
            users={users}
            dispatch={dispatch}
            following={following}
          />
        </aside>
      </div>

      {/* MODAL */}
      {showCreatePost && (
        <Modal title="Create Post" onClose={() => setShowCreatePost(false)}>
          <CreatePost
            currentUser={currentUser}
            dispatch={dispatch}
            onClose={() => setShowCreatePost(false)}
          />
        </Modal>
      )}
    </div>
  );
}
