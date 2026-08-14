export type Theme = {
  bg: string;
  panel: string;
  border: string;
  accent: string;
  accent2: string;
  text: string;
  textDim: string;
  font: "mono" | "sans" | "serif";
};

export type Profile = {
  id: string;
  username: string;
  role: "user" | "admin";
  created_at: string;
};

export type Page = {
  id: string;
  user_id: string;
  title: string;
  theme: Theme;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type BlockType =
  | "hero"
  | "about"
  | "quote"
  | "status"
  | "taglist"
  | "personality"
  | "memories"
  | "playlist"
  | "friends"
  | "sysinfo"
  | "heading"
  | "text"
  | "image";

export type Block = {
  id: string;
  page_id: string;
  type: BlockType;
  position: number;
  content: Record<string, any>;
  visible: boolean;
  created_at: string;
  updated_at: string;
};
