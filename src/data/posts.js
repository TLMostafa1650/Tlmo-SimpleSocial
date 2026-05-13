export const INIT_POSTS = [
  {
    id: "p1",
    authorId: "u1",
    content:
      "Just shipped the new design system! 🎨 Spent 3 months refining every component, token, and interaction. The result? A cohesive visual language that scales beautifully.",
    image: null,
    tags: ["design", "ux"],
    likes: ["u2", "u3"],
    comments: [
      {
        id: "c1",
        authorId: "u2",
        text: "This looks incredible, Mostafa!",
        createdAt: "2h ago",
      },
      {
        id: "c1",
        authorId: "u3",
        text: "Splendid work, Mostafa!",
        createdAt: "Moments ago",
      },
    ],
    bookmarks: ["u3"],
    createdAt: "3h ago",
    edited: false,
  },
  {
    id: "p2",
    authorId: "u2",
    content:
      "Open source lesson of the week: write the README before you write the code. Forces you to think about the API clearly. Been doing this for 2 years and it genuinely improves architecture.",
    image: null,
    tags: ["coding", "opensource"],
    likes: ["u1"],
    comments: [],
    bookmarks: ["u1", "u3"],
    createdAt: "5h ago",
    edited: false,
  },
  {
    id: "p3",
    authorId: "u3",
    content:
      "Golden hour in Lagos never disappoints. Shot this at the harbour just as the fishing boats were coming in. The light was absolutely magical.",
    image: "photo",
    tags: ["photography", "lagos"],
    likes: ["u1", "u2"],
    comments: [
      {
        id: "c2",
        authorId: "u1",
        text: "Stunning composition! What lens did you use?",
        createdAt: "1h ago",
      },
      {
        id: "c3",
        authorId: "u3",
        text: "Shot on 85mm f/1.4 .. love the bokeh it produces!",
        createdAt: "45m ago",
      },
    ],
    bookmarks: [],
    createdAt: "8h ago",
    edited: false,
  },
  {
    id: "p4",
    authorId: "u1",
    content:
      "Hot take: dark mode is not just an aesthetic choice — it's an accessibility feature. High contrast, reduced eye strain, works better for OLED screens. Designers should default to supporting both.",
    image: null,
    tags: ["design", "accessibility"],
    likes: ["u3"],
    comments: [],
    bookmarks: ["u2"],
    createdAt: "1d ago",
    edited: false,
  },
];