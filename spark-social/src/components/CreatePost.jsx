import { useState } from "react";
import { COLORS } from "../constants/colors";
import { FONTS } from "../constants/fonts";
import Input from "./Input";
import Btn from "./Btn";
import { generateId } from "../utils/generateId";



export default function CreatePost({ currentUser, dispatch, onClose }) {
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [hasImage, setHasImage] = useState(false);

  function submit() {
    if (!content.trim()) return;
    dispatch({
      type: "ADD_POST",
      post: {
        id: generateId(),
        authorId: currentUser.id,
        content: content.trim(),
        image: hasImage ? "photo" : null,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        likes: [],
        comments: [],
        bookmarks: [],
        createdAt: "just now",
        edited: false,
      },
    });
    if (onClose) onClose();
  }

  return (
    <div>
      <Input
        multiline
        value={content}
        onChange={setContent}
        placeholder="What's on your mind?"
        rows={4}
      />
      <Input
        label="Tags (comma-separated)"
        value={tags}
        onChange={setTags}
        placeholder="design, tech, life"
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            cursor: "pointer",
            fontFamily: FONTS.body,
            fontSize: 14,
            color: COLORS.muted,
          }}
        >
          <input
            type="checkbox"
            checked={hasImage}
            onChange={(e) => setHasImage(e.target.checked)}
          />{" "}
          📷 Add photo
        </label>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
        {onClose && (
          <Btn variant="ghost" onClick={onClose}>
            Cancel
          </Btn>
        )}
        <Btn onClick={submit} disabled={!content.trim()}>
          Publish post
        </Btn>
      </div>
    </div>
  );
}