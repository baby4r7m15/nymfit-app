import { BlockType } from "@/lib/types";

export type FieldKind = "text" | "textarea" | "number" | "url" | "list" | "objectList";

export type ObjectFieldDef = { key: string; label: string; kind: "text" | "number" };

export type FieldDef = {
  key: string;
  label: string;
  kind: FieldKind;
  // for kind === "objectList": shape of each item in the array
  itemFields?: ObjectFieldDef[];
};

export type CardDef = {
  type: BlockType;
  label: string;
  description: string;
  fields: FieldDef[];
  defaultContent: Record<string, any>;
};

export const CARD_REGISTRY: Record<BlockType, CardDef> = {
  hero: {
    type: "hero",
    label: "Hero Image",
    description: "Big banner image with a title, like a cover photo.",
    fields: [
      { key: "title", label: "Panel title", kind: "text" },
      { key: "imageUrl", label: "Image URL", kind: "url" },
      { key: "lockedLabel", label: "Corner badge text", kind: "text" },
    ],
    defaultContent: {
      title: "//_HERO",
      imageUrl: "",
      lockedLabel: "LOCKED",
    },
  },
  about: {
    type: "about",
    label: "About",
    description: "Name, role, bio paragraphs, a stat list, and a portrait.",
    fields: [
      { key: "title", label: "Panel title", kind: "text" },
      { key: "name", label: "Name", kind: "text" },
      { key: "role", label: "Role / subtitle", kind: "text" },
      { key: "bio", label: "Bio (one line per paragraph)", kind: "list" },
      {
        key: "stats",
        label: "Stats",
        kind: "objectList",
        itemFields: [
          { key: "label", label: "Label", kind: "text" },
          { key: "value", label: "Value", kind: "text" },
        ],
      },
      { key: "imageUrl", label: "Portrait image URL", kind: "url" },
    ],
    defaultContent: {
      title: "//_ABOUT_ME",
      name: "YOUR NAME",
      role: "Your role",
      bio: ["Say something about yourself."],
      stats: [{ label: "ROLE:", value: "..." }],
      imageUrl: "",
    },
  },
  quote: {
    type: "quote",
    label: "Quote",
    description: "A short highlighted quote.",
    fields: [
      { key: "title", label: "Panel title", kind: "text" },
      { key: "lines", label: "Quote lines", kind: "list" },
    ],
    defaultContent: {
      title: "//_QUOTE.LOG",
      lines: ['"Your quote goes here."'],
    },
  },
  status: {
    type: "status",
    label: "Status",
    description: "A little status readout with rows of stats.",
    fields: [
      { key: "title", label: "Panel title", kind: "text" },
      { key: "state", label: "Big state label", kind: "text" },
      {
        key: "rows",
        label: "Rows",
        kind: "objectList",
        itemFields: [
          { key: "label", label: "Label", kind: "text" },
          { key: "value", label: "Value", kind: "text" },
        ],
      },
      { key: "footer", label: "Footer text", kind: "text" },
    ],
    defaultContent: {
      title: "//_STATUS",
      state: "STABLE",
      rows: [{ label: "mood:", value: "good" }],
      footer: "you are safe here.",
    },
  },
  taglist: {
    type: "taglist",
    label: "Tag List",
    description: "Simple bullet list — use for likes, dislikes, or anything list-shaped.",
    fields: [
      { key: "title", label: "Panel title", kind: "text" },
      { key: "items", label: "Items", kind: "list" },
      { key: "style", label: "Style ('likes' or 'dislikes')", kind: "text" },
    ],
    defaultContent: {
      title: "//_LIST",
      items: ["item one", "item two"],
      style: "likes",
    },
  },
  personality: {
    type: "personality",
    label: "Radar Chart",
    description: "A radar/spider chart from a list of axis names + 0-100 values.",
    fields: [
      { key: "title", label: "Panel title", kind: "text" },
      { key: "axes", label: "Axis names", kind: "list" },
      { key: "values", label: "Values (0-100, same order as axes)", kind: "list" },
    ],
    defaultContent: {
      title: "//_PERSONALITY",
      axes: ["kind", "bold", "calm", "wild", "shy", "sharp"],
      values: [70, 60, 50, 40, 30, 55],
    },
  },
  memories: {
    type: "memories",
    label: "File List",
    description: "A list of 'locked file' style entries — memories, logs, whatever.",
    fields: [
      { key: "title", label: "Panel title", kind: "text" },
      {
        key: "items",
        label: "Entries",
        kind: "objectList",
        itemFields: [
          { key: "file", label: "File name", kind: "text" },
          { key: "label", label: "Label", kind: "text" },
        ],
      },
      { key: "footer", label: "Footer text", kind: "text" },
    ],
    defaultContent: {
      title: "//_MEMORIES",
      items: [{ file: "2024_01_01.exe", label: "first entry" }],
      footer: "...more locked",
    },
  },
  playlist: {
    type: "playlist",
    label: "Playlist",
    description: "A now-playing music widget.",
    fields: [
      { key: "title", label: "Panel title", kind: "text" },
      { key: "artUrl", label: "Album art URL", kind: "url" },
      { key: "name", label: "Playlist name", kind: "text" },
      { key: "status", label: "Status label", kind: "text" },
      { key: "track", label: "Track name", kind: "text" },
      { key: "album", label: "Album name", kind: "text" },
      { key: "currentTime", label: "Current time", kind: "text" },
      { key: "duration", label: "Duration", kind: "text" },
      { key: "progress", label: "Progress % (0-100)", kind: "number" },
    ],
    defaultContent: {
      title: "//_PLAYLIST.EXE",
      artUrl: "",
      name: "my playlist",
      status: "now playing",
      track: "track name",
      album: "album name",
      currentTime: "0:00",
      duration: "3:00",
      progress: 25,
    },
  },
  friends: {
    type: "friends",
    label: "People Grid",
    description: "A grid of avatars with a name + tag — friends, team, links, etc.",
    fields: [
      { key: "title", label: "Panel title", kind: "text" },
      {
        key: "items",
        label: "People",
        kind: "objectList",
        itemFields: [
          { key: "name", label: "Name", kind: "text" },
          { key: "tag", label: "Tag", kind: "text" },
          { key: "imageUrl", label: "Image URL", kind: "text" },
        ],
      },
    ],
    defaultContent: {
      title: "//_FRIENDS.NET",
      items: [{ name: "NAME.exe", tag: "TAG", imageUrl: "" }],
    },
  },
  sysinfo: {
    type: "sysinfo",
    label: "Info Readout",
    description: "A block of terminal-style text lines with a small side image.",
    fields: [
      { key: "title", label: "Panel title", kind: "text" },
      { key: "lines", label: "Lines", kind: "list" },
      { key: "imageUrl", label: "Side image URL", kind: "url" },
    ],
    defaultContent: {
      title: "//_SYSTEM_INFO",
      lines: ["v1.0.0", "status: ok"],
      imageUrl: "",
    },
  },
  heading: {
    type: "heading",
    label: "Heading",
    description: "A plain section heading.",
    fields: [{ key: "text", label: "Heading text", kind: "text" }],
    defaultContent: { text: "New Section" },
  },
  text: {
    type: "text",
    label: "Text Block",
    description: "Free-form paragraph text.",
    fields: [{ key: "text", label: "Text", kind: "textarea" }],
    defaultContent: { text: "Write anything here." },
  },
  image: {
    type: "image",
    label: "Image",
    description: "A single full-width image with an optional caption.",
    fields: [
      { key: "url", label: "Image URL", kind: "url" },
      { key: "caption", label: "Caption", kind: "text" },
    ],
    defaultContent: { url: "", caption: "" },
  },
};

export const CARD_TYPES = Object.keys(CARD_REGISTRY) as BlockType[];
